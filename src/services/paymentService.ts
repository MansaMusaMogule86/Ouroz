/**
 * OUROZ Payment Service — powered by Stripe.
 * Server-only: never import this in client components.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY      — Stripe secret key (sk_live_... or sk_test_...)
 *   STRIPE_WEBHOOK_SECRET  — Webhook signing secret from Stripe Dashboard (whsec_...)
 */

import Stripe from 'stripe';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

function getStripe(): Stripe {
  const env = getEnv();
  const key = env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  return new Stripe(key, { apiVersion: '2026-02-25.clover' });
}

function getAdminClient() {
  const env = getEnv();
  return createSupabaseAdmin(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

// ── Webhook event construction ────────────────────────────────────────────────

/**
 * Verifies the Stripe webhook signature and returns the parsed event.
 * Throws if the signature is invalid (caught by the route handler → 400).
 */
export function constructWebhookEvent(
  rawBody: string,
  signature: string,
): Stripe.Event {
  const env = getEnv();
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  return getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
}

// ── Create payment intent ─────────────────────────────────────────────────────

interface CreatePaymentIntentParams {
  orderId: string;
  amountAed: number;
  customerEmail: string;
  metadata?: Record<string, string>;
}

interface CreatePaymentIntentResult {
  ok: boolean;
  clientSecret?: string;
  error?: string;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams,
): Promise<CreatePaymentIntentResult> {
  try {
    const stripe = getStripe();
    const { orderId, amountAed, customerEmail, metadata } = params;

    // Stripe amounts are in the smallest currency unit (fils for AED = 100 fils per dirham)
    const amount = Math.round(amountAed * 100);

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'aed',
      receipt_email: customerEmail,
      metadata: {
        order_id: orderId,
        ...metadata,
      },
    }, {
      idempotencyKey: `order:${orderId}:payment-intent`,
    });

    // Persist the payment intent ID on the order so we can look it up in webhooks
    const db = getAdminClient();
    await db.from('orders').update({ stripe_payment_intent_id: intent.id }).eq('id', orderId);

    return { ok: true, clientSecret: intent.client_secret ?? undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment intent creation failed';
    console.error('[payment] createPaymentIntent failed:', message);
    return { ok: false, error: message };
  }
}

// ── Handle payment success ────────────────────────────────────────────────────

export async function handlePaymentSuccess(
  paymentIntentId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = getAdminClient();

    // Look up the order by payment intent ID
    const { data: order, error: fetchErr } = await db
      .from('orders')
      .select('id, status')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (fetchErr || !order) {
      // Try fetching from Stripe metadata as fallback
      const stripe = getStripe();
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const orderId = intent.metadata?.order_id;
      if (!orderId) return { ok: false, error: 'Order not found for payment intent' };

      await db.from('orders').update({ status: 'confirmed' }).eq('id', orderId);
      return { ok: true };
    }

    if (order.status !== 'pending') {
      // Already processed — idempotent
      return { ok: true };
    }

    const { error: updateErr } = await db
      .from('orders')
      .update({ status: 'confirmed' })
      .eq('id', order.id);

    if (updateErr) return { ok: false, error: updateErr.message };
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'handlePaymentSuccess failed';
    console.error('[payment] handlePaymentSuccess failed:', message);
    return { ok: false, error: message };
  }
}

// ── Handle payment failure ────────────────────────────────────────────────────

export async function handlePaymentFailure(paymentIntentId: string): Promise<void> {
  try {
    const db = getAdminClient();

    const { data: order } = await db
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (order) {
      await db.from('orders').update({ status: 'failed' }).eq('id', order.id);
    }
  } catch (err) {
    console.error('[payment] handlePaymentFailure failed:', err);
  }
}

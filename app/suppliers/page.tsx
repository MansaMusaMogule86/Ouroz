/**
 * /suppliers – Supplier Access page
 * Centered quiet luxury layout with the working application form:
 *   - Fields: Company Name, Business Email, Phone Number, Country, Product Category, Trade License Upload
 *   - Backend: File upload to Supabase storage 'trade-licenses' + DB insertion
 *   - Status: Success confirmation & error handling
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const PRODUCT_CATEGORIES = [
  'Spices & Seasonings',
  'Oils & Condiments',
  'Tea & Beverages',
  'Preserved Foods',
  'Bakery & Sweets',
  'Ceramics & Crafts',
  'Textiles & Homeware',
  'Beauty & Argan',
  'Other',
];

const COUNTRIES = [
  'Morocco',
  'United Arab Emirates',
  'Tunisia',
  'Algeria',
  'Egypt',
  'Turkey',
  'France',
  'Spain',
  'Other',
];

export default function SupplierRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    phone: '',
    phoneCode: '+212',
    country: '',
    category: '',
    tradeLicense: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to submit a supplier application');
      }

      // 1. Upload Trade License if exists
      let tradeLicenseUrl = null;
      if (form.tradeLicense) {
        if (form.tradeLicense.size > 10 * 1024 * 1024) {
          throw new Error('Trade license file size must be under 10MB');
        }

        const formData = new FormData();
        formData.append('file', form.tradeLicense);
        formData.append('bucket', 'trade-licenses');
        const fileExt = form.tradeLicense.name.split('.').pop();
        const filename = `${user.id}/${Date.now()}.${fileExt}`;
        formData.append('path', filename);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await res.json();
        if (!res.ok) {
          throw new Error(uploadData.error || 'Failed to upload trade license file');
        }
        tradeLicenseUrl = uploadData.url;
      }

      // 2. Slug generation
      const slug = form.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // 3. Database insert
      const { error: insertError } = await supabase.from('suppliers').insert({
        owner_user_id: user.id,
        name: form.companyName,
        slug,
        description: `${form.category} supplier from ${form.country}`,
        contact_phone: `${form.phoneCode} ${form.phone}`,
        contact_email: form.email,
        trade_license_url: tradeLicenseUrl,
        status: 'pending',
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/supplier/dashboard');
      }, 3500);

    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 text-sm border-b border-[var(--color-charcoal)]/15 bg-transparent focus:outline-none focus:border-[var(--color-charcoal)]/40 transition-colors placeholder:text-[var(--color-charcoal)]/30 font-body";
  const labelClasses = "block text-[11px] font-semibold text-[var(--color-charcoal)]/50 mb-2 uppercase tracking-wider font-body";

  if (success) {
    return (
      <div className="relative z-10 max-w-md mx-auto px-5 sm:px-8 py-24 text-center space-y-6">
        <div className="w-20 h-20 bg-stone-900/5 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl text-[var(--color-gold-bright)]">ⵣ</span>
        </div>
        <h1 className="text-3xl font-heading text-[var(--color-charcoal)]">Application Received</h1>
        <p className="text-sm text-[var(--color-charcoal)]/60 font-body leading-relaxed">
          Thank you for requesting access. Your supplier credentials and trade license are under review. We will notify you within 24-48 business hours.
        </p>
        <div className="pt-4">
          <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin border-(--color-charcoal)/5 border-t-(--color-charcoal)/30" />
          <p className="text-xs text-[var(--color-charcoal)]/30 mt-2 font-body">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full py-12 lg:py-20">
      <div className="relative z-10 max-w-2xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-heading text-[var(--color-charcoal)] mb-3" style={{ fontWeight: 400 }}>
            Supplier Access
          </h1>
          <p className="text-xs lg:text-sm text-[var(--color-charcoal)]/55 font-body leading-relaxed max-w-md mx-auto">
            Moroccan producers, distributors, and trade partners can request access to manage product listings, stock, and wholesale orders.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 border border-[var(--color-terracotta)]/20 bg-white/60 backdrop-blur rounded-xl p-4 text-xs text-[var(--color-terracotta)] text-center font-body">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div
          className="rounded-3xl p-8 sm:p-10 border border-white/60"
          style={{
            background: 'rgba(253, 248, 240, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 12px 36px rgba(42,32,22,0.06)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Company Name | Business Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className={labelClasses}>Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  required
                  value={form.companyName}
                  onChange={e => update('companyName', e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Atlas Cooperatives Ltd"
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>Business Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className={inputClasses}
                  placeholder="partner@company.com"
                />
              </div>
            </div>

            {/* Row 2: Phone Number | Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                <div className="flex items-center border-b border-[var(--color-charcoal)]/15 focus-within:border-[var(--color-charcoal)]/40 transition-colors">
                  <select
                    title="Phone country code"
                    value={form.phoneCode}
                    onChange={e => update('phoneCode', e.target.value)}
                    className="bg-transparent text-sm text-[var(--color-charcoal)]/60 pr-1 py-3 focus:outline-none appearance-none cursor-pointer font-body"
                  >
                    <option value="+212">+212 (MA)</option>
                    <option value="+971">+971 (AE)</option>
                    <option value="+216">+216 (TN)</option>
                    <option value="+213">+213 (DZ)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+34">+34 (ES)</option>
                  </select>
                  <span className="text-[var(--color-charcoal)]/15 mx-2">|</span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className="flex-1 bg-transparent text-sm py-3 focus:outline-none placeholder:text-[var(--color-charcoal)]/30 font-body"
                    placeholder="600 000 000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className={labelClasses}>Country of Origin</label>
                <select
                  id="country"
                  required
                  value={form.country}
                  onChange={e => update('country', e.target.value)}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="" className="text-stone-400">Select Country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Product Category | Trade License Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className={labelClasses}>Product Category</label>
                <select
                  id="category"
                  required
                  value={form.category}
                  onChange={e => update('category', e.target.value)}
                  className={`${inputClasses} appearance-none cursor-pointer`}
                >
                  <option value="" className="text-stone-400">Choose a category</option>
                  {PRODUCT_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Trade License Upload</label>
                <div className="flex items-center border-b border-[var(--color-charcoal)]/15 py-3 gap-3">
                  <label className="cursor-pointer text-sm text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)]/60 transition-colors flex-1 truncate font-body">
                    {form.tradeLicense ? form.tradeLicense.name : 'Upload file (.pdf, .jpg, .png)'}
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      title="Trade License file"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setForm(prev => ({ ...prev, tradeLicense: file }));
                      }}
                    />
                  </label>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-charcoal)]/30 bg-[var(--color-charcoal)]/5 px-2.5 py-1 rounded font-body">
                    FILES
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-4 bg-[var(--color-charcoal)] text-[var(--color-sahara)] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full hover:bg-[var(--color-charcoal)]/85 transition-colors duration-300 disabled:opacity-50 font-body shadow-sm"
              >
                {loading ? 'Submitting Application...' : 'Request Access'}
              </button>
            </div>

            {/* Review notice */}
            <p className="text-center text-[11px] text-[var(--color-charcoal)]/35 mt-2 font-body">
              All supplier accounts are reviewed before activation.
            </p>

            {/* Sign in link */}
            <div className="text-center pt-2 font-body text-xs">
              <Link
                href="/auth/login"
                className="text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300"
              >
                Already Approved? <span className="font-semibold underline underline-offset-4">Sign In</span>
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

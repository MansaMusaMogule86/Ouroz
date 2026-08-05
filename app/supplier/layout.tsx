'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface SupplierData {
    id: string;
    name: string;
    status: 'pending' | 'approved' | 'suspended';
}

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [supplier, setSupplier] = useState<SupplierData | null>(null);
    const [loading, setLoading] = useState(true);
    const isPublicStorefront = pathname === '/supplier/atlas-souk' || pathname === '/supplier/danat-al-jazeera';

    useEffect(() => {
        if (isPublicStorefront) {
            setLoading(false);
            return;
        }

        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/auth/login?return=/supplier/dashboard'); return; }

            const { data } = await supabase
                .from('suppliers')
                .select('id, name, status')
                .eq('owner_user_id', user.id)
                .single();

            if (!data && pathname !== '/supplier/register') {
                router.push('/supplier/register');
                return;
            }

            setSupplier(data);
            setLoading(false);
        })();
    }, [isPublicStorefront, pathname, router]);

    const navItems = [
        { href: '/supplier/dashboard', label: 'Dashboard' },
        { href: '/supplier/products', label: 'Products' },
        { href: '/supplier/orders', label: 'Orders' },
    ];

    if (loading) {
        return <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center text-[var(--color-charcoal)]/50">Loading...</div>;
    }

    // Allow public storefront and register page without portal layout
    if (pathname === '/supplier/register' || isPublicStorefront) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            {/* Top bar */}
            <header className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/shop" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-amber-700/20 flex items-center justify-center">
                                <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
                            </div>
                            <span className="font-serif font-bold text-lg">OUROZ</span>
                        </Link>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Supplier Portal</span>
                    </div>

                    <nav className="flex items-center gap-6">
                        {navItems.map(item => (
                            <Link key={item.href} href={item.href}
                                className={`text-sm font-medium transition ${pathname === item.href ? 'text-amber-600' : 'text-gray-500 hover:text-gray-900'}`}>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {supplier && (
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                supplier.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                                supplier.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                'bg-red-50 text-red-700'
                            }`}>
                                {supplier.status}
                            </span>
                        )}
                        <span className="text-sm font-medium text-gray-700">{supplier?.name}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {supplier?.status === 'pending' && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                        Your supplier account is pending approval. You can add products, but they won't be visible until approved.
                    </div>
                )}
                {children}
            </main>
        </div>
    );
}

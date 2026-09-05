import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.css';
import { ThemeScript } from '@/components/ui/ThemeScript';

export const metadata: Metadata = {
  title: 'Page not found / 找不到頁面 — Claude Code Cookbook',
  description:
    'This page does not exist. Return to Claude Code Cookbook in English or Traditional Chinese. 此頁面不存在，請返回英文或繁體中文首頁。',
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <main className="mx-auto max-w-2xl px-6 py-20">
          <p className="text-sm text-ink-subtle">Claude Code Cookbook · 404</p>
          <h1 className="mt-4 text-3xl font-semibold">That page does not exist</h1>
          <p className="mt-3 text-ink-muted">The address may be incorrect or out of date.</p>
          <p lang="zh-TW" className="mt-3 text-ink-muted">
            找不到這個頁面，網址可能有誤或已過期。
          </p>
          <nav aria-label="Choose language" className="mt-6 flex flex-wrap gap-4">
            <Link href="/learn/" className="text-accent underline">
              Learning path
            </Link>
            <Link href="/" className="text-accent underline">
              English home
            </Link>
            <Link href="/zh-TW/" lang="zh-TW" className="text-accent underline">
              繁體中文首頁
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}

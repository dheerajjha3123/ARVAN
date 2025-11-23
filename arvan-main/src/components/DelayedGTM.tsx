'use client';

import dynamic from 'next/dynamic';

const GoogleTagManager = dynamic(() => import('@next/third-parties/google').then(mod => mod.GoogleTagManager), { ssr: false });

export default function DelayedGTM() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) return null;

  return <GoogleTagManager gtmId={gtmId} />;
}

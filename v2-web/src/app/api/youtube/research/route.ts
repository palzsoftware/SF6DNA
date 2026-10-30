import { NextResponse } from 'next/server';

/** Fail closed in every environment until a reviewed administrator policy exists. */
export async function GET() {
  const enabled = process.env.ENABLE_YOUTUBE_RESEARCH === 'true';
  return NextResponse.json({ error: enabled ? 'AUTH_POLICY_UNCONFIGURED' : 'DISABLED' }, {
    status: enabled ? 403 : 404, headers: { 'Cache-Control': 'private, no-store' },
  });
}

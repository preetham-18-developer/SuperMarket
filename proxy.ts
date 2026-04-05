import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple High-Performance Rate Limiter (Memory-based)
// Note: In a distributed 10k concurrent setup, you would use Redis/Upstash here
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 req/min/IP

  const current = rateLimitMap.get(ip) ?? { count: 0, lastReset: now };

  if (now - current.lastReset > windowMs) {
    current.count = 0;
    current.lastReset = now;
  }

  current.count++;
  rateLimitMap.set(ip, current);

  if (current.count > maxRequests) {
    return new NextResponse('Too many requests. Please try again soon.', { status: 429 });
  }

  const response = NextResponse.next();
  response.headers.set('X-Anti-Lag-System', 'Active');
  response.headers.set('X-Response-Time', now.toString());
  
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};

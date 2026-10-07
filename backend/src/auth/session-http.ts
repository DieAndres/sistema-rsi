import { ForbiddenException } from '@nestjs/common';
import type { Request, Response } from 'express';

export const SESSION_COOKIE = '__Host-rsi_session';
export const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/',
};

export function cookie(request: Request, name: string): string {
  const values = (request.headers.cookie ?? '')
    .split(';')
    .map((part) => part.trim().split('='))
    .filter(([key]) => key === name);
  // Reject malformed or ambiguous cookies rather than guessing a credential.
  return values.length === 1 &&
    values[0].length === 2 &&
    /^[a-f0-9]{64}$/.test(values[0][1] ?? '')
    ? values[0][1]
    : '';
}

// Browsers send Origin on writes. Missing, null or foreign origins are rejected.
export function validateOrigin(request: Request) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return;
  const allowed = (
    process.env.SESSION_ALLOWED_ORIGINS ??
    'https://localhost:8443,http://localhost:5173'
  )
    .split(',')
    .map((value) => value.trim());
  const origin = request.get('Origin');
  if (!origin || origin === 'null' || !allowed.includes(origin)) {
    throw new ForbiddenException(
      'El origen de la solicitud no está autorizado.',
    );
  }
}

export function setSession(response: Response, token: string) {
  response.cookie(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_TTL_MS,
  });
  response.setHeader('Cache-Control', 'no-store');
}

export function clearSession(response: Response) {
  response.clearCookie(SESSION_COOKIE, cookieOptions);
  response.setHeader('Cache-Control', 'no-store');
}

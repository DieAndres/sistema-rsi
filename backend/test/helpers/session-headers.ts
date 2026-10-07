import { SESSION_COOKIE } from '../../src/auth/session-http';

export function sessionHeaders(token: string, anonymous = false) {
  return {
    ...(anonymous ? {} : { Cookie: SESSION_COOKIE + '=' + token }),
    Origin: 'https://localhost:8443',
  };
}

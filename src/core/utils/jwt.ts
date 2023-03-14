import * as jwt from 'jsonwebtoken';

export function signJwt(payload: object, secretKey: string, expires: number): string {
  const accessToken = jwt.sign(payload, secretKey, {
    expiresIn: expires,
  });

  return accessToken;
}

export function verifyJwt<T>(token: string, secretKey: string): T | null {
  const verifyValue = jwt.verify(token, secretKey, {
    ignoreExpiration: false,
  }) as T;
  return verifyValue;
}

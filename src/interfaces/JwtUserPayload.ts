export interface JwtUserPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

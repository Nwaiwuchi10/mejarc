export function parseJwt(token: string | null | undefined) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token: string | null | undefined) {
  const parsed = parseJwt(token);
  if (!parsed || !parsed.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return parsed.exp < now;
}

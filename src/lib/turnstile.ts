import { env } from "@/lib/env";

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (!env.hasTurnstile) {
    return env.isDev;
  }

  const formData = new FormData();
  formData.append("secret", env.turnstileSecretKey);
  formData.append("response", token);
  if (ip) formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

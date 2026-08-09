export type LeadType = "message" | "discovery";

export type LeadPayload = {
  type: LeadType;
  name: string;
  email: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  timezone?: string;
  /** Honeypot — must be empty */
  website?: string;
};

export type LeadValidationResult =
  | { ok: true; data: LeadPayload }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimString(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export function validateLeadPayload(body: unknown): LeadValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid payload." };
  }

  const raw = body as Record<string, unknown>;
  const website = trimString(raw.website, 200);
  if (website) {
    return { ok: false, error: "Rejected." };
  }

  const type = raw.type;
  if (type !== "message" && type !== "discovery") {
    return { ok: false, error: "Choose a valid lead type." };
  }

  const name = trimString(raw.name, 120);
  const email = trimString(raw.email, 200);
  const message = trimString(raw.message, 4000);
  const preferredDate = trimString(raw.preferredDate, 32);
  const preferredTime = trimString(raw.preferredTime, 32);
  const timezone = trimString(raw.timezone, 80);

  if (!name) {
    return { ok: false, error: "Name is required." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "A valid email is required." };
  }

  if (type === "message") {
    if (!message) {
      return { ok: false, error: "Message is required." };
    }
    return {
      ok: true,
      data: { type, name, email, message, website: "" },
    };
  }

  if (!preferredDate) {
    return { ok: false, error: "Preferred date is required." };
  }
  if (!preferredTime) {
    return { ok: false, error: "Preferred time is required." };
  }

  return {
    ok: true,
    data: {
      type,
      name,
      email,
      message: message || undefined,
      preferredDate,
      preferredTime,
      timezone: timezone || undefined,
      website: "",
    },
  };
}

export const DISCOVERY_TIME_OPTIONS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

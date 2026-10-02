/**
 * QR Code Data Encoders & Sanitizers
 * Formats data for URL, Plain Text, Wi-Fi, Email, Phone, SMS, vCard, and WhatsApp.
 */

export type QrType =
  | "url"
  | "text"
  | "wifi"
  | "email"
  | "phone"
  | "sms"
  | "vcard"
  | "whatsapp";

export interface WifiData {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
}

export interface WhatsAppData {
  phone: string;
  message: string;
}

export interface QrFormData {
  type: QrType;
  url: string;
  text: string;
  wifi: WifiData;
  email: EmailData;
  phone: PhoneData;
  sms: SmsData;
  vcard: VCardData;
  whatsapp: WhatsAppData;
}

export const INITIAL_QR_FORM_DATA: QrFormData = {
  type: "url",
  url: "https://clydeabenojar.site",
  text: "",
  wifi: {
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  },
  email: {
    email: "",
    subject: "",
    body: "",
  },
  phone: {
    phone: "",
  },
  sms: {
    phone: "",
    message: "",
  },
  vcard: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    website: "",
  },
  whatsapp: {
    phone: "",
    message: "",
  },
};

/**
 * Escapes characters in Wi-Fi strings: \ ; , : "
 */
export function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:\"])/g, "\\$1");
}

/**
 * Compiles the raw string payload for the QR code based on the selected type.
 */
export function encodeQrData(data: QrFormData): string {
  switch (data.type) {
    case "url": {
      let raw = data.url.trim();
      if (!raw) return "";
      if (!/^https?:\/\//i.test(raw)) {
        raw = `https://${raw}`;
      }
      return raw;
    }

    case "text":
      return data.text;

    case "wifi": {
      const { ssid, password, encryption, hidden } = data.wifi;
      if (!ssid) return "";
      const escapedSsid = escapeWifiString(ssid);
      const escapedPass = encryption === "nopass" ? "" : escapeWifiString(password);
      return `WIFI:T:${encryption};S:${escapedSsid};P:${escapedPass};H:${hidden ? "true" : "false"};;`;
    }

    case "email": {
      const { email, subject, body } = data.email;
      if (!email) return "";
      const params = new URLSearchParams();
      if (subject) params.append("subject", subject);
      if (body) params.append("body", body);
      const queryString = params.toString();
      return `mailto:${email.trim()}${queryString ? `?${queryString}` : ""}`;
    }

    case "phone": {
      const cleanPhone = data.phone.phone.trim();
      return cleanPhone ? `tel:${cleanPhone}` : "";
    }

    case "sms": {
      const { phone, message } = data.sms;
      const cleanPhone = phone.trim();
      if (!cleanPhone) return "";
      return `SMSTO:${cleanPhone}:${message}`;
    }

    case "vcard": {
      const { firstName, lastName, phone, email, company, title, website } = data.vcard;
      const fn = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
      if (!fn && !phone && !email) return "";

      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName.trim()};${firstName.trim()};;;`,
        fn ? `FN:${fn}` : "",
        company.trim() ? `ORG:${company.trim()}` : "",
        title.trim() ? `TITLE:${title.trim()}` : "",
        phone.trim() ? `TEL;TYPE=CELL:${phone.trim()}` : "",
        email.trim() ? `EMAIL:${email.trim()}` : "",
        website.trim() ? `URL:${website.trim()}` : "",
        "END:VCARD",
      ].filter(Boolean);

      return lines.join("\n");
    }

    case "whatsapp": {
      const { phone, message } = data.whatsapp;
      const digitsOnly = phone.replace(/[^0-9]/g, "");
      if (!digitsOnly) return "";
      const params = message ? `?text=${encodeURIComponent(message)}` : "";
      return `https://wa.me/${digitsOnly}${params}`;
    }

    default:
      return "";
  }
}

/**
 * Returns a human-readable default filename for export
 */
export function getExportFilename(data: QrFormData): string {
  const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 30);
  switch (data.type) {
    case "url": {
      try {
        const urlObj = new URL(encodeQrData(data));
        return `qr-${sanitize(urlObj.hostname)}`;
      } catch {
        return "qr-link";
      }
    }
    case "wifi":
      return `qr-wifi-${sanitize(data.wifi.ssid || "network")}`;
    case "vcard":
      return `qr-contact-${sanitize(data.vcard.firstName || data.vcard.lastName || "card")}`;
    case "email":
      return `qr-email-${sanitize(data.email.email.split("@")[0] || "contact")}`;
    case "phone":
      return `qr-tel-${sanitize(data.phone.phone || "call")}`;
    case "sms":
      return `qr-sms-${sanitize(data.sms.phone || "message")}`;
    case "whatsapp":
      return `qr-whatsapp-${sanitize(data.whatsapp.phone || "chat")}`;
    case "text":
    default:
      return "qr-code";
  }
}

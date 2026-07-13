"use server";

import { Resend } from "resend";
import { CONTACT, CONTACT_FORM } from "@/lib/content";

export type ContactValues = {
  nombre: string;
  email: string;
  mensaje: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>> & {
  /** Error general (fallo de envío), no asociado a un campo. */
  form?: string;
};

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; errors: ContactErrors; values: ContactValues };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Los saltos de línea se eliminan de los campos que van a headers del
  // email (asunto, reply-to) para impedir inyección de headers.
  const nombre = String(formData.get("nombre") ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  const email = String(formData.get("email") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  // Honeypot: campo invisible para humanos; si viene lleno es un bot.
  // Se responde éxito para no darle señal de que fue detectado.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success" };
  }

  const errors: ContactErrors = {};
  const v = CONTACT_FORM.validation;
  if (!nombre) errors.nombre = v.nombreRequired;
  else if (nombre.length > 100) errors.nombre = v.nombreMax;
  if (!email) errors.email = v.emailRequired;
  else if (!EMAIL_RE.test(email)) errors.email = v.emailInvalid;
  if (!mensaje) errors.mensaje = v.mensajeRequired;
  else if (mensaje.length > 5000) errors.mensaje = v.mensajeMax;

  const values: ContactValues = { nombre, email, mensaje };
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Remitente: debe ser una dirección de un dominio verificado en Resend.
  // Antes de verificar el dominio se puede usar "onboarding@resend.dev".
  const from = process.env.CONTACT_FROM ?? CONTACT_FORM.email.fromFallback;

  // Fallback de desarrollo: sin API key el form sigue siendo usable y el
  // lead queda en la consola del servidor.
  if (!apiKey) {
    console.warn(
      "[contacto] RESEND_API_KEY sin configurar — lead recibido:",
      values,
    );
    return { status: "success" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: CONTACT.email,
      replyTo: `${nombre} <${email}>`,
      subject: CONTACT_FORM.email.subject(nombre),
      text: CONTACT_FORM.email.body(nombre, email, mensaje),
    });
    if (error) {
      console.error("[contacto] Resend devolvió error:", error);
      return {
        status: "error",
        errors: { form: CONTACT_FORM.sendError },
        values,
      };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contacto] error enviando email:", err);
    return {
      status: "error",
      errors: { form: CONTACT_FORM.sendError },
      values,
    };
  }
}

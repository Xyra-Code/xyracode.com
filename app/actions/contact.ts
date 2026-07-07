"use server";

import { Resend } from "resend";
import { CONTACT } from "@/lib/content";

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
  if (!nombre) errors.nombre = "Contanos tu nombre.";
  else if (nombre.length > 100) errors.nombre = "Máximo 100 caracteres.";
  if (!email) errors.email = "Necesitamos tu email para responderte.";
  else if (!EMAIL_RE.test(email)) errors.email = "Ese email no parece válido.";
  if (!mensaje) errors.mensaje = "Contanos brevemente tu proyecto.";
  else if (mensaje.length > 5000) errors.mensaje = "Máximo 5000 caracteres.";

  const values: ContactValues = { nombre, email, mensaje };
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  // Remitente: debe ser una dirección de un dominio verificado en Resend.
  // Antes de verificar el dominio se puede usar "onboarding@resend.dev".
  const from = process.env.CONTACT_FROM ?? "XyraCode Web <web@xyracode.com>";

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
      subject: `Nuevo contacto desde la web: ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
    });
    if (error) {
      console.error("[contacto] Resend devolvió error:", error);
      return {
        status: "error",
        errors: {
          form: "No pudimos enviar tu mensaje. Probá de nuevo en un momento o escribinos por WhatsApp.",
        },
        values,
      };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contacto] error enviando email:", err);
    return {
      status: "error",
      errors: {
        form: "No pudimos enviar tu mensaje. Probá de nuevo en un momento o escribinos por WhatsApp.",
      },
      values,
    };
  }
}

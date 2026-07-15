// ---------- Contacto ----------

export const CONTACT = {
  email: "contacto@xyracode.com",
  /** Solo dígitos con indicativo de país, formato wa.me. */
  whatsapp: "573106790518",
  /** Mensaje precargado al abrir el chat de WhatsApp. */
  whatsappMessage:
    "¡Hola XyraCode! Me gustaría contarles sobre un proyecto y pedir una cotización.",
  location: "Villavicencio, Colombia",
  /** Agenda pública de Cal.com; si se pone en null, el botón cae al mailto. */
  calLink: "https://cal.com/xyracode/30min" as string | null,
} as const;

// ---------- Formulario de contacto ----------

/** Copys del formulario, validaciones y plantilla de email (consumidos por
 *  ContactForm.tsx y app/actions/contact.ts). */
export const CONTACT_FORM = {
  aria: "Formulario de contacto",
  labels: {
    nombre: "Nombre",
    email: "Email",
    celular: "Celular",
    mensaje: "Mensaje",
  },
  placeholders: {
    nombre: "¿Cómo te llamas?",
    email: "nombre@empresa.com",
    celular: "¿Cuál es tu número de teléfono?",
    mensaje: "Cuéntanos tu proyecto: qué necesitas, para cuándo…",
  },
  submit: "Enviar mensaje",
  submitting: "Enviando…",
  legal:
    "Al enviar aceptas el tratamiento de tus datos para responder tu solicitud (Ley 1581 de 2012, Colombia).",
  success: {
    title: "¡Mensaje enviado!",
    body: "Te responderemos en el menor tiempo posible.",
  },
  validation: {
    nombreRequired: "Cuéntanos tu nombre.",
    nombreMax: "Máximo 100 caracteres.",
    emailRequired: "Necesitamos tu email para responderte.",
    emailInvalid: "Ese email no parece válido.",
    celularRequired: "Déjanos un número para contactarte.",
    celularMax: "Máximo 20 caracteres.",
    mensajeRequired: "Cuéntanos brevemente tu proyecto.",
    mensajeMax: "Máximo 5000 caracteres.",
  },
  sendError:
    "No pudimos enviar tu mensaje. Prueba de nuevo en un momento o escríbenos por WhatsApp.",
  email: {
    fromFallback: "XyraCode Web <web@xyracode.com>",
    subject: (nombre: string) => `Nuevo contacto desde la web: ${nombre}`,
    body: (nombre: string, email: string, celular: string, mensaje: string) =>
      `Nombre: ${nombre}\nEmail: ${email}\nCelular: ${celular}\n\n${mensaje}`,
  },
} as const;

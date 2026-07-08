"use client";

import { Check } from "lucide-react";
import { useActionState, useId } from "react";
import { sendContact, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

const inputClass =
  "w-full rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-white px-3.5 py-2.5 text-sm text-brand-ink transition-colors duration-200 placeholder:text-slate-400 focus:border-brand-primary focus:outline-2 focus:-outline-offset-1 focus:outline-brand-primary disabled:opacity-60";

const errorClass = "mt-1 text-xs text-[#EF4444]";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendContact,
    initialState,
  );
  const id = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="w-full rounded-2xl bg-white p-8 text-center text-brand-ink shadow-[0_22px_44px_-26px_rgba(11,31,28,0.38)]"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <Check size={24} className="text-brand-secondary" aria-hidden />
        </div>
        <p className="text-[17px] font-bold">¡Mensaje enviado!</p>
        <p className="mt-1.5 text-sm text-slate-500">
          Te responderemos en el menor tiempo posible.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values =
    state.status === "error"
      ? state.values
      : { nombre: "", email: "", mensaje: "" };

  return (
    <form
      action={formAction}
      noValidate
      aria-label="Formulario de contacto"
      aria-busy={pending}
      className="w-full rounded-2xl bg-white p-6 text-left text-brand-ink shadow-[0_22px_44px_-26px_rgba(11,31,28,0.38)] sm:p-7"
    >
      {/* Honeypot anti-spam: invisible para humanos, los bots lo completan */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="mb-4">
        <label
          htmlFor={`${id}-nombre`}
          className="mb-1.5 block text-[13px] font-bold"
        >
          Nombre
        </label>
        <input
          id={`${id}-nombre`}
          name="nombre"
          type="text"
          autoComplete="name"
          placeholder="¿Cómo te llamas?"
          defaultValue={values.nombre}
          disabled={pending}
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? `${id}-nombre-error` : undefined}
          className={inputClass}
        />
        {errors.nombre && (
          <p id={`${id}-nombre-error`} className={errorClass}>
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={`${id}-email`}
          className="mb-1.5 block text-[13px] font-bold"
        >
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nombre@empresa.com"
          defaultValue={values.email}
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={inputClass}
        />
        {errors.email && (
          <p id={`${id}-email-error`} className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-5">
        <label
          htmlFor={`${id}-mensaje`}
          className="mb-1.5 block text-[13px] font-bold"
        >
          Mensaje
        </label>
        <textarea
          id={`${id}-mensaje`}
          name="mensaje"
          rows={4}
          placeholder="Cuéntanos tu proyecto: qué necesitas, para cuándo…"
          defaultValue={values.mensaje}
          disabled={pending}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? `${id}-mensaje-error` : undefined}
          className={`${inputClass} resize-y`}
        />
        {errors.mensaje && (
          <p id={`${id}-mensaje-error`} className={errorClass}>
            {errors.mensaje}
          </p>
        )}
      </div>

      {errors.form && (
        <p role="alert" className="mb-4 text-sm text-[#EF4444]">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-brand-secondary px-[22px] py-3 text-sm font-bold text-night transition-all duration-200 ease-out hover:-translate-y-px hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60  cursor-pointer"
      >
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>

      <p className="mt-3 text-[11px] leading-normal text-slate-500">
        Al enviar aceptas el tratamiento de tus datos para responder tu
        solicitud (Ley 1581 de 2012, Colombia).
      </p>
    </form>
  );
}

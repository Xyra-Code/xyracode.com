# Card de GitHub con dos links (perfil + organización)

**Fecha:** 2026-07-12 · **Página:** /nosotros, sección "Credenciales verificables"

## Objetivo

Enriquecer la card "Código abierto" para que linkee tanto al perfil personal
(`github.com/YEENDJ`) como a la organización verificada (`github.com/Xyra-Code`),
aprovechando que la org está verificada con el dominio xyracode.com y lista a
Yeison como miembro.

## Diseño

### 1. Tipo `Credential` (lib/content.ts)

Reemplazar los campos `href?: string` y `linkLabel?: string` por una lista:

```ts
export type CredentialLink = { href: string; label: string };

export type Credential = {
  // …campos existentes sin cambios…
  /** Enlaces externos; la card renderiza un botón por cada uno. */
  links?: CredentialLink[];
};
```

### 2. Datos (lib/content.ts)

- **Henry:** `links: [{ href: <PDF certs.soyhenry.com>, label: "Verificar certificado" }]`
- **Técnico en Sistemas:** `links: [{ href: "/assets/certificado-tecnico-sena.pdf", label: "Ver certificado" }]`
- **GitHub:**
  - desc: "Mira cómo escribo código, no solo lo que digo de él: mi perfil
    personal y la organización de XyraCode, verificada con el dominio
    xyracode.com."
  - `links: [{ href: "https://github.com/YEENDJ", label: "Ver perfil" },
    { href: "https://github.com/Xyra-Code", label: "Ver organización" }]`
  - Orden: perfil primero (la desc habla del código propio), organización segundo.

### 3. Render (app/nosotros/page.tsx)

El bloque del botón único pasa a mapear `cred.links`:

```tsx
{cred.links && cred.links.length > 0 && (
  <div className="mt-auto flex flex-wrap gap-3 pt-2">
    {cred.links.map((link) => (
      <Button key={link.href} href={link.href} target="_blank"
              variant="ghost" className="border-white/22">
        {link.label} <ArrowRight size={18} aria-hidden />
      </Button>
    ))}
  </div>
)}
```

Mismos estilos que el botón actual; `flex-wrap` para que en mobile los dos
botones bajen de línea sin romper la card.

### 4. JSON-LD (app/nosotros/page.tsx)

Agregar `"https://github.com/YEENDJ"` al array `sameAs` de la entidad Person
(hoy solo tiene la organización).

## Fuera de alcance

- Chips de stack, stats de GitHub o mención de proyectos concretos (opciones
  descartadas en brainstorming).
- Cambios en las otras cards más allá de la migración mecánica a `links`.

## Verificación

- `npx tsc --noEmit` sin errores.
- Visual: card de GitHub muestra dos botones lado a lado en desktop y apilados
  en mobile; Henry y Técnico siguen mostrando su único botón.

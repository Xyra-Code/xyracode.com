# Nosotros: la persona detrás de XyraCode

**Fecha:** 2026-07-12
**Estado:** aprobado en conversación

## Problema

La página `/nosotros` explica bien **cómo trabaja** Yeison (manifiesto, terminal `sobre-mi.sh`), pero dice poco de **quién es**: no hay historia de origen, ni credenciales verificables, ni lado humano. Para una agencia unipersonal, la confianza personal es el producto — quien entra a esta sección debe salir conociendo a Yeison.

## Materia prima (entrevista)

- **Recorrido:** técnico en sistemas → **más de 10 años vendiendo servicios de telecomunicaciones** → certificación full-stack en Henry → freelance → XyraCode. La década en ventas es el diferencial central: entiende mercados y clientes desde antes de programar.
- **Motivación:** transformar el negocio del cliente.
- **Credenciales:** certificado full-stack de Henry (con link de verificación), técnico en sistemas, GitHub (github.com/Xyra-Code), proyectos del portfolio.
- **Lado humano:** vida en Villavicencio + hobbies (pendientes de definir → placeholder).
- **Tono:** bastante personal, primera persona.

## Decisión

Mantener la identidad terminal existente (whoami / sobre-mi.sh / xyra start) y agregar tres secciones nuevas: historia como timeline "git log", credenciales verificables y bloque humano. Enfoque A aprobado sobre alternativas (carta narrativa, extensión mínima).

## Estructura resultante de la página

1. **Hero `$ whoami`** — existente; el párrafo intro gana el gancho: "Antes de escribir código pasé más de 10 años del lado del cliente…"
2. **Terminal `sobre-mi.sh`** — existente; nueva línea `trayectoria: 10+ años en ventas de telecomunicaciones antes del código`.
3. 🆕 **"Mi historia"** — prompt `$ git log --reverse mi-carrera`; timeline vertical donde cada etapa es un "commit": hash decorativo mono (aria-hidden) + título + párrafo corto.
4. 🆕 **"Credenciales verificables"** — prompt `$ ls certificados/`; grid de 3 tarjetas.
5. **Manifiesto "Cómo trabajo"** — existente, sin cambios.
6. 🆕 **"Cuando cierro la laptop"** — dos columnas: foto natural + texto humano.
7. **CTA final** — existente, sin cambios.

## Contenido de las secciones nuevas

### Mi historia (`CAREER_LOG` en `lib/content.ts`)

| Commit | Título | Texto (borrador aprobado) |
|---|---|---|
| `init` | Técnico en sistemas | Donde empezó la curiosidad por cómo funcionan las cosas por dentro. *(año: PLACEHOLDER)* |
| `feat` | 10+ años vendiendo telecomunicaciones | Una década escuchando clientes, entendiendo mercados y aprendiendo qué hace que un negocio compre o no. Hoy es la mayor ventaja: "entiendo tu negocio antes de escribir la primera línea de código". |
| `feat` | Certificación full-stack en Henry | Formación intensiva en desarrollo full-stack. Enlaza al certificado. |
| `feat` | Primeros proyectos freelance | Encargos reales para clientes reales; construir de punta a punta. |
| `release` | XyraCode v1.0 | La formalización: una agencia de una persona donde hablas siempre con quien construye. |

Años exactos: PLACEHOLDER marcado en código hasta que Yeison los confirme.

### Credenciales verificables (`CREDENTIALS` en `lib/content.ts`)

1. **Certificado Full-Stack — Henry** (tarjeta protagonista): imagen del certificado (slot placeholder hasta recibir el archivo) + botón "Verificar certificado" → URL de verificación de Henry (PLACEHOLDER).
2. **Técnico en Sistemas**: institución y año (PLACEHOLDERS).
3. **Código abierto**: link a github.com/Xyra-Code — "mira cómo escribo código, no solo lo que digo de él".

### Cuando cierro la laptop (`PERSONAL` en `lib/content.ts`)

- Foto: `public/assets/foto-nosotros-natural-900.png` (ya existe en el repo, sin usar).
- Texto: párrafo sobre vivir y trabajar desde Villavicencio + lista breve de hobbies (PLACEHOLDER marcado).
- Cierre que conecta al negocio: "Trabajo con clientes de cualquier parte, pero respondo como vecino: directo y sin vueltas." (ajustable).

## Cambios de soporte

- **JSON-LD** en `app/nosotros/page.tsx`: al `Person` agregar `alumniOf` (Henry), `hasCredential` (certificación full-stack + técnico en sistemas) y `sameAs` (GitHub). Refuerza E-E-A-T de la entidad ya indexada.
- **Metadata**: actualizar `description` para incluir el ángulo "10 años entendiendo clientes antes de programar".
- Todo el contenido nuevo vive en `lib/content.ts` como constantes tipadas, siguiendo el patrón existente (`ABOUT_TERMINAL`, `MANIFESTO`).

## Placeholders pendientes de Yeison

1. Años del timeline (técnico, ventas, Henry, freelance, XyraCode).
2. URL de verificación del certificado Henry + imagen del certificado.
3. Institución y año del técnico en sistemas.
4. Hobbies concretos.

Cada uno se marca en código con comentario `PLACEHOLDER:` siguiendo la convención ya usada en `lib/content.ts`.

## Fuera de alcance

- No se toca la home ni otras secciones.
- No se crea página de CV ni blog personal.
- No se cambian Navbar, Footer ni rutas.

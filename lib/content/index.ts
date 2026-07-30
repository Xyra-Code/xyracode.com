/**
 * Contenido editable de la landing, modularizado por dominio.
 * Barrel: re-exporta todo para que `@/lib/content` siga funcionando igual.
 * Para editar textos/datos, ve al módulo del dominio correspondiente.
 *
 * `./demos` NO va acá, y no es una cuestión de gusto — se midió en el bundle.
 *
 * Varios componentes cliente del sitio (`Cta`, `FloatingWhatsApp`, `Footer`,
 * `Hero`…) importan `CONTACT`/`UI` de este barrel. Al re-exportar `./demos`, el
 * bundler metía `demos.ts` completo en el chunk compartido del sitio: el
 * catálogo del cliente —`/demos/guantes-nr1/*.webp`, sus tallas y sus precios—
 * viajaba en el JS de la home para todo visitante que nunca abre una demo. No
 * lo salva el tree shaking: `DEMOS` se arma con llamadas en el tope del módulo
 * y el minificador no puede probar que sean puras.
 *
 * La rama de demos importa `@/lib/content/demos` directo. Cuesta una ruta más
 * larga y a cambio la fuga no puede volver por descuido.
 */
export * from "./contact";
export * from "./home";
export * from "./services";
export * from "./service-pages";
export * from "./projects";
export * from "./team";
export * from "./ui";
export * from "./social";
export * from "./blocks";
export * from "./case-studies";
export * from "./blog";

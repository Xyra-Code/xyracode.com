/**
 * Precio en pesos colombianos. Sin decimales: en COP no se usan, y un ",00"
 * repetido en cada precio del catálogo es ruido.
 *
 * Ojo al testear: `Intl` con `es-CO` separa el signo del número con U+00A0
 * (espacio duro), no con un espacio normal. Un test escrito con espacio normal
 * falla sin decir por qué.
 */
const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(cop: number): string {
  return COP.format(cop);
}

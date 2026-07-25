#!/usr/bin/env python3
"""
Genera un PDF A4 autonomo a partir de un documento HTML de XyraCode.

Uso:
    python generar-pdf.py <documento.html> [salida.pdf]

Hace dos inyecciones para que el HTML/PDF sea autonomo (sin dependencias externas):
  1. /* __BASE_CSS__ */  -> contenido de ../base.css (design-system de marca).
  2. __LOGO_DATA__       -> logo teal horizontal en base64.

Ambas son idempotentes: si el marcador ya no esta, se salta ese paso, asi que
puedes re-generar el PDF tras editar el documento sin duplicar nada.

Luego imprime a PDF con Chrome/Edge headless (A4, con fondos, sin cabecera/pie del
navegador) y verifica que el numero de paginas coincida con las hojas
<section class="page"> del HTML (si no, alguna seccion desbordo su A4).
"""
import base64
import os
import re
import subprocess
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve()
SKILL_DIR = SCRIPT.parents[1]                 # .claude/skills/documentos-xyracode
REPO = SCRIPT.parents[4]                       # raiz del repo
BASE_CSS = SKILL_DIR / "base.css"
LOGO = REPO / "public" / "assets" / "brand" / "logo-horizontal.png"

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]


def find_browser() -> str:
    for c in CHROME_CANDIDATES:
        if os.path.isfile(c):
            return c
    sys.exit("No se encontro Chrome ni Edge. Instala uno o ajusta CHROME_CANDIDATES.")


def inject(html_path: Path) -> None:
    html = html_path.read_text(encoding="utf-8")
    changed = False

    if "/* __BASE_CSS__ */" in html:
        if not BASE_CSS.is_file():
            sys.exit(f"No existe la base: {BASE_CSS}")
        html = html.replace("/* __BASE_CSS__ */", BASE_CSS.read_text(encoding="utf-8"))
        print("base.css inyectada")
        changed = True

    if "__LOGO_DATA__" in html:
        if not LOGO.is_file():
            sys.exit(f"No existe el logo: {LOGO}")
        data = "data:image/png;base64," + base64.b64encode(LOGO.read_bytes()).decode()
        html = html.replace("__LOGO_DATA__", data)
        print("logo incrustado")
        changed = True

    if changed:
        html_path.write_text(html, encoding="utf-8")


def to_pdf(html_path: Path, pdf_path: Path) -> None:
    browser = find_browser()
    subprocess.run(
        [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path.resolve().as_uri(),
        ],
        check=True,
    )
    print(f"PDF generado: {pdf_path}")

    data = pdf_path.read_bytes()
    paginas = len(re.findall(rb"/Type\s*/Page[^s]", data))
    hojas = html_path.read_text(encoding="utf-8").count('<section class="page')
    print(f"Paginas en PDF: {paginas} | Hojas .page en HTML: {hojas}")
    if paginas != hojas:
        print(
            "AVISO: el PDF tiene mas paginas que hojas: alguna seccion desbordo su A4. "
            "Compacta (listas a 2 columnas, reduce .page-pad y .section margin-top)."
        )


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    html_path = Path(sys.argv[1]).resolve()
    if not html_path.is_file():
        sys.exit(f"No existe el HTML: {html_path}")
    pdf_path = (
        Path(sys.argv[2]).resolve()
        if len(sys.argv) > 2
        else html_path.with_suffix(".pdf")
    )
    inject(html_path)
    to_pdf(html_path, pdf_path)


if __name__ == "__main__":
    main()
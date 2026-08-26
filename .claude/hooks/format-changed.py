#!/usr/bin/env python3
"""PostToolUse (Write|Edit) — formatea el fichero que se acaba de tocar.

Ahorra tokens: el modelo no gasta turnos arreglando comillas, comas finales ni
sangrado. Solo actua sobre UN fichero, nunca sobre el proyecto entero.

Silencioso por diseno: si no hay formateador, no pasa nada. Nunca bloquea.
"""
import json
import os
import shutil
import subprocess
import sys

EXTENSIONES = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".css", ".scss", ".json", ".jsonc", ".md", ".mdx",
    ".html", ".vue", ".svelte", ".astro", ".yaml", ".yml",
}

TIEMPO_LIMITE = 20  # segundos


def raiz_proyecto() -> str:
    return os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def existe(raiz: str, *nombres: str) -> bool:
    return any(os.path.exists(os.path.join(raiz, n)) for n in nombres)


def comando_formateo(raiz: str, ruta: str):
    """Devuelve el comando a ejecutar, o None si no hay formateador configurado."""
    if existe(raiz, "biome.json", "biome.jsonc"):
        return ["npx", "--no-install", "biome", "check", "--write", ruta]

    prettier_cfg = (
        ".prettierrc", ".prettierrc.json", ".prettierrc.js", ".prettierrc.cjs",
        ".prettierrc.mjs", ".prettierrc.yaml", ".prettierrc.yml",
        "prettier.config.js", "prettier.config.mjs", "prettier.config.cjs",
    )
    if existe(raiz, *prettier_cfg):
        return ["npx", "--no-install", "prettier", "--write", ruta]

    # prettier declarado dentro de package.json
    pkg = os.path.join(raiz, "package.json")
    if os.path.exists(pkg):
        try:
            with open(pkg, encoding="utf-8") as f:
                datos = json.load(f)
            if "prettier" in datos:
                return ["npx", "--no-install", "prettier", "--write", ruta]
            deps = {**datos.get("dependencies", {}), **datos.get("devDependencies", {})}
            if "prettier" in deps:
                return ["npx", "--no-install", "prettier", "--write", ruta]
            if "@biomejs/biome" in deps:
                return ["npx", "--no-install", "biome", "check", "--write", ruta]
        except Exception:
            pass

    return None


def main() -> int:
    try:
        datos = json.load(sys.stdin)
    except Exception:
        return 0

    entrada = datos.get("tool_input") or {}
    ruta = entrada.get("file_path") or entrada.get("path") or ""
    if not ruta or os.path.splitext(ruta)[1].lower() not in EXTENSIONES:
        return 0
    if not os.path.isfile(ruta):
        return 0

    raiz = raiz_proyecto()
    # No formatear nada fuera del proyecto.
    try:
        if os.path.commonpath([os.path.realpath(ruta), os.path.realpath(raiz)]) != os.path.realpath(raiz):
            return 0
    except ValueError:
        return 0

    if shutil.which("npx") is None:
        return 0

    cmd = comando_formateo(raiz, ruta)
    if cmd is None:
        return 0

    try:
        subprocess.run(
            cmd, cwd=raiz, timeout=TIEMPO_LIMITE,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False,
        )
    except Exception:
        pass  # un formateador roto nunca debe frenar el trabajo

    return 0


if __name__ == "__main__":
    sys.exit(main())

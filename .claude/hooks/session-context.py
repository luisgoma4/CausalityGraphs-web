#!/usr/bin/env python3
"""SessionStart — inyecta un estado minimo del proyecto al abrir la sesion.

Objetivo de tokens: unos cientos, no miles. Evita que la conversacion arranque
leyendo cuatro documentos para saber por donde iba.
"""
import json
import os
import re
import subprocess
import sys

LIMITE_CARACTERES = 1400


def raiz() -> str:
    return os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def fases_completadas(base: str) -> str:
    artefactos = [
        ("0 brief", "docs/01-brief.md"),
        ("1 arquitectura", "docs/02-arquitectura.md"),
        ("2 diseno", "docs/03-design-system.md"),
        ("3 plan", "docs/04-plan.md"),
    ]
    hechas = [nombre for nombre, ruta in artefactos if os.path.exists(os.path.join(base, ruta))]
    return ", ".join(hechas) if hechas else "ninguna"


def resumen_tareas(base: str) -> str:
    ruta = os.path.join(base, "docs", "tasks.md")
    if not os.path.exists(ruta):
        return "sin docs/tasks.md — ejecuta /web:plan"
    try:
        with open(ruta, encoding="utf-8") as f:
            texto = f.read()
    except Exception:
        return "docs/tasks.md ilegible"

    conteo = {}
    for estado in ("hecho", "en curso", "bloqueado", "pendiente"):
        conteo[estado] = len(re.findall(rf"\b{estado}\b", texto, re.IGNORECASE))

    en_curso = re.findall(r"^.*\ben curso\b.*$", texto, re.IGNORECASE | re.MULTILINE)
    detalle = en_curso[0].strip()[:120] if en_curso else "ninguna"

    return (
        f"{conteo['hecho']} hechas / {conteo['en curso']} en curso / "
        f"{conteo['bloqueado']} bloqueadas / {conteo['pendiente']} pendientes\n"
        f"En curso: {detalle}"
    )


def ultimo_commit(base: str) -> str:
    try:
        salida = subprocess.run(
            ["git", "log", "-1", "--format=%ad %s", "--date=short"],
            cwd=base, capture_output=True, text=True, timeout=5,
        )
        return salida.stdout.strip() or "sin commits"
    except Exception:
        return "sin repositorio git"


def main() -> int:
    try:
        json.load(sys.stdin)
    except Exception:
        pass

    base = raiz()
    if not os.path.isdir(os.path.join(base, "docs")):
        return 0  # proyecto sin orquestar todavia: no inyectamos ruido

    contexto = (
        "## Estado del orquestador\n"
        f"Fases completadas: {fases_completadas(base)}\n"
        f"Tareas: {resumen_tareas(base)}\n"
        f"Ultimo commit: {ultimo_commit(base)}\n"
        "Usa /web:status para el detalle. No leas docs/ entero salvo que lo necesites."
    )[:LIMITE_CARACTERES]

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "SessionStart",
            "additionalContext": contexto,
        }
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())

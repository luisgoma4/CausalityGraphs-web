#!/usr/bin/env python3
"""PreToolUse (Bash) — bloquea comandos destructivos o peligrosos.

Entrada: JSON del hook por stdin.
Salida: JSON con permissionDecision=deny cuando el comando coincide con un patrón
vetado. En cualquier otro caso, sale con codigo 0 y sin salida (permite).

Filosofia: bloquear lo irreversible y lo que filtra secretos. Todo lo demas pasa;
un guardarrail que molesta constantemente acaba desactivado.
"""
import json
import re
import sys

# (patron, motivo). Se evaluan sobre el comando completo, sin distinguir mayusculas.
REGLAS = [
    (r"\brm\s+(-[a-zA-Z]*\s+)*-[a-zA-Z]*[rR][a-zA-Z]*[fF]|\brm\s+-[a-zA-Z]*[fF][a-zA-Z]*[rR]",
     "borrado recursivo forzado"),
    (r"\bmkfs(\.|\s)", "formateo de sistema de ficheros"),
    (r"\bdd\s+.*of=/dev/", "escritura directa a dispositivo de bloque"),
    (r">\s*/dev/(sd|nvme|disk)", "escritura directa a disco"),
    (r"\bgit\s+push\b.*(--force(?!-with-lease)\b|\s-f\b)",
     "push forzado (usa --force-with-lease)"),
    (r"\bgit\s+reset\s+--hard\b", "reset destructivo del arbol de trabajo"),
    (r"\bgit\s+clean\s+-[a-zA-Z]*[fdx]", "limpieza destructiva de ficheros no rastreados"),
    (r"\bgit\s+checkout\s+.*\s--\s+\.", "descarte masivo de cambios locales"),
    (r"\bcurl\b[^|]*\|\s*(sudo\s+)?(ba)?sh", "ejecucion directa de script descargado"),
    (r"\bwget\b[^|]*\|\s*(sudo\s+)?(ba)?sh", "ejecucion directa de script descargado"),
    (r"\bchmod\s+(-[a-zA-Z]+\s+)*777\b", "permisos 777"),
    (r"\bnpm\s+publish\b", "publicacion de paquete"),
    (r"\bDROP\s+(TABLE|DATABASE|SCHEMA)\b", "sentencia SQL destructiva"),
    (r"\bTRUNCATE\s+TABLE\b", "vaciado de tabla"),
    (r"\b(prisma|drizzle-kit)\s+.*\b(reset|drop)\b", "reset de base de datos"),
    (r"\bcat\s+[^|;&]*\.env\b(?!\.example)", "volcado de fichero .env"),
    (r"\bgit\s+add\s+.*\.env\b(?!\.example)", "intento de versionar un .env"),
    (r"\bhistory\s+-c\b", "borrado del historial"),
    (r"\bsudo\s+rm\b", "borrado con privilegios elevados"),
]

# Rutas fuera del proyecto que nunca deben tocarse con operaciones de escritura.
RUTAS_PROHIBIDAS = re.compile(
    r"\b(rm|mv|cp|chmod|chown)\b[^|;&]*\s(/|~/?|/etc|/usr|/System|/Library|/var)(\s|$)"
)


# Comandos que solo leen o imprimen: mencionar un patron peligroso dentro de ellos
# no es ejecutarlo. Evita falsos positivos tipo `grep -r "DROP TABLE" docs/`.
CABEZAS_INOCUAS = {"echo", "printf", "grep", "egrep", "fgrep", "rg", "ag", "ack",
                   "wc", "comm", "diff", "man", "which", "type"}

# ...salvo que el resultado se canalice hacia un interprete.
TUBERIA_A_SHELL = re.compile(r"\|\s*(sudo\s+)?(ba|z|k)?sh\b")

SEPARADORES = re.compile(r"(?:&&|\|\||;|\n)")

# Patrones que abarcan separadores y por tanto se evaluan sobre el comando entero.
REGLAS_GLOBALES = [
    (r":\(\)\s*\{.*\}\s*;\s*:", "fork bomb"),
]


def sentencias_evaluables(comando: str):
    """Divide el comando y descarta las sentencias que solo leen o imprimen."""
    for trozo in SEPARADORES.split(comando):
        trozo = trozo.strip()
        if not trozo:
            continue
        if TUBERIA_A_SHELL.search(trozo):
            yield trozo
            continue
        primera = trozo.split()[0].lstrip("(").rsplit("/", 1)[-1]
        if primera in CABEZAS_INOCUAS:
            continue
        yield trozo


def main() -> int:
    try:
        datos = json.load(sys.stdin)
    except Exception:
        return 0  # sin entrada valida, no bloqueamos

    if datos.get("tool_name") != "Bash":
        return 0

    comando = (datos.get("tool_input") or {}).get("command", "")
    if not comando:
        return 0

    motivo = None
    for patron, texto in REGLAS_GLOBALES:
        if re.search(patron, comando):
            motivo = texto
            break

    for sentencia in [] if motivo else sentencias_evaluables(comando):
        for patron, texto in REGLAS:
            if re.search(patron, sentencia, re.IGNORECASE):
                motivo = texto
                break
        if motivo is None and RUTAS_PROHIBIDAS.search(sentencia):
            motivo = "operacion de escritura sobre una ruta del sistema"
        if motivo:
            break

    if motivo is None:
        return 0

    salida = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": (
                f"Bloqueado por el orquestador: {motivo}. "
                "Si es intencionado, ejecutalo tu mismo en la terminal o "
                "ajusta .claude/hooks/guard-bash.py."
            ),
        }
    }
    print(json.dumps(salida))
    return 0


if __name__ == "__main__":
    sys.exit(main())

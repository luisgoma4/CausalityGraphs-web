#!/usr/bin/env python3
"""PreToolUse (Bash) — bloquea comandos destructivos, irreversibles o que filtran secretos.

Red contra accidentes, no frontera de seguridad: las garantías reales van en permisos y SO.

Un hook que lee texto de shell siempre se puede rodear (scripts, variables, codificaciones).
Este intenta cazar lo barato y lo accidental sin estorbar el trabajo normal:
  - trocea el comando respetando comillas, pipes, subshells y `$(...)`;
  - analiza cada sentencia por palabras (no por regex sobre el texto crudo), de modo que
    `l""ive`, `rm -r -f`, `\\rm`, `X=ruta; rm $X` o `cd dir && rm sub` no esquivan nada;
  - mira tambien los fragmentos de codigo en linea (`python3 -c`, `node -e`) quitando
    comillas y `+`, para cazar `'live/'+'ARMED'`.

FALLA CERRADO: JSON ilegible, entrada inesperada o cualquier excepcion interna => exit 2
con un mensaje (el comando NO se ejecuta). Un bloqueo normal sale con exit 0 y un JSON
`permissionDecision=deny`.

Si un bloqueo es un falso positivo, ejecuta el comando tu mismo en la terminal.
"""
import fnmatch
import json
import os
import re
import shlex
import sys

# ======================================================================================
# Configuracion del repo
# ======================================================================================
ESCRITURA_PROTEGIDA = []   # (regex sobre la ruta normalizada, motivo)
LECTURA_PROTEGIDA = []     # (regex, motivo): rutas que tampoco se leen
MUESTRAS_ESCRITURA = []    # rutas concretas para resolver globs
MUESTRAS_LECTURA = []
FRAGMENTOS = []            # (literal, motivo) para codigo en linea
REGLAS_TEXTO_EXTRA = []
REGLAS_GLOBALES_EXTRA = []

# ======================================================================================
# Reglas comunes
# ======================================================================================
_ENV = r"\.env(?!\.(?:example|sample|template|dist)(?![\w-]))(?:\.[\w.-]+)?"
_OTROS = (r"\.ssh|\.aws|\.config/gh|\.credentials\.json|\.npmrc|\.netrc|\.git-credentials"
          r"|id_(?:rsa|dsa|ecdsa|ed25519)")
_ANTES = r"(?<![\w.\\-])"
ENV_RE = re.compile(_ANTES + r"(?:" + _ENV + r")(?![\w-])")
OTROS_SECRETOS_RE = re.compile(_ANTES + r"(?:" + _OTROS + r")(?![\w-])")
PEM_RE = re.compile(r"\.pem$")

# Rutas donde un agente no escribe (ademas de las de ESCRITURA_PROTEGIDA del repo).
ESCRITURA_COMUN = [
    (re.compile(r"(^|/)\.claude/(settings(\.local)?\.json|hooks(/|$)|\.credentials)"),
     "modificacion de la configuracion o los hooks de Claude Code"),
    (re.compile(r"(^|/)\.git/hooks(/|$)"), "modificacion de los hooks de git"),
    (re.compile(r"(^|/)\.(bashrc|zshrc|profile|bash_profile|bash_login|zprofile|zshenv)$"),
     "modificacion de un fichero de arranque de la shell"),
    (re.compile(r"^~/\.claude(/|$)"), "modificacion de ~/.claude"),
]

# Muestras concretas para resolver globs (`live/AR*`, `.e*`).
MUESTRAS_SECRETO = [".env", ".env.local", ".env.production", ".ssh/id_rsa",
                    ".ssh/id_ed25519", ".aws/credentials", ".config/gh/hosts.yml",
                    ".npmrc", ".claude/.credentials.json"]

# Fragmentos que, dentro de codigo en linea (comillas y '+' ya quitados), delatan que se
# toca algo protegido.
FRAGMENTOS_COMUNES = [
    (".ssh", "codigo en linea que toca ~/.ssh"),
    (".aws", "codigo en linea que toca ~/.aws"),
    (".config/gh", "codigo en linea que toca la config de gh"),
    (".credentials.json", "codigo en linea que toca credenciales"),
    ("id_rsa", "codigo en linea que toca una clave privada"),
    ("id_ed25519", "codigo en linea que toca una clave privada"),
    (".npmrc", "codigo en linea que toca .npmrc"),
    (".claude/settings", "codigo en linea que toca la configuracion de Claude Code"),
    (".claude/hooks", "codigo en linea que toca los hooks de Claude Code"),
    (".bashrc", "codigo en linea que toca un fichero de arranque de la shell"),
    (".zshrc", "codigo en linea que toca un fichero de arranque de la shell"),
]
ENV_COMPACTO_RE = re.compile(r"(?<!process)(?<!meta)\.env(?!iron|\.example|\.sample|\.template|\.dist)")

# Reglas de texto: se aplican a cada sentencia que no sea de solo lectura/impresion.
REGLAS_TEXTO = [
    (r"\bDROP\s+(TABLE|DATABASE|SCHEMA)\b", "sentencia SQL destructiva"),
    (r"\bTRUNCATE\s+TABLE\b", "vaciado de tabla"),
    (r"\b(prisma|drizzle-kit)\s+.*\b(reset|drop)\b", "reset de base de datos"),
    (r"\bhistory\s+-c\b", "borrado del historial"),
    (r"\bnpm\s+(un)?publish\b|\b(yarn|pnpm)\s+publish\b", "publicacion de paquete"),
]

# Reglas que se aplican al comando entero (crudo y sin comillas).
REGLAS_GLOBALES = [
    (r":\(\)\s*\{.*\}\s*;\s*:", "fork bomb"),
    (r"\b(ba|z|k|da)?sh\s+(-\S+\s+)*<\(\s*(curl|wget)\b",
     "ejecucion directa de script descargado"),
    (r"\b(source|eval)\b[^|;&]*(<\(|\$\(|`)\s*(curl|wget)\b",
     "ejecucion directa de script descargado"),
    (r"-c\s+[\"']?\$\(\s*(curl|wget)\b", "ejecucion directa de script descargado"),
    (r"\bmkfs(\.|\s)", "formateo de sistema de ficheros"),
    (r"\bdd\b[^|;&]*\bof=/dev/", "escritura directa a dispositivo de bloque"),
    (r">\s*/dev/(sd|nvme|disk|hd|vd)", "escritura directa a disco"),
]

SOLO_IMPRIMEN = {"echo", "printf", "man", "which", "type", "true", "false"}
CABEZAS_TEXTO_INOCUAS = SOLO_IMPRIMEN | {"grep", "egrep", "fgrep", "rg", "ag", "ack",
                                          "wc", "comm", "diff"}
BUSCADORES = {"grep", "egrep", "fgrep", "rg", "ag", "ack"}
# Cabezas que mencionan una ruta sin leerla (o cuya escritura se vigila aparte).
EXENTAS_LECTURA = SOLO_IMPRIMEN | {"ls", "stat", "file", "test", "[", "cd", "pwd", "mkdir",
                                   "touch", "rm", "chmod", "chown", "chgrp", "du", "wc",
                                   "realpath", "dirname", "basename", "readlink", "ln",
                                   "unlink", "rmdir", "shred", "truncate", "git", "find"}
SUBS_GIT_LECTORES = {"show", "diff", "log", "blame", "cat-file", "grep", "archive",
                     "apply", "cherry-pick", "format-patch", "annotate", "whatchanged"}
SHELLS = {"sh", "bash", "zsh", "ksh", "dash", "ash", "fish"}
INTERPRETES = {"python", "node", "nodejs", "perl", "ruby", "php", "deno", "bun",
               "osascript", "lua", "rscript"}
FLAGS_EN_LINEA = {"-c", "-e", "-E", "-p", "-r", "--eval", "--print", "-pe", "-ne", "-ce",
                  "-pie", "-i"}
ENVOLTORIOS = {"sudo", "doas", "env", "nohup", "time", "command", "builtin", "exec", "nice",
               "ionice", "stdbuf", "setsid", "timeout", "xargs", "unbuffer", "caffeinate"}
RED = {"curl", "wget", "nc", "ncat", "netcat", "socat", "ssh", "scp", "sftp", "ftp", "telnet"}
RAICES = {"/", "~", "~/", "/etc", "/usr", "/System", "/Library", "/var", "/home", "/root",
          "/bin", "/boot", "/opt", "$HOME", "/*", "~/*"}


class Bloqueo(Exception):
    pass


def bloquear(motivo: str):
    raise Bloqueo(motivo)


# --------------------------------------------------------------------------------------
# Troceado respetando comillas
# --------------------------------------------------------------------------------------
def trocear(cmd: str):
    """Devuelve [(sentencia, separador_previo)]. Separa por ; \\n && || | & ( ) $( `."""
    res, cur, q, i, n = [], [], None, 0, len(cmd)
    sep_prev = ";"

    def vaciar(sep):
        nonlocal cur, sep_prev
        s = "".join(cur).strip()
        if s:
            res.append((s, sep_prev))
        cur = []
        sep_prev = sep

    while i < n:
        c = cmd[i]
        if c == "\\" and q != "'":
            cur.append(c)
            if i + 1 < n:
                cur.append(cmd[i + 1])
            i += 2
            continue
        if q:
            if c == q:
                q = None
            cur.append(c)
            i += 1
            continue
        if c in "'\"":
            q = c
            cur.append(c)
            i += 1
            continue
        if c == "$" and cmd[i + 1:i + 2] == "(":
            vaciar(";")
            i += 2
            continue
        if c in "`();\n":
            vaciar(";")
            i += 1
            continue
        if c == "&":
            if cmd[i + 1:i + 2] == "&":
                vaciar(";")
                i += 2
                continue
            if (cur and cur[-1] in "<>") or cmd[i + 1:i + 2] == ">":
                cur.append(c)
                i += 1
                continue
            vaciar(";")
            i += 1
            continue
        if c == "|":
            if cmd[i + 1:i + 2] == "|":
                vaciar(";")
                i += 2
                continue
            vaciar("|")
            i += 1
            continue
        cur.append(c)
        i += 1
    vaciar(";")
    return res


def extraer_heredocs(cmd: str):
    """Quita los cuerpos de heredoc del comando y los devuelve aparte."""
    cuerpos = []
    patron = re.compile(r"<<-?\s*(['\"]?)(\w+)\1[^\n]*\n")
    salida, pos = [], 0
    while True:
        m = patron.search(cmd, pos)
        if not m:
            salida.append(cmd[pos:])
            break
        fin = re.search(r"^\s*" + re.escape(m.group(2)) + r"\s*$", cmd[m.end():], re.M)
        salida.append(cmd[pos:m.end()])
        if not fin:
            cuerpos.append(cmd[m.end():])
            break
        cuerpos.append(cmd[m.end():m.end() + fin.start()])
        pos = m.end() + fin.end()
    return "".join(salida), cuerpos


def sin_comillas(texto: str) -> str:
    return re.sub(r"[\"'\\]", "", texto)


def compacto(texto: str) -> str:
    return re.sub(r"[\s\"'+\\,()\[\]]", "", texto)


# --------------------------------------------------------------------------------------
# Utilidades de rutas
# --------------------------------------------------------------------------------------
def normaliza(t: str) -> str:
    t = t.strip()
    while t.startswith("./"):
        t = t[2:]
    for pre in ("$HOME/", "${HOME}/"):
        if t.startswith(pre):
            t = "~/" + t[len(pre):]
    base = os.environ.get("CLAUDE_PROJECT_DIR") or ""
    if base and t.startswith(base.rstrip("/") + "/"):
        t = t[len(base.rstrip("/")) + 1:]
    t = re.sub(r"/{2,}", "/", t)
    return t


def con_glob(t: str) -> bool:
    return any(ch in t for ch in "*?[")


def glob_coincide(tok: str, muestras) -> bool:
    if not con_glob(tok):
        return False
    pat = normaliza(tok)
    if pat.startswith("~/"):
        pat = pat[2:]
    psegs = pat.split("/")
    for m in muestras:
        for cand in (m, "x/" + m):
            csegs = cand.split("/")
            if len(csegs) == len(psegs):
                if any(c.startswith(".") and p[:1] in "*?[" for c, p in zip(csegs, psegs)):
                    continue
            if fnmatch.fnmatchcase(cand, pat):
                return True
    return False


def variantes(tok: str):
    v = {tok}
    t = tok.lstrip("@")
    v.add(t)
    if "=" in t:
        v.add(t.split("=", 1)[1].lstrip("@"))
    return v


def es_secreto(tok: str, incluir_env=True):
    for v in variantes(tok):
        if " " in v.strip() or "\n" in v:
            continue  # prosa (mensajes, descripciones), no una ruta
        if OTROS_SECRETOS_RE.search(v) or PEM_RE.search(v):
            return "ruta de credenciales o claves"
        if incluir_env and ENV_RE.search(v):
            return "fichero .env"
        for rx, motivo in LECTURA_PROTEGIDA:
            if rx.search(normaliza(v)):
                return motivo
        if glob_coincide(v, MUESTRAS_SECRETO + MUESTRAS_LECTURA):
            return "glob que alcanza ficheros de credenciales"
    return None


def escritura_protegida(tok: str, cwd: str):
    """Motivo si `tok` apunta a una ruta de escritura vigilada (probando tambien con cwd)."""
    cands = {normaliza(tok)}
    if cwd and not tok.startswith(("/", "~")):
        cands.add(normaliza(os.path.normpath(os.path.join(cwd, tok))))
    for c in list(cands):
        cands.add(os.path.normpath(c) if c else c)
    for c in cands:
        if not c or c.startswith("-"):
            continue
        for rx, motivo in ESCRITURA_COMUN + ESCRITURA_PROTEGIDA:
            if rx.search(c):
                return motivo
        if OTROS_SECRETOS_RE.search(c):
            return "ruta de credenciales o claves"
        if glob_coincide(c, MUESTRAS_ESCRITURA + MUESTRAS_SECRETO):
            return "glob que alcanza una ruta protegida"
    return None


# --------------------------------------------------------------------------------------
# Analisis
# --------------------------------------------------------------------------------------
ASIGNACION = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*=")


def indice_cabeza(toks):
    i, sudo = 0, False
    while i < len(toks):
        t = toks[i]
        if ASIGNACION.match(t):
            i += 1
            continue
        b = os.path.basename(t)
        if b in ENVOLTORIOS:
            if b in ("sudo", "doas"):
                sudo = True
            i += 1
            while i < len(toks) and (toks[i].startswith("-") or ASIGNACION.match(toks[i])
                                     or (b == "timeout" and re.match(r"^\d", toks[i]))):
                i += 1
            continue
        break
    return i, sudo


def nombre_cabeza(t: str) -> str:
    b = os.path.basename(t)
    if re.match(r"^python[\d.]*$", b):
        return "python"
    return b


def extraer_redirecciones(toks):
    destinos, resto, i = [], [], 0
    while i < len(toks):
        t = toks[i]
        m = re.match(r"^(?:\d*|&)>>?(?!&)(\|?)(.*)$", t)
        if m and not re.match(r"^\d*>&", t):
            d = m.group(2)
            if not d and i + 1 < len(toks):
                i += 1
                d = toks[i]
            if d:
                destinos.append(d)
        else:
            resto.append(t)
        i += 1
    return destinos, resto


class Analizador:
    def __init__(self, profundidad=0):
        self.vars, self.cwd, self.prof = {}, "", profundidad
        self.cabezas, self.hay_descarga, self.hay_shell_fichero = [], False, False

    def sustituir(self, t):
        def r(m):
            return self.vars.get(m.group(1) or m.group(2), m.group(0))
        return re.sub(r"\$(?:\{(\w+)\}|(\w+))", r, t)

    # ---- entrada ----
    def comando(self, cmd: str):
        for rx, motivo in REGLAS_GLOBALES + REGLAS_GLOBALES_EXTRA:
            if re.search(rx, cmd) or re.search(rx, sin_comillas(cmd)):
                bloquear(motivo)
        cmd2, cuerpos = extraer_heredocs(cmd)
        sentencias = trocear(cmd2)
        previa = None
        for texto, sep in sentencias:
            previa = self.sentencia(texto, sep, previa, cuerpos)
        if self.hay_descarga and self.hay_shell_fichero:
            bloquear("descarga y ejecucion de un script en el mismo comando")
        if self.prof < 3:
            for m in re.finditer(r"\$\(([^()]*)\)|`([^`]*)`", cmd2):
                inner = m.group(1) or m.group(2)
                if inner and inner.strip():
                    sub = Analizador(self.prof + 1)
                    sub.vars, sub.cwd = dict(self.vars), self.cwd
                    sub.comando(inner)

    def sentencia(self, texto, sep, previa, cuerpos):
        try:
            toks = shlex.split(texto, posix=True)
        except ValueError:
            toks = texto.split()
        toks = [self.sustituir(t) for t in toks]
        if not toks:
            return previa
        # asignaciones puras: se recuerdan
        if all(ASIGNACION.match(t) for t in toks):
            for t in toks:
                k, v = t.split("=", 1)
                self.vars[k] = v
            return previa
        destinos_redir, toks = extraer_redirecciones(toks)
        for d in destinos_redir:
            self.redireccion(d)
        if not toks:
            return previa
        i, sudo = indice_cabeza(toks)
        for t in toks[:i]:
            if ASIGNACION.match(t):
                k, v = t.split("=", 1)
                # asignacion de entorno de una sola orden: no persiste, pero se sustituye
                self.vars.setdefault(k, v)
        if i >= len(toks):
            ult = os.path.basename(toks[-1]) if toks else ""
            return ult if ult in ("env", "printenv", "set") else previa
        cab = nombre_cabeza(toks[i])
        args = toks[i + 1:]
        self.cabezas.append(cab)
        crudo = sin_comillas(texto)

        # reglas de texto (no en cabezas que solo buscan o imprimen)
        if cab not in CABEZAS_TEXTO_INOCUAS:
            for rx, motivo in REGLAS_TEXTO + REGLAS_TEXTO_EXTRA:
                if re.search(rx, texto, re.I) or re.search(rx, crudo, re.I):
                    bloquear(motivo)
        self.tuberias(cab, args, sep, previa)

        flags = [a for a in args if a.startswith("-") and len(a) > 1]
        pos = [a for a in args if not a.startswith("-")]

        # ejecutores de cadenas
        if cab in SHELLS and "-c" in args:
            j = args.index("-c")
            if j + 1 < len(args) and self.prof < 3:
                self.recursivo(args[j + 1])
        if cab == "eval" and self.prof < 3:
            self.recursivo(" ".join(args))
        if cab in ("source", ".") and pos and pos[0] in ("/dev/stdin", "-"):
            bloquear("ejecucion de codigo desde la entrada estandar")
        if cab in SHELLS and pos and not ("-c" in args):
            self.hay_shell_fichero = True
        if cab in ("source", ".") and pos:
            self.hay_shell_fichero = True
        if cab in ("curl", "wget"):
            self.hay_descarga = True
        if cab == "cd" or cab == "pushd":
            if pos and not re.search(r"[$`]", pos[0]) and pos[0] != "-":
                self.cwd = os.path.normpath(os.path.join(self.cwd, pos[0])) \
                    if not pos[0].startswith(("/", "~")) else pos[0]
            return cab

        self.reglas_comunes(cab, args, flags, pos, sudo)
        self.codigo_en_linea(cab, args, cuerpos)
        self.escrituras(cab, args, flags, pos)
        self.lecturas(cab, args, flags, pos)
        return cab

    def recursivo(self, cmd):
        sub = Analizador(self.prof + 1)
        sub.vars, sub.cwd = dict(self.vars), self.cwd
        sub.comando(cmd)

    # ---- tuberias a interpretes ----
    def tuberias(self, cab, args, sep, previa):
        if sep != "|":
            return
        if previa in ("env", "printenv", "set") and cab in RED:
            bloquear("volcado del entorno hacia la red")
        if previa in ("curl", "wget"):
            sin_flags = [a for a in args if not a.startswith("-")]
            if cab in SHELLS and "-c" not in args and not sin_flags:
                bloquear("ejecucion directa de script descargado")
            if cab == "python" or cab in INTERPRETES:
                if not any(a in ("-c", "-e", "-m", "-p", "--eval") for a in args) \
                        and not [a for a in sin_flags if a != "-"]:
                    bloquear("ejecucion directa de script descargado")
            if cab in ("sudo", "eval", "source", "."):
                bloquear("ejecucion directa de script descargado")

    # ---- reglas de comandos conocidos ----
    def reglas_comunes(self, cab, args, flags, pos, sudo):
        cortos = "".join(f[1:] for f in flags if not f.startswith("--"))
        largos = {f for f in flags if f.startswith("--")}
        if cab == "rm":
            if sudo:
                bloquear("borrado con privilegios elevados")
            rec = bool(re.search(r"[rR]", cortos)) or "--recursive" in largos
            forz = "f" in cortos or "--force" in largos
            if rec and forz:
                bloquear("borrado recursivo forzado")
            if "--no-preserve-root" in largos:
                bloquear("borrado sin proteccion de la raiz")
        if cab in ("rm", "mv", "cp", "chmod", "chown", "chgrp", "ln", "shred"):
            for a in pos:
                if a in RAICES:
                    bloquear("operacion de escritura sobre una ruta del sistema")
        if cab == "chmod":
            if any(re.fullmatch(r"0?777|a\+rwx|ugo\+rwx", a) for a in pos):
                bloquear("permisos 777")
        if cab == "find":
            if "-delete" in args:
                bloquear("find con -delete")
            for k, a in enumerate(args):
                if a in ("-exec", "-execdir", "-ok", "-okdir"):
                    fin = k + 1
                    while fin < len(args) and args[fin] not in (";", "+", "\\;"):
                        fin += 1
                    sub = args[k + 1:fin]
                    if any(es_secreto(x) for x in args if x not in sub):
                        bloquear("find que ejecuta ordenes sobre ficheros de credenciales")
                    if sub and self.prof < 3:
                        self.recursivo(" ".join(shlex.quote(x) for x in sub))
        if cab in BUSCADORES and any(a == "--pre" or a.startswith("--pre=") for a in args):
            bloquear("ejecucion de comandos arbitrarios via --pre")
        if cab == "git":
            self.git(args)
        if cab in ("mkfs",) or cab.startswith("mkfs."):
            bloquear("formateo de sistema de ficheros")
        if cab == "dd" and any(a.startswith("of=/dev/") for a in args):
            bloquear("escritura directa a dispositivo de bloque")
        if cab == "sudo" and pos and os.path.basename(pos[0]) == "rm":
            bloquear("borrado con privilegios elevados")

    def git(self, args):
        i, cwd_git = 0, None
        while i < len(args):
            a = args[i]
            if a in ("-C", "-c", "--git-dir", "--work-tree", "--namespace"):
                if a == "-C" and i + 1 < len(args):
                    cwd_git = args[i + 1]
                i += 2
                continue
            if a.startswith("-"):
                i += 1
                continue
            break
        if cwd_git:
            m = escritura_protegida(cwd_git, self.cwd)
            if m:
                bloquear(f"git sobre una ruta protegida ({m})")
        if i >= len(args):
            return
        sub, resto = args[i], args[i + 1:]
        flags = [a for a in resto if a.startswith("-")]
        cortos = "".join(f[1:] for f in flags if not f.startswith("--"))
        pos = [a for a in resto if not a.startswith("-")]
        if sub == "push":
            for a in resto:
                if a == "--force" or a == "-f" or (re.fullmatch(r"-[a-zA-Z]*f[a-zA-Z]*", a)):
                    bloquear("push forzado (usa --force-with-lease)")
                if a in ("--delete", "-d", "--mirror", "--prune"):
                    bloquear("push que borra ramas o refs remotas")
            for a in pos:
                if a.startswith("+"):
                    bloquear("push forzado por refspec (+)")
                if a.startswith(":") and len(a) > 1:
                    bloquear("push que borra una rama remota")
        elif sub == "reset" and "--hard" in resto:
            bloquear("reset destructivo del arbol de trabajo")
        elif sub == "clean":
            dry = "n" in cortos or "--dry-run" in resto
            if ("f" in cortos or "--force" in resto or re.search(r"[xd]", cortos)) and not dry:
                bloquear("limpieza destructiva de ficheros no rastreados")
        elif sub in ("checkout", "restore"):
            if "." in pos or ":/" in pos or "--" in resto and resto[resto.index("--") + 1:] == ["."]:
                bloquear("descarte masivo de cambios locales")
            if sub == "checkout" and "--" in resto and "." in resto[resto.index("--") + 1:]:
                bloquear("descarte masivo de cambios locales")
        elif sub == "branch":
            if "D" in cortos or ("--delete" in resto and ("--force" in resto or "f" in cortos)):
                bloquear("borrado forzado de rama")
        elif sub in ("filter-branch", "filter-repo"):
            bloquear("reescritura de historial")
        elif sub == "add":
            for a in pos:
                if ENV_RE.search(a) or es_secreto(a) == "ruta de credenciales o claves":
                    bloquear("intento de versionar credenciales")
        if sub in ("rm", "mv", "checkout", "restore", "clean", "apply", "reset", "stash"):
            for a in resto:
                m = escritura_protegida(a, self.cwd) if not a.startswith("-") else None
                if m:
                    bloquear(f"git sobre una ruta protegida ({m})")
        if sub in SUBS_GIT_LECTORES:
            for a in pos:
                m = es_secreto(a)
                if m:
                    bloquear(f"lectura de {m}")

    # ---- codigo en linea ----
    def codigo_en_linea(self, cab, args, cuerpos):
        if cab not in INTERPRETES:
            return
        en_linea = any(a in FLAGS_EN_LINEA or re.fullmatch(r"-[a-zA-Z]*[ecp]", a)
                       for a in args)
        if cab in ("perl", "ruby") and "-i" in "".join(a for a in args if a.startswith("-")):
            en_linea = True
        texto = " ".join(args)
        if not en_linea and not cuerpos:
            return
        material = texto + " " + " ".join(cuerpos)
        c = compacto(material)
        if ENV_COMPACTO_RE.search(c):
            bloquear("codigo en linea que toca un fichero .env")
        for lit, motivo in FRAGMENTOS_COMUNES + FRAGMENTOS:
            if lit in c:
                bloquear(motivo)

    # ---- escrituras ----
    def redireccion(self, d):
        if d.startswith("/dev/") and d not in ("/dev/null", "/dev/stdout", "/dev/stderr",
                                               "/dev/tty", "/dev/stdin"):
            bloquear("escritura directa a un dispositivo")
        if es_secreto(d, incluir_env=True) and not d.startswith(("/dev/",)):
            bloquear("redireccion hacia un fichero de credenciales o .env")
        m = escritura_protegida(d, self.cwd)
        if m:
            bloquear(f"redireccion hacia una ruta protegida ({m})")

    def escrituras(self, cab, args, flags, pos):
        objetivos = []
        if cab in ("rm", "unlink", "rmdir", "shred", "truncate", "touch", "chmod", "chown",
                   "chgrp", "mv", "tee", "patch", "ln", "split", "csplit"):
            objetivos = pos
            if cab == "chmod" and pos:
                objetivos = pos[1:]
        elif cab in ("cp", "install", "rsync", "scp"):
            objetivos = pos[-1:]
            for k, a in enumerate(args):
                if a in ("-t", "--target-directory") and k + 1 < len(args):
                    objetivos.append(args[k + 1])
                if a.startswith("--target-directory="):
                    objetivos.append(a.split("=", 1)[1])
        elif cab in ("sed", "gsed", "perl", "ruby"):
            cortos = "".join(f[1:] for f in flags if not f.startswith("--"))
            if ("i" in cortos) or "--in-place" in flags or any(
                    f.startswith("--in-place") for f in flags):
                objetivos = pos
        elif cab == "dd":
            objetivos = [a[3:] for a in args if a.startswith("of=")]
        elif cab == "curl":
            for k, a in enumerate(args):
                if a in ("-o", "--output") and k + 1 < len(args):
                    objetivos.append(args[k + 1])
        elif cab == "wget":
            for k, a in enumerate(args):
                if a in ("-O", "--output-document", "-P") and k + 1 < len(args):
                    objetivos.append(args[k + 1])
        elif cab == "sort":
            for k, a in enumerate(args):
                if a in ("-o", "--output") and k + 1 < len(args):
                    objetivos.append(args[k + 1])
        for o in objetivos:
            m = escritura_protegida(o, self.cwd)
            if m:
                bloquear(f"escritura sobre una ruta protegida ({m})")
            if cab in ("tee", "sed", "gsed", "perl", "ruby", "mv", "truncate", "shred") \
                    and ENV_RE.search(o):
                bloquear("modificacion de un fichero .env")
        if cab == "ln":
            for o in pos:
                m = escritura_protegida(o, self.cwd)
                if m:
                    bloquear(f"enlace hacia una ruta protegida ({m})")

    # ---- lecturas ----
    def lecturas(self, cab, args, flags, pos):
        if cab in EXENTAS_LECTURA:
            return
        cand = list(args)
        if cab in ("cp", "install", "rsync", "mv"):
            cand = list(pos[:-1]) + [a for a in args if a.startswith("-")]
        if cab in BUSCADORES and not any(a in ("-e", "-f") or a.startswith("--regexp")
                                         for a in args):
            for k, a in enumerate(cand):
                if not a.startswith("-"):
                    cand = cand[:k] + cand[k + 1:]
                    break
        if cab in ("python", "node", "nodejs", "perl", "ruby", "php", "deno", "bun") \
                and any(a in FLAGS_EN_LINEA for a in args):
            return  # ya revisado con codigo_en_linea
        for a in cand:
            if a.startswith("-") and "=" not in a:
                continue
            m = es_secreto(a)
            if m:
                bloquear(f"lectura o copia de {m}")


def analizar(cmd: str):
    Analizador().comando(cmd)


def deny(motivo: str) -> int:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": (
                f"Bloqueado por el orquestador: {motivo}. "
                "Si es intencionado, ejecutalo tu mismo en la terminal o "
                "ajusta .claude/hooks/guard-bash.py."
            ),
        }
    }))
    return 0


def cerrar(detalle: str) -> int:
    sys.stderr.write(
        "Bloqueado por el hook guard-bash.py: no se pudo analizar el comando "
        f"({detalle}). Falla cerrado por diseno; si es un fallo del hook, revisalo.\n")
    return 2


def main() -> int:
    try:
        datos = json.loads(sys.stdin.read())
    except Exception as e:
        return cerrar(f"entrada JSON ilegible: {type(e).__name__}")
    try:
        if not isinstance(datos, dict):
            return cerrar("la entrada no es un objeto JSON")
        herramienta = datos.get("tool_name")
        if herramienta is None:
            return cerrar("falta tool_name")
        if herramienta != "Bash":
            return 0
        entrada = datos.get("tool_input")
        if not isinstance(entrada, dict):
            return cerrar("falta tool_input")
        comando = entrada.get("command", "")
        if comando is None or comando == "":
            return 0
        if not isinstance(comando, str):
            return cerrar("command no es texto")
        analizar(comando)
        return 0
    except Bloqueo as b:
        return deny(str(b))
    except Exception as e:  # fallo cerrado: ante la duda, no se ejecuta
        return cerrar(f"error interno: {type(e).__name__}: {e}")


if __name__ == "__main__":
    sys.exit(main())

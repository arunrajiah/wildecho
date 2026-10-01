"""Render ../PRIVACY.md into privacy.html so the policy has one source of truth.

Handles the small Markdown subset PRIVACY.md uses: #/## headings, paragraphs,
"- " lists, **bold**, _italic_, `code`, [text](url) and <url> links.
Run: python3 site/build.py
"""

import html
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent
SOURCE = SITE.parent / "PRIVACY.md"
REPO_BLOB = "https://github.com/arunrajiah/wildecho/blob/main/"


def inline(text: str) -> str:
    out = html.escape(text, quote=False)
    out = re.sub(r"`([^`]+)`", r"<code>\1</code>", out)
    out = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", out)
    out = re.sub(r"(?<![\w/])_([^_]+)_(?!\w)", r"<em>\1</em>", out)
    out = re.sub(r"\[([^\]]+)\]\(\./([^)\s]+)\)", rf'<a href="{REPO_BLOB}\2">\1</a>', out)
    out = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', out)
    out = re.sub(r"&lt;(https?://[^&\s]+)&gt;", r'<a href="\1">\1</a>', out)
    out = re.sub(r"(?<![\w\"/>])([\w.+-]+@[\w-]+\.[\w.]+)", r'<a href="mailto:\1">\1</a>', out)
    return out


def render(markdown: str) -> str:
    blocks: list[str] = []
    para: list[str] = []
    items: list[str] = []

    def flush() -> None:
        if para:
            blocks.append(f"<p>{inline(' '.join(para))}</p>")
            para.clear()
        if items:
            blocks.append("<ul>" + "".join(f"<li>{inline(i)}</li>" for i in items) + "</ul>")
            items.clear()

    for raw in markdown.splitlines():
        line = raw.rstrip()
        if not line.strip():
            flush()
        elif line.startswith("## "):
            flush()
            blocks.append(f"<h2>{inline(line[3:])}</h2>")
        elif line.startswith("# "):
            flush()
            blocks.append(f"<h1>{inline(line[2:])}</h1>")
        elif line.startswith("- "):
            if para:
                flush()
            items.append(line[2:].strip())
        elif items and raw.startswith("  "):
            items[-1] += " " + line.strip()
        else:
            para.append(line.strip())
    flush()
    return "\n".join(blocks)


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy policy | WildEcho</title>
<meta name="description" content="How the WildEcho app and its public server handle your data.">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="canonical" href="https://wildecho.arunrajiah.com/privacy">
<style>
:root {{ --bg:#fff; --text:#0d1b2a; --muted:#52637a; --line:#e3eaf3; --brand:#208aef; --soft:#f5f8fc; }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg:#07121f; --text:#e8eef6; --muted:#9db0c6; --line:#1c2f45; --soft:#0b1a2c; }} }}
* {{ box-sizing: border-box; }}
body {{ margin:0; background:var(--bg); color:var(--text); font:17px/1.7 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif; -webkit-font-smoothing:antialiased; }}
header {{ border-bottom:1px solid var(--line); }}
.bar {{ max-width:760px; margin:0 auto; padding:18px 16px; display:flex; align-items:center; justify-content:space-between; }}
.logo {{ display:flex; align-items:center; gap:10px; font-weight:800; font-size:18px; color:var(--text); text-decoration:none; }}
.logo img {{ width:30px; height:30px; border-radius:8px; }}
a {{ color:var(--brand); }}
main {{ max-width:760px; margin:0 auto; padding:40px 16px 72px; }}
h1 {{ font-size:clamp(30px,5vw,40px); letter-spacing:-.02em; line-height:1.15; margin:0 0 8px; }}
h1 + p em {{ color:var(--muted); font-style:normal; font-size:15px; }}
h2 {{ font-size:22px; letter-spacing:-.01em; margin:40px 0 8px; }}
ul {{ padding-left:22px; }}
li {{ margin:8px 0; }}
code {{ background:var(--soft); border:1px solid var(--line); border-radius:6px; padding:1px 6px; font-size:.88em; }}
footer {{ border-top:1px solid var(--line); color:var(--muted); font-size:14px; }}
footer .bar {{ padding:24px 16px; }}
</style>
</head>
<body>
<header><div class="bar"><a class="logo" href="/"><img src="/assets/icon-192.png" alt="">WildEcho</a><a href="/">Home</a></div></header>
<main>
{body}
</main>
<footer><div class="bar"><span>WildEcho</span><a href="https://github.com/arunrajiah/wildecho/blob/main/PRIVACY.md">Source of this policy</a></div></footer>
</body>
</html>
"""


def main() -> None:
    body = render(SOURCE.read_text(encoding="utf-8"))
    (SITE / "privacy.html").write_text(PAGE.format(body=body), encoding="utf-8")
    print(f"wrote {SITE / 'privacy.html'}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate printable monthly hero sheets from docs/ Markdown database."""
from __future__ import annotations

import argparse
import re
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs"

DAYS = {
    "en": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "pt": ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
}
CLASS_DISPLAY = {
    "en": {
        "guerreiro": "Warrior",
        "bardo": "Bard",
        "mago": "Mage",
        "ladino": "Rogue",
    },
    "pt": {
        "guerreiro": "Guerreiro",
        "bardo": "Bardo",
        "mago": "Mago",
        "ladino": "Ladino",
    },
}
UI = {
    "en": {
        "no_skills": "No skills yet",
        "daily_objectives": "Daily Objectives",
        "level": "Level",
        "month": "Month",
        "theme": "Theme",
        "xp_squares": "XP squares (100 pts)",
        "week": "Week",
        "extras": "Extras",
        "boss": "Collective BOSS",
        "mission_fallback": "Collective Mission",
        "mission_name": "Mission",
    },
    "pt": {
        "no_skills": "Ainda sem skills",
        "daily_objectives": "Objetivos diários",
        "level": "Nível",
        "month": "Mês",
        "theme": "Tema",
        "xp_squares": "Quadrados de XP (100 pts)",
        "week": "Semana",
        "extras": "Extras",
        "boss": "BOSS coletivo",
        "mission_fallback": "Missão Coletiva",
        "mission_name": "Missão",
    },
}


def pick(obj: dict | None, key: str, locale: str) -> str:
    """Prefer key_pt when locale=pt, else key."""
    if not obj:
        return ""
    if locale == "pt":
        pt = obj.get(f"{key}_pt")
        if isinstance(pt, str) and pt.strip():
            return pt
    val = obj.get(key)
    return val if isinstance(val, str) else (str(val) if val is not None else "")


def parse_md(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    data = yaml.safe_load(parts[1]) or {}
    return data, parts[2].strip()


def resolve_asset(rel: str) -> Path:
    rel = (rel or "").replace("\\", "/")
    if rel.startswith("docs/"):
        return ROOT / rel
    return DOCS / rel


def asset_uri(rel: str) -> str:
    return resolve_asset(rel).resolve().as_uri()


def load_game() -> dict:
    data, _ = parse_md(DOCS / "config" / "game-config.md")
    return data


def load_month(month: str) -> dict:
    path = DOCS / "config" / "months" / f"{month}.md"
    if not path.exists():
        raise SystemExit(f"Month setup not found: {path}")
    data, _ = parse_md(path)
    return data


def load_bestiary() -> dict:
    data, _ = parse_md(DOCS / "config" / "bestiary.md")
    return data.get("themes") or {}


def load_hero(hid: str) -> dict:
    folder = DOCS / hid
    profile, _ = parse_md(folder / "profile.md")
    skills, _ = parse_md(folder / "skills.md")
    objectives, _ = parse_md(folder / "objectives.md")
    return {
        "id": hid,
        "profile": profile,
        "skills": skills.get("skills") or [],
        "objectives": objectives,
    }


def theme_palette(themes: dict, theme_key: str) -> list[str]:
    t = themes.get(theme_key) or {}
    return t.get("palette") or ["#C92A2A", "#A87900", "#3D2B1F"]


def weasy_available() -> bool:
    import contextlib
    import io
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            from weasyprint import HTML  # noqa: F401
        return True
    except Exception:
        return False


# --- HTML / WeasyPrint path -------------------------------------------------

def hero_page_html(hero, month, game, themes, points, locale: str = "pt") -> str:
    ui = UI[locale]
    days = DAYS[locale]
    profile = hero["profile"]
    objs = list(hero["objectives"].get("daily_objectives") or [])
    while len(objs) < 3:
        objs.append({
            "name": f"{ui['mission_name']} {len(objs) + 1}",
            "name_pt": f"{UI['pt']['mission_name']} {len(objs) + 1}",
            "points": points.get("per_task", 30),
        })

    theme_key = month.get("theme") or "treino"
    palette = theme_palette(themes, theme_key)
    theme_meta = themes.get(theme_key) or {}
    bg = theme_meta.get("background") or f"docs/assets/backgrounds/{theme_key}.svg"
    photo = profile.get("photo") or f"docs/assets/photos/{hero['id'].lower()}.svg"
    avatar = profile.get("avatar") or f"docs/assets/avatars/{profile.get('class', 'guerreiro')}.svg"
    bosses = month.get("bosses") or []
    weeks = month.get("weeks") or []
    cls_key = profile.get("class") or "?"
    cls = CLASS_DISPLAY[locale].get(cls_key, str(cls_key).title())
    name = pick(profile, "character_name", locale) or hero["id"]
    level = profile.get("level", 1)
    skills = hero["skills"]
    skill_names = [pick(s, "name", locale) or "?" for s in skills]
    skill_txt = " · ".join(skill_names) if skill_names else ui["no_skills"]
    theme_name = pick(theme_meta, "name", locale) or theme_key

    obj_list = "".join(
        f'<li><strong>{pick(o, "name", locale)}</strong> '
        f'<span class="muted">({o.get("points", 30)} pts)</span></li>'
        for o in objs[:3]
    )

    boss_blocks = []
    for i, week in enumerate(weeks):
        boss = next((b for b in bosses if b.get("week") == week), bosses[i] if i < len(bosses) else {})
        btype = boss.get("type") or "monstro"
        img = boss.get("image") or f"docs/assets/enemies/{btype}.svg"
        boss_blocks.append(
            f'''<div class="boss-week"><div class="boss-head">
              <img src="{asset_uri(img)}" class="boss-img"/>
              <div><div class="week-label">{week}</div>
              <div class="boss-name">{pick(boss, "name", locale) or "BOSS"}</div>
              <div class="muted">{pick(boss, "mission_redacted", locale) or ui["mission_fallback"]} · +{boss.get("points", 30)} pts</div></div>
              <span class="box big"></span></div></div>'''
        )

    week_grids = []
    for week in weeks:
        rows = "".join(
            f'<tr><th>{lab}</th>'
            + "".join('<td class="cb"><span class="box"></span></td>' for _ in range(3))
            + '<td class="extras"></td></tr>'
            for lab in days
        )
        week_grids.append(
            f'<div class="week-grid"><h4>{week}</h4><table>'
            f'<thead><tr><th></th><th>1</th><th>2</th><th>3</th><th>Ex</th></tr></thead>'
            f'<tbody>{rows}</tbody></table></div>'
        )

    xp_squares = "".join('<div class="xp-sq"></div>' for _ in range(4))
    primary, accent, deep = palette[0], palette[1], palette[2]
    footer = (
        f"Family Quest — marcar no papel; transferir para docs/{hero['id']}/weekly/ no fim da semana."
        if locale == "pt"
        else f"Family Quest — mark on paper; transfer to docs/{hero['id']}/weekly/ at week end."
    )

    return f'''
    <section class="page" style="--c1:{primary};--c2:{accent};--c3:{deep};--bg:url('{asset_uri(bg)}');">
      <header class="top">
        <div class="id-block">
          <img src="{asset_uri(photo)}" class="photo"/>
          <img src="{asset_uri(avatar)}" class="avatar"/>
        </div>
        <div class="meta">
          <div class="game">{game.get("game_name", "Family Quest RPG")}</div>
          <h1>{name}</h1>
          <p class="subtitle">{cls} · {ui["level"]} {level} · {ui["month"]} {month.get("month")} · {ui["theme"]} {theme_name}</p>
          <p class="skills">Skills: <span class="skill">{skill_txt}</span></p>
        </div>
        <div class="xp-panel">
          <div class="xp-label">XP ({points.get("monthly_xp", 400)})</div>
          <div class="xp-row">{xp_squares}</div>
          <div class="muted">1 □ = {points.get("weekly_target", 100)} pts</div>
        </div>
      </header>
      <div class="cols">
        <div class="panel"><h3>{ui["daily_objectives"]}</h3><ol class="objs">{obj_list}</ol>
          <p class="muted">{ui["extras"]}: +{points.get("per_extra", 2.5)} pts</p></div>
        <div class="panel bosses"><h3>{ui["boss"]}</h3>{"".join(boss_blocks)}</div>
      </div>
      <div class="grids">{"".join(week_grids)}</div>
      <footer>{footer}</footer>
    </section>'''


def full_html(pages: list[str], title: str, locale: str = "pt") -> str:
    css = """
    @page { size: A4; margin: 10mm; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Georgia, serif; color: #1a1410; font-size: 10px; }
    .page {
      page-break-after: always; min-height: 277mm; padding: 12px 14px;
      background: linear-gradient(160deg, var(--c3), color-mix(in srgb, var(--c1) 40%, var(--c3))), var(--bg);
      background-size: cover; border: 2px solid #D4A945; color: #F5E6C8; position: relative;
    }
    .page:last-child { page-break-after: auto; }
    .top { display: flex; gap: 12px; margin-bottom: 10px; }
    .id-block { display: flex; gap: 6px; }
    .photo, .avatar { width: 72px; height: 90px; object-fit: cover; border: 2px solid #D4A945; background: #2a2218; }
    .avatar { width: 72px; height: 72px; border-radius: 50%; align-self: center; }
    .meta { flex: 1; }
    .game { letter-spacing: 0.12em; text-transform: uppercase; color: #D4A945; font-size: 9px; }
    h1 { margin: 2px 0 4px; font-size: 22px; color: #D4A945; }
    .subtitle, .skills { margin: 0 0 6px; }
    .skill { color: #D4A945; }
    .muted { opacity: 0.75; font-size: 9px; }
    .xp-panel { text-align: right; min-width: 110px; }
    .xp-label { color: #D4A945; font-weight: bold; margin-bottom: 4px; }
    .xp-row { display: flex; gap: 4px; justify-content: flex-end; margin-bottom: 4px; }
    .xp-sq { width: 22px; height: 22px; border: 2px solid #D4A945; background: rgba(0,0,0,0.25); }
    .cols { display: flex; gap: 10px; margin-bottom: 10px; }
    .panel { flex: 1; background: rgba(26,20,16,0.72); border: 1px solid #D4A945; padding: 8px 10px; }
    .panel h3, .week-grid h4 { margin: 0 0 6px; color: #D4A945; font-size: 11px; text-transform: uppercase; }
    .objs { margin: 0; padding-left: 16px; }
    .boss-week { margin-bottom: 6px; }
    .boss-head { display: flex; gap: 8px; align-items: center; }
    .boss-img { width: 36px; height: 36px; border: 1px solid #D4A945; }
    .boss-name { font-weight: bold; }
    .week-label { font-size: 8px; color: #D4A945; }
    .box { display: inline-block; width: 12px; height: 12px; border: 1.5px solid #D4A945; background: rgba(0,0,0,0.2); }
    .box.big { width: 18px; height: 18px; margin-left: auto; }
    .grids { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .week-grid { background: rgba(26,20,16,0.72); border: 1px solid rgba(212,169,69,0.45); padding: 6px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid rgba(212,169,69,0.35); padding: 2px; text-align: center; }
    th { color: #D4A945; font-weight: normal; font-size: 8px; }
    .extras { min-width: 28px; height: 16px; }
    footer { position: absolute; bottom: 8px; left: 14px; right: 14px; font-size: 8px; opacity: 0.7;
      border-top: 1px solid rgba(212,169,69,0.3); padding-top: 4px; }
    """
    return f"""<!DOCTYPE html><html lang="{locale}"><head><meta charset="utf-8"/>
<title>{title}</title><style>{css}</style></head><body>{"".join(pages)}</body></html>"""


def write_pdf_weasy(html: str, out: Path) -> None:
    from weasyprint import HTML
    out.parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html, base_url=str(ROOT)).write_pdf(str(out))
    print(f"Wrote {out} (weasyprint)")


# --- ReportLab fallback -----------------------------------------------------

def _hex(c: str):
    from reportlab.lib.colors import HexColor
    return HexColor(c)


def _rasterize_svg(path: Path) -> Path | None:
    """SVG → PNG cache next to asset (ReportLab cannot draw SVG)."""
    cache = path.with_suffix(path.suffix + ".raster.png")
    if cache.exists() and cache.stat().st_mtime >= path.stat().st_mtime:
        return cache
    try:
        import cairosvg  # type: ignore

        cairosvg.svg2png(url=str(path), write_to=str(cache), output_width=512)
        return cache
    except Exception:
        pass
    try:
        from svglib.svglib import svg2rlg
        from reportlab.graphics import renderPM

        drawing = svg2rlg(str(path))
        if drawing is None:
            return None
        renderPM.drawToFile(drawing, str(cache), fmt="PNG")
        return cache
    except Exception:
        return None


def _try_image(path: Path, w: float, h: float):
    """Return Image flowable or None. PNG/JPG OK; SVG rasterized via cairosvg/svglib when available."""
    if not path.exists():
        return None
    use = path
    if path.suffix.lower() == ".svg":
        raster = _rasterize_svg(path)
        if not raster:
            return None
        use = raster
    try:
        from reportlab.platypus import Image
        return Image(str(use), width=w, height=h, kind="proportional")
    except Exception:
        return None


def write_pdf_reportlab(heroes_data: list[dict], out: Path, combined: bool = False, locale: str = "pt") -> None:
    """heroes_data: list of dicts with keys hero, month, game, themes, points"""
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas

    out.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(out), pagesize=A4)
    w, h = A4

    for item in heroes_data:
        hero = item["hero"]
        month = item["month"]
        game = item["game"]
        themes = item["themes"]
        points = item["points"]
        profile = hero["profile"]
        theme_key = month.get("theme") or "treino"
        palette = theme_palette(themes, theme_key)
        theme_meta = themes.get(theme_key) or {}
        deep, primary = palette[2], palette[0]
        gold = "#D4A945"
        cream = "#F5E6C8"

        c.setFillColor(_hex(deep))
        c.rect(0, 0, w, h, fill=1, stroke=0)
        c.setStrokeColor(_hex(primary))
        c.setLineWidth(2)
        c.rect(8 * mm, 8 * mm, w - 16 * mm, h - 16 * mm, fill=0, stroke=1)
        c.setStrokeColor(_hex(gold))
        c.rect(10 * mm, 10 * mm, w - 20 * mm, h - 20 * mm, fill=0, stroke=1)

        ui = UI[locale]
        days = DAYS[locale]
        name = pick(profile, "character_name", locale) or hero["id"]
        cls_key = profile.get("class") or "?"
        cls = CLASS_DISPLAY[locale].get(cls_key, str(cls_key).title())
        level = profile.get("level", 1)
        theme_name = pick(theme_meta, "name", locale) or theme_key

        # Photo / avatar placeholders (SVG not drawn by reportlab — gold frames)
        photo = resolve_asset(profile.get("photo") or "")
        avatar = resolve_asset(profile.get("avatar") or "")
        img = _try_image(photo, 22 * mm, 28 * mm)
        if img:
            img.drawOn(c, 14 * mm, h - 48 * mm)
        else:
            c.setFillColor(_hex("#2a2218"))
            c.rect(14 * mm, h - 48 * mm, 22 * mm, 28 * mm, fill=1, stroke=1)
            c.setFillColor(_hex(gold))
            c.setFont("Times-Roman", 8)
            c.drawCentredString(25 * mm, h - 34 * mm, "photo")

        img_a = _try_image(avatar, 18 * mm, 18 * mm)
        if img_a:
            img_a.drawOn(c, 40 * mm, h - 42 * mm)
        else:
            c.setFillColor(_hex(primary))
            c.circle(49 * mm, h - 33 * mm, 9 * mm, fill=1, stroke=1)
            c.setFillColor(_hex(gold))
            c.setFont("Times-Bold", 7)
            c.drawCentredString(49 * mm, h - 34 * mm, cls[:3].upper())

        c.setFillColor(_hex(gold))
        c.setFont("Times-Bold", 9)
        c.drawString(62 * mm, h - 20 * mm, game.get("game_name", "Family Quest RPG").upper())
        c.setFont("Times-Bold", 18)
        c.drawString(62 * mm, h - 28 * mm, name)
        c.setFillColor(_hex(cream))
        c.setFont("Times-Roman", 10)
        c.drawString(
            62 * mm,
            h - 34 * mm,
            f"{cls} · {ui['level']} {level} · {month.get('month')} · {theme_name}",
        )
        skills = hero["skills"]
        skill_names = [pick(s, "name", locale) or "?" for s in skills]
        skill_txt = ", ".join(skill_names) if skill_names else ui["no_skills"]
        c.setFont("Times-Italic", 9)
        c.drawString(62 * mm, h - 39 * mm, f"Skills: {skill_txt}")

        # XP squares
        c.setFont("Times-Bold", 9)
        c.setFillColor(_hex(gold))
        c.drawRightString(w - 14 * mm, h - 20 * mm, f"XP ({points.get('monthly_xp', 400)})")
        for i in range(4):
            x = w - 14 * mm - (4 - i) * 8 * mm
            c.setStrokeColor(_hex(gold))
            c.setFillColor(_hex("#1a1410"))
            c.rect(x, h - 30 * mm, 6.5 * mm, 6.5 * mm, fill=1, stroke=1)
        c.setFillColor(_hex(cream))
        c.setFont("Times-Roman", 7)
        c.drawRightString(w - 14 * mm, h - 35 * mm, f"1 □ = {points.get('weekly_target', 100)} pts")

        # Objectives
        y = h - 58 * mm
        c.setFillColor(_hex("#1a1410"))
        c.setStrokeColor(_hex(gold))
        c.rect(14 * mm, y - 32 * mm, 85 * mm, 38 * mm, fill=1, stroke=1)
        c.setFillColor(_hex(gold))
        c.setFont("Times-Bold", 10)
        c.drawString(16 * mm, y, ui["daily_objectives"].upper())
        objs = list(hero["objectives"].get("daily_objectives") or [])
        while len(objs) < 3:
            objs.append({"name": f"{ui['mission_name']} {len(objs)+1}", "points": 30})
        c.setFillColor(_hex(cream))
        c.setFont("Times-Roman", 9)
        for i, o in enumerate(objs[:3]):
            c.drawString(
                18 * mm,
                y - 8 * mm - i * 6 * mm,
                f"• {pick(o, 'name', locale)} ({o.get('points', 30)} pts)",
            )
        c.setFont("Times-Italic", 8)
        c.drawString(18 * mm, y - 28 * mm, f"{ui['extras']}: +{points.get('per_extra', 2.5)} pts")

        # Bosses
        c.setFillColor(_hex("#1a1410"))
        c.rect(104 * mm, y - 32 * mm, w - 118 * mm, 38 * mm, fill=1, stroke=1)
        c.setFillColor(_hex(gold))
        c.setFont("Times-Bold", 10)
        c.drawString(106 * mm, y, ui["boss"].upper())
        bosses = month.get("bosses") or []
        weeks = month.get("weeks") or []
        c.setFillColor(_hex(cream))
        c.setFont("Times-Roman", 8)
        for i, week in enumerate(weeks[:4]):
            boss = next((b for b in bosses if b.get("week") == week), bosses[i] if i < len(bosses) else {})
            by = y - 7 * mm - i * 6 * mm
            c.drawString(106 * mm, by, f"{week}: {pick(boss, 'name', locale) or 'BOSS'}")
            c.setStrokeColor(_hex(gold))
            c.rect(w - 22 * mm, by - 1 * mm, 4 * mm, 4 * mm, fill=0, stroke=1)

        # Week grids 2x2
        grid_top = y - 42 * mm
        gw, gh = (w - 32 * mm) / 2, 52 * mm
        for gi, week in enumerate(weeks[:4]):
            col, row = gi % 2, gi // 2
            gx = 14 * mm + col * (gw + 4 * mm)
            gy = grid_top - row * (gh + 4 * mm) - gh
            c.setFillColor(_hex("#1a1410"))
            c.setStrokeColor(_hex(gold))
            c.rect(gx, gy, gw, gh, fill=1, stroke=1)
            c.setFillColor(_hex(gold))
            c.setFont("Times-Bold", 8)
            c.drawString(gx + 2 * mm, gy + gh - 5 * mm, week)
            # header
            headers = ["", "1", "2", "3", "Ex"]
            cell_w = (gw - 4 * mm) / 5
            cell_h = (gh - 10 * mm) / 8
            c.setFont("Times-Roman", 7)
            for hi, lab in enumerate(headers):
                c.drawCentredString(gx + 2 * mm + hi * cell_w + cell_w / 2, gy + gh - 10 * mm, lab)
            for di, dlab in enumerate(days):
                dy = gy + gh - 10 * mm - (di + 1) * cell_h
                c.setFillColor(_hex(cream))
                c.drawString(gx + 3 * mm, dy + 1, dlab)
                for ci in range(1, 4):
                    cx = gx + 2 * mm + ci * cell_w + cell_w / 2 - 2 * mm
                    c.setStrokeColor(_hex(gold))
                    c.rect(cx, dy, 3.5 * mm, 3.5 * mm, fill=0, stroke=1)
                # extras line
                c.line(
                    gx + 2 * mm + 4 * cell_w + 1 * mm,
                    dy + 1.5 * mm,
                    gx + 2 * mm + 5 * cell_w - 1 * mm,
                    dy + 1.5 * mm,
                )

        c.setFillColor(_hex(cream))
        c.setFont("Times-Roman", 7)
        footer = (
            f"Family Quest — marcar no papel; transferir para docs/{hero['id']}/weekly/ no fim da semana."
            if locale == "pt"
            else f"Family Quest — mark on paper; transfer to docs/{hero['id']}/weekly/ at week end."
        )
        c.drawString(14 * mm, 12 * mm, footer)
        c.showPage()

    c.save()
    engine = "reportlab"
    print(f"Wrote {out} ({engine})")


def build_hero_bundle(hid: str, p: dict, month: dict, game: dict, themes: dict, points: dict) -> dict:
    hero = load_hero(hid)
    if not hero["profile"].get("photo"):
        hero["profile"]["photo"] = p.get("photo")
    if not hero["profile"].get("avatar"):
        hero["profile"]["avatar"] = p.get("avatar")
    if not hero["profile"].get("character_name"):
        hero["profile"]["character_name"] = p.get("character_name")
    if not hero["profile"].get("character_name_pt") and p.get("character_name_pt"):
        hero["profile"]["character_name_pt"] = p.get("character_name_pt")
    if not hero["profile"].get("class"):
        hero["profile"]["class"] = p.get("class")
    return {"hero": hero, "month": month, "game": game, "themes": themes, "points": points}


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Family Quest monthly PDFs")
    parser.add_argument("--month", required=True, help="YYYY-MM")
    parser.add_argument(
        "--locale",
        choices=("en", "pt"),
        default="pt",
        help="Sheet language (default: pt — family print)",
    )
    parser.add_argument(
        "--engine",
        choices=("auto", "weasyprint", "reportlab"),
        default="auto",
        help="PDF engine (default: auto — weasyprint if available)",
    )
    args = parser.parse_args()
    month_id = args.month
    locale = args.locale
    if not re.fullmatch(r"\d{4}-\d{2}", month_id):
        raise SystemExit("--month must be YYYY-MM")

    game = load_game()
    month = load_month(month_id)
    themes = load_bestiary()
    points = game.get("points") or {}
    players = game.get("players") or []
    out_dir = ROOT / "pdfs" / month_id

    bundles = [build_hero_bundle(p["id"], p, month, game, themes, points) for p in players]

    use_weasy = args.engine == "weasyprint" or (args.engine == "auto" and weasy_available())
    if args.engine == "weasyprint" and not weasy_available():
        raise SystemExit("WeasyPrint unavailable (system libs missing). Use --engine reportlab")

    if use_weasy:
        pages = [hero_page_html(**b, locale=locale) for b in bundles]
        for b, page in zip(bundles, pages):
            write_pdf_weasy(
                full_html([page], f"{b['hero']['id']} {month_id}", locale),
                out_dir / f"{b['hero']['id']}.pdf",
            )
        write_pdf_weasy(
            full_html(pages, f"Family Quest {month_id}", locale),
            out_dir / f"family-quest-{month_id}.pdf",
        )
    else:
        if args.engine == "auto":
            print("WeasyPrint unavailable — falling back to reportlab")
        for b in bundles:
            write_pdf_reportlab([b], out_dir / f"{b['hero']['id']}.pdf", locale=locale)
        write_pdf_reportlab(bundles, out_dir / f"family-quest-{month_id}.pdf", locale=locale)

    print(f"Done: {len(bundles)} heroes · locale={locale} → {out_dir}")


if __name__ == "__main__":
    main()

import type { CSSProperties } from 'react'
import { assetUrl } from './githubApi'
import type { BestiaryTheme, SheetColors } from './types'

/** CSS alpha of panels (0.10 = 10% solid → landscape shows through). */
export const DEFAULT_SHEET_COLORS: SheetColors = {
  text: '#ECECEC',
  block: '#1C1917',
  block_opacity: 0.1,
}

export function clampBlockOpacity(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_SHEET_COLORS.block_opacity
  return Math.min(0.85, Math.max(0.05, n))
}

export function defaultsFromPalette(palette?: string[]): SheetColors {
  const deep = palette?.[2] || DEFAULT_SHEET_COLORS.block
  return {
    text: DEFAULT_SHEET_COLORS.text,
    block: deep,
    block_opacity: DEFAULT_SHEET_COLORS.block_opacity,
  }
}

export function resolveSheetColors(
  saved: SheetColors | undefined,
  theme?: BestiaryTheme,
): SheetColors {
  if (saved?.text && saved?.block != null) {
    return {
      text: saved.text,
      block: saved.block,
      block_opacity:
        typeof saved.block_opacity === 'number'
          ? clampBlockOpacity(saved.block_opacity)
          : DEFAULT_SHEET_COLORS.block_opacity,
    }
  }
  return defaultsFromPalette(theme?.palette)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function blockFill(blockHex: string, opacity: number): string {
  const rgb = hexToRgb(blockHex) || { r: 28, g: 25, b: 23 }
  const a = clampBlockOpacity(opacity)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

export function sheetCssVars(opts: {
  theme?: BestiaryTheme
  colors: SheetColors
}): CSSProperties {
  const palette = opts.theme?.palette || ['#A87900', '#C9A227', '#1C1917']
  const accent = palette[0] || '#A87900'
  const gold = palette[1] || '#C9A227'
  const deep = palette[2] || '#1C1917'
  const motif = opts.theme?.background ? assetUrl(opts.theme.background) : ''

  return {
    ['--sheet-text' as string]: opts.colors.text,
    ['--sheet-block' as string]: blockFill(opts.colors.block, opts.colors.block_opacity),
    ['--sheet-block-alpha' as string]: String(clampBlockOpacity(opts.colors.block_opacity)),
    ['--sheet-accent' as string]: accent,
    ['--sheet-gold' as string]: gold,
    ['--sheet-deep' as string]: deep,
    color: opts.colors.text,
    backgroundImage: motif
      ? `linear-gradient(180deg, color-mix(in oklab, ${deep} 35%, transparent), color-mix(in oklab, ${deep} 55%, transparent)), url("${motif}")`
      : `linear-gradient(160deg, ${accent}, ${deep})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 0.3s ease, color 0.3s ease',
  }
}

const BODY_CLASSES = ['guerreiro', 'bardo', 'mago', 'ladino'] as const

/**
 * Avatar stage 0–12.
 * 0 = plain clothes (no rewards yet).
 * N = months completed → gear from class upgrades 1…N stacked.
 */
export function bodyStage(monthsCompleted: number): number {
  return Math.min(12, Math.max(0, Math.floor(monthsCompleted)))
}

/** Class avatar path — {male|female}/lv-00…12 (gear from classes.md). */
export function bodyAssetPath(
  classId: string | undefined,
  monthsCompleted: number,
  sex?: 'male' | 'female',
): string {
  const cls = BODY_CLASSES.includes(classId as (typeof BODY_CLASSES)[number])
    ? classId!
    : 'guerreiro'
  const s = sex === 'female' ? 'female' : 'male'
  const lv = String(bodyStage(monthsCompleted)).padStart(2, '0')
  return `docs/assets/bodies/${cls}/${s}/lv-${lv}.svg`
}

const CLASS_BG: Record<string, string> = {
  guerreiro: 'docs/assets/backgrounds/classes/guerreiro.jpg',
  bardo: 'docs/assets/backgrounds/classes/bardo.jpg',
  mago: 'docs/assets/backgrounds/classes/mago.jpg',
  ladino: 'docs/assets/backgrounds/classes/ladino.jpg',
}

/** Focal point for epic class landscapes (sky / dragons stay visible). */
const CLASS_BG_POS: Record<string, string> = {
  guerreiro: 'center 28%',
  bardo: 'center 32%',
  mago: 'center 30%',
  ladino: 'center 35%',
}

/** Cinematic landscape by class (quest destination vibe). */
export function classBackgroundPath(classId: string | undefined): string {
  if (!classId) return CLASS_BG.guerreiro
  return CLASS_BG[classId] || CLASS_BG.guerreiro
}

export function classBackgroundPosition(classId: string | undefined): string {
  if (!classId) return CLASS_BG_POS.guerreiro
  return CLASS_BG_POS[classId] || 'center 32%'
}

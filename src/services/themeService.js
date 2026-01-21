// Theme Service - Aplica cores dinamicamente na aplicação
// Converte cores HEX para RGB e gera variações automaticamente

/**
 * Converte cor HEX para RGB separado (formato: "59 130 246")
 * @param {string} hex - Cor em formato HEX (#RRGGBB)
 * @returns {string} RGB separado por espaços
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0 0 0'

  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)

  return `${r} ${g} ${b}`
}

/**
 * Converte RGB para HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{h: number, s: number, l: number}}
 */
function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  }
}

/**
 * Converte HSL para RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} RGB separado
 */
function hslToRgb(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  return `${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)}`
}

/**
 * Gera cor mais escura (para dark mode)
 * @param {string} hex - Cor HEX
 * @param {number} amount - Quanto escurecer (0-100)
 * @returns {string} RGB separado
 */
function darken(hex, amount = 20) {
  const rgb = hexToRgb(hex).split(' ').map(Number)
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])

  hsl.l = Math.max(0, hsl.l - amount)

  return hslToRgb(hsl.h, hsl.s, hsl.l)
}

/**
 * Gera cor mais clara
 * @param {string} hex - Cor HEX
 * @param {number} amount - Quanto clarear (0-100)
 * @returns {string} RGB separado
 */
function lighten(hex, amount = 20) {
  const rgb = hexToRgb(hex).split(' ').map(Number)
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])

  hsl.l = Math.min(100, hsl.l + amount)

  return hslToRgb(hsl.h, hsl.s, hsl.l)
}

/**
 * Verifica se a cor é escura
 * @param {string} hex - Cor HEX
 * @returns {boolean}
 */
function isDark(hex) {
  const rgb = hexToRgb(hex).split(' ').map(Number)
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2])
  return hsl.l < 50
}

/**
 * Aplica tema completo na aplicação
 * @param {Object} settings - Configurações do app
 * @param {string} settings.primaryColor - Cor primária HEX
 * @param {string} settings.secondaryColor - Cor secundária HEX
 * @param {string} settings.accentColor - Cor de destaque HEX
 */
export function applyTheme(settings) {
  const root = document.documentElement

  // Cores principais (light mode)
  root.style.setProperty('--primary', hexToRgb(settings.primaryColor))
  root.style.setProperty('--primary-foreground', '255 255 255')

  root.style.setProperty('--secondary', hexToRgb(settings.secondaryColor))
  root.style.setProperty('--secondary-foreground', '255 255 255')

  root.style.setProperty('--accent', hexToRgb(settings.accentColor))
  root.style.setProperty('--accent-foreground', '255 255 255')

  // Ring (focus) usa cor primária
  root.style.setProperty('--ring', hexToRgb(settings.primaryColor))

  console.log('✅ Tema aplicado:', settings.brandName)
}

/**
 * Carrega configurações da API e aplica o tema
 */
export async function loadAndApplyTheme() {
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7000/api'
    const response = await fetch(`${baseUrl}/AppSettings`)

    if (!response.ok) {
      console.warn('Configurações não encontradas, usando padrão')
      return null
    }

    const settings = await response.json()

    // Aplicar tema
    applyTheme(settings)

    // Atualizar título da página
    document.title = settings.brandName || 'Base API'

    // Salvar no localStorage para cache
    localStorage.setItem('app_settings', JSON.stringify(settings))

    return settings
  } catch (error) {
    console.error('Erro ao carregar configurações:', error)

    // Tentar usar cache
    const cached = localStorage.getItem('app_settings')
    if (cached) {
      const settings = JSON.parse(cached)
      applyTheme(settings)
      return settings
    }

    return null
  }
}

/**
 * Obtém configurações do cache ou carrega da API
 */
export function getCachedSettings() {
  const cached = localStorage.getItem('app_settings')
  return cached ? JSON.parse(cached) : null
}

export default {
  applyTheme,
  loadAndApplyTheme,
  getCachedSettings,
  hexToRgb,
  darken,
  lighten,
  isDark
}

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const darkTheme = {
  dark: true,
  colors: {
    background: '#09090b',
    surface: '#131316',
    'surface-bright': '#1e1e22',
    'surface-light': '#1a1a1f',
    'surface-variant': '#27272a',
    'on-surface-variant': '#a1a1aa',
    primary: '#818cf8',
    'on-primary': '#1e1b4b',
    secondary: '#a78bfa',
    success: '#34d399',
    'on-success': '#064e3b',
    error: '#f87171',
    'on-error': '#7f1d1d',
    warning: '#fbbf24',
    'on-warning': '#78350f',
    info: '#60a5fa',
    'on-background': '#e4e4e7',
    'on-surface': '#e4e4e7',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: { dark: darkTheme },
  },
  defaults: {
    VCard: { rounded: 'lg', variant: 'flat', color: 'surface-bright' },
    VBtn: { rounded: 'lg', variant: 'flat' },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VTextarea: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VChip: { rounded: 'lg' },
    VTable: { class: 'bg-transparent' },
  },
})

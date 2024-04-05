// uno.config.ts
import {
    defineConfig,
    presetAttributify,
    presetTypography,
    presetUno,
  } from "unocss";
import presetWind from "@unocss/preset-wind";
import presetIcons from '@unocss/preset-icons'
import {presetDaisy} from 'unocss-preset-daisy'

export default defineConfig({
  presets: [presetWind(), presetAttributify(), presetTypography(), presetUno(), presetIcons(),presetDaisy()],
  safelist: ["prose"],
  theme: {
    colors : {
      blank:'var(--color-base)',
      mantle: 'var(--color-mantle)',
      overlay: 'var(--color-overlay)',
      highlight: 'var(--color-bg-highlight)',
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)'
    }
  }
});

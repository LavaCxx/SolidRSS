// uno.config.ts
import {
    defineConfig,
    presetAttributify,
    presetTypography,
    presetUno,
    presetWind,presetIcons
  } from "unocss";
import {presetDaisy} from 'unocss-preset-daisy'

export default defineConfig({
  presets: [presetWind(), presetAttributify(), presetTypography(
    {
      cssExtend:{
        'img': {
          'width': '100%',
          "border-radius": '6px'
        },
        'span': {
          'display':'inline-block'
        },
        'svg[width="1em"]':{
          'display':'none'
        },
        "code":{
          'background-color':'var(--color-curst) !important',
          "padding":'2px 4px',
          'border-radius':'4px'
        },
        "code::before,code::after":{
          'display':'none'
        },
        "pre":{
          'background-color':'var(--color-curst) !important',
          'border-radius':'6px'
        },
        "pre code":{
          'background-color':'unset',
          'padding':'unset',
        },
        "tr:nth-child(2n)": {
          "background-color": "var(--color-curst)",
        }
      }
    }
  ), presetUno(), presetIcons(), presetDaisy()],
  safelist: ["prose"],
  theme: {
    colors : {
      blank:'var(--color-base)',
      mantle: 'var(--color-mantle)',
      curst: 'var(--color-curst)',
      overlay: 'var(--color-overlay)',
      highlight: 'var(--color-bg-highlight)',
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)'
    }
  }
});

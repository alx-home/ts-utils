import type { Config } from "tailwindcss";
import container_queries from '@tailwindcss/container-queries';

import { PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      'shadow-opacities': {
        '0': 'transparent',
        '1/4': '.25',
        '1/2': '.5',
        '3/4': '.75',
        '1': '1'
      }
    },
  },
  plugins: [
    ({ addVariant, matchUtilities, theme }: PluginAPI) => {
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('hocus-within', ['&:hover', '&:focus-within']);
      addVariant('group-hocus', [
        ':merge(.group):hover &',
        ':merge(.group):focus &'
      ]);
      addVariant('group-hocus-within', [
        ':merge(.group):hover &',
        ':merge(.group):focus-within &'
      ]);
      addVariant('peer-hocus', [
        ':merge(.peer):hover ~ &',
        ':merge(.peer):focus ~ &'
      ]);
      addVariant('peer-hocus-within', [
        ':merge(.peer):hover ~ &',
        ':merge(.peer):focus-within ~ &'
      ]);
      matchUtilities(
        {
          'shadow-opacity': (value) => ({
            '--tw-shadow-opacity': value
          }),
        },
        { values: theme('shadow-opacities') }
      )
    },
    container_queries
  ],
} satisfies Config;
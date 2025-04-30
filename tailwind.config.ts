/*
MIT License

Copyright (c) 2025 alx-home

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import type { Config } from "tailwindcss";
import container_queries from '@tailwindcss/container-queries';

import { KeyValuePair, PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      },
      boxShadow: {
        'sm': '0 1px 2px 0 var(--tw-shadow-color)',
        'md': '0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color)',
        'lg': '0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color)',
        'xl': '0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color)',
        '2xl': '0 25px 50px -12px var(--tw-shadow-color)',
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
          'shadow-color': (value) => ({
            '--tw-shadow-color': value
          }),
        },
        {
          values: {
            ...theme('colors'),
            default: "rgb(2,6,23)"
          } as KeyValuePair,
          type: 'color'
        }
      )
    },
    container_queries
  ],
} satisfies Config;
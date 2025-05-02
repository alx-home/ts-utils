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

import { AliasOptions, PluginOption, UserConfig } from "vite";
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

const webBrowserTest = process.env.WEB_BROWSER_TEST;
const default_output_dir = process.env.OUTPUT_DIR;

export const LibConfig = ({ name, entries, output_dir, empty_out, alias, plugins, minify, sourcemap }: {
   name: string,
   output_dir?: string,
   entries: string[],
   empty_out?: boolean,
   alias?: AliasOptions,
   sourcemap?: boolean
   plugins?: PluginOption[],
   minify?: boolean
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest
   },
   build: {
      lib: {
         name: name,
         entry: entries,
      },
      minify: minify ?? true,
      rollupOptions: {
         external: ['react', 'react-dom', 'styled-components'],
         output: {
            manualChunks: undefined,
            globals: {
               react: 'React',
               'react-dom': 'ReactDOM',
               'styled-components': 'styled',
            },
         },
      },
      outDir: output_dir ?? default_output_dir,
      ssr: false,
      sourcemap: sourcemap ?? process.env.BUILD_TYPE === 'development',
      emptyOutDir: empty_out ?? true,
   },
   resolve: {
      alias: alias,
      extensions: [
         '.js',
         '.json',
         '.jsx',
         '.ts',
         '.tsx',
      ],
   },
   plugins: [
      react(),
      eslint(),
      dts({
         insertTypesEntry: true,
      }),
      svgr(),
      ...(plugins ?? [])
   ] as PluginOption[],
   css: {
      postcss: {
         plugins: [
            autoprefixer,
            tailwindcss
         ]
      },
   }
});

export const AppConfig = ({ output_dir, empty_out, alias, plugins, minify }: {
   output_dir?: string,
   empty_out?: boolean,
   alias?: AliasOptions,
   plugins?: PluginOption[],
   minify?: boolean
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest
   },
   build: {
      lib: false,
      minify: minify ?? true,
      rollupOptions: {
         output: {
            manualChunks: undefined,
         },
      },
      outDir: output_dir ?? default_output_dir,
      ssr: false,
      sourcemap: process.env.BUILD_TYPE === 'development',
      emptyOutDir: empty_out ?? true,
   },
   resolve: {
      alias: alias,
      extensions: [
         '.js',
         '.json',
         '.jsx',
         '.ts',
         '.tsx',
      ],
   },
   plugins: [
      react(),
      cssInjectedByJsPlugin(),
      eslint(),
      dts({
         insertTypesEntry: true,
      }),
      svgr(),
      ...(plugins ?? [])
   ] as PluginOption[],
   css: {
      postcss: {
         plugins: [
            autoprefixer,
            tailwindcss
         ]
      },
   }
});


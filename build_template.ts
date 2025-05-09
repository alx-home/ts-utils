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

import { AliasOptions, BuildEnvironmentOptions, LibraryOptions, Plugin, PluginOption, UserConfig } from "vite";
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import svgr from 'vite-plugin-svgr';
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { config } from "dotenv";
import tsconfigPaths, { PluginOptions } from 'vite-tsconfig-paths';
import { ESLint } from 'eslint';

let dev = false;
process.argv.forEach(function (val) {
   if (val == "--dev") {
      dev = true;
   }
});

if (dev) {
   console.log("Building for development")

   config({
      path: ".env.development"
   });
} else {
   console.log("Building for production")

   config({
      path: ".env.production"
   });
}

const webBrowserTest = process.env.WEB_BROWSER_TEST;
const default_output_dir = process.env.OUTPUT_DIR;

type RollupOptions = Exclude<BuildEnvironmentOptions['rollupOptions'], undefined>;

export const LibConfig = ({ name, rollupOptions, entries, output_dir, empty_out, alias, plugins, minify, sourcemap, target, define }: {
   name: string,
   output_dir?: string,
   entries: string[] | LibraryOptions,
   empty_out?: boolean,
   rollupOptions?: RollupOptions,
   alias?: AliasOptions,
   sourcemap?: boolean
   plugins?: Plugin<unknown>[],
   minify?: boolean,
   define?: Record<string, unknown>,
   target?: string | false | string[]
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest,
      ...define
   },
   build: {
      lib: {
         name: name,
         entry: (Array.isArray(entries) ? entries : []),
         ...(Array.isArray(entries) ? {} : entries)
      },
      minify: minify ?? (process.env.BUILD_TYPE === 'development' ? false : "esbuild"),
      terserOptions: {
         compress: {
            drop_console: process.env.BUILD_TYPE !== 'development'
         }
      },
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
         ...rollupOptions
      },
      target: target,
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
      svgr(),
      cssInjectedByJsPlugin(),
      tsconfigPaths(),
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

export const AppConfig = ({ output_dir, empty_out, plugins, minify, alias, tsconfig, define }: {
   output_dir?: string,
   empty_out?: boolean,
   plugins?: Plugin<unknown>[],
   alias?: AliasOptions,
   define?: Record<string, unknown>,
   minify?: boolean,
   tsconfig?: PluginOptions
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest,
      ...define
   },
   build: {
      lib: false,
      minify: minify ?? (process.env.BUILD_TYPE === 'development' ? false : "esbuild"),
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
      svgr(),
      tsconfigPaths(tsconfig),
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

export const lint = async (path: string) => {
   const cwd = process.cwd();
   process.chdir(path)
   const eslint = new ESLint({
      globInputPaths: false
   });

   // Lancer le linting sur un ou plusieurs fichiers ou répertoires
   const results = await eslint.lintFiles([]);
   process.chdir(cwd)

   // Afficher les résultats
   const formatter = await eslint.loadFormatter("stylish");
   const resultText = formatter.format(results);
   console.log(resultText);

   // Vérifier si des erreurs sont présentes
   const hasErrors = results.some(result => result.errorCount > 0);
   if (hasErrors) {
      process.exit(1);
   }
};

export type VitePlugin = Plugin;
export type ViteConfig = UserConfig;
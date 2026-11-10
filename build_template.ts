/*
MIT License

Copyright (c) 2025 Alexandre GARCIN

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
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { config } from "dotenv";
import { ESLint } from 'eslint';
import { MinifyOptions } from "terser";
import { readFile } from "node:fs/promises";
import { transform } from '@svgr/core';
import  jsx from '@svgr/plugin-jsx';
import { transform as esbuildTransform } from 'esbuild';

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

const svgReactComponentPlugin = (): Plugin => ({
   name: 'svg-react-component-plugin',
   enforce: 'pre',
   async load(id) {
      const [filePath, query = ''] = id.split('?', 2);
      const isSvgReactRequest = filePath.endsWith('.svg') && query.split('&').includes('react');

      if (!isSvgReactRequest) {
         return null;
      }

      const svgCode = await readFile(filePath, 'utf8');

      const componentCode = await transform(svgCode, undefined, {
         filePath,
         caller: {
            defaultPlugins: [jsx],
         },
      });

      const result = await esbuildTransform(componentCode, {
         loader: 'jsx',
         format: 'esm',
         jsx: 'automatic',
         sourcemap: false,
      });

      return {
         code: result.code,
         map: null,
      };
   },
});

export const LibConfig = ({ name: _name, with_tailwindcss: _with_tailwindcss, with_react: _with_react, rollupOptions: _rollupOptions, entries: _entries, output_dir: _output_dir, empty_out: _empty_out, plugins: _plugins, minify: _minify, sourcemap: _sourcemap, target: _target, define: _define }: {
   name: string,
   output_dir?: string,
   entries: string[] | LibraryOptions,
   empty_out?: boolean,
   rollupOptions?: RollupOptions,
   sourcemap?: boolean
   plugins?: Plugin<unknown>[],
   minify?: boolean,
   define?: Record<string, unknown>,
   target?: string | false | string[],
   with_react?: boolean,
   with_tailwindcss?: boolean
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest,
      ..._define
   },
   build: {
      lib: {
         name: _name,
         entry: (Array.isArray(_entries) ? _entries : []),
         ...(Array.isArray(_entries) ? {} : _entries)
      },
      minify: _minify ?? (process.env.BUILD_TYPE === 'development' ? false : "esbuild"),
      ...((typeof _minify === 'string' && _minify === 'terser') ? {
         terserOptions: {
            compress: {
               drop_console: process.env.BUILD_TYPE !== 'development'
            }
         } as MinifyOptions
      } : {}),
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
         ..._rollupOptions
      },
      target: _target,
      outDir: _output_dir ?? default_output_dir,
      ssr: false,
      sourcemap: _sourcemap ?? process.env.BUILD_TYPE === 'development',
      emptyOutDir: _empty_out ?? true,
   },
   resolve: {
      dedupe: ['react', 'react-dom'],
      tsconfigPaths: true,
      extensions: [
         '.js',
         '.json',
         '.jsx',
         '.ts',
         '.tsx',
      ],
   },
   plugins: [
      svgReactComponentPlugin(),
      (_with_react ?? true) ? react() : [],
      cssInjectedByJsPlugin(),
      ...(_plugins ?? [])
   ] as PluginOption[],
   css: {
      postcss: {
         plugins: [
            autoprefixer,
            ...((_with_tailwindcss ?? true) ? [tailwindcss] : [])
         ]
      },
   }
});

export const AppConfig = ({ with_react: _with_react, assetsInclude: _assetsInclude, with_tailwindcss: _with_tailwindcss, output_dir: _output_dir, empty_out: _empty_out, plugins: _plugins, minify: _minify, alias: _alias, define: _define, target: _target, rollup_options: _rollup_options }: {
   output_dir?: string,
   empty_out?: boolean,
   plugins?: Plugin<unknown>[],
   alias?: AliasOptions,
   define?: Record<string, unknown>,
   minify?: boolean | 'terser' | 'esbuild',
   target?: string | false | string[],
   with_react?: boolean,
   rollup_options?: RollupOptions,
   with_tailwindcss?: boolean,
   assetsInclude?: string[]
}): UserConfig => ({
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest,
      ..._define
   },
   build: {
      lib: false,
      minify: _minify ?? (process.env.BUILD_TYPE === 'development' ? false : "esbuild"),
      rollupOptions: {
         output: {
            manualChunks: undefined,
         },
         ..._rollup_options
      },
      outDir: _output_dir ?? default_output_dir,
      ssr: false,
      sourcemap: process.env.BUILD_TYPE === 'development',
      emptyOutDir: _empty_out ?? true,
      target: _target,
   },
   resolve: {
      alias: _alias,
      dedupe: ['react', 'react-dom'],
      tsconfigPaths: true,
      extensions: [
         '.js',
         '.json',
         '.jsx',
         '.ts',
         '.tsx',
      ],
   },
   plugins: [
      svgReactComponentPlugin(),
      (_with_react ?? true) ? react() : [],
      cssInjectedByJsPlugin(),
      ...(_plugins ?? [])
   ] as PluginOption[],
   assetsInclude: _assetsInclude,
   css: {
      postcss: {
         plugins: [
            autoprefixer,
            ...((_with_tailwindcss ?? true) ? [tailwindcss] : [])
         ]
      },
   }
});

export const lint = async (_path: string) => {
   const cwd = process.cwd();
   process.chdir(_path)
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
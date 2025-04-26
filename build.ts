import { UserConfig, build, createServer } from "vite";
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react'
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minify = true;
const webBrowserTest = process.env.WEB_BROWSER_TEST;
const outputDir = process.env.OUTPUT_DIR;

const Config: UserConfig = {
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest
   },
   build: {
      lib: {
         name: 'alx-home@ts-utils',
         entry: [
            path.resolve(__dirname, './src/main.tsx'),
            path.resolve(__dirname, './tailwind.config.ts')
         ],
      },
      minify: minify,
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
      outDir: outputDir,
      ssr: false,
      sourcemap: process.env.BUILD_TYPE === 'development',
      emptyOutDir: true,
   },
   resolve: {
      alias: {
         "@Events": path.resolve(__dirname, "./src/Events"),
         "@fonts": path.resolve(__dirname, "./src/fonts"),
         "@images": path.resolve(__dirname, "./src/images"),
         "@polyfills": path.resolve(__dirname, "./src/polyfills"),
         "@Utils": path.resolve(__dirname, "./src/Utils"),
      },
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
      viteStaticCopy({
         targets: [
            {
               src: 'package.json',
               dest: './'
            },
            {
               src: 'src/global.css',
               dest: './'
            },
            {
               src: 'src/images/*',
               dest: './images/'
            },
            {
               src: 'src/fonts/*',
               dest: './fonts/'
            }
         ]
      })
   ],
   css: {
      postcss: {
         plugins: [
            autoprefixer,
            tailwindcss
         ]
      },
   }
};

if (process.env.BUILD_TYPE === 'production') {
   await build(Config);
} else {
   await createServer({
      ...Config,
      server: {
         port: 3999,
         host: 'localhost',
      }
   }).then((server) => server.listen(3999));
}
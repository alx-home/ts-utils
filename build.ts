import { UserConfig, build, createServer } from "vite";
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const minify = true;
const webBrowserTest = process.env.WEB_BROWSER_TEST;

const Config: UserConfig = {
   mode: process.env.BUILD_TYPE,
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest
   },
   build: {
      lib: {
         name: 'alx-home@ts-utils',
         entry: path.resolve(__dirname, './src/main.tsx'),
      },
      minify: minify,
      rollupOptions: {
         output: {
            manualChunks: undefined
         },
      },
      outDir: "../../build/ts-utils/dist",
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
      cssInjectedByJsPlugin(),
      eslint(),
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
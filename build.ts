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

import { build } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LibConfig, lint } from '@build';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webBrowserTest = process.env.WEB_BROWSER_TEST;

const Config = {
   ...LibConfig({
      name: 'alx-home@ts-utils',
      entries: [
         path.resolve(__dirname, './src/main.tsx'),
      ],
   }), 
   define: {
      __WEB_BROWSER_TEST__: webBrowserTest
   },
};

await lint(".");
await build(Config)
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

import { useEffect, useState, useRef, useCallback } from 'react';

export interface Dim { width: number, height: number };

export const useResize = (): [Dim | undefined, (_value: HTMLElement | null) => void] => {
   const [dimensions, setDimensions] = useState<Dim>();
   const ref = useRef<HTMLElement | null>(null);
   const setRef = useCallback((value: HTMLElement | null) => ref.current = value, []);

   useEffect(() => {
      const obj = ref.current;
      if (obj) {
         const observer = new ResizeObserver(() => {
            const { width, height } = obj.getBoundingClientRect();
            setDimensions({ width: Math.round(width), height: Math.round(height) });
         });

         observer.observe(obj);
         return () => observer?.unobserve(obj);
      }
   }, [ref]);

   return [dimensions, setRef];
}

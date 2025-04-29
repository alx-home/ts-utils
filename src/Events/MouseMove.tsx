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

import { useEffect, useRef, useState } from "react";

const useMouseMove = (active?: boolean) => {
   const savedPosition = useRef<{ x: number, y: number }>(undefined);
   const [position, setPosition] = useState<{ x: number, y: number }>();
   const [needsUpdate, setNeedsUpdate] = useState(0);

   useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
         savedPosition.current = { x: e.clientX, y: e.clientY };
         if (active ?? true) {
            setNeedsUpdate(count => count + 1);
         }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
   }, [active]);

   useEffect(() => {
      if (active ?? true) {
         setPosition(savedPosition.current);
      } else {
         setPosition(undefined);
      }
   }, [active, needsUpdate])

   return position;
}

export default useMouseMove;
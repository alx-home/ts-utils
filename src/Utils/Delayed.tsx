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

import { useCallback, useEffect, useRef, useState } from "react"

export const useDelayed = <T,>() => {
   const promises = useRef<{
      timeout?: NodeJS.Timeout,
      resolve: (_value: T) => void,
      reject: (_error: Error) => void,
      value: T | undefined,
      error: Error | undefined
   }[]>([])
   const [updated, setUpdated] = useState(false);

   const delay = useCallback((promise: Promise<T>, timeout?: number): Promise<T> => {
      const promise2 = new Promise<T>((resolve, reject) => {
         const result: {
            timeout?: NodeJS.Timeout,
            resolve: (_value: T) => void,
            reject: (_error: Error) => void,
            value: T | undefined,
            error: Error | undefined
         } = {
            resolve: resolve,
            reject: reject,
            timeout: undefined,
            value: undefined,
            error: undefined
         };

         result.timeout = timeout ? setTimeout(() => {
            result.error = new Error("timeout")
            setUpdated(true);
         }, timeout) : undefined;

         promise.then((value) => {
            result.value = value
            setUpdated(true);
         }).catch(error => {
            result.error = error
            setUpdated(true);
         });

         promises.current.push(result);
      });

      return promise2
   }, []);

   useEffect(() => {
      if (updated) {
         promises.current = promises.current.filter(promise => {
            if (promise.value || promise.error) {
               if (promise.timeout) {
                  clearTimeout(promise.timeout);
               }

               if (promise.value) {
                  promise.resolve(promise.value)
               } else {
                  promise.reject(promise.error!)
               }

               return true;
            }

            return false;
         });
         setUpdated(false)
      }
   }, [updated])

   return delay
}
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

import { PropsWithChildren, MouseEventHandler, useRef } from 'react';

export const Button = ({ children, onClick, className, active, disabled, title }: PropsWithChildren<{
   onClick?: MouseEventHandler<HTMLButtonElement>,
   className?: string,
   active: boolean,
   disabled?: boolean,
   title?: string
}>) => {
   const elemRef = useRef<HTMLButtonElement | null>(null);


   return <button className={"group grow bg-gray-700 p-1 shadow-md flex rounded-sm border-2 border-gray-900 overflow-hidden"
      + ((!(disabled ?? false)) ? ' hocus:bg-gray-800 hocus:drop-shadow-xl hocus:border-msfs has-[:focus]:border-msfs has-[:hover]:border-msfs cursor-pointer' : ' opacity-30')}
      title={title}
      ref={elemRef}
      onClick={e => {
         elemRef.current?.blur();
         onClick?.(e)
      }}
      disabled={(disabled ?? false) || !(active ?? true)}>
      <div className={'line-clamp-1 w-[100%] overflow-ellipsis text-xl font-semibold text-white ' + (className ?? "")} >
         {children}
      </div>
   </button>;
};
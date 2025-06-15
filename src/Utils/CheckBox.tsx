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

import { ChangeEvent, Children, PropsWithChildren, useCallback, useEffect, useRef } from "react";

import checkImage from '@images/check.svg';

export const CheckBox = ({ className, active, children, value, defaultValue, onChange, reset }: PropsWithChildren<{
   className?: string,
   active?: boolean,
   defaultValue?: boolean,
   value: boolean,
   onChange: (_checked: boolean) => void,
   reset?: boolean
}>) => {
   const elemRef = useRef<HTMLInputElement | null>(null);

   useEffect(() => {
      if (reset) {
         onChange(defaultValue ?? false);
      }
   }, [reset, defaultValue, value, onChange]);

   const onChangeC = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.checked)
   }, [onChange]);

   const blur = useCallback(() => { elemRef.current?.blur(); }, [])

   return <div className={"relative flex flex-row "
      + (className ?? "")}>
      <div className={"relative flex my-auto " + (Children.count(children) ? "mr-4 " : "")
         + ((active ?? true) ? '' : ' opacity-15 pointer-events-none')}>
         <img className={'absolute transition transition-std p-0 m-0 left-[-8px] top-[-7px] min-w-14 min-h-14 invert pointer-events-none'
            + (value ? '' : ' opacity-0')} src={checkImage} alt='checked' />
         <input type='checkbox' className={'peer absolute opacity-0 h-8 w-8 p-0 m-0 cursor-pointer'} checked={value}
            onChange={onChangeC}
            onMouseUp={blur}
            ref={elemRef}
            disabled={!(active ?? true)} />
         <div className={"flex h-8 w-8 bg-gray-700 p-1 shadow-md text-left rounded-sm border-2 border-gray-900"
            + " peer-hocus:bg-gray-800 peer-hocus:border-msfs cursor-pointer"} />
      </div>
      {children}
   </div>;
};
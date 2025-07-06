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

import { HTMLInputTypeAttribute, useState, useEffect, useRef, useMemo, RefObject, useCallback, KeyboardEvent, ChangeEvent, PropsWithChildren, Children, isValidElement } from 'react';

export const EndSlot = ({ children }: PropsWithChildren) => {
   return children
}

export const Input = ({ inputClass, className, active, placeholder, pattern, type, inputMode, validate, value, defaultValue, reset, onChange, onValidate, setIsValid, ref: parentRef, children, reload, onKeyDown, onKeyUp: onKeyUpP }: PropsWithChildren<{
   active: boolean,
   className?: string,
   inputClass?: string,
   placeholder?: string,
   pattern?: string,
   inputMode?: "email" | "search" | "tel" | "text" | "url" | "none" | "numeric" | "decimal",
   validate?: (_value: string, _blur: boolean) => Promise<boolean>,
   type?: HTMLInputTypeAttribute,
   reset?: boolean,
   reload?: boolean,
   value?: string,
   defaultValue?: string,
   onChange?: (_value: string) => void,
   setIsValid?: (_: boolean) => void,
   onValidate?: (_value: string) => void,
   ref?: RefObject<HTMLInputElement | null>,
   onKeyDown?: (_event: KeyboardEvent<HTMLInputElement>) => void
   onKeyUp?: (_event: KeyboardEvent<HTMLInputElement>) => void
}>) => {
   const [valid, setValid] = useState(true);
   const endSlots = useMemo(() => Children.toArray(children).filter(child => isValidElement(child) && child.type === EndSlot), [children]);
   const _setValid = useCallback((value: boolean) => {
      setValid(value);
      setIsValid?.(value);
   }, [setIsValid]);

   const [init, setInit] = useState(true);

   const refInt = useRef<HTMLInputElement | null>(null);
   const ref = useMemo(() => parentRef ?? refInt, [parentRef]);

   useEffect(() => {
      if (reset) {
         if (ref.current) {
            _setValid(true);
            ref.current.value = "";
         }
         onChange?.(defaultValue ?? "");
      }
   }, [reset, ref, onChange, defaultValue, _setValid]);

   useEffect(() => {
      if (reload && (value !== undefined)) {
         if (ref.current) {
            _setValid(true);
            ref.current.value = value;
         }
         onChange?.(value);
      }
   }, [reset, ref, onChange, defaultValue, reload, value, _setValid]);

   useEffect(() => {
      if (init) {
         if (value != undefined) {
            ref.current!.value = value
         }

         setInit(false);
      }
   }, [init, ref, value]);

   const onKeyUp = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
         onValidate?.(e.currentTarget.value);
      }

      onKeyUpP?.(e);
   }, [onKeyUpP, onValidate]);

   const onChangeC = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
      const valid = (await validate?.(e.target.value, false)) ?? true;
      _setValid(valid)
      if (valid) {
         onChange?.(e.target.value);
      }
   }, [onChange, _setValid, validate]);

   return <div className={"overflow-hidden grow bg-gray-700 shadow-md flex text-left text-white rounded-sm border-2 border-gray-900 " + (className ?? "")
      + (active ? ' hocus:bg-gray-800 hocus:drop-shadow-xl hocus:border-msfs has-[:focus]:border-msfs has-[:hover]:border-msfs' : ' opacity-30')
      + (valid ? '' : ' invalid')}>
      <div className='flex flex-row grow min-w-0 py-1 px-2'>
         <input ref={ref} type={type} className={'grow flex max-w-full bg-transparent ' + (inputClass ?? "") + (valid ? '' : ' invalid')}
            disabled={!active} placeholder={placeholder} inputMode={inputMode} pattern={pattern}
            onChange={onChangeC}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
         />
      </div>
      {endSlots}
   </div>;
};
import { HTMLInputTypeAttribute, useState, useEffect, useRef, useMemo, RefObject, useCallback, KeyboardEvent, ChangeEvent, PropsWithChildren, Children, isValidElement } from 'react';


export const EndSlot = ({ children }: PropsWithChildren) => {
   return children
}

export const Input = ({ inputClass, className, active, placeholder, pattern, type, inputMode, validate, value, defaultValue, reset, onChange, onValidate, setIsValid, ref: parentRef, children, reload }: PropsWithChildren<{
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
   ref?: RefObject<HTMLInputElement | null>
}>) => {
   const [valid, setValid] = useState(true);
   const endSlots = useMemo(() => Children.toArray(children).filter(child => isValidElement(child) && child.type === EndSlot), [children]);
   const _setValid = useCallback((value: boolean) => {
      setValid(value);
      setIsValid?.(value);
   }, [setIsValid]);

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
      if (value != undefined) {
         ref.current!.value = value
      }
   }, [ref, value]);

   const onKeyUp = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === "Enter") {
         onValidate?.(e.currentTarget.value);
      }
   }, [onValidate]);

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
         <input ref={ref} type={type} className={'grow flex max-w-full bg-transparent ' + (inputClass ?? "") + (valid ? '' : ' invalid')} disabled={!active} placeholder={placeholder} inputMode={inputMode} pattern={pattern}
            onChange={onChangeC}
            onKeyUp={onKeyUp}
         />
      </div>
      {endSlots}
   </div>;
};
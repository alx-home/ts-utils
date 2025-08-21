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

import { PropsWithChildren, useRef, useMemo, Children, isValidElement, useState, ReactElement, useCallback, KeyboardEvent, ReactNode, RefObject, useEffect, FocusEvent } from 'react';

import Arrow from '@images/arrow.svg?react';

type OptionProps<Id> = PropsWithChildren<{
   id: Id
}>;
export const Option = <Id,>({ children }: OptionProps<Id>) => {
   return children
}

export function Select<Id>({ children, close, className, active, disabled, value, onChange }: PropsWithChildren<{
   className?: string,
   active: boolean,
   disabled?: boolean,
   close?: boolean,
   value: Id,
   onChange: (_value: Id) => void
}>) {
   const [open, setOpen] = useState(false);
   const elemRef = useRef<HTMLButtonElement | null>(null);
   const parentRef = useRef<HTMLDivElement | null>(null);
   const [focusTime, setFocusTime] = useState<Date>(new Date());
   const style = useMemo(() => "bg-gray-700 shadow-md rounded-sm border-gray-900"
      + ((disabled ?? false) ? ' opacity-30' : ' group-hocus:bg-gray-800 group-hocus:drop-shadow-xl group-hocus:border-msfs group-has-[:focus]:border-msfs group-has-[:hover]:border-msfs cursor-pointer'), [disabled]);

   const childs = useMemo(() =>
      Children.toArray(children)
         .filter(child => isValidElement(child))
         .filter(child => child.type == Option<Id>) as ReactElement<OptionProps<Id>>[], [children]);

   const optionsRef = useMemo((): RefObject<HTMLButtonElement | null>[] =>
      childs.map(() => ({
         current: null
      }))
      , [childs]);

   const onBlur = useCallback((e: FocusEvent<HTMLButtonElement>) => {
      const delta = (new Date()).getTime() - focusTime.getTime();

      if (e.relatedTarget !== elemRef.current
         && !optionsRef.find(elem => elem.current === e.relatedTarget)
      ) {
         if (delta > 100) {
            setOpen(false)
         }
      }
   }, [focusTime, optionsRef]);

   const onFocus = useCallback(() => {
      setFocusTime(new Date());
   }, []);

   const preventDefault = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.code == 'ArrowLeft' || e.code == 'ArrowRight' || e.code == 'ArrowDown' || e.code == 'ArrowUp') {
         e.stopPropagation()
         e.preventDefault()
      }
   }, []);

   const onKey = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
      preventDefault(e);

      if (e.code == 'ArrowLeft') {
         elemRef.current?.focus()
         setOpen(false);
      } else if (e.code == 'ArrowRight') {
         setOpen(true);
      } else if (e.code == 'ArrowDown') {
         setOpen(true);
         const index = optionsRef.findIndex(elem => document.activeElement === elem.current)
         if (index !== -1) {
            optionsRef[(index + 1) % optionsRef.length].current?.focus();
         } else if (open) {
            optionsRef[0].current?.focus();
         }
      } else if (e.code == 'ArrowUp') {
         setOpen(true);
         let index = optionsRef.findIndex(elem => document.activeElement === elem.current)
         if (index !== -1) {
            if (index == 0) {
               index = optionsRef.length - 1;
            } else {
               --index;
            }
            optionsRef[index].current?.focus();
         } else if (open) {
            optionsRef[optionsRef.length - 1].current?.focus();
         }
      }
   }, [open, optionsRef, preventDefault]);

   useEffect(() => {
      if (close) {
         setOpen(false)
      }
   }, [close])

   const options = useCallback((optionsRef?: RefObject<HTMLButtonElement | null>[]) =>
      <div className={'options flex flex-col p-1 border-x-2 border-b-2 ' + style + ' rounded-t-none focus:[&:hover>*:not(:hover)]:border-transparent '}>{
         childs.map((child, index) =>
            <button key={child.props.id as string}
               ref={optionsRef?.[index]}
               className='option py-1 px-2 border-2 border-transparent text-ellipsis overflow-x-hidden line-clamp-1 hocus:border-msfs'
               onClick={() => {
                  elemRef.current?.focus()
                  onChange(child.props.id)
                  setOpen(false)
               }}
               onMouseUp={() => {
                  elemRef.current?.blur()
               }}
               onMouseDown={onFocus}
               onFocus={onFocus}
               onBlur={onBlur}
               onKeyDown={preventDefault}
               onKeyUp={onKey}
            >
               {child.props.children}
            </button>)
      }</div>, [style, childs, onFocus, onBlur, preventDefault, onKey, onChange]);

   const labels = useMemo(() => childs.reduce((result, child) => {
      result.set(child.props.id, child.props.children);
      return result;
   }, new Map<Id, ReactNode>()), [childs]);

   const toggle = useCallback(() => {
      setOpen(open => !open)
   }, []);

   useEffect(() => {
      if (open) {
         optionsRef.find(elem => elem.current!.textContent === labels.get(value))?.current!.focus()
      }
   }, [labels, open, optionsRef, value]);

   return <div ref={parentRef} className={"flex flex-col group grow max-w-full [&_*]:overflow-y-visible " + (className ?? "")}>
      <div className='relative flex flex-col grow max-w-full'>
         <button className={'option py-1 min-h-fit flex flex-row grow border-2 max-w-full ' + style + ' rounded-r-none' + (open ? ' rounded-b-none' : '')}
            ref={elemRef}
            onClick={toggle}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyUp={onKey}
            onKeyDown={preventDefault}
            disabled={(disabled ?? false) || !(active ?? true)}>
            <div
               className={'grow max-w-full overflow-x-hidden'}>
               <div className={style + ' w-full max-w-full text-sm text-white text-center justify-center'} >
                  <div className='w-full text-ellipsis overflow-x-hidden line-clamp-1'>{labels.get(value)}</div>
               </div>
            </div>
            <div className={'flex flex-col min-w-0 shrink-0 w-5 h-4 rounded-l-none m-auto ' + style + " shadow-none" + (open ? ' rounded-b-none' : '')}>
               <Arrow width={'100%'} height={'100%'} className={'transition-all m-auto' + (open ? ' -rotate-90' : '')} />
            </div>
         </button>
         <div className='flex w-full h-0'>
            <div className='absolute w-full'>
               <div inert={!open} className={'relative z-50 overflow-x-hidden w-full duration-300 transition-opacity'
                  + (open ? ' h-full' : ' max-h-0 opacity-0 pointer-events-none')}>
                  {options(optionsRef)}
               </div>
            </div>
         </div>
         {/* Keeps min width to fit options */}
         <div className={'block h-0 max-h-0 opacity-0 overflow-x-hidden'} inert={true}>
            {options()}
         </div>
      </div>
   </div>;
};

export default Select;
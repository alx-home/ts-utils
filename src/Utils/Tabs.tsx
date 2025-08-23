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

import { memo, PropsWithChildren } from "react";
import { Button } from "./Button";

const TabsComp = <Tab extends string,>({ children, tabs, disabled, switchTab, activeTab, names, className }: PropsWithChildren<{
   activeTab: string,
   tabs: Tab[],
   names?: Record<Tab, string>,
   switchTab: (_tab: Tab) => void,
   disabled?: boolean,
   className?: string
}>) => {
   return <div className='flex flex-col [&>:not(:first-child)]:ml-2 shadow-sm'>
      <div className='flex flex-row justify-start h-[29px] min-h-[29px]'>
         <div className='flex flex-row shrink!important [&>:not(:first-child)]:ml-1'>
            {tabs.map(tab =>
               <Button active={!disabled} key={tab} disabled={(activeTab === tab) || disabled} className='px-2'
                  onClick={() => switchTab(tab)}>
                  {names !== undefined ? names[tab] : tab}
               </Button>)}
         </div>
      </div>
      <div className={'flex flex-col p-4 ' + (className ?? "")}>
         {children}
      </div>
   </div>
}

export const Tabs = memo(TabsComp) as typeof TabsComp
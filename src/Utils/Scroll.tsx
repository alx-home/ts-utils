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

import { useMouseRelease, useMouseMove, useResize } from '@Events';
import { PropsWithChildren, useEffect, useState, CSSProperties, useCallback, MouseEvent, forwardRef, useRef, useImperativeHandle, ForwardedRef } from 'react';

type ScrollProps = PropsWithChildren<{
   className?: string,
   style?: CSSProperties,
   hidden?: boolean,
   onWheel?: (_ev: WheelEvent) => void
}>;

type ScrollRef = HTMLDivElement | null;

const MIN_HANDLE_SIZE_REM = 1.5;

const wheelScale = (event: WheelEvent, elem: HTMLDivElement) => {
   if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      const lineHeight = Number.parseFloat(getComputedStyle(elem).lineHeight) || 16;
      return { x: lineHeight, y: lineHeight };
   }
   if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return { x: elem.clientWidth, y: elem.clientHeight };
   }
   return { x: 1, y: 1 };
};

const ScrollImpl = ({ children, className, style, hidden, onWheel }: ScrollProps, inputRef: ForwardedRef<ScrollRef>) => {
   const [scroll, setScroll] = useState({ x: 0, y: 0, ratioX: 0, ratioY: 0, width: 0, height: 0, displayX: false, displayY: false });
   const [scrolling, setScrolling] = useState<{ vertical: boolean } | undefined>(undefined);
   const [selectable, setSelectable] = useState(true);
   const mousePosition = useMouseMove(scrolling !== undefined);
   const [offset, setOffset] = useState(0);
   const mouseUp = useMouseRelease(scrolling !== undefined);
   const ref = useRef<ScrollRef>(null);
   const verticalTrackRef = useRef<HTMLDivElement>(null);
   const horizontalTrackRef = useRef<HTMLDivElement>(null);
   const [dimensions, setResizeRef] = useResize();

   useImperativeHandle<ScrollRef, ScrollRef>(inputRef, () => ref.current);

   useEffect(() => {
      if (mouseUp !== undefined) {
         setScrolling(undefined);
         setSelectable(true);
         setOffset(0);
      }
   }, [mouseUp, scrolling]);

   useEffect(() => {
      if (mousePosition && scrolling && ref.current) {
         const boundings = ref.current.parentElement!.getBoundingClientRect();

         if (scrolling.vertical) {
            ref.current?.scroll({ top: (mousePosition.y + offset - (boundings?.top ?? 0) - scroll.height / 2) * scroll.ratioY });
         } else {
            ref.current?.scroll({ left: (mousePosition.x + offset - (boundings?.left ?? 0) - scroll.width / 2) * scroll.ratioX });
         }
      }
   }, [mousePosition, scroll.height, scroll.ratioX, scroll.ratioY, scroll.width, scrolling, offset]);

   const updateScroll = useCallback((target: HTMLDivElement) => {
      const ratio = [target.scrollWidth ? target.clientWidth / target.scrollWidth : 1, target.scrollHeight ? target.clientHeight / target.scrollHeight : 1];
      const client = [target.clientWidth, target.clientHeight];
      const minHandleSize = MIN_HANDLE_SIZE_REM * Number.parseFloat(getComputedStyle(target.ownerDocument.documentElement).fontSize);
      const scrollSize = client.map((size, axis) => Math.min(size, Math.max(minHandleSize, size * ratio[axis])));

      const moveSize = [client[0] - scrollSize[0], client[1] - scrollSize[1]];
      const outer = [target.scrollWidth - client[0], target.scrollHeight - client[1]];
      const posRatio = [outer[0] ? target.scrollLeft / outer[0] : 0, outer[1] ? target.scrollTop / outer[1] : 0];

      setScroll({ x: moveSize[0] * posRatio[0], y: moveSize[1] * posRatio[1], ratioX: moveSize[0] > 0 ? outer[0] / moveSize[0] : 0, ratioY: moveSize[1] > 0 ? outer[1] / moveSize[1] : 0, width: scrollSize[0], height: scrollSize[1], displayX: outer[0] !== 0, displayY: outer[1] !== 0 })
   }, []);

   const onClick = useCallback((_e: MouseEvent<HTMLDivElement>, vertical: boolean) => {
      setSelectable(false);
      setScrolling({ vertical });
   }, []);

   const onScrollClick = useCallback((e: MouseEvent<HTMLDivElement>, vertical: boolean) => {
      const boundings = ref.current?.parentElement!.getBoundingClientRect();

      if (vertical) {
         setOffset((scroll.height / 2 + scroll.y) - (e.clientY - (boundings?.top ?? 0)));
      } else {
         setOffset((scroll.width / 2 + scroll.x) - (e.clientX - (boundings?.left ?? 0)));
      }
   }, [scroll.height, scroll.width, scroll.x, scroll.y]);

   useEffect(() => {
      if (ref.current) {
         updateScroll(ref.current);
      }
   }, [updateScroll, dimensions, children, hidden]);

   useEffect(() => {
      const elem = ref.current;
      const verticalTrack = verticalTrackRef.current;
      const horizontalTrack = horizontalTrackRef.current;

      if (elem === null) {
         return;
      }

      const contentWheel = (event: WheelEvent) => onWheel?.call(elem, event);
      const trackWheel = (event: WheelEvent, vertical: boolean) => {
         contentWheel(event);
         if (event.defaultPrevented || event.ctrlKey) {
            return;
         }

         const scale = wheelScale(event, elem);
         const horizontal = !vertical || (event.shiftKey && event.deltaX === 0);
         const left = (horizontal ? (event.deltaX || event.deltaY) : event.deltaX) * scale.x;
         const top = horizontal ? 0 : event.deltaY * scale.y;
         const previousLeft = elem.scrollLeft;
         const previousTop = elem.scrollTop;
         elem.scrollBy({ left, top, behavior: 'instant' });
         if (elem.scrollLeft !== previousLeft || elem.scrollTop !== previousTop) {
            event.preventDefault();
         }
      };
      const verticalWheel = (event: WheelEvent) => trackWheel(event, true);
      const horizontalWheel = (event: WheelEvent) => trackWheel(event, false);

      elem.addEventListener('wheel', contentWheel, { passive: false });
      verticalTrack?.addEventListener('wheel', verticalWheel, { passive: false });
      horizontalTrack?.addEventListener('wheel', horizontalWheel, { passive: false });
      return () => {
         elem.removeEventListener('wheel', contentWheel);
         verticalTrack?.removeEventListener('wheel', verticalWheel);
         horizontalTrack?.removeEventListener('wheel', horizontalWheel);
      };
   }, [onWheel]);

   return <div className='group/container flex w-full relative min-h-0 max-h-full overflow-hidden'>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className={`group/scroll absolute transition duration-1000 hover:duration-200 cursor-pointer z-10`
         + ` flex flex-row right-0 top-0 bottom-0 bg-gray-800 bg-opacity-50 opacity-0 hover:opacity-100`
         + ` group-hover/container:opacity-100 [&:hover>*]:w-6${scroll.displayY ? '' : ' hidden'}`
      }
         ref={verticalTrackRef}
         onMouseDown={e => onClick(e, true)}
      >
         {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
         <div className={'grow bg-gray-700 group-hover/scroll:bg-msfs select-none transition [transition-property:width] hocus:w-6'
            + (scrolling?.vertical ? ' bg-msfs w-6' : ' w-2')}
            style={{ marginTop: scroll.y, height: scroll.height }}
            onMouseDown={e => onScrollClick(e, true)}
         />
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div className={`group/scroll absolute transition duration-1000 hover:duration-200 cursor-pointer z-10`
         + ` flex flex-col left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 opacity-0 hover:opacity-100`
         + ` group-hover/container:opacity-100 [&:hover>*]:h-6${scroll.displayX ? '' : ' hidden'}`
      }
         ref={horizontalTrackRef}
         onMouseDown={e => onClick(e, false)}
      >
         {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
         <div className={'grow bg-gray-700 group-hover/scroll:bg-msfs select-none transition [transition-property:height] hocus:h-6'
            + (scrolling?.vertical === false ? ' bg-msfs h-6' : ' h-2')}
            style={{ marginLeft: scroll.x, width: scroll.width }}
            onMouseDown={e => onScrollClick(e, false)}
         />
      </div>
      <div className={`peer relative z-0 flex w-full box-content overflow-scroll [scrollbar-width:none] ${className ?? ''
         }${selectable ? '' : ' select-none'
         }${(hidden ?? false) ? ' hidden' : ''}`}
         style={style}
         ref={e => { ref.current = e; setResizeRef(e); }}
         onScroll={e => updateScroll(e.currentTarget)}
      >
         {children}
      </div>
   </div >;
};

export const Scroll = forwardRef<ScrollRef, ScrollProps>(ScrollImpl);
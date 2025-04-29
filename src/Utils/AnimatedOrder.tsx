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

import { Children, isValidElement, MutableRefObject, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

export const AnimatedOrder = ({ children, orders, itemsRef, vertical }: PropsWithChildren<{
   orders: number[],
   itemsRef: MutableRefObject<(HTMLDivElement | null)[]>,
   vertical: boolean
}>) => {
   const [currentOrders, setCurrentOrders] = useState<number[]>();
   const [transforms, setTransforms] = useState<string[]>();
   const childs = useMemo(() => Children.toArray(children).filter(child => isValidElement<{ style: object }>(child)), [children]);

   const getIndex = useCallback((order: number, orders_: number[] = orders) => orders_.findIndex(value => value === order), [orders]);

   useEffect(() => {
      setTimeout(() => {
         setTransforms(undefined);
      }, 10);
   }, [transforms]);

   useEffect(() => {
      if (orders.findIndex((order, index) => order !== currentOrders?.[index]) !== -1) {
         setCurrentOrders((_oldOrders) => {
            const oldOrders = _oldOrders ?? orders;

            const getOffsets = () => {
               const sizes = itemsRef.current.map((value) => (vertical ? value?.offsetHeight : value?.offsetWidth) ?? 0);

               let newOffset = 0;
               let oldOffset = 0;

               const newOffsets: number[] = [];
               const oldOffsets: number[] = [];

               console.assert(itemsRef.current.length === orders.length);

               for (let order = 0; order < itemsRef.current.length; ++order) {
                  const oldIndex = getIndex(order, oldOrders);
                  const newIndex = getIndex(order, orders);

                  newOffsets[newIndex] = newOffset;
                  oldOffsets[oldIndex] = oldOffset;

                  newOffset += sizes[newIndex];
                  oldOffset += sizes[oldIndex];
               }

               return { new: newOffsets, old: oldOffsets };
            };

            const offsets = getOffsets();

            const newTransforms: string[] = [];


            for (let index = 0; index < itemsRef.current.length; ++index) {
               const element = itemsRef.current[index];
               if (element) {
                  const oldOffset = offsets.old[index];
                  const newOffset = offsets.new[index];
                  newTransforms[index] = `translate3d(${vertical ? 0 : oldOffset - newOffset}px,${vertical ? oldOffset - newOffset : 0}px,0px)`;
               }
            }

            setTransforms(newTransforms);
            return orders;
         })
      }
   }, [orders, currentOrders, getIndex, itemsRef, vertical]);

   return <>{childs.map((child, index) => {
      const order = (currentOrders ?? [...orders.keys()])[index] + 1;

      const style = {
         ...child.props.style,
         ...(transforms?.[index] ?
            { transform: transforms[index] } :
            { transform: "translate3d(0px,0px,0px)", transition: "transform 200ms" })
      };

      return {
         ...child, props: {
            ...child.props,
            style: { ...style },
            order: order
         }
      };
   })?.sort((left, right) => left.props.order - right.props.order)}</>
};
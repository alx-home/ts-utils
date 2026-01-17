import { useRef, useCallback } from "react";
import { useEvent } from "react-use-event-hook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBatch = <T extends (..._args: any[]) => unknown>(
   callback: T,
   timeout?: number
) => {
   const timeoutsRef = useRef<NodeJS.Timeout | undefined>(undefined);
   const counter = useRef(0);
   const event = useEvent(callback)

   return useCallback((...args: Parameters<T>) => {
      const currentCounter = ++counter.current;
      if (timeoutsRef.current) {
         clearTimeout(timeoutsRef.current);
      }
      timeoutsRef.current = setTimeout(() => {
         if (currentCounter === counter.current) {
            timeoutsRef.current = undefined;
            event(...args);
         }
      }, timeout ?? 200);
   }, [event, timeout]);
};
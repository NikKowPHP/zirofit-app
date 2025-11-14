import { useState, useEffect } from 'react';

export function useObservable<T>(observable: any, deps: any[] = []): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    if (!observable) {
      setData(null);
      return;
    }

    const subscription = observable.subscribe((newData: T) => {
      setData(newData);
    });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, deps);

  return data;
}

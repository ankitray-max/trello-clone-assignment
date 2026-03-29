import { useRef, useEffect } from 'react';

export const useFocus = () => {
  // Use the useRef hook to get access to the rendered input element.
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}
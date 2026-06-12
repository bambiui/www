import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { kbd } from "../components/kbd";
import "../styles/kbd.css";

export interface KbdProps extends Omit<ComponentPropsWithoutRef<"kbd">, "size"> {
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  function Kbd(
    {
      size = "sm",
      children,
      ...props
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLElement | null>(null);
    const instanceRef = useRef<ReturnType<typeof kbd.mount> | null>(null);

    useImperativeHandle(
      forwardedRef,
      () => localRef.current as HTMLElement,
      [],
    );

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const instance = kbd.mount(element, {
        size,
      });
      instanceRef.current = instance;

      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    }, []);

    useEffect(() => {
      instanceRef.current?.update({
        size,
      });
    }, [size]);

    return (
      <kbd
        {...props}
        ref={localRef as never}
        data-bambi-kbd=""
        data-size={size}
      >
        {children}
      </kbd>
    );
  },
);

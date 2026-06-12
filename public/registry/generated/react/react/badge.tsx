import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { badge } from "../components/badge";
import "../styles/badge.css";

export interface BadgeProps extends Omit<ComponentPropsWithoutRef<"span">, "variant" | "size"> {
  variant?: "default" | "secondary" | "outline" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export const Badge = forwardRef<HTMLElement, BadgeProps>(
  function Badge(
    {
      variant = "default",
      size = "sm",
      children,
      ...props
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLElement | null>(null);
    const instanceRef = useRef<ReturnType<typeof badge.mount> | null>(null);

    useImperativeHandle(
      forwardedRef,
      () => localRef.current as HTMLElement,
      [],
    );

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const instance = badge.mount(element, {
        variant,
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
        variant,
        size,
      });
    }, [variant, size]);

    return (
      <span
        {...props}
        ref={localRef as never}
        data-bambi-badge=""
        data-variant={variant}
        data-size={size}
      >
        {children}
      </span>
    );
  },
);

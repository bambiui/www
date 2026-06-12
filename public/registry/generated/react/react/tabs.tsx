import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { tabs } from "../components/tabs";
import "../styles/tabs.css";

export interface TabsProps extends Omit<ComponentPropsWithoutRef<"div">, "value" | "defaultValue" | "orientation" | "activationMode"> {
  value?: string;
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  children?: ReactNode;
}

export const Tabs = forwardRef<HTMLElement, TabsProps>(
  function Tabs(
    {
      value,
      defaultValue,
      orientation = "horizontal",
      activationMode = "automatic",
      children,
      ...props
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLElement | null>(null);
    const instanceRef = useRef<ReturnType<typeof tabs.mount> | null>(null);

    useImperativeHandle(
      forwardedRef,
      () => localRef.current as HTMLElement,
      [],
    );

    useEffect(() => {
      const element = localRef.current;
      if (!element) return;

      const instance = tabs.mount(element, {
        value,
        defaultValue,
        orientation,
        activationMode,
      });
      instanceRef.current = instance;

      return () => {
        instance.destroy();
        instanceRef.current = null;
      };
    }, []);

    useEffect(() => {
      instanceRef.current?.update({
        value,
        defaultValue,
        orientation,
        activationMode,
      });
    }, [value, defaultValue, orientation, activationMode]);

    return (
      <div
        {...props}
        ref={localRef as never}
        data-bambi-tabs=""
        data-value={value}
        data-default-value={defaultValue}
        data-orientation={orientation}
        data-activation-mode={activationMode}
      >
        {children}
      </div>
    );
  },
);

export interface TabsListProps extends Omit<ComponentPropsWithoutRef<"div">, "value"> {
  value?: string;
}

export const TabsList = forwardRef<HTMLElement, TabsListProps>(
  function TabsList({
      value,
      ...props
    }, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef as never}
        data-bambi-tabs-list=""
        role="tablist"
        data-value={value}
      />
    );
  },
);


export interface TabsTriggerProps extends Omit<ComponentPropsWithoutRef<"button">, "value"> {
  value?: string;
}

export const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(
  function TabsTrigger({
      value,
      ...props
    }, forwardedRef) {
    return (
      <button
        {...props}
        ref={forwardedRef as never}
        data-bambi-tabs-trigger=""
        role="tab"
        data-value={value}
      />
    );
  },
);


export interface TabsContentProps extends Omit<ComponentPropsWithoutRef<"div">, "value"> {
  value?: string;
}

export const TabsContent = forwardRef<HTMLElement, TabsContentProps>(
  function TabsContent({
      value,
      ...props
    }, forwardedRef) {
    return (
      <div
        {...props}
        ref={forwardedRef as never}
        data-bambi-tabs-content=""
        role="tabpanel"
        data-value={value}
      />
    );
  },
);

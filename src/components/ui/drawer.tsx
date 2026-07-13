"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface DrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("Drawer components must be used within a Drawer");
  }
  return context;
}

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

function Drawer({ open: controlledOpen, onOpenChange, children }: DrawerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const titleId = useId();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <DrawerContext.Provider value={{ open, setOpen, titleId }}>
      {children}
    </DrawerContext.Provider>
  );
}

interface DrawerTriggerProps {
  children: ReactNode;
}

function DrawerTrigger({ children }: DrawerTriggerProps) {
  const { setOpen } = useDrawerContext();

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
      }}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  side?: "left" | "right";
  showClose?: boolean;
}

function DrawerContent({
  children,
  className,
  side = "right",
  showClose = true,
  ...props
}: DrawerContentProps) {
  const { open, setOpen, titleId } = useDrawerContext();
  const containerRef = useFocusTrap<HTMLDivElement>(open);
  const portalTarget = useSyncExternalStore(
    () => () => {},
    () => document.body,
    () => null,
  );
  const reducedMotion = useReducedMotion();

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!open || !portalTarget) return null;

  const slideClass =
    side === "right" ? "translate-x-0" : "translate-x-0";

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          "absolute inset-0 bg-market-ink/40 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none",
          "opacity-100",
          reducedMotion && "transition-none",
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-md flex-col border-border-sand bg-fresh-white shadow-elevated transition-transform duration-300 ease-out motion-reduce:transition-none",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          slideClass,
          className,
        )}
        {...props}
      >
        {showClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3 z-10"
            onClick={() => setOpen(false)}
            aria-label="Close drawer"
          >
            <X />
          </Button>
        )}
        {children}
      </div>
    </div>,
    portalTarget,
  );
}

function DrawerHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-border-sand px-5 py-4 pr-12", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDrawerContext();
  return (
    <h2
      id={titleId}
      className={cn(
        "font-heading text-lg font-semibold text-market-ink",
        className,
      )}
      {...props}
    />
  );
}

function DrawerBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-t border-border-sand px-5 py-4",
        className,
      )}
      {...props}
    />
  );
}

function DrawerClose({ children }: { children: ReactNode }) {
  const { setOpen } = useDrawerContext();
  return (
    <span onClick={() => setOpen(false)} className="inline-flex">
      {children}
    </span>
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
};

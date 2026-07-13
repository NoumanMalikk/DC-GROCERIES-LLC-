"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

interface CheckoutStepTransitionProps {
  stepKey: string;
  children: ReactNode;
}

export function CheckoutStepTransition({
  stepKey,
  children,
}: CheckoutStepTransitionProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div key={stepKey}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

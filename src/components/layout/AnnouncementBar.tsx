"use client";

import { useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { storeConfig } from "../../../data/store-config";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ROTATION_INTERVAL_MS = 5000;

export function AnnouncementBar() {
  const messages = [...storeConfig.announcementMessages];
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const paused = reducedMotion || userPaused;

  useEffect(() => {
    if (paused || messages.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [paused, messages.length]);

  const togglePause = useCallback(() => {
    setUserPaused((prev) => !prev);
  }, []);

  if (!messages || messages.length === 0) return null;

  return (
    <div
      className="relative border-b border-border-sand bg-market-ink text-fresh-white"
      aria-live={paused ? "polite" : "off"}
      aria-atomic="true"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="flex-1 text-center text-xs font-medium sm:text-sm">
          <span className="sr-only">Announcement: </span>
          {messages[index]}
        </p>
        {messages.length > 1 && !reducedMotion && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={togglePause}
            className={cn(
              "shrink-0 text-fresh-white/80 hover:bg-fresh-white/10 hover:text-fresh-white",
            )}
            aria-label={paused ? "Resume announcements" : "Pause announcements"}
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </Button>
        )}
      </div>
    </div>
  );
}

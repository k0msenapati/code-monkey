"use client"

import { useEffect } from "react"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowRightFromLineIcon } from "lucide-react"

const SIDEBAR_KEYBOARD_SHORTCUT = "/"
const REQUIRES_ALT_KEY = true

export function SidebarKeyboardShortcut() {
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        !event.ctrlKey &&
        !event.metaKey &&
        event.altKey === REQUIRES_ALT_KEY
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSidebar]);

  return null;
}

export function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="fixed left-0 top-5 z-50 md:hidden p-2 h-8 w-5 rounded-l-none rounded-r-lg bg-primary text-background"
      aria-label="Toggle sidebar"
    >
      <ArrowRightFromLineIcon className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar (Alt+/)</span>
    </Button>
  )
}
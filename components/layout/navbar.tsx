"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggle}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
        {title && (
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight">{title}</h1>
        )}
      </div>
    </header>
  );
}


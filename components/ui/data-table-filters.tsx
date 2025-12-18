"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type DataTableFiltersProps = {
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
};

export function DataTableFilters({
  searchPlaceholder = "Buscar...",
  children,
  className,
}: DataTableFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchValue = searchParams.get("search") || "";

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page when searching
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    // Preserve only non-filter params if needed
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilters = searchParams.toString().length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Búsqueda de texto */}
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filtros adicionales */}
        {children && (
          <div className="flex flex-wrap gap-2 items-center">
            {children}
          </div>
        )}

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  );
}


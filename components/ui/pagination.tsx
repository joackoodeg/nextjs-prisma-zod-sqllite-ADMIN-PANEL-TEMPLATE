"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  className?: string;
};

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const updatePageSize = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newPageSize);
    params.set("page", "1"); // Reset to first page when changing page size
    router.push(`?${params.toString()}`);
  };

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {/* Info de rango */}
      <div className="text-sm text-muted-foreground">
        Mostrando {start}-{end} de {total}
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Selector de tamaño de página */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Por página:
          </span>
          <Select value={pageSize.toString()} onValueChange={updatePageSize}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botones de navegación */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updatePage(1)}
            disabled={page === 1}
            aria-label="Primera página"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updatePage(page - 1)}
            disabled={page === 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Números de página */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => updatePage(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => updatePage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updatePage(totalPages)}
            disabled={page === totalPages || totalPages === 0}
            aria-label="Última página"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}


import Link from "next/link";
import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export function Logo({ className = "", dark = false}: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Shield className="w-5 h-5" />
      </div>
      <span className="text-lg font-semibold text-sidebar-foreground">admin</span>
    </Link>
  );
}


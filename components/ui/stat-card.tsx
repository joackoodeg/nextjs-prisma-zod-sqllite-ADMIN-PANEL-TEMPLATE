import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon: LucideIcon;
  description?: ReactNode;
  valueColor?: string;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  valueColor,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="p-3">
      <CardHeader className="flex flex-row items-center justify-between px-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-3.5 w-3.5 ${iconColor || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className={`text-xl font-bold ${valueColor || ""}`}>
          {value}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground">
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


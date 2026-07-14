import type { LucideIcon } from "lucide-react";
import { theme } from "@/core/theme";

export function NavBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-0.5 px-2 py-1">
      <Icon size={20} color={active ? theme.primary : theme.muted} />
      <span className="text-[10px]" style={{ color: active ? theme.primary : theme.muted }}>
        {label}
      </span>
    </button>
  );
}

import { Popover as PopoverPrimitive } from "radix-ui";
import { Check } from "lucide-react";

type StatusOption = string | { label: string; value: string };

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    Inactive: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
    Draft: { bg: "#fef3c7", text: "#92400e", dot: "#f59b0b" },
    Archived: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
    Pending: { bg: "#e0f2fe", text: "#075985", dot: "#0ea5e9" },
};

export function EditableStatusBadge({
    status,
    onChange,
    options = ["Active", "Inactive"],
}: {
    status: string;
    onChange?: (val: string) => void;
    options?: StatusOption[];
}) {
    // Normalize all options to { label, value }
    const normalized = options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
    );

    // Find the matching option for current status (match by value first, then label)
    const current =
        normalized.find((o) => o.value === status) ||
        normalized.find((o) => o.label === status) ||
        normalized[0];

    const displayLabel = current?.label ?? status;
    const s = STATUS_STYLES[displayLabel] ?? STATUS_STYLES["Inactive"];

    // Static badge (no onChange)
    if (!onChange) {
        return (
            <div
                style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 10px 5px 8px", borderRadius: 20,
                    background: s.bg, border: `1.5px solid ${s.dot}33`,
                    fontSize: 12.5, fontWeight: 600, color: s.text,
                    userSelect: "none",
                }}
            >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span>{displayLabel}</span>
            </div>
        );
    }

    // Interactive badge using Radix Popover (same foundation as Dropdown)
    return (
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 10px 5px 8px", borderRadius: 20,
                        background: s.bg, border: `1.5px solid ${s.dot}33`,
                        fontSize: 12.5, fontWeight: 600, color: s.text,
                        cursor: "pointer", outline: "none",
                        userSelect: "none",
                    }}
                >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                    <span>{displayLabel}</span>
                    <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▾</span>
                </button>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Content
                align="start"
                sideOffset={6}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                    minWidth: 150, zIndex: 99999,
                }}
            >
                {normalized.map((opt) => {
                    const style = STATUS_STYLES[opt.label] ?? STATUS_STYLES["Inactive"];
                    const isSelected = opt.value === status || opt.label === status;

                    return (
                        <PopoverPrimitive.Close key={opt.value} asChild>
                            <div
                                onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "9px 14px", cursor: "pointer", fontSize: 13,
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? style.text : "#374151",
                                    background: isSelected ? style.bg : "transparent",
                                    transition: "background 0.12s",
                                }}
                                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                            >
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />
                                {opt.label}
                                {isSelected && (
                                    <Check size={12} style={{ marginLeft: "auto", color: style.dot }} />
                                )}
                            </div>
                        </PopoverPrimitive.Close>
                    );
                })}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Root>
    );
}

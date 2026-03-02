import { Popover as PopoverPrimitive } from "radix-ui";
import { Star, Check } from "lucide-react";

const FEATURE_STYLES = {
    true: { bg: "#fff7ed", text: "#d97706", star: "#f59e0b", border: "#fde68a" }, // Amber-ish
    false: { bg: "#f8fafc", text: "#64748b", star: "#cbd5e1", border: "#e2e8f0" }, // Slate-ish
};

export function EditableFeatureBadge({
    isFeatured,
    onChange,
}: {
    isFeatured: boolean;
    onChange?: (val: boolean) => void;
}) {
    const s = isFeatured ? FEATURE_STYLES.true : FEATURE_STYLES.false;
    const displayLabel = isFeatured ? 'Yes' : 'No';

    const BadgeTrigger = (
        <div
            style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 12px 5px 10px", borderRadius: 20,
                background: s.bg, border: `1.5px solid ${s.border}`,
                fontSize: 12.5, fontWeight: 700, color: s.text,
                userSelect: "none",
                cursor: onChange ? "pointer" : "default",
                transition: "all 0.12s ease",
            }}
        >
            <Star
                size={14}
                fill={isFeatured ? s.star : "none"}
                color={s.star}
                strokeWidth={isFeatured ? 0 : 2.5}
            />
            <span>{displayLabel}</span>
            {onChange && <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▾</span>}
        </div>
    );

    if (!onChange) {
        return BadgeTrigger;
    }

    const options = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ];

    return (
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: 'none', border: 'none', padding: 0, outline: 'none' }}
                >
                    {BadgeTrigger}
                </button>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align="start"
                    sideOffset={6}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                        minWidth: 130, zIndex: 99999,
                    }}
                >
                    {options.map((opt) => {
                        const isSelected = opt.value === isFeatured;
                        const optStyle = opt.value ? FEATURE_STYLES.true : FEATURE_STYLES.false;

                        return (
                            <PopoverPrimitive.Close key={String(opt.value)} asChild>
                                <div
                                    onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "10px 14px", cursor: "pointer", fontSize: 13,
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? optStyle.text : "#475569",
                                        background: isSelected ? optStyle.bg : "transparent",
                                        transition: "background 0.12s",
                                    }}
                                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                                >
                                    <Star
                                        size={13}
                                        fill={opt.value ? optStyle.star : "none"}
                                        color={optStyle.star}
                                        strokeWidth={opt.value ? 0 : 2}
                                    />
                                    {opt.label}
                                    {isSelected && (
                                        <Check size={12} style={{ marginLeft: "auto", color: optStyle.text }} />
                                    )}
                                </div>
                            </PopoverPrimitive.Close>
                        );
                    })}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}

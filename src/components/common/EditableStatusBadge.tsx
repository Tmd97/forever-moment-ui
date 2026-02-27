import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const STATUS_OPTIONS = ["Active", "Inactive", "Draft", "Archived"];

const STATUS_STYLES: Record<string, { bg: string, text: string, dot: string }> = {
    Active: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    Inactive: { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
    Draft: { bg: "#fef3c7", text: "#92400e", dot: "#f59b0b" },
    Archived: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
};

export function EditableStatusBadge({
    status,
    onChange,
    options = STATUS_OPTIONS
}: {
    status: string,
    onChange?: (val: string) => void,
    options?: string[]
}) {
    const [open, setOpen] = useState(false);
    const s = STATUS_STYLES[status] || STATUS_STYLES["Inactive"];
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const [rect, setRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        if (open && ref.current) {
            setRect(ref.current.getBoundingClientRect());

            const handleScroll = () => {
                if (ref.current) setRect(ref.current.getBoundingClientRect());
            };
            window.addEventListener('scroll', handleScroll, true);
            window.addEventListener('resize', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll, true);
                window.removeEventListener('resize', handleScroll);
            };
        }
    }, [open]);

    if (!onChange) {
        // Render static badge
        return (
            <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 10px 5px 8px", borderRadius: 20,
                background: s.bg, border: `1.5px solid ${s.dot}22`,
                fontSize: 12.5, fontWeight: 600, color: s.text,
            }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span>{status}</span>
            </div>
        )
    }

    return (
        <div style={{ position: "relative", display: "inline-block" }} ref={ref} onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 10px 5px 8px", borderRadius: 20,
                background: s.bg, border: `1.5px solid ${s.dot}22`,
                cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: s.text,
                transition: "all 0.15s", outline: "none",
                boxShadow: open ? `0 0 0 3px ${s.dot}30` : "none",
                minWidth: "85px", justifyContent: "center"
            }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span>{status}</span>
                <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2, flexShrink: 0 }}>▾</span>
            </button>

            {open && rect && createPortal(
                <div style={{
                    position: "fixed", top: rect.bottom + 6, left: rect.left, zIndex: 99999,
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: 140,
                }}>
                    {options.map(opt => {
                        const style = STATUS_STYLES[opt] || STATUS_STYLES["Inactive"];
                        const isActive = opt === status;
                        return (
                            <div key={opt} onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }} style={{
                                display: "flex", alignItems: "center", gap: 8, padding: "9px 14px",
                                cursor: "pointer", fontSize: 13, fontWeight: isActive ? 600 : 400,
                                color: isActive ? style.text : "#374151",
                                background: isActive ? style.bg : "transparent",
                                transition: "background 0.15s",
                            }}
                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                            >
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />
                                {opt}
                                {isActive && <span style={{ marginLeft: "auto", color: style.dot }}>✓</span>}
                            </div>
                        );
                    })}
                </div>,
                document.body
            )}
        </div>
    );
}

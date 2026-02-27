import { useState, useRef, useEffect } from "react";

export function EditableTitle({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

    const commit = () => { setEditing(false); onChange(val); };

    if (editing) return (
        <input ref={inputRef} value={val}
            onChange={e => setVal(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(value); setEditing(false); } }}
            style={{
                fontSize: 14, fontWeight: 600, color: "#111827", border: "none",
                borderBottom: "2px solid #6366f1", outline: "none", background: "transparent",
                width: "100%", padding: "2px 0", fontFamily: "inherit",
            }}
            onClick={(e) => e.stopPropagation()}
        />
    );

    return (
        <span onClick={(e) => { e.stopPropagation(); setEditing(true); }} title="Click to edit" style={{
            fontSize: 14, fontWeight: 600, color: "#111827", cursor: "text",
            borderBottom: "1.5px dashed transparent",
            transition: "border-color 0.15s",
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#d1d5db"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
        >
            {val}
        </span>
    );
}

import React from 'react';

export interface StatCard {
    icon: React.ReactNode;
    iconBg: string;
    value: string | number;
    label: string;
}

export interface StatsRowProps {
    stats: StatCard[];
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((c, i) => (
                <div
                    key={i}
                    style={{
                        background: '#fff',
                        border: '1px solid #e8e6e0',
                        borderRadius: 14,
                        padding: '16px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        transition: 'box-shadow 0.2s',
                        cursor: 'default',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                >
                    <div style={{
                        width: 40, height: 40,
                        borderRadius: 10,
                        background: c.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {c.icon}
                    </div>
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 600, color: '#0f1117', lineHeight: 1.2 }}>{c.value}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{c.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

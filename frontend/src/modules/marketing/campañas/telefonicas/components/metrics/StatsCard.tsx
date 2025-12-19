import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: string;
    delay?: number;
    isVisible?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    trend,
    icon,
    delay = 0,
    isVisible = true
}) => {
    return (
        <div
            className={`flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg bg-white p-6 border border-gray-200/50 shadow-sm transform transition-all duration-700 ease-out ${isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <p className="text-base font-medium text-gray-600">{title}</p>
            <p className="tracking-light text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
                <p className={`text-base font-medium leading-normal ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
                </p>
            )}
        </div>
    );
};

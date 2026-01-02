import React from 'react';
import { MistakeCategory, getCategoryInfo } from '@/logic/mistakeCategories';

interface CategoryBadgeProps {
    category: MistakeCategory;
    count?: number;
}

export default function CategoryBadge({ category, count }: CategoryBadgeProps) {
    const info = getCategoryInfo(category);

    return (
        <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${info.bgColor} ${info.borderColor}`}
            title={info.description}
        >
            <span className="text-2xl">{info.icon}</span>
            <span className={`font-semibold ${info.textColor}`}>
                {info.name}
            </span>
            {count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold ${info.textColor}`}>
                    {count}
                </span>
            )}
        </div>
    );
}

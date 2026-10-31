import React from 'react';
import Button from './Button';

export default function EmptyState({
    title = 'No items found',
    description = 'Get started by creating a new record.',
    actionLabel,
    onAction,
    icon: Icon,
}) {
    return (
        <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-gray-200/80 bg-gray-50/50">
            {Icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#e04f2d] mb-4">
                    <Icon className="h-6 w-6" />
                </div>
            )}
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">{description}</p>
            {actionLabel && onAction && (
                <div className="mt-5">
                    <Button onClick={onAction} size="sm">
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}


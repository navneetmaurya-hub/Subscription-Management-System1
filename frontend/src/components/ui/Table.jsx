import React from 'react';

export default function Table({ columns = [], data = [], keyField = '_id', onRowClick }) {
    if (!data.length) {
        return null;
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                        {columns.map((col, idx) => (
                            <th key={idx} className={`py-3 px-4 ${col.className || ''}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {data.map((row, rIdx) => (
                        <tr
                            key={row[keyField] || rIdx}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`hover:bg-orange-50/30 transition-colors ${
                                onRowClick ? 'cursor-pointer' : ''
                            }`}
                        >
                            {columns.map((col, cIdx) => (
                                <td key={cIdx} className={`py-3.5 px-4 text-gray-700 ${col.className || ''}`}>
                                    {col.cell ? col.cell(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


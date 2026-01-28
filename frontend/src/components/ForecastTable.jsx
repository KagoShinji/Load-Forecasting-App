import React from 'react';
import { Table } from 'lucide-react';

const ForecastTable = ({ forecast }) => {
    if (!forecast || forecast.length === 0) return null;

    // Format number with commas
    const formatNumber = (num) => {
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-600" />
                Forecast Table
            </h3>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Predicted Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {forecast.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                    {row.Date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    {formatNumber(row.PredictedValue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ForecastTable;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const ResultsChart = ({ history, forecast }) => {
    // Combine data for plotting
    // History data needs to distinguish itself from forecast

    const mergedData = [];
    const historyMap = new Map();
    history.forEach(h => historyMap.set(h.Date, h.Value));

    const forecastMap = new Map();
    forecast.forEach(f => forecastMap.set(f.Date, f.PredictedValue));

    // Get all unique dates
    const allDates = new Set([...historyMap.keys(), ...forecastMap.keys()]);
    const sortedDates = Array.from(allDates).sort();

    sortedDates.forEach(date => {
        mergedData.push({
            date,
            Value: historyMap.get(date),
            Predicted: forecastMap.get(date)
        });
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
            <h3 className="text-lg font-semibold mb-6 text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Forecast Results
            </h3>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mergedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(value) => value.slice(5)} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6 }}
                            name="Historical Data"
                        />
                        <Line
                            type="monotone"
                            dataKey="Predicted"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Forecast"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ResultsChart;

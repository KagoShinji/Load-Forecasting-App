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
        <div>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    Forecast Results
                </h3>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Historical
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Forecast
                    </div>
                </div>
            </div>

            <div className="h-[450px] w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mergedData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            tickFormatter={(value) => value.slice(0, 7)}
                            minTickGap={30}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `${value / 1000}k`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                padding: '12px',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            type="monotone"
                            dataKey="Value"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 0, strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                            name="Historical Data"
                        />
                        <Line
                            type="monotone"
                            dataKey="Predicted"
                            stroke="#10b981"
                            strokeWidth={3}
                            strokeDasharray="4 4"
                            dot={{ r: 0, strokeWidth: 0 }}
                            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                            name="Forecast"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ResultsChart;

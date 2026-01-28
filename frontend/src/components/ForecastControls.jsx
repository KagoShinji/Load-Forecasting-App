import React, { useState } from 'react';
import { Calendar, Play } from 'lucide-react';

const ForecastControls = ({ onForecast, disabled, availablePlaces, selectedPlace, onPlaceChange }) => {
    const [targetYear, setTargetYear] = useState(2026);

    const handleForecast = () => {
        onForecast({ targetYear });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Forecast Settings
            </h3>

            <div className="space-y-4">
                {availablePlaces && availablePlaces.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Place</label>
                        <select
                            value={selectedPlace}
                            onChange={(e) => onPlaceChange(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                        >
                            {availablePlaces.map(place => (
                                <option key={place} value={place}>{place}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Year</label>
                    <input
                        type="number"
                        min="2024"
                        value={targetYear}
                        onChange={(e) => setTargetYear(parseInt(e.target.value) || 2026)}
                        placeholder="e.g. 2030"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">Forecasts until end of this year</p>
                </div>

                <button
                    onClick={handleForecast}
                    disabled={disabled}
                    className={`w-full py-2.5 mt-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${disabled
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    <Play className="w-4 h-4" />
                    Generate Forecast
                </button>
            </div>
        </div>
    );
};

export default ForecastControls;

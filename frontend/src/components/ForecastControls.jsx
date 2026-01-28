import React, { useState } from 'react';
import { Calendar, Play } from 'lucide-react';

const ForecastControls = ({ onForecast, disabled, availablePlaces, selectedPlace, onPlaceChange }) => {
    const [targetYear, setTargetYear] = useState(2026);

    const handleForecast = () => {
        onForecast({ targetYear });
    };

    return (
        <div className="p-6">
            <h3 className="text-lg font-bold mb-5 text-slate-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                Forecast Settings
            </h3>

            <div className="space-y-5">
                {availablePlaces && availablePlaces.length > 0 && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Select Place</label>
                        <div className="relative">
                            <select
                                value={selectedPlace}
                                onChange={(e) => onPlaceChange(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-100/50"
                            >
                                {availablePlaces.map(place => (
                                    <option key={place} value={place}>{place}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Target Year</label>
                    <div className="relative">
                        <input
                            type="number"
                            min="2024"
                            value={targetYear}
                            onChange={(e) => setTargetYear(parseInt(e.target.value) || 2026)}
                            placeholder="e.g. 2030"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">YEAR</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 ml-1">
                        Forecast will extend until Dec 31, <span className="font-semibold text-indigo-500">{targetYear}</span>
                    </p>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleForecast}
                        disabled={disabled}
                        className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-[0.98] ${disabled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'
                            }`}
                    >
                        <Play className="w-4 h-4 fill-current" />
                        Generate Forecast
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForecastControls;

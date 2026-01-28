import React, { useState } from 'react';
import axios from 'axios';
import { Activity } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ForecastControls from './components/ForecastControls';
import ResultsChart from './components/ResultsChart';
import ForecastTable from './components/ForecastTable';

function App() {
  const [modelReady, setModelReady] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');

  const handleUploadSuccess = (data) => {
    setModelReady(true);
    console.log("Model trained:", data);

    if (data.places && data.places.length > 0) {
      setAvailablePlaces(data.places);
      setSelectedPlace(data.places[0]);
    }
  };

  const handleForecast = async ({ targetYear }) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/forecast', {
        target_year: targetYear,
        place: selectedPlace
      });
      setHistoryData(response.data.history);
      setForecastData(response.data.forecast);
    } catch (err) {
      console.error(err);
      alert("Forecast failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              Smart Forecaster
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            Universal Time-Series Forecasting
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column: Controls */}
          <div className="space-y-6">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            <ForecastControls
              onForecast={handleForecast}
              disabled={!modelReady || loading}
              availablePlaces={availablePlaces}
              selectedPlace={selectedPlace}
              onPlaceChange={setSelectedPlace}
            />
          </div>

          {/* Right Column: Visualization */}
          <div className="md:col-span-2 space-y-6">
            {historyData.length > 0 || forecastData.length > 0 ? (
              <>
                <ResultsChart history={historyData} forecast={forecastData} />
                <ForecastTable forecast={forecastData} />
              </>
            ) : (
              <div className="bg-white h-full min-h-[400px] rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <Activity className="w-16 h-16 mb-4 opacity-20" />
                <p>Upload a dataset and generate a forecast to see analytics</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;

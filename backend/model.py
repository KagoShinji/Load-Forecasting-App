import pandas as pd
import numpy as np
import io
from statsmodels.tsa.arima.model import ARIMA
import warnings

# Suppress warnings for cleaner logs
warnings.filterwarnings("ignore")

class ForecastModel:
    def __init__(self):
        self.data_dict = {} # Store data for each place
        self.last_dates = {} # Store last date for each place
        self.available_places = []
        self.model_fit = None # Store the fitted model (for single place predicting)

    def train(self, file_content: bytes):
        # Load data
        try:
             # Handle commas in numbers (e.g. 1,291,469)
            try:
                df = pd.read_csv(io.BytesIO(file_content), thousands=',')
            except:
                # Try Excel
                df = pd.read_excel(io.BytesIO(file_content))
        except:
            raise ValueError("Invalid file format. Please upload a CSV or Excel file.")

        # Auto-detect Date column
        date_col = None
        # First check generic parsing
        for col in df.columns:
            # use pd.api.types for safety against new string dtypes
            is_date = pd.api.types.is_datetime64_any_dtype(df[col])
            is_string_or_object = pd.api.types.is_object_dtype(df[col]) or pd.api.types.is_string_dtype(df[col])
            
            if is_string_or_object or is_date:
                try:
                    pd.to_datetime(df[col], errors='raise')
                    date_col = col
                    break
                except:
                    # Try specific format Jan-21 (%b-%y)
                    try:
                        pd.to_datetime(df[col], format='%b-%y', errors='raise')
                        date_col = col
                        break
                    except:
                        continue
        
        if not date_col:
            # check for common names if auto-detect failed
            possible_names = ['date', 'Date', 'timestamp', 'time']
            for name in possible_names:
                if name in df.columns:
                    date_col = name
                    break
        
        if not date_col:
             raise ValueError("Could not detect a Date column. Please ensure one column has valid date formats.")

        # Standardize Date
        try:
             # explicit check for Jan-21 format which might need specific format string to be safe
             dates = pd.to_datetime(df[date_col], format='%b-%y', errors='coerce')
             if dates.isnull().all():
                 # Fallback to standard
                 dates = pd.to_datetime(df[date_col])
             df['Date'] = dates
        except:
             df['Date'] = pd.to_datetime(df[date_col])

        # Identify Places (all numeric columns except Date)
        places = []
        for col in df.columns:
            if col != date_col:
                # After read_csv(thousands=','), they should be numeric. Verify:
                if pd.api.types.is_numeric_dtype(df[col]):
                    places.append(col)
        
        if not places:
            raise ValueError("Could not detect any numeric columns to forecast (after handling commas).")

        self.available_places = places
        self.data_dict = {}
        self.last_dates = {}

        # 1. Resample to Monthly Start (MS) - this helps with "First day of the month" rule
        # Set Date as index for resampling
        df = df.set_index('Date').sort_index()

        # Pre-process data for each place
        for place in places:
            # Resample strictly to Month Start
            series = df[place].resample('MS').sum() # Assuming Load is additive. Use .mean() if it's a rate.
            
            place_df = series.to_frame(name='Value').reset_index()
            place_df = place_df.dropna() # Drop any empty months if any
            
            self.data_dict[place] = place_df
            self.last_dates[place] = place_df['Date'].max()

        # Compute "All Places" (Total)
        # Sum of all places, then resample
        total_series = df[places].sum(axis=1).resample('MS').sum()
        total_df = total_series.to_frame(name='Value').reset_index().dropna()
        
        self.data_dict["All Places"] = total_df
        self.last_dates["All Places"] = total_df['Date'].max()
        
        # Add "All Places" to the start of the list
        all_places_list = ["All Places"] + places

        return {
            "message": "File processed successfully", 
            "places": all_places_list, 
            "rows": len(df),
            "date_range": f"{total_df['Date'].min().date()} to {total_df['Date'].max().date()}"
        }

    def predict(self, target_year: int = None, place: str = None, days: int = 0, months: int = 0, years: int = 0):
        if not self.data_dict:
            raise ValueError("No data loaded. Please upload a file first.")
        
        # Determine Place
        if not place:
            place = "All Places" if "All Places" in self.data_dict else list(self.data_dict.keys())[0]
        
        if place not in self.data_dict:
             raise ValueError(f"Place '{place}' not found in dataset.")

        df = self.data_dict[place]
        last_date = self.last_dates[place]
        
        # Determine Forecast Steps (Months)
        # If target_year is provided, calculate months until end of that year.
        if target_year:
            target_date = pd.Timestamp(year=target_year, month=12, day=1)
            if target_date <= last_date:
                raise ValueError(f"Target year {target_year} must be after the last data point ({last_date.year})")
            
            # Difference in months
            diff = (target_date.year - last_date.year) * 12 + (target_date.month - last_date.month)
            steps = diff
        else:
            # Fallback to legacy months/years inputs if needed (though we plan to remove them)
            # Just default to 12 months if nothing valid
            steps = 12 

        if steps <= 0:
             return {"error": "Forecast steps must be positive."}

        # ARIMA Training on the fly
        # Simple ARIMA(1,1,1) or auto-arima logic. 
        # Using a fixed order (5,1,0) is often a decent starting point for monthly data without heavy seasonality analysis
        # or (1,1,1). Let's stick to something robust.
        
        series = df['Value']
        # Ensure distinct index
        series.index = pd.DatetimeIndex(df['Date']).to_period('M')
        
        try:
            # Fit ARIMA
            model = ARIMA(series, order=(5,1,0))
            model_fit = model.fit()
            
            # Forecast
            forecast_result = model_fit.forecast(steps=steps)
            
            # Convert forecast to DataFrame
            # Forecast index is PeriodIndex, convert to timestamp (MS)
            forecast_dates = forecast_result.index.to_timestamp(freq='MS')
            
            future_df = pd.DataFrame({
                'Date': forecast_dates,
                'PredictedValue': forecast_result.values
            })
            
        except Exception as e:
            raise ValueError(f"ARIMA modeling failed: {str(e)}")
        
        # Format for API
        result = future_df[['Date', 'PredictedValue']].copy()
        result['Date'] = result['Date'].dt.strftime('%Y-%m-%d')
        
        # Also return historical data for the chart
        history = df[['Date', 'Value']].copy()
        history['Date'] = history['Date'].dt.strftime('%Y-%m-%d')
        
        return {
            "history": history.to_dict(orient='records'),
            "forecast": result.to_dict(orient='records'),
            "place": place
        }

forecast_system = ForecastModel()

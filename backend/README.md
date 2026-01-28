# Backend Setup Instructions

It appears that **Python** is not installed or configured on your system. To run the forecasting backend, please follow these steps:

## 1. Install Python
1.  Go to [python.org/downloads](https://www.python.org/downloads/).
2.  Download the latest version for Windows.
3.  **IMPORTANT**: Run the installer and check the box **"Add Python to PATH"** before clicking Install.
4.  After installation, open a new terminal and run `python --version` to verify.

## 2. Setup Virtual Environment
Once Python is installed, run the following commands in the `LoadForecasting` directory:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
```

## 3. Run the Server
Start the backend server with:

```powershell
.\venv\Scripts\uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

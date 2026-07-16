import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

try:
    df = pd.read_csv("tv_scraper/extracted_data.csv")
    if list(df.columns) == ['0', '1', '2', '3', '4', '5', '6']:
        df.columns = ['date', 'open', 'high', 'low', 'close', 'change', 'volume']
    
    for col in ['open', 'high', 'low', 'close']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', ''), errors='coerce')
            
    df = df.iloc[::-1].reset_index(drop=True)
    df = df.fillna(0)
    
    recent_df = df.tail(90).copy()
    X_train = np.arange(len(recent_df)).reshape(-1, 1)
    y_train = recent_df['close'].values
    
    print("Fitting model...")
    model = LinearRegression()
    model.fit(X_train, y_train)
    print("Fit successful!")
    
    future_X = np.arange(len(recent_df), len(recent_df) + 30).reshape(-1, 1)
    future_y = model.predict(future_X)
    print("Prediction successful!")
except Exception as e:
    print("Error:", e)

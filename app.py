import os
os.environ['OBJC_DISABLE_INITIALIZE_FORK_SAFETY'] = 'YES'
os.environ['OMP_NUM_THREADS'] = '1'
os.environ['OPENBLAS_NUM_THREADS'] = '1'
os.environ['MKL_NUM_THREADS'] = '1'

import streamlit as st
import pandas as pd
import numpy as np
from datetime import timedelta
from sklearn.linear_model import LinearRegression
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Configure page
st.set_page_config(page_title="Technical Analysis Dashboard", layout="wide")
st.title("📈 Technical Analysis & Forecast Dashboard")

# File uploader
uploaded_file = st.file_uploader("Upload your historical data CSV (must contain date, open, high, low, close)", type=["csv"])

if uploaded_file is not None:
    try:
        # 1. Load and prep data
        df = pd.read_csv(uploaded_file)
        
        # Standardize columns to lowercase
        df.columns = [str(col).strip().lower() for col in df.columns]
        
        # Auto-detect missing headers from our scraper
        if list(df.columns) == ['0', '1', '2', '3', '4', '5', '6']:
            df.columns = ['date', 'open', 'high', 'low', 'close', 'change', 'volume']
            
        if 'close' not in df.columns:
            st.error("The CSV must contain a 'close' column.")
            st.stop()
            
        # Ensure numeric columns
        for col in ['open', 'high', 'low', 'close']:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', ''), errors='coerce')
            
        # Reverse data if newest is at the top (like TradingView exports)
        df = df.iloc[::-1].reset_index(drop=True)

        # Try to parse real dates from TradingView format (e.g. "Mon 08 Jun '26")
        if 'date' in df.columns:
            # Replace the apostrophe with "20" to make it "2026" for easy parsing
            date_strs = df['date'].astype(str).str.replace("'", "20")
            df['date_parsed'] = pd.to_datetime(date_strs, format='%a %d %b %Y', errors='coerce')
        else:
            df['date_parsed'] = pd.NaT
            
        # Fallback to proxy dates if missing or parsing failed
        if df['date_parsed'].isna().any():
            base_date = pd.Timestamp.now() - pd.Timedelta(days=len(df))
            df['date_parsed'] = pd.date_range(start=base_date, periods=len(df), freq='D')

        # 2. Calculate Indicators
        df['SMA_20'] = df['close'].rolling(window=20).mean()
        df['SMA_50'] = df['close'].rolling(window=50).mean()
        df['EMA_20'] = df['close'].ewm(span=20, adjust=False).mean()
        df['EMA_50'] = df['close'].ewm(span=50, adjust=False).mean()

        # Bollinger Bands
        df['STD_20'] = df['close'].rolling(window=20).std()
        df['BB_Upper'] = df['SMA_20'] + (df['STD_20'] * 2)
        df['BB_Lower'] = df['SMA_20'] - (df['STD_20'] * 2)

        # RSI
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))

        # MACD
        exp1 = df['close'].ewm(span=12, adjust=False).mean()
        exp2 = df['close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = exp1 - exp2
        df['Signal'] = df['MACD'].ewm(span=9, adjust=False).mean()

        # Replace NaNs
        df = df.fillna(0)

        # 2.5 Calculate Patterns (Doji, Hammer, Engulfing)
        if all(c in df.columns for c in ['open', 'high', 'low', 'close']):
            df['body'] = abs(df['close'] - df['open'])
            df['range'] = df['high'] - df['low']
            
            # Doji: body is very small compared to the range
            df['is_doji'] = df['body'] <= (df['range'] * 0.1)
            
            # Hammer: lower shadow >= 2x body, upper shadow <= 0.2x body
            df['lower_shadow'] = np.minimum(df['open'], df['close']) - df['low']
            df['upper_shadow'] = df['high'] - np.maximum(df['open'], df['close'])
            df['is_hammer'] = (df['lower_shadow'] >= 2 * df['body']) & (df['upper_shadow'] <= df['body'] * 0.2) & (df['body'] > 0)
            
            # Engulfing (Bullish and Bearish)
            df['prev_open'] = df['open'].shift(1)
            df['prev_close'] = df['close'].shift(1)
            df['is_bullish_engulfing'] = (df['prev_close'] < df['prev_open']) & (df['close'] > df['open']) & (df['open'] <= df['prev_close']) & (df['close'] >= df['prev_open'])
            df['is_bearish_engulfing'] = (df['prev_close'] > df['prev_open']) & (df['close'] < df['open']) & (df['open'] >= df['prev_close']) & (df['close'] <= df['prev_open'])

        # 3. Predict next 30 days (1 month) using Multivariate Random Forest
        from sklearn.ensemble import RandomForestRegressor
        
        # We use the last 250 days to train the model to capture the recent market regime
        features = ['close', 'SMA_20', 'SMA_50', 'EMA_20', 'EMA_50', 'BB_Upper', 'BB_Lower', 'RSI', 'MACD', 'Signal']
        
        ml_df = df.dropna(subset=features).copy()
        train_window = min(250, len(ml_df))
        train_df = ml_df.tail(train_window).copy()
        
        forecast_horizon = 30
        
        # Only use ML if we have enough historical data to train on sequences
        if len(train_df) > forecast_horizon + 20:
            X_data = train_df[features].values
            Y_data = []
            
            # Create training examples: X = features at day i, Y = next 30 days of close prices
            for i in range(len(train_df) - forecast_horizon):
                Y_data.append(train_df['close'].iloc[i+1 : i+1+forecast_horizon].values)
                
            X_train = X_data[:-forecast_horizon]
            y_train = np.array(Y_data)
            
            # Train the Multivariate Random Forest
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X_train, y_train)
            
            # Predict the next 30 days using TODAY'S latest indicator values
            X_latest = X_data[-1].reshape(1, -1)
            future_y = model.predict(X_latest)[0]
        else:
            # Fallback to simple Linear Regression if data is extremely limited
            recent_df = df.tail(90).copy()
            X_train_lr = np.arange(len(recent_df)).reshape(-1, 1)
            y_train_lr = recent_df['close'].values
            
            lr_model = LinearRegression()
            lr_model.fit(X_train_lr, y_train_lr)

            future_X = np.arange(len(recent_df), len(recent_df) + forecast_horizon).reshape(-1, 1)
            future_y = lr_model.predict(future_X)
            
        last_date = df['date_parsed'].iloc[-1]
        future_dates = [(last_date + timedelta(days=i)) for i in range(1, 31)]

        # KPI Metrics
        col1, col2, col3 = st.columns(3)
        col1.metric("Latest Close", f"{df['close'].iloc[-1]:.2f}")
        col2.metric("Current RSI (14)", f"{df['RSI'].iloc[-1]:.2f}")
        col3.metric("30-Day Forecast", f"{future_y[-1]:.2f}")

        st.markdown("---")
        
        # Use all data for display so the user can interactively zoom
        display_df = df
        
        # --- Main Chart: Price, SMA, BB, Forecast, Support & Resistance ---
        st.subheader("Price, SMA 20, Bollinger Bands, Support/Resistance & Forecast")
        st.markdown("**Note:** Green dotted lines indicate Support, Red dotted lines indicate Resistance.")
        
        # Chart Controls
        col_ctrl1, col_ctrl2, col_ctrl3, col_ctrl4, col_ctrl5 = st.columns(5)
        with col_ctrl1:
            chart_type = st.radio("Chart Type", ["Line", "Candlestick"], index=1, horizontal=True)
        with col_ctrl2:
            sr_type = st.radio("Support/Resistance Type", ["Horizontal", "Diagonal", "Both", "None"], index=3, horizontal=True)
        with col_ctrl3:
            sr_window = st.slider("S/R Sensitivity (Window)", min_value=2, max_value=50, value=10)
        with col_ctrl4:
            show_patterns = st.checkbox("Show Patterns", value=False)
            show_bb = st.checkbox("Show Bollinger Bands", value=False)
            show_forecast = st.checkbox("Show 30-Day Forecast", value=True)
            show_fib = st.checkbox("Show Fibonacci Levels", value=False)
            if show_fib:
                min_d = display_df['date_parsed'].min().date()
                max_d = display_df['date_parsed'].max().date()
                def_start = max_d - pd.Timedelta(days=250)
                if def_start < min_d: def_start = min_d
                fib_start = st.date_input("Fib Start Date", value=def_start, min_value=min_d, max_value=max_d)
                fib_end = max_d
            else:
                fib_start = None
                fib_end = None
        with col_ctrl5:
            chart_theme = st.radio("Chart Theme", ["Dark", "Light"], horizontal=True)
            plotly_template = "plotly_dark" if chart_theme == "Dark" else "plotly_white"
            
        ma_options = st.multiselect("Moving Averages to Display", ["SMA 20", "SMA 50", "EMA 20", "EMA 50"], default=[])
        
        def get_support_resistance(d, w):
            supp = []
            res = []
            hc = 'high' if 'high' in d.columns else 'close'
            lc = 'low' if 'low' in d.columns else 'close'
            for i in range(w, len(d)-w):
                if d[lc].iloc[i] == min(d[lc].iloc[i-w:i+w+1]):
                    supp.append((i, d['date_parsed'].iloc[i], d[lc].iloc[i]))
                if d[hc].iloc[i] == max(d[hc].iloc[i-w:i+w+1]):
                    res.append((i, d['date_parsed'].iloc[i], d[hc].iloc[i]))
            return supp, res

        supports, resistances = get_support_resistance(display_df, sr_window)
        
        fig1 = go.Figure()
        
        # Historical Price
        if chart_type == "Candlestick" and all(c in display_df.columns for c in ['open', 'high', 'low', 'close']):
            fig1.add_trace(go.Candlestick(
                x=display_df['date_parsed'],
                open=display_df['open'],
                high=display_df['high'],
                low=display_df['low'],
                close=display_df['close'],
                name='Price'
            ))
            fig1.update_layout(xaxis_rangeslider_visible=True)
        else:
            if chart_type == "Candlestick":
                st.warning("Candlestick chart requires 'open', 'high', 'low', and 'close' columns. Falling back to Line chart.")
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['close'], name='Close', line=dict(color='#2c3e50', width=2)))
            fig1.update_layout(xaxis_rangeslider_visible=True)
            
        # Moving Averages
        if "SMA 20" in ma_options:
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['SMA_20'], name='SMA 20', line=dict(color='#f39c12', width=1.5)))
        if "SMA 50" in ma_options:
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['SMA_50'], name='SMA 50', line=dict(color='#d35400', width=1.5)))
        if "EMA 20" in ma_options:
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['EMA_20'], name='EMA 20', line=dict(color='#27ae60', width=1.5)))
        if "EMA 50" in ma_options:
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['EMA_50'], name='EMA 50', line=dict(color='#8e44ad', width=1.5)))
            
        # Bollinger Bands
        if show_bb:
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['BB_Upper'], name='Upper BB', line=dict(color='rgba(52, 152, 219, 0.5)')))
            fig1.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['BB_Lower'], name='Lower BB', fill='tonexty', fillcolor='rgba(52, 152, 219, 0.1)', line=dict(color='rgba(52, 152, 219, 0.5)')))
        # Forecast
        if show_forecast:
            fig1.add_trace(go.Scatter(x=future_dates, y=future_y, name='30-Day Forecast', line=dict(color='#e74c3c', dash='dot', width=3)))
        
        # Support / Resistance Lines
        if sr_type in ["Horizontal", "Both"]:
            unique_supp = set(s[2] for s in supports)
            unique_res = set(r[2] for r in resistances)
            for s in unique_supp:
                fig1.add_hline(y=s, line_dash="dot", line_color="green", line_width=1, opacity=0.6)
            for r in unique_res:
                fig1.add_hline(y=r, line_dash="dot", line_color="red", line_width=1, opacity=0.6)
                
        if sr_type in ["Diagonal", "Both"]:
            if len(supports) > 1:
                # Use only the most recent 15 pivot points to capture the current trend
                recent_supports = supports[-15:] if len(supports) > 15 else supports
                supp_x = np.array([p[0] for p in recent_supports]).reshape(-1, 1)
                supp_y = np.array([p[2] for p in recent_supports])
                reg_supp = LinearRegression().fit(supp_x, supp_y)
                
                start_idx = recent_supports[0][0]
                end_idx = len(display_df) - 1
                
                x_vals = np.array([start_idx, end_idx]).reshape(-1, 1)
                y_vals = reg_supp.predict(x_vals)
                date_vals = [display_df['date_parsed'].iloc[start_idx], display_df['date_parsed'].iloc[end_idx]]
                
                fig1.add_trace(go.Scatter(x=date_vals, y=y_vals, mode='lines', line=dict(color='green', width=2), name='Support Trendline'))

            if len(resistances) > 1:
                recent_resistances = resistances[-15:] if len(resistances) > 15 else resistances
                res_x = np.array([p[0] for p in recent_resistances]).reshape(-1, 1)
                res_y = np.array([p[2] for p in recent_resistances])
                reg_res = LinearRegression().fit(res_x, res_y)
                
                start_idx = recent_resistances[0][0]
                end_idx = len(display_df) - 1
                
                x_vals = np.array([start_idx, end_idx]).reshape(-1, 1)
                y_vals = reg_res.predict(x_vals)
                date_vals = [display_df['date_parsed'].iloc[start_idx], display_df['date_parsed'].iloc[end_idx]]
                
                fig1.add_trace(go.Scatter(x=date_vals, y=y_vals, mode='lines', line=dict(color='red', width=2), name='Resistance Trendline'))
                
        # Fibonacci Retracement
        if show_fib and fib_start is not None:
            fib_df = display_df[(display_df['date_parsed'].dt.date >= fib_start) & (display_df['date_parsed'].dt.date <= fib_end)]
            
            if not fib_df.empty:
                max_price = fib_df['high'].max()
                min_price = fib_df['low'].min()
                diff = max_price - min_price
                
                if diff > 0:
                    levels = {
                        '0.0%': max_price,
                        '23.6%': max_price - 0.236 * diff,
                        '38.2%': max_price - 0.382 * diff,
                        '50.0%': max_price - 0.500 * diff,
                        '61.8%': max_price - 0.618 * diff,
                        '78.6%': max_price - 0.786 * diff,
                        '100.0%': min_price
                    }
                    colors = ['#7f8c8d', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#7f8c8d']
                    
                    for (name, price), color in zip(levels.items(), colors):
                        fig1.add_hline(y=price, line_dash="dash", line_color=color, line_width=1, opacity=0.8, 
                                       annotation_text=f"Fib {name}", annotation_position="top right", annotation_font_color=color)
            
        # Candlestick patterns have been moved to a separate chart below
            
        fig1.update_layout(height=800, template=plotly_template, margin=dict(l=0, r=0, t=30, b=0))
        st.plotly_chart(fig1, use_container_width=True, theme=None)

        # --- Secondary Charts: MACD & RSI ---
        col_left, col_right = st.columns(2)
        
        with col_left:
            st.subheader("MACD & Signal")
            fig2 = go.Figure()
            fig2.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['MACD'], name='MACD', line=dict(color='#3498db')))
            fig2.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['Signal'], name='Signal', line=dict(color='#e74c3c')))
            fig2.update_layout(height=300, template=plotly_template, margin=dict(l=0, r=0, t=30, b=0))
            st.plotly_chart(fig2, use_container_width=True, theme=None)
            
        with col_right:
            st.subheader("RSI (14)")
            fig3 = go.Figure()
            fig3.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['RSI'], name='RSI', line=dict(color='#9b59b6')))
            # Add Overbought/Oversold lines
            fig3.add_hline(y=70, line_dash="dash", line_color="red")
            fig3.add_hline(y=30, line_dash="dash", line_color="green")
            fig3.update_layout(height=300, template=plotly_template, yaxis=dict(range=[0, 100]), margin=dict(l=0, r=0, t=30, b=0))
            st.plotly_chart(fig3, use_container_width=True, theme=None)
            
        # --- Pattern Analysis Chart ---
        if show_patterns and all(c in display_df.columns for c in ['is_doji', 'is_hammer', 'is_bullish_engulfing', 'is_bearish_engulfing']):
            st.markdown("---")
            st.subheader("Candlestick Pattern Analysis")
            st.markdown("Isolated price action highlighting automatically detected reversal patterns.")
            fig_pat = go.Figure()
            
            if all(c in display_df.columns for c in ['open', 'high', 'low', 'close']):
                fig_pat.add_trace(go.Candlestick(
                    x=display_df['date_parsed'],
                    open=display_df['open'],
                    high=display_df['high'],
                    low=display_df['low'],
                    close=display_df['close'],
                    name='Price'
                ))
            else:
                fig_pat.add_trace(go.Scatter(x=display_df['date_parsed'], y=display_df['close'], name='Close'))
                
            offset = display_df['range'].mean() * 0.3 if 'range' in display_df.columns else 0.5
            
            doji_df = display_df[display_df['is_doji']]
            if not doji_df.empty:
                fig_pat.add_trace(go.Scatter(x=doji_df['date_parsed'], y=doji_df['high'] + offset, mode='markers+text', 
                                          text="Doji", textposition="top center", textfont=dict(size=10, color='gray'),
                                          marker=dict(symbol='triangle-down', size=8, color='gray'), name='Doji'))
            
            hammer_df = display_df[display_df['is_hammer']]
            if not hammer_df.empty:
                fig_pat.add_trace(go.Scatter(x=hammer_df['date_parsed'], y=hammer_df['low'] - offset, mode='markers+text', 
                                          text="Hammer", textposition="bottom center", textfont=dict(size=10, color='blue'),
                                          marker=dict(symbol='triangle-up', size=8, color='blue'), name='Hammer'))
                                          
            bull_eng_df = display_df[display_df['is_bullish_engulfing']]
            if not bull_eng_df.empty:
                fig_pat.add_trace(go.Scatter(x=bull_eng_df['date_parsed'], y=bull_eng_df['low'] - offset, mode='markers+text', 
                                          text="Bull Engulf", textposition="bottom center", textfont=dict(size=10, color='green'),
                                          marker=dict(symbol='triangle-up', size=8, color='green'), name='Bullish Engulfing'))

            bear_eng_df = display_df[display_df['is_bearish_engulfing']]
            if not bear_eng_df.empty:
                fig_pat.add_trace(go.Scatter(x=bear_eng_df['date_parsed'], y=bear_eng_df['high'] + offset, mode='markers+text', 
                                          text="Bear Engulf", textposition="top center", textfont=dict(size=10, color='red'),
                                          marker=dict(symbol='triangle-down', size=8, color='red'), name='Bearish Engulfing'))
            
            unique_supp = set(s[2] for s in supports)
            def near_support(low_price):
                if not unique_supp: return False
                min_dist = min(abs(low_price - s) / s for s in unique_supp)
                return min_dist < 0.03

            display_df['near_support'] = display_df['low'].apply(near_support)
            display_df['high_prob_buy'] = display_df['is_hammer'] & (display_df['RSI'] <= 35) & display_df['near_support']
            
            hpb_df = display_df[display_df['high_prob_buy']]
            if not hpb_df.empty:
                fig_pat.add_trace(go.Scatter(x=hpb_df['date_parsed'], y=hpb_df['low'] - (offset * 2.5), mode='markers+text', 
                                          text="🚀 HIGH PROB BUY", textposition="bottom center", textfont=dict(size=12, color='green'),
                                          marker=dict(symbol='star', size=16, color='gold', line=dict(color='green', width=2)), name='High Prob Buy'))
            
            fig_pat.update_layout(xaxis_rangeslider_visible=False, height=600, template=plotly_template, margin=dict(l=0, r=0, t=30, b=0))
            st.plotly_chart(fig_pat, use_container_width=True, theme=None)

    except Exception as e:
        st.error(f"An error occurred while processing the file: {e}")
else:
    st.info("Please upload a CSV file to begin analysis.")
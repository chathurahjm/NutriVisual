import time
import pandas as pd
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

def extract_table_data(page):
    """
    Attempts to extract data from the first visible table on the page.
    """
    print("Waiting for table to appear...")
    
    # Wait for any table or grid that might represent the "Table view"
    try:
        page.wait_for_selector("table", state="visible", timeout=10000)
    except PlaywrightTimeoutError:
        print("Could not find a <table> element. TradingView might use a custom div grid.")
        # If it's a div-based grid, more complex parsing might be needed
        # We will fallback to attempting to find something with role="grid" or similar
        try:
            page.wait_for_selector('[role="grid"]', state="visible", timeout=5000)
            print("Found a grid element. Extracting text... Note: Grid parsing might require specific selectors.")
            return [] # This would need specific adjustment based on the actual DOM
        except PlaywrightTimeoutError:
            print("Could not find any table or grid structure.")
            return []

    print("Table found. Extracting rows...")
    
    # Try to extract headers
    headers = []
    header_elements = page.locator("table thead th").all()
    if not header_elements:
        # Fallback to first row if no thead
        header_elements = page.locator("table tr").first.locator("th, td").all()
        
    for th in header_elements:
        headers.append(th.inner_text().strip())
        
    # Extract rows with scrolling
    all_rows_dict = {}
    rows_data = []
    start_idx = 1 if not page.locator("table thead th").count() else 0
    
    previous_count = -1
    consecutive_same_count = 0
    
    while consecutive_same_count < 3:
        row_elements = page.locator("table tbody tr").all()
        if not row_elements:
            row_elements = page.locator("table tr").all()[start_idx:]
            
        # Process current rows and maintain insertion order using a dict
        for row in row_elements:
            try:
                row_data = row.evaluate("""
                    (row) => {
                        return Array.from(row.cells).map(cell => cell.innerText.trim());
                    }
                """)
                if row_data and len(row_data) > 0:
                    row_tuple = tuple(row_data)
                    if row_tuple not in all_rows_dict:
                        all_rows_dict[row_tuple] = list(row_data)
            except Exception:
                pass
                
        current_count = len(all_rows_dict)
        print(f"Extracted {current_count} unique rows so far...")
        
        if current_count == previous_count:
            consecutive_same_count += 1
        else:
            consecutive_same_count = 0
            
        previous_count = current_count
        
        # Scroll down
        if consecutive_same_count < 3 and row_elements:
            try:
                # Hover the MIDDLE row to ensure it's neither hidden behind a sticky top header
                # nor clipped at the bottom of the virtual list viewport.
                mid_idx = len(row_elements) // 2
                row_elements[mid_idx].hover(timeout=1000)
            except Exception:
                pass
                
            try:
                # Scroll the mouse wheel down gently
                page.mouse.wheel(0, 400)
                
                # Robust native scroll fallback: find the scrollable container and dispatch a scroll event
                page.evaluate("""
                    () => {
                        const tables = document.querySelectorAll('table');
                        for (let table of tables) {
                            let p = table.parentElement;
                            while (p && p !== document.body) {
                                if (p.scrollHeight > p.clientHeight) {
                                    p.scrollTop += 300;
                                    p.dispatchEvent(new Event('scroll', { bubbles: true }));
                                    break;
                                }
                                p = p.parentElement;
                            }
                        }
                    }
                """)
                time.sleep(1.5) # Wait for TradingView to render new rows
            except Exception as e:
                print(f"Scrolling warning: {e}")
                time.sleep(1.5)
            
    return headers, list(all_rows_dict.values())

def run_scraper():
    import urllib.parse
    url = "https://www.tradingview.com/chart/?symbol=CSELK%3AMASK.N0000"
    
    # Extract ticker name from URL dynamically
    query = urllib.parse.urlparse(url).query
    params = urllib.parse.parse_qs(query)
    symbol_str = params.get('symbol', [''])[0]
    ticker = ""
    if ":" in symbol_str:
        ticker = symbol_str.split(":")[1].split(".")[0]
    elif symbol_str:
        ticker = symbol_str.split(".")[0]
        
    filename = f"extracted_data_{ticker}.csv" if ticker else "extracted_data.csv"
    
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 800},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        
        print(f"Navigating to {url} ...")
        page.goto(url)
        
        print("Waiting for chart canvas to load...")
        try:
            # Wait for the canvas to be visible. Usually TradingView main chart is a canvas.
            page.wait_for_selector("canvas", state="visible", timeout=20000)
            print("Canvas loaded.")
        except PlaywrightTimeoutError:
            print("Timeout waiting for canvas. The page might be taking too long or requires login.")
            browser.close()
            return
            
        # Give it a bit more time to fully render the chart
        time.sleep(3)
        
        # Right click in the middle of the first canvas
        canvas = page.locator("canvas").first
        box = canvas.bounding_box()
        
        if box:
            center_x = box['x'] + box['width'] / 2
            center_y = box['y'] + box['height'] / 2
            
            print(f"Right-clicking at ({center_x}, {center_y})...")
            page.mouse.click(center_x, center_y, button="right")
        else:
            print("Could not get bounding box for the canvas.")
            browser.close()
            return
            
        # Wait for the context menu to appear and click "Table view" or similar
        print("Waiting for context menu option 'Table view'...")
        time.sleep(1) # short wait for menu animation
        
        try:
            # Try to click on an element containing the text "Table view" (case-insensitive via regex)
            menu_item = page.locator('text=/Table view/i').first
            menu_item.wait_for(state="visible", timeout=5000)
            menu_item.click()
            print("Clicked on 'Table view'.")
        except PlaywrightTimeoutError:
            print("Could not find 'Table view' in the context menu. Are you sure it's available for this chart/layout?")
            # Attempt to take a screenshot for debugging
            page.screenshot(path="debug_menu.png")
            print("Saved screenshot to debug_menu.png")
            browser.close()
            return
            
        # Wait for table to load and extract
        time.sleep(2) # Give table time to render
        result = extract_table_data(page)
        
        if result and len(result) == 2:
            headers, data = result
            print(f"Extracted {len(data)} rows.")
            
            # Save to CSV
            if data:
                expected_headers = ['date', 'open', 'high', 'low', 'close', 'change', 'volume']
                if len(data[0]) == len(expected_headers):
                    df = pd.DataFrame(data, columns=expected_headers)
                else:
                    df = pd.DataFrame(data, columns=headers if len(headers) == len(data[0]) else None)
                df.to_csv(filename, index=False)
                print(f"Data saved successfully to {filename}")
            else:
                print("No data rows found to save.")
        
        # Optional: wait a bit before closing so user can see it
        time.sleep(2)
        browser.close()

if __name__ == "__main__":
    run_scraper()

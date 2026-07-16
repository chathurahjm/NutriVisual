#!/bin/bash
set -e

# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

echo "Setup complete. To run the scraper, execute:"
echo "source venv/bin/activate"
echo "python scraper.py"

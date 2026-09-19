# WasteX — AI-Powered Industrial Waste Exchange

WasteX is an intelligent industrial waste exchange platform designed to bridge the gap between businesses generating waste and those capable of reusing, recycling, or processing it. Built as a Minimum Viable Product (MVP) for a hackathon, WasteX focuses on intuitive discovery, intelligent matching, and logistics evaluation to promote a circular economy.

By leveraging a combination of internal database matching and external search capabilities, WasteX ensures that waste producers can find a sustainable and profitable destination for their by-products, whether the buyer is already on the platform or somewhere out on the web.

## How It Works

1. **Waste Listing:** Producers can easily list industrial waste, providing details like material type, quantity, form, condition, location, and expected price.
2. **Dashboard:** Users have access to a dashboard displaying active listings and essential exchange statistics.
3. **Internal Buyer Matching:** The system first attempts to find registered consumers within the WasteX platform matching the material and location criteria.
4. **Logistics & Market Intelligence:** The platform provides an estimate for transport logistics and market value based on standard metrics and basic geographic logic.

### External Discovery (Powered by SerpApi)

A core feature of WasteX is its ability to find buyers even when there isn't a direct match within its own database. This is where **SerpApi** is utilized.

**How SerpApi is used:**
When a user lists a waste material (e.g., "Cotton Scraps") at a specific location (e.g., "Mumbai"), and the system requires more potential buyers, the backend integrates with the SerpApi Google Search Engine. 
- It dynamically generates a targeted search query: `"{material} recycling buyers near {location}"`.
- SerpApi performs a real-time web search and retrieves the organic search results.
- WasteX extracts the top 3 external recycling businesses or buyers from these results, pulling their **title**, **link**, and a descriptive **snippet**.
- These external buyers are then seamlessly presented to the user alongside any internal platform matches, dramatically expanding the potential network for waste exchange.

If no API key is provided during development, the system falls back to gracefully providing mock external buyer data to ensure the UI remains functional.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Backend:** FastAPI, Python, PyMongo, SerpApi
- **Database:** MongoDB

## How to Run

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate` (or `source venv/bin/activate` on Mac/Linux)
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`
*Make sure MongoDB is running locally on port 27017, and set your `SERPAPI_KEY` in `backend/.env`.*

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open your browser at `http://localhost:5173`.

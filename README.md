# WasteX — AI-Powered Industrial Waste Exchange

WasteX is an intelligent industrial waste exchange platform that connects businesses generating waste with those that can reuse, recycle, or process it. This MVP is built for a hackathon, focusing on discovery, intelligent matching, and logistics evaluation.

## Features Built
1. **Waste Listing:** Producers can list industrial waste (material, quantity, form, condition, location, expected price).
2. **Dashboard:** View active listings and basic exchange stats.
3. **Internal Buyer Matching:** Finds registered consumers matching material and location criteria.
4. **External Discovery (SerpApi):** Discovers external buyers and recyclers if no internal match is found.
5. **Logistics & Market Intelligence:** Provides an estimate for transport logistics and market value based on public data or basic logic.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React (Dark theme inspired by wemakedevs)
- **Backend:** FastAPI, Python, PyMongo, SerpApi
- **Database:** MongoDB

## How to Run

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `venv\Scripts\activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`
*Make sure MongoDB is running locally on port 27017, and set your SERPAPI_KEY in backend/.env.*

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Open your browser at `http://localhost:5173`.

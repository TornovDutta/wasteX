# WasteX - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [External Integrations](#external-integrations)
8. [Setup and Installation](#setup-and-installation)

---

## 1. Overview
WasteX is an intelligent, AI-powered industrial waste exchange platform. Its primary mission is to promote a circular economy by connecting businesses that generate industrial waste with entities capable of reusing, recycling, or processing it. 

It achieves this through an intuitive listing process, intelligent internal database matching, external buyer discovery, and AI-powered conversational listing features.

## 2. Key Features

- **Waste Listing Management:** Producers can list industrial waste (material type, quantity, location, expected price, condition, etc.).
- **Smart Conversational Listing:** Uses Hugging Face (Llama-3.2-1B-Instruct) to parse user prompts and interactively gather required fields for creating a waste listing.
- **Internal Buyer Matching:** Suggests compatible buyers within the platform based on material and location.
- **External Buyer Discovery:** Uses SerpApi (Google Search) to dynamically find recycling buyers outside the platform based on material and location.
- **Semantic Search:** Employs AI to parse user search queries and perform semantic matching against the available listings in the database, allowing users to find relevant listings even with synonyms or related concepts.
- **AI Assistant Chatbot:** Integrated assistant powered by Hugging Face to help users understand the platform and guide them.

## 3. System Architecture
WasteX follows a client-server architecture:
- **Frontend:** A React Single Page Application (SPA) built with Vite and styled using Tailwind CSS.
- **Backend:** A FastAPI-based RESTful service that handles business logic, AI integrations, and database operations.
- **Database:** MongoDB is used for persistent storage of users, listings, and messages.

*Reference: System Design diagram can be found at `docs/design.png`.*

## 4. Technology Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Backend:** FastAPI, Python, Pydantic, Uvicorn
- **Database:** MongoDB (using PyMongo)
- **AI / External APIs:** 
  - Hugging Face Inference API (for Chat, Semantic Search, and Listing Parser)
  - SerpApi (for External Discovery)
  - Firebase (for Authentication - indicated by `firebase_uid` in User model)

## 5. Data Models
The core entities represented in the MongoDB database are:

- **User**
  - `company_name`, `email`, `role`, `industry`, `location`, `firebase_uid`, `created_at`
- **WasteListing**
  - `producer_id`, `title`, `material`, `category`, `form`, `condition`, `quantity`, `quantity_unit`, `frequency`, `location`, `expected_price`, `created_at`
- **ContactMessage**
  - `listing_id`, `buyer_name`, `message`, `created_at`

## 6. API Endpoints

### Authentication & Users
- `POST /auth/google`: Handles Google Login/Registration, updating Firebase UID if necessary.
- `POST /users`: Creates a new user manually.
- `GET /nearby-buyers/{user_id}`: Retrieves nearby consumer users based on a given user's location.

### Listings
- `POST /listings`: Creates a new waste listing and auto-categorizes the material.
- `GET /listings`: Retrieves all available listings.
- `GET /match/{listing_id}`: Returns internal platform matches and external leads (via SerpApi) for a specific listing, along with market intelligence pricing.

### AI Features
- `POST /chat`: Interacts with the AI Assistant using Hugging Face's LLM.
- `POST /parse-listing`: Conversational endpoint that parses a user's natural language input to extract required listing fields and prompts for missing information.
- `POST /search/semantic`: Performs an AI-driven semantic search over listings based on user query.

### Communication
- `POST /messages`: Sends a contact message from a buyer regarding a specific listing.

## 7. External Integrations

### SerpApi
WasteX dynamically generates search queries (e.g., `"{material} recycling buyers near {location}"`) to find external buyers when platform matches are insufficient. The backend parses organic results and extracts business titles, links, and snippets.

### Hugging Face Inference API
Utilizes the `meta-llama/Llama-3.2-1B-Instruct` model for:
1. **Chatbot Support:** Guiding users about WasteX.
2. **Semantic Search:** Identifying semantically relevant listings from a natural text search.
3. **Smart Parsing:** Converting natural conversational prompts into structured `WasteListing` properties.

## 8. Setup and Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB instance (running locally on port `27017` or via MongoDB Atlas)
- SerpApi Key
- Hugging Face Token (with Inference Providers permission)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure `.env` variables:
   ```env
   FRONTEND_URL=http://localhost:5173
   SERPAPI_KEY=your_serpapi_key_here
   HF_TOKEN=your_huggingface_token_here
   HF_MODEL=meta-llama/Llama-3.2-1B-Instruct
   ```
6. Start the FastAPI server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Configure frontend `.env` (if applicable) for Firebase and Backend URL.
4. Run the development server: `npm run dev`
5. Open your browser to `http://localhost:5173`.

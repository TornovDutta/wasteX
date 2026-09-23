import os
from fastapi import APIRouter, HTTPException
from models import WasteListing, User, BuyerRequirement, ChatRequest, PromptParseRequest, SearchRequest, ContactMessage
from database import database
from bson import ObjectId
from serpapi import GoogleSearch

router = APIRouter()

def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@router.post("/auth/google")
def google_login(user: User):
    existing_user = database.users.find_one({"email": user.email})
    if existing_user:
        # Update user with any new info if needed, e.g., firebase_uid
        if user.firebase_uid and not existing_user.get("firebase_uid"):
            database.users.update_one({"_id": existing_user["_id"]}, {"$set": {"firebase_uid": user.firebase_uid}})
        return {"id": str(existing_user["_id"]), "message": "Login successful"}
    else:
        # Create new user
        result = database.users.insert_one(user.dict())
        return {"id": str(result.inserted_id), "message": "User registered successfully"}

@router.post("/users")
def create_user(user: User):
    result = database.users.insert_one(user.dict())
    return {"id": str(result.inserted_id)}

@router.post("/listings")
def create_listing(listing: WasteListing):
    listing_dict = listing.dict()
    material = listing_dict.get("material", "").lower()
    if "cotton" in material or "fabric" in material:
        listing_dict["category"] = "Textile"
    elif "plastic" in material:
        listing_dict["category"] = "Plastic"
    else:
        listing_dict["category"] = "Other"

    result = database.listings.insert_one(listing_dict)
    return {"id": str(result.inserted_id), "message": "Listing created"}

@router.get("/listings")
def get_listings():
    cursor = database.listings.find()
    return [serialize_doc(doc) for doc in cursor]

@router.get("/match/{listing_id}")
def match_buyers(listing_id: str):
    listing = database.listings.find_one({"_id": ObjectId(listing_id)})
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    material = listing.get("material", "")
    location = listing.get("location", "")
    
    internal_buyers = []
    cursor = database.users.find({"role": "consumer"})
    for consumer in cursor:
        internal_buyers.append({
            "name": consumer.get("company_name"),
            "distance": "120 km",
            "compatibility": "85%",
            "internal": True
        })
    if not internal_buyers:
        internal_buyers = [
            {"name": "GreenThreads Recyclers", "distance": "80 km", "compatibility": "92%", "internal": True},
            {"name": "EcoFibre Processing", "distance": "150 km", "compatibility": "88%", "internal": True}
        ]

    external_buyers = []
    api_key = os.getenv("SERPAPI_KEY")
    if api_key and api_key != "YOUR_SERPAPI_KEY_HERE":
        try:
            search = GoogleSearch({
                "q": f"{material} recycling buyers near {location}",
                "location": "India",
                "api_key": api_key
            })
            results = search.get_dict()
            organic = results.get("organic_results", [])
            for res in organic[:3]:
                external_buyers.append({
                    "name": res.get("title"),
                    "link": res.get("link"),
                    "snippet": res.get("snippet"),
                    "internal": False
                })
        except Exception as e:
            print("SerpApi Error:", e)
    else:
        # Mock external buyers for demo if no key
        external_buyers = [
            {"name": "Global Textile Recovery", "link": "#", "snippet": "We buy all types of cotton and polyester waste.", "internal": False},
            {"name": "National Scrap Marketplace", "link": "#", "snippet": "Leading buyers of industrial scrap.", "internal": False}
        ]

    market_price = "₹6-₹12/kg"

    return {
        "listing": serialize_doc(listing),
        "internal_matches": internal_buyers,
        "external_leads": external_buyers,
        "market_intelligence": {
            "estimated_price": market_price
        }
    }

@router.post("/chat")
def chat_with_bot(request: ChatRequest):
    from huggingface_hub import InferenceClient
    
    api_key = os.getenv("HF_TOKEN")
    model = os.getenv("HF_MODEL", "meta-llama/Llama-3.2-1B-Instruct")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Hugging Face token not configured in backend.")
    
    try:
        client = InferenceClient(api_key=api_key)
        
        system_prompt = "You are a helpful AI assistant for WasteX. WasteX is a platform dedicated to reducing waste, promoting recycling, and connecting people with waste management resources. Your purpose is to explain the work, purpose, and objectives of WasteX clearly and concisely to users. Keep your answers brief and helpful."
        
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in request.messages:
            if msg.role == 'assistant' and msg.content == '': continue
            formatted_messages.append({"role": msg.role, "content": msg.content})
            
        res = client.chat_completion(
            messages=formatted_messages, 
            model=model,
            max_tokens=250,
            temperature=0.7
        )
        
        bot_reply = "Sorry, I couldn't generate a response."
        if res and res.choices and len(res.choices) > 0:
            bot_reply = res.choices[0].message.content.strip()
            
        return {"reply": bot_reply}
        
    except Exception as e:
        error_msg = str(e)
        if "not supported by any provider" in error_msg:
            raise HTTPException(status_code=403, detail="Your Hugging Face token lacks the 'Make calls to Inference Providers' permission. Please create a new Fine-grained token in your HF settings and check that box.")
        elif "Unauthorized" in error_msg or "Invalid" in error_msg:
            raise HTTPException(status_code=401, detail="Unauthorized: Invalid Hugging Face token in backend.")
        else:
            raise HTTPException(status_code=500, detail=f"Hugging Face API error: {error_msg}")

@router.post("/parse-listing")
def parse_listing_prompt(request: PromptParseRequest):
    from huggingface_hub import InferenceClient
    import json
    
    api_key = os.getenv("HF_TOKEN")
    model = os.getenv("HF_MODEL", "meta-llama/Llama-3.2-1B-Instruct")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="HF token not configured.")
        
    system_prompt = f"""
    You are a conversational AI assistant helping a user list industrial waste on the WasteX platform.
    The required fields for a listing are:
    - title (string: Name of the waste)
    - material (string: e.g. Cotton, Plastic)
    - quantity (number)
    - form (string: e.g. liquid, solid, scraps, powder)
    - condition (string: e.g. dry, mixed, pure)
    - location (string: City or Region)
    - expected_price (number: Expected price per kg in INR)
    - frequency (string: strictly one of "monthly", "weekly", or "one-time")
    
    Current extracted data:
    {json.dumps(request.current_data)}
    
    1. Update the Current extracted data with any new information found in the user's prompt.
    2. Check which required fields are still missing or null.
    3. If any required fields are missing, generate a friendly, natural question asking the user for ONE or TWO of the missing fields (don't ask for all at once). e.g., "Where is this material located?" or "What condition is it in?"
    4. If all required fields are present, set the message to "All set! I'm creating your listing now."
    
    Return ONLY a JSON object with this exact structure (no markdown, no extra text):
    {{
      "parsed_data": {{
        "title": "...",
        "material": "...",
        "quantity": 500,
        "form": "...",
        "condition": "...",
        "location": "...",
        "expected_price": 10,
        "frequency": "..."
      }},
      "message": "Your conversational response here"
    }}
    """
    
    client = InferenceClient(api_key=api_key)
    try:
        res = client.chat_completion(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.prompt}
            ],
            model=model,
            max_tokens=600,
            temperature=0.3
        )
        content = res.choices[0].message.content.strip()
        
        # Clean up markdown block if present
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        try:
            parsed_json = json.loads(content)
        except json.JSONDecodeError:
            # Fallback if the model didn't return valid JSON
            parsed_json = {
                "parsed_data": {},
                "message": "I caught some of that, but could you clarify what else you need to add?"
            }
        
        return parsed_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search/semantic")
def semantic_search(request: SearchRequest):
    cursor = database.listings.find()
    listings = [serialize_doc(doc) for doc in cursor]
    
    if not listings:
        return []
        
    from huggingface_hub import InferenceClient
    import json
    
    api_key = os.getenv("HF_TOKEN")
    model = os.getenv("HF_MODEL", "meta-llama/Llama-3.2-1B-Instruct")
    
    if not api_key or not request.query.strip():
        return listings
        
    listings_text = json.dumps([{"id": l["_id"], "title": l.get("title"), "material": l.get("material"), "condition": l.get("condition"), "form": l.get("form")} for l in listings])
    
    system_prompt = f"""
    You are a semantic search engine. The user is searching for: "{request.query}".
    Here is a list of available industrial waste listings:
    {listings_text}
    
    Which of these listings are semantically relevant to the user's query? 
    Consider synonyms, related materials, and use-cases (e.g., if user searches for "clothing", "cotton scraps" is highly relevant).
    
    Return ONLY a JSON list of the relevant listing IDs (strings). No other text.
    Example output:
    ["64a1f...", "64a2c..."]
    """
    
    client = InferenceClient(api_key=api_key)
    try:
        res = client.chat_completion(
            messages=[{"role": "system", "content": system_prompt}],
            model=model,
            max_tokens=200,
            temperature=0.1
        )
        content = res.choices[0].message.content.strip()
        
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        relevant_ids = json.loads(content)
        filtered_listings = [l for l in listings if l["_id"] in relevant_ids]
        return filtered_listings
    except Exception as e:
        print("Semantic search error:", e)
        # Fallback to fuzzy text search
        query_lower = request.query.lower()
        return [l for l in listings if query_lower in l.get('title', '').lower() or query_lower in l.get('material', '').lower()]

@router.post("/messages")
def send_message(message: ContactMessage):
    result = database.messages.insert_one(message.dict())
    return {"id": str(result.inserted_id), "message": "Message sent successfully"}

@router.get("/nearby-buyers/{user_id}")
def get_nearby_buyers(user_id: str):
    from bson.errors import InvalidId
    try:
        user = database.users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Mocking distance/compatibility for nearby buyers based on string location or just fetching consumers
    location = user.get("location", "Unknown")
    buyers = []
    
    cursor = database.users.find({"role": "consumer"})
    for consumer in cursor:
        if str(consumer["_id"]) == user_id:
            continue # skip self
            
        buyers.append({
            "id": str(consumer["_id"]),
            "name": consumer.get("company_name", "Unknown Buyer"),
            "location": consumer.get("location", "Unknown Location"),
            "distance": "12 km", # mocked
            "compatibility": "85%", # mocked
        })
        
    if not buyers:
        # Provide some dummy data if no actual consumers exist in DB to make the feature visible
        buyers = [
            {"id": "dummy1", "name": "GreenThreads Recyclers", "location": location, "distance": "8 km", "compatibility": "92%"},
            {"id": "dummy2", "name": "EcoFibre Processing", "location": "Nearby City", "distance": "15 km", "compatibility": "88%"}
        ]
        
    return {"user_location": location, "buyers": buyers}


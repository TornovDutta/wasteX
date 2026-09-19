from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    company_name: str
    email: str
    role: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    firebase_uid: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WasteListing(BaseModel):
    producer_id: str
    title: str
    material: str
    category: str
    form: str
    condition: str
    quantity: float
    quantity_unit: str = "kg"
    frequency: str = "monthly"
    location: str
    expected_price: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BuyerRequirement(BaseModel):
    consumer_id: str
    material_required: str
    quantity_required: float
    location: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class PromptParseRequest(BaseModel):
    prompt: str
    current_data: dict = {}

class SearchRequest(BaseModel):
    query: str

class ContactMessage(BaseModel):
    listing_id: str
    buyer_name: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

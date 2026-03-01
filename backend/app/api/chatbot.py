from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List
import logging
import time
from datetime import datetime

from app.api.auth import get_current_user
from app.models.user import UserResponse
from app.core.database import get_collection
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    text: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    processing_time: float
    conversation_id: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Chat with the AI chatbot.
    Provides conversational responses with better context awareness.
    """
    try:
        start_time = time.time()
        
        # Validate input
        if not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )
        
        if len(request.message) > 5000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message too long. Maximum 5,000 characters allowed."
            )
        
        # Build conversation context from history
        conversation_context = ""
        if request.conversation_history:
            for msg in request.conversation_history[-5:]:  # Keep last 5 messages for context
                conversation_context += f"{msg.role.capitalize()}: {msg.text}\n"
        
        # Create the prompt for the chatbot
        system_prompt = request.system_prompt or """You are a helpful and knowledgeable AI assistant. 
You provide clear, concise, and informative responses. 
You maintain a conversational tone while being professional and accurate.
You ask clarifying questions when needed to better help the user.
You provide practical examples and explanations."""
        
        prompt = f"""{system_prompt}

Previous conversation:
{conversation_context}

User: {request.message}
Assistant:"""
        
        try:
            # Call AI service for chat response
            if ai_service.use_inference_api:
                response_text = await ai_service._call_inference_api(prompt, max_tokens=512)
            else:
                response_text = await ai_service._generate_with_local_model(
                    prompt, max_length=512, min_length=50
                )
            
            # Clean up the response
            response_text = response_text.strip()
            
            # Remove any potential "Assistant:" prefix if it appears in the response
            if response_text.startswith("Assistant:"):
                response_text = response_text[10:].strip()
            
            # Save to history
            try:
                history_doc = {
                    "user_id": current_user.firebase_uid,
                    "feature_type": "chatbot",
                    "input_data": {
                        "message": request.message,
                        "history_length": len(request.conversation_history)
                    },
                    "output_data": {
                        "response": response_text
                    },
                    "created_at": datetime.utcnow(),
                    "processing_time_ms": (time.time() - start_time) * 1000
                }
                
                history_collection = get_collection("history")
                result = await history_collection.insert_one(history_doc)
                
            except Exception as e:
                logger.warning(f"Failed to save chat to history: {e}")
            
            processing_time = time.time() - start_time
            
            return ChatResponse(
                response=response_text,
                processing_time=processing_time,
                conversation_id=None
            )
            
        except Exception as e:
            logger.error(f"AI service error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate response: {str(e)}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred"
        )

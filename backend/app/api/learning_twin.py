from datetime import datetime
import logging
import time
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.api.auth import get_current_user
from app.core.database import get_collection
from app.models.user import UserResponse
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter()


class LearningTwinRequest(BaseModel):
    topic: str
    learner_explanation: str
    quiz_mistakes: Optional[List[str]] = None
    doubts: Optional[List[str]] = None
    learning_style: Optional[str] = "general learner"


class CurrentUnderstanding(BaseModel):
    summary: str
    confidence_score: int
    evidence: List[str]


class LikelyMisconception(BaseModel):
    misconception: str
    why_it_matters: str
    correction: str


class PredictedFailurePoint(BaseModel):
    scenario: str
    twin_response: str
    better_response: str


class CorrectionStep(BaseModel):
    step: str
    purpose: str
    practice_prompt: str


class LearningTwinResponse(BaseModel):
    twin_name: str
    topic: str
    current_understanding: CurrentUnderstanding
    likely_misconceptions: List[LikelyMisconception]
    predicted_failure_points: List[PredictedFailurePoint]
    personalized_correction_path: List[CorrectionStep]
    teach_back_prompt: str
    processing_time: float


@router.post("/build", response_model=LearningTwinResponse)
async def build_learning_twin(
    request: LearningTwinRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """Build a first-pass model of the learner's current understanding."""
    try:
        start_time = time.time()

        if not request.topic.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Topic cannot be empty",
            )

        if not request.learner_explanation.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Your explanation cannot be empty",
            )

        if len(request.topic) > 500:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Topic is too long. Maximum 500 characters allowed.",
            )

        if len(request.learner_explanation) > 6000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Explanation is too long. Maximum 6,000 characters allowed.",
            )

        context = {
            "topic": request.topic,
            "learner_explanation": request.learner_explanation,
            "quiz_mistakes": request.quiz_mistakes or [],
            "doubts": request.doubts or [],
            "learning_style": request.learning_style or "general learner",
        }

        result = await ai_service.build_learning_twin(context)

        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Learning twin build failed: {result.get('error', 'Unknown error')}",
            )

        processing_time = time.time() - start_time
        twin_data = result["data"]

        response = LearningTwinResponse(
            twin_name=twin_data.get("twin_name", "Learning Twin"),
            topic=twin_data.get("topic", request.topic),
            current_understanding=CurrentUnderstanding(**twin_data.get("current_understanding", {})),
            likely_misconceptions=[
                LikelyMisconception(**item)
                for item in twin_data.get("likely_misconceptions", [])
            ],
            predicted_failure_points=[
                PredictedFailurePoint(**item)
                for item in twin_data.get("predicted_failure_points", [])
            ],
            personalized_correction_path=[
                CorrectionStep(**item)
                for item in twin_data.get("personalized_correction_path", [])
            ],
            teach_back_prompt=twin_data.get("teach_back_prompt", ""),
            processing_time=processing_time,
        )

        try:
            history_collection = get_collection("history")
            await history_collection.insert_one({
                "user_id": current_user.firebase_uid,
                "feature_type": "learning_twin",
                "input_data": {
                    "topic": request.topic,
                    "learner_explanation": request.learner_explanation[:1000],
                    "quiz_mistakes": request.quiz_mistakes or [],
                    "doubts": request.doubts or [],
                    "learning_style": request.learning_style or "general learner",
                },
                "output_data": {
                    "twin_name": response.twin_name,
                    "confidence_score": response.current_understanding.confidence_score,
                    "misconceptions_count": len(response.likely_misconceptions),
                    "failure_points_count": len(response.predicted_failure_points),
                    "correction_steps_count": len(response.personalized_correction_path),
                },
                "processing_time": processing_time,
                "status": "completed",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            })
        except Exception as history_error:
            logger.warning(f"Failed to save learning twin history: {history_error}")

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error building learning twin: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to build learning twin",
        )

import logging
import json
import asyncio
from typing import Dict, Any, List
from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIService:
    """
    AI Service using Hugging Face Inference API and transformers.
    Supports both cloud-based Inference API and local model loading.
    """

    def __init__(self):
        """Initialize the AI Service with Hugging Face models."""
        try:
            logger.debug("Initializing Hugging Face AI Service...")

            self.model = None
            self.pipeline = None
            self.use_inference_api = False

            # Check if we have HF token for Inference API
            if settings.hf_api_key:
                try:
                    from huggingface_hub import HfApi
                    self.hf_api_key = settings.hf_api_key
                    self.use_inference_api = True
                    self.model_name = settings.hf_model_name
                    
                    # Test API connectivity
                    api = HfApi(token=self.hf_api_key)
                    logger.info(f"Hugging Face Inference API initialized with model: {self.model_name}")
                except Exception as e:
                    logger.warning(f"Failed to initialize Inference API: {e}. Falling back to local model.")
                    self.use_inference_api = False
            
            # If not using Inference API, try loading local model
            if not self.use_inference_api:
                try:
                    from transformers import pipeline
                    self.model_name = settings.hf_model_name
                    logger.debug(f"Loading local Hugging Face model: {self.model_name}")
                    
                    # Try summarization pipeline first for BART models, then fall back to text-generation
                    pipeline_task = "summarization" if "bart" in self.model_name.lower() else "text-generation"
                    
                    try:
                        self.pipeline = pipeline(
                            pipeline_task,
                            model=self.model_name,
                            device=-1  # CPU; use device=0 for GPU
                        )
                    except Exception as task_error:
                        # If the specified task fails, try the alternative
                        alt_task = "text-generation" if pipeline_task == "summarization" else "summarization"
                        logger.debug(f"Task '{pipeline_task}' failed, trying '{alt_task}'...")
                        self.pipeline = pipeline(
                            alt_task,
                            model=self.model_name,
                            device=-1
                        )
                    
                    logger.info(f"Local Hugging Face model loaded: {self.model_name}")
                    self.model = self.pipeline.model
                except Exception as e:
                    logger.error(f"Failed to load local model: {e}")
                    logger.warning("AI features will be unavailable.")
                    self.model = None
                    self.pipeline = None

        except Exception as e:
            logger.error(f"Error initializing AI Service: {str(e)}")
            self.model = None

    async def _call_inference_api(self, prompt: str, max_tokens: int = 1024) -> str:
        """
        Call Hugging Face Inference API.
        Automatically selects correct endpoint for:
        - Chat/Instruction models (Mistral, Llama, etc.)
        - Base text generation models
        """

        try:
            from huggingface_hub import InferenceClient

            client = InferenceClient(api_key=self.hf_api_key)

            def api_call():
                model_lower = self.model_name.lower()

                # Detect instruction/chat models
                is_chat_model = any(keyword in model_lower for keyword in [
                    "mistral",
                    "mixtral",
                    "instruct",
                    "chat",
                    "llama",
                    "gemma"
                ])

                if is_chat_model:
                    logger.debug(f"Using chat completion API for {self.model_name}")

                    response = client.chat.completions.create(
                        model=self.model_name,
                        messages=[
                            {"role": "user", "content": prompt}
                        ],
                        max_tokens=max_tokens,
                        temperature=0.7
                    )

                    return response.choices[0].message.content

                else:
                    logger.debug(f"Using text generation API for {self.model_name}")

                    response = client.text_generation(
                        prompt=prompt,
                        max_new_tokens=max_tokens,
                        temperature=0.7,
                    )

                    return response

            result = await asyncio.to_thread(api_call)
            return result

        except Exception as e:
            logger.warning(f"Inference API failed for model {self.model_name}: {e}")
            logger.debug("Falling back to local model loading...")

            # Fallback to local model
            if not self.pipeline:
                try:
                    from transformers import pipeline

                    self.model_name = settings.hf_model_name
                    pipeline_task = (
                        "summarization"
                        if "bart" in self.model_name.lower()
                        else "text-generation"
                    )

                    try:
                        self.pipeline = pipeline(
                            pipeline_task,
                            model=self.model_name,
                            device=-1
                        )
                    except Exception:
                        alt_task = (
                            "text-generation"
                            if pipeline_task == "summarization"
                            else "summarization"
                        )
                        self.pipeline = pipeline(
                            alt_task,
                            model=self.model_name,
                            device=-1
                        )

                    self.model = self.pipeline.model
                    self.use_inference_api = False
                    logger.info(f"Switched to local model: {self.model_name}")

                except Exception as local_error:
                    logger.error(f"Failed to load local model as fallback: {local_error}")
                    raise

            return await self._generate_with_local_model(
                prompt,
                max_length=150,
                min_length=50
            )

    async def _generate_with_local_model(
        self, prompt: str, max_length: int = 150, min_length: int = 50
    ) -> str:
        """
        Generate text using local transformers model.

        Args:
            prompt: The input text/prompt
            max_length: Maximum length of generated text
            min_length: Minimum length of generated text

        Returns:
            Generated text
        """
        try:
            if not self.pipeline:
                raise ValueError("Pipeline not initialized")

            # Check the pipeline task type
            pipeline_task = self.pipeline.task
            
            if pipeline_task == "summarization":
                # Use summarization pipeline
                def summarize():
                    result = self.pipeline(
                        prompt,
                        max_length=max_length,
                        min_length=min_length,
                        do_sample=False
                    )
                    return result[0]['summary_text'] if result else ""

                result = await asyncio.to_thread(summarize)
                return result

            elif pipeline_task == "text-generation":
                # Use text generation pipeline
                def generate():
                    result = self.pipeline(
                        prompt,
                        max_length=max_length,
                        min_length=min_length,
                        do_sample=False,
                        temperature=0.7
                    )
                    # Handle both single and batch results
                    if isinstance(result, list) and len(result) > 0:
                        return result[0].get('generated_text', '')
                    return ""

                result = await asyncio.to_thread(generate)
                return result
            
            else:
                # Fallback for other task types
                logger.warning(f"Unsupported pipeline task: {pipeline_task}. Attempting generic generation...")
                def fallback_generate():
                    result = self.pipeline(prompt, max_length=max_length)
                    if isinstance(result, list) and len(result) > 0:
                        return str(result[0])
                    return str(result)
                
                result = await asyncio.to_thread(fallback_generate)
                return result

        except Exception as e:
            logger.error(f"Error in local model generation: {e}")
            raise



    async def summarize_notes(
        self,
        text: str,
        max_length: int = 500,
        summarization_type: str = 'abstractive',
        summary_mode: str = 'narrative'
    ) -> Dict[str, Any]:
        """
        Summarize text using AI with specified summarization type and style.

        Args:
            text: The input text to summarize
            max_length: Maximum length of the summary in words
            summarization_type: 'abstractive' or 'extractive'
            summary_mode: 'narrative', 'beginner', 'technical', or 'bullet'
        """
        try:
            if not self.model and not self.use_inference_api:
                return {
                    "success": False,
                    "error": "AI model not available. Please check the backend configuration."
                }

            # Define style instructions for each mode
            style_instructions = {
                'narrative': "Write the summary in a flowing, story-like manner.",
                'beginner': "Use simple, clear language suitable for beginners.",
                'technical': "Use precise technical language and terminology.",
                'bullet': "Present as a structured list of key points."
            }.get(summary_mode, "Write in a clear, concise manner.")

            method_instructions = {
                'extractive': "Select and combine important sentences from the original text.",
                'abstractive': "Generate a new summary capturing the meaning in your own words."
            }.get(summarization_type, "Summarize the text appropriately.")

            format_instructions = """{
                "summary": "the summarized text",
                "key_points": ["point 1", "point 2", "point 3"],
                "word_count": number_of_words
            }"""

            prompt = f"""Summarize this text according to these specifications:

Style: {style_instructions}
Method: {method_instructions}
Maximum Length: {max_length} words

Text to summarize:
{text}

Format your response as JSON:
{format_instructions}

Respond only with the JSON, no additional text."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=1024)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=int(max_length * 1.5), min_length=int(max_length * 0.5)
                )

            response_text = response_text.strip()

            # Handle possible formatting issues in the response
            try:
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields
                if not all(key in result for key in ["summary", "key_points"]):
                    raise ValueError("Missing required fields in AI response")

                return {
                    "success": True,
                    "data": result
                }
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")
            except Exception as e:
                logger.error(f"Error processing AI response: {response_text}")
                raise ValueError(f"Error processing AI response: {str(e)}")
        except Exception as e:
            logger.error(f"Error summarizing notes: {e}")
            return {
                "success": False,
                "error": str(e)
            }



    async def generate_quiz(self, text: str, num_questions: int = 5) -> Dict[str, Any]:
        """Generate quiz questions from text using AI."""
        try:
            if not self.model and not self.use_inference_api:
                return {
                    "success": False,
                    "error": "AI model not available. Please check the backend configuration."
                }

            if not text or not text.strip():
                raise ValueError("Input text cannot be empty")

            prompt = f"""Based on the following text, generate {num_questions} multiple choice questions.
For each question:
1. Generate a clear, specific question
2. Create 4 distinct answer options labeled A, B, C, D
3. Mark one option as correct
4. Provide a brief explanation

Text to generate questions from:
{text}

Format your response as JSON:
{{
    "questions": [
        {{
            "question": "What is...?",
            "options": [
                "A) First option",
                "B) Second option", 
                "C) Third option",
                "D) Fourth option"
            ],
            "correct_answer": "A) First option",
            "explanation": "This is correct because..."
        }}
    ],
    "total_questions": {num_questions}
}}

Requirements:
1. Each option MUST start with its letter (A, B, C, or D)
2. Generate exactly {num_questions} questions
3. Respond only with JSON, no markdown."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=2048)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=2000, min_length=500
                )

            response_text = response_text.strip()

            # Handle possible markdown code blocks in response
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]

            response_text = response_text.strip()

            try:
                result = json.loads(response_text)

                # Validate required fields and structure
                if "questions" not in result or not isinstance(result["questions"], list):
                    raise ValueError("Invalid response format: missing or invalid 'questions' array")

                if "total_questions" not in result:
                    result["total_questions"] = len(result["questions"])

                # Validate each question
                for q in result["questions"]:
                    if not all(key in q for key in ["question", "options", "correct_answer", "explanation"]):
                        raise ValueError("Invalid question format: missing required fields")

                    # Validate options
                    if not isinstance(q["options"], list) or len(q["options"]) != 4:
                        raise ValueError("Invalid options format: must be an array of 4 items")

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in generate_quiz: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            return {
                "success": False,
                "error": str(e)
            }



    async def create_mindmap(self, topic: str, subtopics: List[str] = None) -> Dict[str, Any]:
        """Create a mind map structure for a topic using AI."""
        try:
            if not self.model and not self.use_inference_api:
                return {
                    "success": False,
                    "error": "AI model not available. Please check the backend configuration."
                }

            if not topic or not topic.strip():
                raise ValueError("Topic cannot be empty")

            base_prompt = """Create a comprehensive mind map structure. The response must be a valid JSON object.
Include 3-5 main branches, each with 2-4 subtopics.
Each subtopic should have 2-3 key details or facts.

Response format must be exactly:
{
    "topic": "main topic",
    "branches": [
        {
            "name": "main branch name",
            "subtopics": [
                {
                    "name": "subtopic name",
                    "details": ["detail 1", "detail 2"]
                }
            ]
        }
    ]
}

Do not use any markdown formatting in the response.
Respond only with the JSON object, no additional text."""

            if not subtopics:
                prompt = f"""{base_prompt}

Generate a mind map for this topic: "{topic}" """
            else:
                prompt = f"""{base_prompt}

Generate a mind map for the topic "{topic}" incorporating these subtopics: {', '.join(subtopics)} """

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=2048)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=2000, min_length=500
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields and structure
                if not isinstance(result, dict):
                    raise ValueError("Invalid response format: root must be an object")

                if "topic" not in result or not isinstance(result["topic"], str):
                    raise ValueError("Invalid response format: missing or invalid 'topic' field")

                if "branches" not in result or not isinstance(result["branches"], list):
                    raise ValueError("Invalid response format: missing or invalid 'branches' array")

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in create_mindmap: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error creating mind map: {e}")
            return {
                "success": False,
                "error": str(e)
            }



    async def simplify_topic(self, topic: str, complexity_level: str = "basic") -> Dict[str, Any]:
        """Simplify complex topics using ELI5 (Explain Like I'm 5) approach."""
        try:
            if not self.model and not self.use_inference_api:
                return {
                    "success": False,
                    "error": "AI model not available. Please check the backend configuration."
                }

            if not topic or not topic.strip():
                raise ValueError("Topic cannot be empty")

            complexity_prompts = {
                "basic": "like you're explaining to a 10-year-old, using very simple terms",
                "intermediate": "for a high school student, balancing simplicity with technical details",
                "advanced": "for a college student, with technical concepts"
            }

            prompt = f"""Explain this topic {complexity_prompts.get(complexity_level, complexity_prompts["basic"])}.
Break down complex concepts into simpler parts.
Use clear analogies and real-world examples.

Topic to explain: {topic}

Respond with only a JSON object in this format:
{{
    "original_topic": "{topic}",
    "simple_explanation": "A clear, simple explanation of the topic",
    "key_concepts": ["Key concept 1", "Key concept 2"],
    "examples": ["Example 1", "Example 2"],
    "analogies": ["Analogy 1", "Analogy 2"]
}}

Requirements:
1. No markdown formatting
2. Each array should have 2-4 items
3. Use language appropriate for the {complexity_level} level
4. Respond only with JSON."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=1024)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=1000, min_length=300
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields
                required_fields = ["original_topic", "simple_explanation", "key_concepts", "examples", "analogies"]
                for field in required_fields:
                    if field not in result:
                        raise ValueError(f"Missing required field: {field}")

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in simplify_topic: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error simplifying topic: {e}")
            return {
                "success": False,
                "error": str(e)
            }



    async def extract_key_points(self, text: str) -> Dict[str, Any]:
        """Extract key points and important information from text."""
        try:
            if not text or not text.strip():
                raise ValueError("Input text cannot be empty")

            prompt = f"""Extract the key points, important facts, and main ideas from the following text.
Organize them in a structured format.

Text:
{text}

Provide the key points in the following JSON format:
{{
    "key_points": ["point 1", "point 2", "point 3"],
    "important_facts": ["fact 1", "fact 2"],
    "main_ideas": ["idea 1", "idea 2"],
    "vocabulary": ["term 1: definition", "term 2: definition"]
}}

Respond only with the JSON, no additional text."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=1024)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=800, min_length=200
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields
                required_fields = ["key_points", "important_facts", "main_ideas", "vocabulary"]
                if not all(key in result for key in required_fields):
                    missing_fields = [key for key in required_fields if key not in result]
                    raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

                # Ensure all fields are lists
                for field in required_fields:
                    if not isinstance(result[field], list):
                        result[field] = [str(result[field])]

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in extract_key_points: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error extracting key points: {e}")
            return {
                "success": False,
                "error": str(e)
            }


    async def process_voice_to_notes(self, speech_text: str) -> Dict[str, Any]:
        """Process voice/speech text and convert to clean notes."""
        try:
            if not speech_text or not speech_text.strip():
                raise ValueError("Speech text cannot be empty")

            prompt = f"""Clean and process the following speech text, then create bullet-point notes from it.

Speech text:
{speech_text}

Provide the result in JSON format:
{{
    "cleaned_text": "The cleaned and corrected version of the speech text",
    "notes": [
        "First bullet point note",
        "Second bullet point note",
        "Third bullet point note"
    ]
}}

Requirements:
1. Clean up speech-to-text errors, filler words, and repetitions
2. Make text readable and grammatically correct
3. Create 3-5 concise bullet-point notes
4. Respond only with JSON, no markdown."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=1024)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=800, min_length=200
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields
                required_fields = ["cleaned_text", "notes"]
                for field in required_fields:
                    if field not in result:
                        raise ValueError(f"Missing required field: {field}")

                    if field == "cleaned_text":
                        if not isinstance(result[field], str) or not result[field].strip():
                            raise ValueError("cleaned_text must be a non-empty string")
                    elif field == "notes":
                        if not isinstance(result[field], list) or not result[field]:
                            raise ValueError("notes must be a non-empty array")

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse AI response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in process_voice_to_notes: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error processing voice to notes: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def detect_knowledge_gaps(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Detect knowledge gaps and missing prerequisites for a topic."""
        try:
            if not context or not context.get("topic"):
                raise ValueError("Topic cannot be empty")

            topic = context.get("topic", "")
            quiz_mistakes = context.get("quiz_mistakes", [])
            explanation_requests = context.get("explanation_requests", [])
            cognitive_profile = context.get("cognitive_profile", "general learner")

            mistakes_text = ", ".join(quiz_mistakes) if quiz_mistakes else "None reported"
            requests_text = ", ".join(explanation_requests) if explanation_requests else "None"

            KNOWLEDGE_GAP_RADAR_PROMPT = f"""You are a Knowledge Gap Detection Engine.

Given:
1. Topic the user is studying: {topic}
2. Their quiz mistakes: {mistakes_text}
3. Their explanation requests: {requests_text}
4. Their cognitive profile: {cognitive_profile}

Your job:
Identify missing prerequisite concepts that may block understanding.

Return STRICT JSON ONLY:

{{
  "studied_topic": "{topic}",
  "core_concepts_detected": ["concept1", "concept2", "concept3"],
  "missing_prerequisites": [
    {{
      "concept": "string",
      "why_missing": "short explanation",
      "importance_level": 1-5
    }}
  ],
  "recommended_micro_lessons": [
    {{
      "title": "string",
      "focus": "string",
      "estimated_time_minutes": 15
    }}
  ]
}}

Rules:
- Only include logically required prerequisites
- Rank importance_level based on dependency severity (5 = critical, 1 = nice to know)
- Be concise
- Output JSON ONLY, no markdown or additional text
- Ensure JSON is valid and well-formed"""

            if self.use_inference_api:
                response_text = await self._call_inference_api(KNOWLEDGE_GAP_RADAR_PROMPT, max_tokens=1536)
            else:
                response_text = await self._generate_with_local_model(
                    KNOWLEDGE_GAP_RADAR_PROMPT, max_length=1000, min_length=200
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                # Validate required fields
                required_fields = ["studied_topic", "core_concepts_detected", "missing_prerequisites", "recommended_micro_lessons"]
                for field in required_fields:
                    if field not in result:
                        raise ValueError(f"Missing required field: {field}")

                # Validate structure
                if not isinstance(result.get("core_concepts_detected"), list):
                    result["core_concepts_detected"] = []
                
                if not isinstance(result.get("missing_prerequisites"), list):
                    result["missing_prerequisites"] = []
                
                if not isinstance(result.get("recommended_micro_lessons"), list):
                    result["recommended_micro_lessons"] = []

                return {
                    "success": True,
                    "response": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse knowledge gap response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in detect_knowledge_gaps: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error detecting knowledge gaps: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def build_learning_twin(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Build a first-pass learner model from the user's own evidence."""
        try:
            if not context or not context.get("topic"):
                raise ValueError("Topic cannot be empty")

            topic = context.get("topic", "").strip()
            learner_explanation = context.get("learner_explanation", "").strip()
            quiz_mistakes = context.get("quiz_mistakes", [])
            doubts = context.get("doubts", [])
            learning_style = context.get("learning_style", "general learner")

            mistakes_text = "\n".join(f"- {item}" for item in quiz_mistakes) if quiz_mistakes else "- None provided"
            doubts_text = "\n".join(f"- {item}" for item in doubts) if doubts else "- None provided"
            explanation_text = learner_explanation or "No self-explanation provided."

            prompt = f"""You are MirrorMind, a Learning Twin builder.

Create a private learner model from the evidence below. Your job is not to teach the whole topic.
Your job is to infer how this student currently understands it, where that understanding may break, and what to do next.

Topic:
{topic}

Student's own explanation:
{explanation_text}

Quiz mistakes:
{mistakes_text}

Doubts or questions:
{doubts_text}

Preferred learning style:
{learning_style}

Return STRICT JSON ONLY in this exact shape:
{{
  "twin_name": "short name for this learner model",
  "topic": "{topic}",
  "current_understanding": {{
    "summary": "2-3 sentence summary of how the learner seems to understand the topic",
    "confidence_score": 0-100,
    "evidence": ["specific clue from input", "specific clue from input"]
  }},
  "likely_misconceptions": [
    {{
      "misconception": "what the learner may believe incorrectly",
      "why_it_matters": "why this blocks understanding",
      "correction": "the corrected idea in simple terms"
    }}
  ],
  "predicted_failure_points": [
    {{
      "scenario": "where the learner may fail or hesitate",
      "twin_response": "what the learner twin would likely say or do",
      "better_response": "what stronger understanding would look like"
    }}
  ],
  "personalized_correction_path": [
    {{
      "step": "short action title",
      "purpose": "what this fixes",
      "practice_prompt": "one concrete thing the learner should answer or try"
    }}
  ],
  "teach_back_prompt": "one prompt asking the learner to explain the topic again"
}}

Rules:
- Use only the evidence provided and careful inference.
- Be specific, concise, and non-judgmental.
- If evidence is thin, say so in the summary and lower the confidence_score.
- Return valid JSON only. No markdown."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=2048)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=1800, min_length=400
                )

            response_text = response_text.strip()

            try:
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                required_fields = [
                    "twin_name",
                    "topic",
                    "current_understanding",
                    "likely_misconceptions",
                    "predicted_failure_points",
                    "personalized_correction_path",
                    "teach_back_prompt",
                ]
                for field in required_fields:
                    if field not in result:
                        raise ValueError(f"Missing required field: {field}")

                return {
                    "success": True,
                    "data": result
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse learning twin response: {response_text}")
                raise ValueError(f"Invalid JSON format in AI response: {str(e)}")

        except ValueError as e:
            logger.error(f"Validation error in build_learning_twin: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error building learning twin: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def generate_learning_hints(self, topic: str) -> Dict[str, Any]:
        """Generate quick learning hints for a specific topic."""
        try:
            if not topic or not topic.strip():
                raise ValueError("Topic cannot be empty")

            prompt = f"""Generate 5-7 practical learning hints for someone studying: {topic}

Focus on:
- Common misconceptions to avoid
- Key strategies for understanding
- Related topics that will help
- Practice tips

Format as JSON:
{{
    "topic": "{topic}",
    "hints": [
        "Hint 1",
        "Hint 2",
        "Hint 3"
    ]
}}

Respond with JSON only, no markdown."""

            if self.use_inference_api:
                response_text = await self._call_inference_api(prompt, max_tokens=512)
            else:
                response_text = await self._generate_with_local_model(
                    prompt, max_length=400, min_length=100
                )

            response_text = response_text.strip()

            try:
                # Handle possible markdown code blocks in response
                if response_text.startswith('```json'):
                    response_text = response_text[7:-3]
                elif response_text.startswith('```'):
                    response_text = response_text[3:-3]

                response_text = response_text.strip()
                result = json.loads(response_text)

                if "hints" not in result:
                    result["hints"] = []

                if not isinstance(result["hints"], list):
                    result["hints"] = [str(result["hints"])]

                return {
                    "success": True,
                    "response": result.get("hints", [])
                }

            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse learning hints response: {response_text}")
                # Return hints as text if JSON parsing fails
                return {
                    "success": True,
                    "response": [response_text]
                }

        except ValueError as e:
            logger.error(f"Validation error in generate_learning_hints: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
        except Exception as e:
            logger.error(f"Error generating learning hints: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# Create a singleton instance
ai_service = AIService()

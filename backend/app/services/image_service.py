import os
import logging
from typing import Dict, Any, Optional
from app.core.config import settings
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

# Try to import pytesseract, but make it optional
try:
    import pytesseract
    from PIL import Image
    import io
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logger.warning("pytesseract not installed. OCR functionality will be disabled.")

class ImageService:
    def __init__(self):
        # Initialize with Hugging Face AI service
        self.ai_service = ai_service
        
        # Check Tesseract availability
        self.tesseract_available = False
        if TESSERACT_AVAILABLE:
            if os.name == 'nt':  # Windows
                # Try multiple common installation paths
                tesseract_paths = [
                    r"C:\Tesseract\tesseract.exe",
                    r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
                    os.environ.get('TESSERACT_PATH', '')
                ]
                
                for tesseract_path in tesseract_paths:
                    if os.path.exists(tesseract_path):
                        pytesseract.pytesseract.tesseract_cmd = tesseract_path
                        try:
                            pytesseract.get_tesseract_version()
                            self.tesseract_available = True
                            logger.info(f"Tesseract OCR is properly installed and configured at: {tesseract_path}")
                            break
                        except Exception as e:
                            logger.warning(f"Tesseract installation found at {tesseract_path} but not working: {e}")
                
                if not self.tesseract_available:
                    logger.warning("Tesseract executable not found in any standard location")
            else:
                try:
                    pytesseract.get_tesseract_version()
                    self.tesseract_available = True
                    logger.info("Tesseract OCR is properly installed and configured.")
                except Exception as e:
                    logger.warning(f"Error verifying Tesseract installation: {e}")
        
        if not self.tesseract_available:
            logger.warning("Tesseract OCR is not available. Text extraction from images will use alternative methods.")
    
    async def extract_text_from_image(self, image_data: bytes) -> str:
        """Extract text from image using OCR or alternative methods."""
        try:
            # Open and validate image
            try:
                image = Image.open(io.BytesIO(image_data))
                image.verify()  # Verify image integrity
                image = Image.open(io.BytesIO(image_data))  # Reopen after verify
            except Exception as e:
                raise ValueError(f"Invalid or corrupted image file: {str(e)}")
            
            # Preprocess image for better OCR
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            if self.tesseract_available:
                # Extract text using pytesseract with improved settings
                text = pytesseract.image_to_string(
                    image,
                    lang='eng',  # English language
                    config='--psm 3'  # Fully automatic page segmentation
                )
            else:
                # For demonstration, return a message when Tesseract is not available
                # In a production environment, you might want to implement alternative OCR methods
                text = "Image text extraction is currently unavailable. Please install Tesseract OCR for full functionality."
            
            # Clean up the extracted text
            text = text.strip()
            text = ' '.join(text.split())  # Normalize whitespace
            
            if not text:
                raise ValueError("No text could be extracted from the image. Please ensure the image contains clear, readable text.")
            
            logger.info(f"Successfully processed image with {len(text)} characters")
            return text
            
        except Exception as e:
            logger.error(f"Error extracting text from image: {e}")
            raise Exception(f"Failed to extract text from image: {str(e)}")
    

    async def summarize_text(self, text: str) -> Dict[str, Any]:
        """Summarize text using Hugging Face."""
        try:
            # Use the AI service's summarize_notes method
            result = await self.ai_service.summarize_notes(
                text=text,
                max_length=500,
                summarization_type='abstractive',
                summary_mode='narrative'
            )
            
            if not result["success"]:
                raise ValueError(result.get("error", "Failed to summarize"))
            
            data = result["data"]
            
            summary_data = {
                "full_summary": data.get("summary", ""),
                "main_summary": data.get("summary", "")[:500],
                "key_points": data.get("key_points", []),
                "important_details": data.get("key_points", [])
            }
            
            logger.info(f"Successfully generated summary with {len(summary_data['key_points'])} key points")
            return summary_data
            
        except Exception as e:
            logger.error(f"Error summarizing text: {e}")
            raise Exception(f"Failed to summarize text: {str(e)}")

    
    async def process_image(self, image_data: bytes, filename: str) -> Dict[str, Any]:
        """Process image: extract text and generate summary."""
        try:
            # Extract text from image
            extracted_text = await self.extract_text_from_image(image_data)
            
            # Generate summary
            summary_data = await self.summarize_text(extracted_text)
            
            return {
                "extracted_text": extracted_text,
                "summary": summary_data,
                "filename": filename,
                "word_count": len(extracted_text.split()),
                "character_count": len(extracted_text)
            }
            
        except Exception as e:
            logger.error(f"Error processing image: {e}")
            raise Exception(f"Failed to process image: {str(e)}")

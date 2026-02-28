import scholarly
from typing import List, Dict, Any
import logging
import json
from datetime import datetime
from app.core.config import settings
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)

class ResearchService:
    def __init__(self):
        try:
            logger.debug("Research Service initialized successfully")
            self.ai_service = ai_service
        except Exception as e:
            logger.error(f"Error initializing Research Service: {str(e)}")
            raise

    async def search_papers(self, topic: str, num_papers: int = 5) -> List[Dict[str, Any]]:
        """Search for research papers on Google Scholar."""
        try:
            # Set up scholarly configuration
            scholarly.use_proxy()
            scholarly.set_timeout(30)
            
            # Configure headers to avoid blocking
            scholarly.set_cookie({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            
            # Search with proper query formatting
            formatted_topic = topic.replace(" ", "+")
            search_query = scholarly.search_pubs(formatted_topic)
            
            # Collect search results
            search_results = []
            papers = []
            
            max_retries = 3
            retry_count = 0
            
            # Try to get required number of papers with retries
            while len(search_results) < num_papers and retry_count < max_retries:
                try:
                    for i in range(num_papers * 2):
                        try:
                            result = next(search_query)
                            if result and hasattr(result, 'bib'):
                                # Basic validation of the result
                                if result.bib.get('title') and result.bib.get('author'):
                                    search_results.append(result)
                                    if len(search_results) >= num_papers:
                                        break
                        except StopIteration:
                            break
                        except Exception as e:
                            logger.error(f"Error during search iteration {i}: {str(e)}")
                            continue
                    
                    if not search_results and retry_count < max_retries - 1:
                        retry_count += 1
                        logger.warning(f"Retrying search (attempt {retry_count + 1}/{max_retries})")
                        scholarly.set_timeout(30 * (retry_count + 1))  # Increase timeout for retries
                        search_query = scholarly.search_pubs(formatted_topic)  # Reset search
                    else:
                        break
                        
                except Exception as e:
                    logger.error(f"Error during retry {retry_count}: {str(e)}")
                    retry_count += 1
                    if retry_count >= max_retries:
                        break

            # Process each result with retry mechanism
            for result in search_results[:num_papers]:
                max_fill_retries = 2
                fill_retry_count = 0
                paper_processed = False
                
                while not paper_processed and fill_retry_count < max_fill_retries:
                    try:
                        # Basic paper data
                        paper_data = {
                            "title": str(result.bib.get('title', 'Title not available')),
                            "authors": result.bib.get('author', ['Author not available']),
                            "year": str(result.bib.get('year', 'Year not available')),
                            "citations": int(getattr(result, 'citedby', 0)),
                            "abstract": str(result.bib.get('abstract', 'Abstract not available')),
                            "url": str(result.bib.get('url', '')),
                            "venue": str(result.bib.get('venue', 'Venue not available')),
                            "pub_url": str(getattr(result, 'pub_url', ''))
                        }

                        # Try to fetch full publication details
                        try:
                            filled_result = scholarly.fill(result)
                            if filled_result and hasattr(filled_result, 'bib'):
                                # Update with detailed information
                                if filled_result.bib.get('abstract'):
                                    paper_data["abstract"] = str(filled_result.bib['abstract'])
                                if hasattr(filled_result, 'citedby'):
                                    paper_data["citations"] = int(filled_result.citedby)
                                if filled_result.bib.get('url'):
                                    paper_data["url"] = str(filled_result.bib['url'])
                                elif hasattr(filled_result, 'pub_url'):
                                    paper_data["url"] = str(filled_result.pub_url)
                        except Exception as e:
                            logger.warning(f"Could not fetch full details (attempt {fill_retry_count + 1}): {str(e)}")
                            fill_retry_count += 1
                            continue

                        # Clean and validate the data
                        paper_data = {k: v for k, v in paper_data.items() if v is not None}
                        
                        # Ensure we have at least a minimal abstract
                        if not paper_data['abstract'] or paper_data['abstract'] == 'Abstract not available':
                            paper_data['abstract'] = (
                                f"This paper titled '{paper_data['title']}' was published in "
                                f"{paper_data['year']} and has been cited {paper_data['citations']} times. "
                                f"It was authored by {', '.join(paper_data['authors'])}. "
                                "The full abstract is not available through the API."
                            )

                        papers.append(paper_data)
                        paper_processed = True
                        
                    except Exception as e:
                        logger.error(f"Error processing paper result (attempt {fill_retry_count + 1}): {str(e)}")
                        fill_retry_count += 1
                        if fill_retry_count >= max_fill_retries:
                            break
            
            return papers
        except Exception as e:
            logger.error(f"Error searching papers: {str(e)}")
            raise


    async def generate_summary(
        self,
        abstract: str,
        summarization_type: str,
        summary_mode: str,
        max_length: int = 500
    ) -> Dict[str, Any]:
        """Generate summary of research paper abstract using Hugging Face."""
        try:
            # Use the AI service's summarize_notes method
            result = await self.ai_service.summarize_notes(
                text=abstract,
                max_length=max_length,
                summarization_type=summarization_type,
                summary_mode=summary_mode
            )
            
            if not result["success"]:
                raise ValueError(result.get("error", "Failed to generate summary"))
            
            # Transform the response to match research service format
            data = result["data"]
            return {
                "summary": data.get("summary", ""),
                "key_findings": data.get("key_points", []),
                "methodology": "Extracted from abstract using AI analysis",
                "implications": "See full abstract for implications"
            }

        except Exception as e:
            logger.error(f"Error generating summary: {str(e)}")
            raise



    async def generate_comparative_analysis(
        self,
        papers: List[Dict[str, Any]],
        summarization_type: str,
        summary_mode: str
    ) -> Dict[str, Any]:
        """Generate comparative analysis of multiple papers using Hugging Face."""
        try:
            # Prepare paper summaries for comparison
            papers_text = "\n\n".join([
                f"Paper {i+1}:\nTitle: {p['title']}\nYear: {p['year']}\nAbstract: {p['abstract']}"
                for i, p in enumerate(papers)
            ])

            # Use AI service to extract key points for comparative analysis
            result = await self.ai_service.extract_key_points(papers_text)
            
            if not result["success"]:
                raise ValueError(result.get("error", "Failed to generate analysis"))
            
            data = result["data"]
            
            return {
                "common_themes": data.get("main_ideas", [])[:2],
                "key_differences": data.get("key_points", [])[:2],
                "research_trends": f"Analysis of {len(papers)} research papers",
                "methodology_comparison": "Compared using AI analysis of abstracts",
                "timeline_evolution": f"Papers from {papers[0].get('year', 'unknown')} onwards",
                "gaps_and_opportunities": data.get("vocabulary", [])[:2]
            }

        except Exception as e:
            logger.error(f"Error generating comparative analysis: {str(e)}")
            raise


    def generate_citations(self, paper: Dict[str, Any]) -> Dict[str, str]:
        """Generate APA and IEEE citations for a paper."""
        try:
            # Format authors
            authors = paper.get('authors', [])
            if isinstance(authors, str):
                authors = [authors]

            # APA format
            if len(authors) == 1:
                apa_authors = authors[0]
            elif len(authors) == 2:
                apa_authors = f"{authors[0]} & {authors[1]}"
            else:
                apa_authors = f"{authors[0]} et al."

            apa_citation = f"{apa_authors} ({paper.get('year')}). {paper.get('title')}. {paper.get('venue')}."

            # IEEE format
            if len(authors) == 1:
                ieee_authors = authors[0]
            else:
                ieee_authors = f"{authors[0]} et al."

            ieee_citation = f"{ieee_authors}, \"{paper.get('title')},\" {paper.get('venue')}, {paper.get('year')}."

            return {
                "apa": apa_citation,
                "ieee": ieee_citation
            }

        except Exception as e:
            logger.error(f"Error generating citations: {str(e)}")
            raise

research_service = ResearchService()

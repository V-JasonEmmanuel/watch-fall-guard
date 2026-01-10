import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACE_API_KEY")

# Initialize Client
# If no token is provided, it might use the public API (rate limited)
client = InferenceClient(token=HF_TOKEN)

def summarize_medical_report(text: str) -> str:
    """
    Uses facebook/bart-large-cnn to summarize medical text.
    """
    if not HF_TOKEN:
        return "[SIMULATION] AI Key missing. Summary: Patient is healthy but needs rest."
        
    try:
        # Using a dedicated summarization model
        summary = client.summarization(
            text,
            model="facebook/bart-large-cnn",
            parameters={"max_length": 150, "min_length": 40}
        )
        return summary.summary_text
    except Exception as e:
        print(f"HF Error: {e}")
        return "AI Summarization unavailable at the moment."

def analyze_cognitive_state(logs_text: str) -> dict:
    """
    Uses google/flan-t5-large to analyze behavior logs and determine stage/advice.
    Returns a dict with 'stage', 'score', 'advice'.
    """
    if not HF_TOKEN:
        return {
            "stage": "Simulation Mode (No Key)",
            "score": 10,
            "advice": ["Add HUGGINGFACE_API_KEY to .env to enable real AI."]
        }

    prompt = f"""
    Analyze the following behavior logs of an elderly patient and determine if they show signs of cognitive decline.
    
    Logs:
    {logs_text}
    
    Task:
    1. Identify the Cognitive Stage (Normal Aging, Mild Cognitive Impairment, Early Dementia).
    2. Assign a Risk Score (0-100).
    3. Provide 3 specific handling advice tips.
    
    Format the output exactly like this:
    Stage: [Stage Name]
    Score: [Number]
    Advice: [Tip 1], [Tip 2], [Tip 3]
    """
    
    try:
        response = client.text_generation(
            prompt,
            model="google/flan-t5-large",
            max_new_tokens=200,
            temperature=0.1
        )
        
        # Parse the text response (Simple parsing logic)
        lines = response.split('\n')
        stage = "Unknown"
        score = 0
        advice = []
        
        for line in lines:
            if "Stage:" in line:
                stage = line.replace("Stage:", "").strip()
            elif "Score:" in line:
                try:
                    score = int(line.replace("Score:", "").strip())
                except:
                    score = 50
            elif "Advice:" in line:
                advice_text = line.replace("Advice:", "").strip()
                advice = [a.strip() for a in advice_text.split(',')]
        
        if not advice: # Fallback if parsing failed
             advice = ["Monitor closely", "Consult a doctor", "Keep a routine"]

        return {"stage": stage, "score": score, "advice": advice}

    except Exception as e:
        print(f"HF Error: {e}")
        return {
            "stage": "Error",
            "score": 0,
            "advice": ["AI Service Error. Please check logs."]
        }

import re

SCAM_KEYWORDS = [
    r"dm for order",
    r"limited stock",
    r"payment first",
    r"100% original",
    r"whatsapp to order",
    r"cash on delivery",
    r"no return",
    r"dm for price",
    r"huge discount",
    r"closing sale",
    r"pay via link",
    r"authorized dealer",
    r"exclusive offer",
    r"gift card only",
    r"bank transfer only"
]

def calculate_bio_risk(bio: str) -> float:
    if not bio:
        return 0.0
    
    bio_lower = bio.lower()
    matches = 0
    for kw in SCAM_KEYWORDS:
        if re.search(kw, bio_lower):
            matches += 1
            
    # Normalize: 3 or more keywords = max risk 1.0
    risk = min(matches / 3, 1.0)
    return risk

def count_scam_keywords(texts: list[str]) -> int:
    if not texts:
        return 0
        
    total_matches = 0
    unique_matches = set()
    
    for text in texts:
        if not text:
            continue
        text_lower = text.lower()
        for kw in SCAM_KEYWORDS:
            if re.search(kw, text_lower):
                unique_matches.add(kw)
                
    return len(unique_matches)

def calculate_comment_authenticity(comments: list[str]) -> float:
    """
    Heuristic to detect bot/fake comments.
    Short, repetitive, or emoji-only comments lower the score.
    Returns 0.0 (fake) to 1.0 (authentic).
    """
    if not comments:
        return 0.5 # Neutral if no data
        
    scores = []
    for comment in comments:
        # Check for length
        if len(comment) < 10:
            score = 0.3
        # Check for repetitive patterns or emoji only
        elif re.match(r'^[\W\d\s]+$', comment): # Only symbols/digits/emojis
            score = 0.2
        else:
            score = 0.9
        scores.append(score)
        
    return sum(scores) / len(scores) if scores else 0.5

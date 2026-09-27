def calculate_engagement_rate(likes: int, comments: int, followers: int) -> float:
    """
    Standard engagement rate formula: (Likes + Comments) / Followers
    """
    if followers <= 0:
        return 0.0
    
    rate = (likes + comments) / followers
    return round(rate, 4)

def calculate_posting_frequency(post_timestamps: list[int]) -> float:
    """
    Calculates average days between posts based on a list of unix timestamps.
    """
    if len(post_timestamps) < 2:
        return 0.0
        
    sorted_ts = sorted(post_timestamps, reverse=True)
    intervals = []
    for i in range(len(sorted_ts) - 1):
        diff = sorted_ts[i] - sorted_ts[i+1] # in seconds
        intervals.append(diff / 86400) # convert to days
        
    avg_interval = sum(intervals) / len(intervals)
    return round(avg_interval, 2)

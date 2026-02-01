export const formatTime = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    // 1. Force AM/PM with en-SG locale
    const timeStr = date.toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit', hour12: true });

    // 2. Format the Date Label (Today / Yesterday / Mon)
    let dayLabel = "";
    const isToday = new Date(now.toDateString()) - new Date(date.toDateString()) === 0;
    const isYesterday = new Date(now.toDateString()) - new Date(date.toDateString()) === 86400000;

    if (isToday) dayLabel = "Today";
    else if (isYesterday) dayLabel = "Yesterday";
    else dayLabel = date.toLocaleDateString('en-SG', { weekday: 'short' });

    // 3. Clearer Duration (Spelled out)
    let agoStr = "";
    if (diffMins < 1) agoStr = "Just now";
    else if (diffMins < 60) agoStr = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    else {
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) agoStr = `${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
        else {
            const diffDays = Math.floor(diffHours / 24);
            agoStr = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        }
    }

    // Combine with cleaner separator
    if (agoStr === "Just now") return `Today, ${timeStr} • Just now`;

    return `${dayLabel}, ${timeStr} • ${agoStr}`;
};

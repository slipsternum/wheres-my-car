const BASE_URL = import.meta.env.BASE_URL || '/';

export const apiFetch = async (url, options = {}) => {
    // Manage Key Persistence
    const searchParams = new URLSearchParams(window.location.search);
    const urlKey = searchParams.get('key');

    if (urlKey) {
        localStorage.setItem('pt_api_key', urlKey);
    }

    const storedKey = localStorage.getItem('pt_api_key');

    // Construct final URL
    // If request is for /api/... and we are in a subdirectory (BASE_URL != '/'), prepend the base.
    let finalUrl = url;
    if (url.startsWith('/api') && BASE_URL !== '/') {
        const cleanPath = url.slice(1); // Remove leading slash
        const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
        finalUrl = `${cleanBase}${cleanPath}`;
    }

    // Append Auth Key
    if (storedKey) {
        const separator = finalUrl.includes('?') ? '&' : '?';
        finalUrl = `${finalUrl}${separator}key=${encodeURIComponent(storedKey)}`;
    }

    // Perform Request
    const res = await fetch(finalUrl, options);

    if (!res.ok) {
        // Handle 403 specifically
        if (res.status === 403) {
            console.error("Access Denied: Invalid Key");
        }
        const error = new Error(`API Error: ${res.status}`);
        error.status = res.status;
        throw error;
    }

    return res;
};

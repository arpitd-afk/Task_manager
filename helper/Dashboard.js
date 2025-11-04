import api from "@/lib/api";
const cache = new Map();
const CACHE_TTL = 60_000;

const fetchWithCache = async (key, fetchFn) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetchFn({ signal: controller.signal });
    cache.set(key, { data: res, timestamp: Date.now() });
    return res;
  } finally {
    clearTimeout(timeout);
  }
};

export const getTicketSummary = () =>
  fetchWithCache("summary", () => api.get("/tickets/summary"));

export const getTicketPriority = () =>
  fetchWithCache("priority", () => api.get("/tickets/priority"));

export const getTaskStatus = () =>
  fetchWithCache("status", () => api.get("/tasks/status"));

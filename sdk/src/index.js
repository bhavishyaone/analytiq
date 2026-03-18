let currentApiKey = null;
let backendUrl = "";
let currentUserId = null;
let isInitialized = false;
let isDebugMode = false;

let eventQueue = [];
const recentEvents = new Map();
const DEDUP_WINDOW_MS = 300;

const getFromStorage = (key) => {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  } 
  catch {
    return null;
  }
};

const saveToStorage = (key, value) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  } 
  catch {}
};

const removeFromStorage = (key) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  } 
  catch {}
};

const logMessage = (...args) => {
  if (isDebugMode) console.log("[analytiq]", ...args);
};

export function init(apiKey, options = {}) {
  if (isInitialized) return;

  apiKey = apiKey?.trim();

  if (!apiKey) {
    console.error(
      "[analytiq] API key is missing or undefined.\n" +
      " If using Vite    → import.meta.env.VITE_ANALYTIQ_KEY\n" +
      " If using Next.js → process.env.NEXT_PUBLIC_ANALYTIQ_KEY\n" +
      " Make sure the variable is defined in your .env file."
    );
    return;
  }

  currentApiKey = apiKey;
  backendUrl = options.host || "https://analytiq-gooo.onrender.com";
  isDebugMode = options.debug === true;

  const savedUserId = getFromStorage("analytiq-user-id");
  if (savedUserId && !currentUserId) {
    currentUserId = savedUserId;
    logMessage("User identity restored from previous session:", currentUserId);
  }

  isInitialized = true;
  logMessage("Initialized successfully.", { host: backendUrl, userId: currentUserId });

  const offlineQueue = getFromStorage("analytiq-offline-queue");
  if (offlineQueue) {
    try {
      const events = JSON.parse(offlineQueue);
      if (events.length > 0) {
        logMessage(`Retrying ${events.length} offline event(s) from previous session...`);
        events.forEach(({ path, body }) => sendNetworkRequest(path, body));
        removeFromStorage("analytiq-offline-queue");
      }
    } 
    catch {
      removeFromStorage("analytiq-offline-queue");
    }
  }

  if (eventQueue.length > 0) {
    logMessage(`Flushing ${eventQueue.length} queued event(s)...`);
    eventQueue.forEach(({ path, body }) => sendNetworkRequest(path, body));
    eventQueue = [];
  }
}

export function identify(userData) {
  if (userData === undefined || userData === null) {
    console.warn(
      "[analytiq] identify() called with null or undefined.\n" +
      "  Call reset() to clear user session."
    );
    return;
  }

  if (typeof userData === "object" && !Array.isArray(userData)) {
    const extractedId = userData.id || userData._id || userData.uid || userData.email || userData.sub;

    if (!extractedId) {
      console.warn("[analytiq] identify() received an object, but could not find a valid ID field (id, _id, uid, email). User not identified.");
      return;
    }
    currentUserId = String(extractedId);
  } 
  else if (typeof userData === "string" || typeof userData === "number") {
    currentUserId = String(userData);
  } 
  else {
    console.warn("[analytiq] identify() expects a string, number, or user object.");
    return;
  }

  saveToStorage("analytiq-user-id", currentUserId);
  logMessage("User identified:", currentUserId);
}

export function reset() {
  currentUserId = null;
  eventQueue = [];
  recentEvents.clear();

  removeFromStorage("analytiq-user-id");
  removeFromStorage("analytiq-offline-queue");

  logMessage("SDK reset. User session cleared.");
  console.log("[analytiq] SDK reset. User session cleared.");
}

export function track(eventName, properties = {}) {
  if (!eventName || typeof eventName !== "string") {
    console.warn("[analytiq] track() requires an event name as a string.");
    return;
  }

  if (properties && typeof properties !== "object") {
    console.warn(`[analytiq] track("${eventName}") expects properties to be an object. Ignored.`);
    properties = {};
  } 
  else if (Array.isArray(properties) || properties === null) {
    properties = {};
  }

  const dedupKey = `${eventName}:${JSON.stringify(properties)}`;
  const lastFired = recentEvents.get(dedupKey);
  const now = Date.now();
  if (lastFired && now - lastFired < DEDUP_WINDOW_MS) {
    logMessage(`Duplicate event "${eventName}" ignored (fired within ${DEDUP_WINDOW_MS}ms).`);
    return;
  }
  recentEvents.set(dedupKey, now);

  const body = {
    name: eventName,
    userId: currentUserId,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (!isInitialized) {
    logMessage(`SDK not initialized yet. Event "${eventName}" queued.`);
    eventQueue.push({ path: "/api/events/track", body });
    return;
  }

  logMessage(`Tracking event: "${eventName}"`, properties);
  sendNetworkRequest("/api/events/track", body);
}

export function batchTrack(events = []) {
  if (!Array.isArray(events) || events.length === 0) {
    console.warn("[analytiq] batchTrack() requires a non-empty array of events.");
    return;
  }

  const enrichedEvents = events.map((e) => ({
    name: e.name,
    userId: e.userId || currentUserId,
    properties: e.properties || {},
    timestamp: e.timestamp || new Date().toISOString(),
  }));

  if (!isInitialized) {
    logMessage("SDK not initialized yet. Batch queued.");
    eventQueue.push({ path: "/api/events/batch", body: { events: enrichedEvents } });
    return;
  }

  logMessage(`Batch tracking ${enrichedEvents.length} event(s).`);
  sendNetworkRequest("/api/events/batch", { events: enrichedEvents });
}

async function sendNetworkRequest(path, body) {
  if (typeof window === "undefined") return;

  const url = `${backendUrl}${path}`;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": currentApiKey,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      console.warn(`[analytiq] Event tracking failed: ${response.status}`);
    } 
    else {
      logMessage("Event sent successfully.");
    }
  } 
  catch (err) {
    logMessage("Network error. Saving event to offline queue...");
    try {
      const existingQueueItems = JSON.parse(getFromStorage("analytiq-offline-queue") || "[]");
      existingQueueItems.push({ path, body });
      saveToStorage("analytiq-offline-queue", JSON.stringify(existingQueueItems));
    } 
    catch {}

    setTimeout(async () => {
      try {
        const retryResponse = await fetch(url, requestOptions);
        if (!retryResponse.ok) {
          console.warn(`[analytiq] Retry also failed: ${retryResponse.status}`);
        } 
        else {
          logMessage("Retry succeeded.");
          try {
            const existingQueueItems = JSON.parse(getFromStorage("analytiq-offline-queue") || "[]");
            const updatedQueueItems = existingQueueItems.filter(
              (e) => JSON.stringify(e) !== JSON.stringify({ path, body })
            );
            saveToStorage("analytiq-offline-queue", JSON.stringify(updatedQueueItems));
          } catch {}
        }
      }
      catch {
        console.warn("[analytiq] Retry failed. Event saved to offline queue for next session.");
      }
    }, 500);
  }
}
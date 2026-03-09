let _apiKey = null;
let _host = '';
let _userId = null;
let _initialized = false;

let _queue = [];


const _recentEvents = new Map(); 
const DEDUP_WINDOW_MS = 300; 


export function init(apiKey, options = {}) {
  if (!apiKey) {
    console.warn('[analytiq] init() requires an API key.');
    return;
  }
  _apiKey = apiKey;
  _host = options.host || '';
  _initialized = true;
  console.log('[analytiq] Initialized successfully.');


  if (_queue.length > 0) {
    console.log(`[analytiq] Flushing ${_queue.length} queued event(s)...`);
    _queue.forEach(({ path, body }) => _sendRequest(path, body));
    _queue = [];
  }
}


export function identify(userId) {
  if (!userId) {
    console.warn('[analytiq] identify() requires a userId.');
    return;
  }
  _userId = userId;
}



export function reset() {
  _userId = null;
  _queue = [];
  _recentEvents.clear();
  console.log('[analytiq] SDK reset. User session cleared.');
}


export function track(eventName, properties = {}) {
  if (!eventName) {
    console.warn('[analytiq] track() requires an event name.');
    return;
  }


  const dedupKey = `${eventName}:${JSON.stringify(properties)}`;
  const lastFired = _recentEvents.get(dedupKey);
  const now = Date.now();
  if (lastFired && now - lastFired < DEDUP_WINDOW_MS) {
    console.warn(`[analytiq] Duplicate event "${eventName}" ignored (fired within ${DEDUP_WINDOW_MS}ms).`);
    return;
  }
  _recentEvents.set(dedupKey, now);

  const body = {
    name: eventName,
    userId: _userId,
    properties: properties,
    timestamp: new Date().toISOString(),
  };


  if (!_initialized) {
    console.warn('[analytiq] SDK not initialized yet. Event queued and will be sent after init().');
    _queue.push({ path: '/api/events/track', body });
    return;
  }

  _sendRequest('/api/events/track', body);
}


export function batchTrack(events = []) {
  if (!Array.isArray(events) || events.length === 0) {
    console.warn('[analytiq] batchTrack() requires a non-empty array of events.');
    return;
  }

  const enrichedEvents = events.map((e) => ({
    name: e.name,
    userId: e.userId || _userId,
    properties: e.properties || {},
    timestamp: e.timestamp || new Date().toISOString(),
  }));


  if (!_initialized) {
    console.warn('[analytiq] SDK not initialized yet. Batch queued and will be sent after init().');
    _queue.push({ path: '/api/events/batch', body: { events: enrichedEvents } });
    return;
  }

  _sendRequest('/api/events/batch', { events: enrichedEvents });
}


async function _sendRequest(path, body) {
  const url = `${_host}${path}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': _apiKey,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.warn(`[analytiq] Event tracking failed: ${response.status}`);
    }
  } catch (err) {
    console.warn('[analytiq] Request failed, retrying in 500ms...');

    setTimeout(async () => {
      try {
        const retryResponse = await fetch(url, options);
        if (!retryResponse.ok) {
          console.warn(`[analytiq] Retry also failed: ${retryResponse.status}`);
        }
      } catch (retryErr) {
        console.warn('[analytiq] Retry failed. Event not tracked.');
      }
    }, 500);
  }
}
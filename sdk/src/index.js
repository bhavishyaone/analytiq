let _apiKey = null;
let _host = '';
let _userId = null;
let _initialized = false;
let _debug = false;

let _queue = [];                           
const _recentEvents = new Map();
const DEDUP_WINDOW_MS = 300;


const _lsGet = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  } catch { return null; }
};
const _lsSet = (key, value) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  } catch {}
};
const _lsRemove = (key) => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch {}
};

const _log = (...args) => { if (_debug) console.log('[analytiq]', ...args); };


export function init(apiKey, options = {}) {

  if (_initialized) return;
  
  apiKey = apiKey?.trim();

  if (!apiKey) {
    console.error(
      '[analytiq] API key is missing or undefined.\n' +
      '  If using Vite    → import.meta.env.VITE_ANALYTIQ_KEY\n' +
      '  If using Next.js → process.env.NEXT_PUBLIC_ANALYTIQ_KEY\n' +
      '  Make sure the variable is defined in your .env file.'
    );
    return;
  }

  _apiKey = apiKey;
  _host = options.host || 'https://analytiq-y63v.onrender.com';
  _debug = options.debug === true;


  const savedUserId = _lsGet('_aq_uid');
  if (savedUserId && !_userId) {
    _userId = savedUserId;
    _log('User identity restored from previous session:', _userId);
  }

  _initialized = true;
  _log('Initialized successfully.', { host: _host, userId: _userId });


  const offlineQueue = _lsGet('_aq_offline_queue');
  if (offlineQueue) {
    try {
      const events = JSON.parse(offlineQueue);
      if (events.length > 0) {
        _log(`Retrying ${events.length} offline event(s) from previous session...`);
        events.forEach(({ path, body }) => _sendRequest(path, body));
        _lsRemove('_aq_offline_queue');
      }
    } catch { _lsRemove('_aq_offline_queue'); }
  }




  if (_queue.length > 0) {
    _log(`Flushing ${_queue.length} queued event(s)...`);
    _queue.forEach(({ path, body }) => _sendRequest(path, body));
    _queue = [];
  }
}




export function identify(userId) {

  if (userId === undefined || userId === null) {
    console.warn(
      '[analytiq] identify() was called with null or undefined.\n' +
      '  Tip: Check whether your user object uses "id" or "_id".\n' +
      '  Example: identify(user.id || user._id)'
    );
    return;
  }

  _userId = String(userId);


  _lsSet('_aq_uid', _userId);

  _log('User identified:', _userId);
}


export function reset() {
  _userId = null;
  _queue = [];
  _recentEvents.clear();


  _lsRemove('_aq_uid');


  _lsRemove('_aq_offline_queue');

  _log('SDK reset. User session cleared.');
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
    _log(`Duplicate event "${eventName}" ignored (fired within ${DEDUP_WINDOW_MS}ms).`);
    return;
  }
  _recentEvents.set(dedupKey, now);

  const body = {
    name: eventName,
    userId: _userId,
    properties,
    timestamp: new Date().toISOString(),
  };

  if (!_initialized) {
    _log(`SDK not initialized yet. Event "${eventName}" queued.`);
    _queue.push({ path: '/api/events/track', body });
    return;
  }

  _log(`Tracking event: "${eventName}"`, properties);
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
    _log('SDK not initialized yet. Batch queued.');
    _queue.push({ path: '/api/events/batch', body: { events: enrichedEvents } });
    return;
  }

  _log(`Batch tracking ${enrichedEvents.length} event(s).`);
  _sendRequest('/api/events/batch', { events: enrichedEvents });
}


async function _sendRequest(path, body) {

  if (typeof window === 'undefined') return;

  const url = `${_host}${path}`;
  const reqOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': _apiKey,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, reqOptions);
    if (!response.ok) {
      console.warn(`[analytiq] Event tracking failed: ${response.status}`);
    } else {
      _log('Event sent successfully.');
    }
  } catch (err) {

    _log('Network error. Saving event to offline queue...');
    try {
      const existing = JSON.parse(_lsGet('_aq_offline_queue') || '[]');
      existing.push({ path, body });
      _lsSet('_aq_offline_queue', JSON.stringify(existing));
    } catch {}


    setTimeout(async () => {
      try {
        const retryResponse = await fetch(url, reqOptions);
        if (!retryResponse.ok) {
          console.warn(`[analytiq] Retry also failed: ${retryResponse.status}`);
        } else {

          _log('Retry succeeded.');
          try {
            const existing = JSON.parse(_lsGet('_aq_offline_queue') || '[]');
            const updated = existing.filter(
              (e) => JSON.stringify(e) !== JSON.stringify({ path, body })
            );
            _lsSet('_aq_offline_queue', JSON.stringify(updated));
          } catch {}
        }
      } catch {
        console.warn('[analytiq] Retry failed. Event saved to offline queue for next session.');
      }
    }, 500);
  }
}
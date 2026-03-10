export interface InitOptions {
    /** Override the Analytiq backend URL. Leave empty — defaults to the production Analytiq server automatically. Only set this for self-hosted deployments. */
    host?: string;
}

export interface EventProperties {
    [key: string]: string | number | boolean | null | undefined;
}

export interface BatchEvent {
    name: string;
    userId?: string;
    properties?: EventProperties;
    timestamp?: string;
}

/**
 * Initialize the Analytiq SDK with your project's API key.
 * Must be called before tracking. Any events called before init()
 * are automatically queued and flushed once init() is called.
 *
 * @example
 * import { init } from 'analytiq'
 * init('pk_live_xxxx', { host: 'https://your-api.onrender.com' })
 */
export function init(apiKey: string, options?: InitOptions): void;

/**
 * Associate all future events with a specific user ID.
 *
 * @example
 * identify('user_123')
 */
export function identify(userId: string): void;

/**
 * Track a single event with optional custom properties.
 * Duplicate events fired within 300ms are automatically ignored.
 *
 * @example
 * track('button_click', { button: 'signup', page: '/home' })
 */
export function track(eventName: string, properties?: EventProperties): void;

/**
 * Track multiple events in a single network request.
 *
 * @example
 * batchTrack([
 *   { name: 'page_view', properties: { path: '/home' } },
 *   { name: 'button_click', properties: { button: 'signup' } },
 * ])
 */
export function batchTrack(events: BatchEvent[]): void;

/**
 * Reset the SDK state. Clears the current userId, event queue, and dedup cache.
 * Call this on user logout to prevent events from being associated with the wrong user.
 *
 * @example
 * reset() // call on logout
 */
export function reset(): void;

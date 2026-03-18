import { useEffect, useRef } from "react";
import { init, identify, reset } from "./index.js";

/**
 * <Analytiq /> — the core React initialization component.
 *
 * Place this ONE component at the root of your application to initialize
 * the SDK. It safely handles React Strict Mode and initializes automatically.
 *
 * @example
 * // src/App.jsx
 * import { Analytiq } from "analytiq/react"
 *
 * function App() {
 *   return (
 *     <>
 *       <Analytiq apiKey="pk_live_your_key_here" autoPageViews={true} />
 *       <Router>...</Router>
 *     </>
 *   )
 * }
 */
export function Analytiq({
  apiKey,
  autoPageViews = false,
  debug = false,
}) {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      init(apiKey, { autoTrackPageViews: autoPageViews, debug });
      isInitialized.current = true;
    }
  }, [apiKey, autoPageViews, debug]);

  return null; 
}

export { identify, track, reset, batchTrack } from "./index.js";

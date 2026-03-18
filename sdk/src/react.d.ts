import { FunctionComponent } from "react";
import { identify, track, reset, batchTrack } from "./index";

export interface AnalytiqProps {
  /** Your Analytiq public API key from the dashboard Settings page. */
  apiKey: string;
  /** Automatically track a page_view event on every client-side navigation.
   *  Default: true */
  autoPageViews?: boolean;
  /** Log every SDK action to the browser console. Remove in production.
   *  Default: false */
  debug?: boolean;
}

/**
 * <Analytiq /> — the core React initialization component.
 *
 * Place this ONE component at the root of your application to initialize
 * the SDK safely. It prevents Strict Mode double-firing automatically.
 *
 * @example
 * // src/App.jsx
 * import { Analytiq } from "analytiq/react"
 *
 * function App() {
 *   return (
 *     <>
 *       <Analytiq apiKey="pk_live_your_key_here" />
 *       <Router>...</Router>
 *     </>
 *   )
 * }
 */
export const Analytiq: FunctionComponent<AnalytiqProps>;

export { identify, track, reset, batchTrack };

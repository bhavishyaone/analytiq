import React from 'react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      <nav className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#3451ff] rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <rect x="4" y="12" width="4" height="8" rx="1" />
              <rect x="10" y="8" width="4" height="12" rx="1" />
              <rect x="16" y="4" width="4" height="16" rx="1" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">Analytiq</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
          <a href="#why-analytiq" className="hover:text-gray-900 transition-colors">Why Analytiq</a>
          <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#docs" className="hover:text-gray-900 transition-colors">Docs</a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link to="/register" className="bg-[#3451ff] text-white px-4 py-2 rounded text-[13px] font-medium hover:bg-[#2b41e6] transition-colors">
            Get started
          </Link>
        </div>
      </nav>


      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <h1 className="text-[56px] font-[800] tracking-tight text-[#111827] leading-[1.05] mb-6">
            Stop guessing.<br />
            Start knowing<br />
            exactly how your<br />
            users behave.
          </h1>
          <p className="text-[17px] text-[#6b7280] mb-8 leading-relaxed max-w-md">
            Track every event, visualize funnels, and measure retention — built for developers who want real data without the fluff.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register" className="bg-[#3451ff] text-white px-6 py-3 rounded text-[14px] font-semibold hover:bg-[#2b41e6] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
              Get started
            </Link>
            <Link
              to="/login?demo=true"
              className="px-6 py-3 rounded text-[14px] font-semibold text-gray-900 border border-gray-200 hover:bg-gray-50 hover:-translate-y-0.5 flex items-center gap-2 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              Try Demo
            </Link>
            <a href="#docs" className="px-6 py-3 rounded text-[14px] font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-all duration-300">
              Read the docs &rarr;
            </a>
            <a href="https://github.com/bhavishyaone/analytiq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-[13px] font-semibold text-gray-700 hover:bg-gray-50 hover:-translate-y-0.5 transition-all duration-300 ml-0 sm:ml-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"></path></svg>
              Star
              <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[11px] ml-1 border border-gray-200">1.2k</span>
            </a>
          </div>

        </div>
        
        <div className="relative w-full flex items-center justify-center p-4">

          <div className="absolute -inset-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:32px_32px] z-0"></div>


          <div className="bg-[#fafafa] rounded-lg border border-gray-200 shadow-sm font-mono text-[11px] sm:text-[13px] relative z-10 w-full max-w-[500px]">

            <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-[#f8f9fb] rounded-t-lg relative">
              <div className="flex gap-1.5 absolute left-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="w-full text-center text-[11px] text-[#64748b] font-sans tracking-wide">Terminal - bash</div>
            </div>
            

            <div className="px-5 py-6 space-y-3 relative z-10 bg-[#fafafa] rounded-b-lg">
              <div>
                <span className="text-[#3451ff] font-medium">npm</span> <span className="text-[#111827]">install analytiq</span>
              </div>
              <div className="text-[#64748b]">{'// Initialize'}</div>
              <div>
                <span className="text-[#111827]">analytiq.init(</span><span className="text-[#3451ff]">'pk_live_your_key_here'</span><span className="text-[#111827]">)</span>
              </div>
              <div className="text-[#64748b]">{'// Track events'}</div>
              <div>
                <span className="text-[#111827]">analytiq.track(</span><span className="text-[#3451ff]">'page_view'</span><span className="text-[#111827]">, {'{'} path: </span><span className="text-[#3451ff]">'/home'</span><span className="text-[#111827]"> {'}'})</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <div className="bg-[#fafafa] border-y border-gray-100 py-12 text-center overflow-hidden">
        <p className="text-[11px] font-[600] tracking-[0.2em] text-[#9ca3af] uppercase mb-8">
          TRUSTED BY DEVELOPERS AT INNOVATIVE COMPANIES
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale transition-opacity duration-300 hover:opacity-70">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Acme Corp</div>
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Globex</div>
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/></svg> Initech</div>
          <div className="flex items-center gap-2 font-bold text-lg text-gray-800 hidden sm:flex"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Pulse</div>
        </div>
      </div>


      <section id="why-analytiq" className="max-w-[1200px] mx-auto px-6 py-24 text-center">
        <h2 className="text-[32px] font-bold text-[#111827] mb-16 tracking-tight">Most analytics tools weren't built for<br />developers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-left border border-gray-100 p-8 rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 text-[#3451ff] rounded flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
            </div>
            <h3 className="font-bold text-[#111827] mb-2">Data Hiding</h3>
            <p className="text-[#6b7280] text-[14px] leading-relaxed">
              Other tools sample your data or hide raw events behind expensive enterprise plans.
            </p>
          </div>
          
          <div className="text-left border border-gray-100 p-8 rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 text-[#3451ff] rounded flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>
            </div>
            <h3 className="font-bold text-[#111827] mb-2">Per-event Charging</h3>
            <p className="text-[#6b7280] text-[14px] leading-relaxed">
              Unpredictable pricing that punishes you for growing your user base and tracking more.
            </p>
          </div>
          
          <div className="text-left border border-gray-100 p-8 rounded-xl bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 text-[#3451ff] rounded flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><circle cx="12" cy="11" r="3"></circle></svg>
            </div>
            <h3 className="font-bold text-[#111827] mb-2">Complexity</h3>
            <p className="text-[#6b7280] text-[14px] leading-relaxed">
              Bloated SDKs and confusing dashboards that require a PhD to navigate effectively.
            </p>
          </div>
        </div>
      </section>


      <section id="features" className="border-t border-gray-100 bg-[#fff]">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="mb-16">
            <p className="text-[#3451ff] font-[700] text-[11px] tracking-[0.1em] uppercase mb-4">WHAT ANALYTIQ DOES</p>
            <h2 className="text-[32px] font-bold text-[#111827] max-w-xl leading-tight tracking-tight">
              Everything you need to understand user behavior, simplified for clarity and speed.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#3451ff] mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <h3 className="font-bold text-[#111827] mb-3 text-[15px]">Event Tracking</h3>
              <p className="text-[#6b7280] text-[14px] mb-6 leading-relaxed">
                Track page views, clicks, signups and any custom event in real time.
              </p>
              <ul className="text-[13px] text-[#6b7280] space-y-3">
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Real-time data ingestion</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Unlimited custom properties</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Auto-capture click events</li>
              </ul>
            </div>
            

            <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#3451ff] mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              </div>
              <h3 className="font-bold text-[#111827] mb-3 text-[15px]">Funnel Analysis</h3>
              <p className="text-[#6b7280] text-[14px] mb-6 leading-relaxed">
                See exactly where users drop off in your key conversion flows.
              </p>
              <ul className="text-[13px] text-[#6b7280] space-y-3">
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Multi-step funnel builder</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Conversion rate by step</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Time-to-convert metrics</li>
              </ul>
            </div>
            

            <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-[#3451ff] mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="21.17" x2="12" y1="8" y2="8"></line><line x1="3.95" x2="8.54" y1="6.06" y2="14"></line><line x1="10.88" x2="15.46" y1="21.94" y2="14"></line></svg>
              </div>
              <h3 className="font-bold text-[#111827] mb-3 text-[15px]">Cohort Retention</h3>
              <p className="text-[#6b7280] text-[14px] mb-6 leading-relaxed">
                Measure how many users come back day 1, day 7, and day 30.
              </p>
              <ul className="text-[13px] text-[#6b7280] space-y-3">
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Weekly & monthly cohorts</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Sticky factor analysis</li>
                <li className="flex items-center gap-2.5"><div className="w-[3px] h-[3px] bg-gray-400 rounded-full"></div>Churn prediction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      <section id="how-it-works" className="bg-[#fafafa] py-24 border-y border-gray-100 overflow-hidden relative">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative">

          <div className="hidden md:block absolute top-[24px] left-[16%] right-[16%] h-[1px] bg-gray-200 z-0"></div>


          <div className="flex flex-col items-center text-center relative z-10 bg-[#fafafa]">
            <div className="w-12 h-12 bg-white border border-gray-200 text-[#3451ff] font-bold text-[15px] rounded-lg flex items-center justify-center mb-6 shadow-sm">
              1
            </div>
            <h4 className="font-bold text-[#111827] text-[14px] mb-4">Install the SDK</h4>
            <code className="text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded text-gray-500 font-mono shadow-sm">npm install analytiq</code>
          </div>
          

          <div className="flex flex-col items-center text-center relative z-10 bg-[#fafafa]">
            <div className="w-12 h-12 bg-white border border-gray-200 text-[#3451ff] font-bold text-[15px] rounded-lg flex items-center justify-center mb-6 shadow-sm">
              2
            </div>
            <h4 className="font-bold text-[#111827] text-[14px] mb-4">Call init()</h4>
            <code className="text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded text-gray-500 font-mono shadow-sm">analytiq.init('pk_live...')</code>
          </div>
          

          <div className="flex flex-col items-center text-center relative z-10 bg-[#fafafa]">
            <div className="w-12 h-12 bg-white border border-gray-200 text-[#3451ff] font-bold text-[15px] rounded-lg flex items-center justify-center mb-6 shadow-sm">
              3
            </div>
            <h4 className="font-bold text-[#111827] text-[14px] mb-4">Call track()</h4>
            <code className="text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded text-gray-500 font-mono shadow-sm">analytiq.track('event')</code>
          </div>
        </div>
      </section>





      <section className="bg-[#111111] py-24 text-center px-6">
        <h2 className="text-[32px] md:text-[40px] font-bold text-white mb-6 max-w-[600px] mx-auto leading-[1.1] tracking-tight">
            Ready to understand what<br />your users are actually<br />doing?
          </h2>
          <p className="text-gray-400 mb-10 text-[14px]">
            Open source. No credit card needed. Free to start.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="bg-[#3451ff] text-white px-6 py-3 rounded text-[14px] font-semibold hover:bg-[#2b41e6] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(52,81,255,0.4)] transition-all duration-300">
              Get started
            </Link>
            <Link to="/login" className="text-[14px] font-semibold text-white px-6 py-3 hover:text-gray-300 transition-colors">
              Sign in
            </Link>
          </div>
      </section>


      <footer className="py-6 px-6 border-t border-gray-100 bg-white flex justify-center">
        <div className="text-[12px] text-gray-400">
          © 2026 Analytiq. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

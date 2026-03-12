import React from 'react';
import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1200px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Analytiq Logo" className="w-6 h-6 object-contain rounded shrink-0" />
            <span className="font-bold text-lg tracking-tight">Analytiq</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
            <a href="#why-analytiq" className="hover:text-gray-900 transition-colors">Why Analytiq?</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Platform</a>
            <a href="#developers" className="hover:text-gray-900 transition-colors">Developers</a>
            <a href="https://bhavishaya.mintlify.app/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Documentation</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="bg-[#3451ff] text-white px-5 py-2 rounded text-[13px] font-medium hover:bg-[#2b41e6] transition-colors shadow-sm">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <header className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20 lg:pt-24 lg:pb-32 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="max-w-xl">
          <h1 className="text-[40px] sm:text-[56px] md:text-[64px] font-[800] tracking-tight text-[#111827] leading-[1.05] mb-6">
            Stop guessing.<br />
            Start knowing<br />
            exactly how your<br />
            users behave.
          </h1>
          <p className="text-[17px] md:text-[19px] text-[#6b7280] mb-10 leading-relaxed max-w-md">
            Track every event, visualize funnels, and measure retention — built for developers who want real data without the fluff.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/login" className="bg-[#3451ff] text-white px-7 py-3.5 rounded text-[15px] font-semibold hover:bg-[#2b41e6] transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/20">
              Get started
            </Link>
            <Link
              to="/login?demo=true"
              className="px-7 py-3.5 rounded text-[15px] font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
              </svg>
              View Live Demo
            </Link>
          </div>
        </div>
        
        <div className="relative w-full flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-70 mask-image-radial"></div>

          <div className="bg-[#fafafa] rounded-xl border border-gray-200 shadow-xl font-mono text-[13px] relative z-10 w-full max-w-[550px] overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-[#f8f9fb] relative">
              <div className="flex gap-1.5 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="w-full text-center text-[12px] text-[#64748b] font-sans tracking-wide">Quickstart</div>
            </div>
            
            <div className="px-6 py-8 space-y-4 bg-white">
              <div className="text-[#64748b]">{'// 1. Install the SDK'}</div>
              <div>
                <span className="text-[#3451ff]">npm</span> <span className="text-[#111827]">install analytiq</span>
              </div>
              <br/>
              <div className="text-[#64748b]">import {'{'} init, track {'}'} from <span className="text-[#16a34a]">'analytiq'</span>;</div>
              <br/>
              <div className="text-[#64748b]">{'// 2. Initialize inside your root layout'}</div>
              <div>
                <span className="text-[#3451ff]">init</span>(<span className="text-[#16a34a]">'pk_live_your_api_key'</span>);
              </div>
              <br/>
              <div className="text-[#64748b]">{'// 3. Track events anywhere in your app'}</div>
              <div>
                <span className="text-[#3451ff]">track</span>(<span className="text-[#16a34a]">'checkout_completed'</span>, {'{'}
              </div>
              <div className="pl-6 text-[#111827]">
                plan: <span className="text-[#16a34a]">'pro_annual'</span>,
              </div>
              <div className="pl-6 text-[#111827]">
                revenue: <span className="text-[#d97706]">299</span>
              </div>
              <div>{'}'});</div>
            </div>
          </div>
        </div>
      </header>

      <section id="why-analytiq" className="bg-[#f8f9fb] border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-24 lg:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-6 tracking-tight">Why choose Analytiq?</h2>
            <p className="text-[17px] text-[#6b7280]">We stripped away the fluff, the confusing pricing tiers, and the bloated scripts to give you exactly what matters: raw, reliable data.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#3451ff] rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h3 className="font-bold text-[19px] text-[#111827] mb-3">Zero Configuration</h3>
              <p className="text-[#6b7280] leading-relaxed">No complex DNS routing or backend proxy setups. Drop the standalone SDK into React, Angular, Vue, or Vanilla JS and it instantly works.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#3451ff] rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
              </div>
              <h3 className="font-bold text-[19px] text-[#111827] mb-3">100% Data Ownership</h3>
              <p className="text-[#6b7280] leading-relaxed">You own your events. We never sample data or arbitrarily hide analytics behind aggressive enterprise paywalls.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-[#3451ff] rounded-lg flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <h3 className="font-bold text-[19px] text-[#111827] mb-3">Real-Time Ingestion</h3>
              <p className="text-[#6b7280] leading-relaxed">Waiting 24 hours for events to process is a relic of the past. Analytiq processes and surfaces your events on the dashboard instantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-24 text-center">
            <span className="text-[#3451ff] font-bold tracking-wider text-sm uppercase">The Platform</span>
            <h2 className="text-[36px] md:text-[44px] font-bold text-[#111827] mt-3">Three core features. Executed flawlessly.</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 lg:mb-32">
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-4">Granular Event Tracking</h3>
              <p className="text-[17px] text-[#6b7280] mb-8 leading-relaxed">
                Log every interaction happening across your application seamlessly. Attach unlimited custom metadata properties so you can filter and segment events later.
              </p>
              <ul className="space-y-4 text-[15px] text-[#374151]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Zero-latency logs.</strong> See events appear on your dashboard the second a user clicks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Rich metadata payloads.</strong> Send shopping cart totals, user tiers, and device OS with a single line of code.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#f8f9fb] border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono text-sm font-semibold">payment_successful</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">Just now</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 flexitems-center justify-between shadow-sm opacity-80">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="font-mono text-sm font-semibold">add_to_cart</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">2 min ago</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm opacity-60">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="font-mono text-sm font-semibold">page_view</span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">5 min ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 lg:mb-32">
            <div className="order-2 lg:order-1 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
               <div className="flex items-end gap-2 h-48 w-full">
                 <div className="w-full bg-[#3451ff] rounded-t-sm h-[100%] relative group cursor-pointer transition-all">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500">100%</div>
                 </div>
                 <div className="w-full bg-[#3451ff] opacity-80 rounded-t-sm h-[68%] relative group cursor-pointer transition-all hover:opacity-100">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 pt-2">68%</div>
                 </div>
                 <div className="w-full bg-[#3451ff] opacity-60 rounded-t-sm h-[42%] relative group cursor-pointer transition-all hover:opacity-100">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 pt-2">42%</div>
                 </div>
                 <div className="w-full bg-[#3451ff] opacity-40 rounded-t-sm h-[15%] relative group cursor-pointer transition-all hover:opacity-100">
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-500 pt-2">15%</div>
                 </div>
               </div>
               <div className="flex justify-between mt-4 text-[10px] sm:text-xs font-mono text-gray-500 uppercase">
                 <span className="w-full text-center">Visit Site</span>
                 <span className="w-full text-center">Sign Up</span>
                 <span className="w-full text-center">Add Card</span>
                 <span className="w-full text-center">Upgrade</span>
               </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-4">Conversion Funnels</h3>
              <p className="text-[17px] text-[#6b7280] mb-8 leading-relaxed">
                Stop guessing why users bounce. Build multi-step conversion funnels instantly using your raw event data to pinpoint exactly where users abandon your flow.
              </p>
              <ul className="space-y-4 text-[15px] text-[#374151]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Visual drop-off rates.</strong> Instantly identify friction points in your SaaS registration or eCommerce checkout.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Retroactive analysis.</strong> Create funnels today from events you started tracking months ago.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h3 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-4">Cohort Retention</h3>
              <p className="text-[17px] text-[#6b7280] mb-8 leading-relaxed">
                Determine your product's true stickiness. Group users by the week they joined and track exactly what percentage of them return to execute an action over time.
              </p>
              <ul className="space-y-4 text-[15px] text-[#374151]">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Weekly cohorts.</strong> Measure Day 1, Day 7, and Day 30 retention automatically.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#3451ff] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Action-based stickiness.</strong> Don't just track logins—track if users return to perform value-generating events.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
              <div className="w-[450px] sm:w-full flex">
                <div className="w-20 sm:w-24 text-[10px] sm:text-xs text-gray-400 py-2">Cohort</div>
                <div className="flex-1 flex justify-between text-[10px] sm:text-xs text-gray-400 py-2 px-2">
                  <span>Day 0</span>
                  <span>Day 1</span>
                  <span>Day 7</span>
                  <span>Day 14</span>
                </div>
              </div>
              <div className="space-y-1 w-[450px] sm:w-full">
                <div className="flex items-center text-[10px] sm:text-xs">
                  <div className="w-20 sm:w-24 font-mono text-gray-600">Jan 1-7</div>
                  <div className="flex-1 flex gap-1">
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-100">100%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.65]">65%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.45]">45%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.32]">32%</div>
                  </div>
                </div>
                <div className="flex items-center text-[10px] sm:text-xs">
                  <div className="w-20 sm:w-24 font-mono text-gray-600">Jan 8-14</div>
                  <div className="flex-1 flex gap-1">
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-100">100%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.72]">72%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.52]">52%</div>
                    <div className="w-full h-8 bg-transparent"></div>
                  </div>
                </div>
                <div className="flex items-center text-[10px] sm:text-xs">
                  <div className="w-20 sm:w-24 font-mono text-gray-600">Jan 15-21</div>
                  <div className="flex-1 flex gap-1">
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-100">100%</div>
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-[0.68]">68%</div>
                    <div className="w-full h-8 bg-transparent"></div>
                    <div className="w-full h-8 bg-transparent"></div>
                  </div>
                </div>
                <div className="flex items-center text-[10px] sm:text-xs">
                  <div className="w-20 sm:w-24 font-mono text-gray-600">Jan 22-28</div>
                  <div className="flex-1 flex gap-1">
                    <div className="w-full h-8 bg-[#3451ff] rounded-sm flex items-center justify-center text-white font-mono opacity-100">100%</div>
                    <div className="w-full h-8 bg-transparent"></div>
                    <div className="w-full h-8 bg-transparent"></div>
                    <div className="w-full h-8 bg-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="developers" className="bg-[#f8f9fb] py-24 lg:py-32 border-t border-gray-100">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#111827] mb-6">Setup takes less than a minute.</h2>
          <p className="text-[17px] text-[#6b7280] mb-16 max-w-2xl mx-auto">No complicated middleware, no Docker containers to spin up locally. Follow these three simple steps.</p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-gray-500 font-mono text-xs mb-3">1. Install the SDK</div>
              <code className="font-mono text-sm block font-semibold">
                <span className="text-[#3451ff]">npm</span> <span className="text-[#111827]">install analytiq</span>
              </code>
            </div>
            
            <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-gray-500 font-mono text-xs mb-3">2. Initialize inside your root layout</div>
              <code className="font-mono text-sm block font-semibold">
                <span className="text-[#3451ff]">init</span>(<span className="text-[#16a34a]">'pk_live_your_api_key'</span>)
              </code>
            </div>

            <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-xl hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-gray-500 font-mono text-xs mb-3">3. Track events anywhere in your app</div>
              <code className="font-mono text-sm block font-semibold">
                <span className="text-[#3451ff]">track</span>(<span className="text-[#16a34a]">'checkout_completed'</span>)
              </code>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a href="https://bhavishaya.mintlify.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#3451ff] hover:text-[#2b41e6] font-semibold transition-colors">
              Read our comprehensive framework integration guides 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-center px-6 border-y border-gray-100">
        <h2 className="text-[32px] md:text-[44px] font-bold text-[#111827] mb-6 max-w-[600px] mx-auto tracking-tight">
          Ready to track product metrics properly?
        </h2>
        <p className="text-[#6b7280] mb-10 text-[17px]">
          Create an account. Manage unlimited projects. Own your data.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/login" className="bg-[#3451ff] text-white px-8 py-4 rounded font-semibold hover:bg-[#2b41e6] hover:-translate-y-0.5 shadow-md shadow-blue-500/20 transition-all">
            Get started
          </Link>
        </div>
      </section>

      <footer className="py-4 px-6 bg-[#f8f9fb] flex justify-center border-t border-gray-100 w-full">
        <div className="text-[13px] text-gray-500">
          © 2026 Analytiq. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

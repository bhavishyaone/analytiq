import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  Filter,
  Users,
  Settings,
  ChevronUp,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react'
import { useProject } from '../context/ProjectContext.jsx'

const navItems = [
  { to: '/app',           end: true, icon: LayoutDashboard, label: 'Overview'  },
  { to: '/app/events',              icon: Zap,             label: 'Events'    },
  { to: '/app/funnels',             icon: Filter,          label: 'Funnels'   },
  { to: '/app/retention',           icon: Users,           label: 'Retention' },
  { to: '/app/settings',            icon: Settings,        label: 'Settings'  },
]


const DATE_RANGE_PAGES = ['/app', '/app/events', '/app/funnels', '/app/retention']

const DATE_RANGES = [
  { label: '7D',  value: 7  },
  { label: '30D', value: 30 },
  { label: '90D', value: 90 },
]

export function AppLayout() {
  const { activeProject, selectedDays, setSelectedDays } = useProject()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)


  const showDateRange = DATE_RANGE_PAGES.some(p =>
    p === '/app' ? location.pathname === '/app' : location.pathname.startsWith(p)
  )

  const Sidebar = (
    <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col h-full">


      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="Analytiq Logo" className="w-7 h-7 object-contain rounded-md shrink-0" />
          <span className="font-bold text-gray-900 text-sm tracking-tight">Analytiq</span>
        </Link>

        <button
          className="md:hidden p-1 text-gray-400 hover:text-gray-600"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>
      </div>


      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, end, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 -ml-[2px] pl-[14px]'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>


      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm text-gray-700 font-medium truncate flex-1 text-left">
            {activeProject?.name ?? 'No project'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">


      <div className="hidden md:flex md:flex-col md:w-52 shrink-0">
        {Sidebar}
      </div>


      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">

          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="relative z-50 w-52 flex flex-col bg-white shadow-xl">
            {Sidebar}
          </div>
        </div>
      )}


      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">


        <div className="flex md:hidden items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-50"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2 cursor-pointer relative z-10 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Analytiq Logo" className="w-6 h-6 object-contain rounded-md shrink-0" />
            <span className="font-bold text-gray-900 text-sm">Analytiq</span>
          </Link>

          {showDateRange && (
            <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelectedDays(r.value)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedDays === r.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>


        {showDateRange && (
          <div className="hidden md:flex items-center justify-end px-6 py-2 bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {DATE_RANGES.map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelectedDays(r.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    selectedDays === r.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

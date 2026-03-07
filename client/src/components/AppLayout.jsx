import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  Filter,
  Users,
  Settings,
  ChevronUp,
  LayoutGrid,
} from 'lucide-react'
import { useProject } from '../context/ProjectContext.jsx'

const navItems = [
  { to: '/app',           end: true, icon: LayoutDashboard, label: 'Overview'  },
  { to: '/app/events',              icon: Zap,             label: 'Events'    },
  { to: '/app/funnels',             icon: Filter,          label: 'Funnels'   },
  { to: '/app/retention',           icon: Users,           label: 'Retention' },
  { to: '/app/settings',            icon: Settings,        label: 'Settings'  },
]

export function AppLayout() {
  const { activeProject } = useProject()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-50">


      <aside className="w-52 shrink-0 bg-white border-r border-gray-100 flex flex-col">


        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center shrink-0">
            <LayoutGrid className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight">Analytiq</span>
        </div>


        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
              Project - {activeProject?.name }
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>
        </div>

      </aside>


      <main className="flex-1 min-w-0 overflow-hidden">
        <Outlet />
      </main>

    </div>
  )
}

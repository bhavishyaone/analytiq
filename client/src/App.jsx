import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProjectProvider } from './context/ProjectContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppLayout } from './components/AppLayout.jsx'
import { Register } from './pages/Register.jsx'
import { Login } from './pages/Login.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Settings } from './pages/Settings.jsx'
import { Events } from './pages/Events.jsx'
import { Funnels } from './pages/Funnels.jsx'
import { Retention } from './pages/Retention.jsx'
import { Projects } from './pages/Projects.jsx'
import { AccountSettings } from './pages/AccountSettings.jsx'
import { NotFound } from './pages/NotFound.jsx'

function App() {
    return (
        <AuthProvider>
            <ProjectProvider>
                <BrowserRouter>
                    <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/app"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        >
                            
                            <Route index element={<Dashboard />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="events" element={<Events />} />
                            <Route path="funnels" element={<Funnels />} />
                            <Route path="retention" element={<Retention />} />
                        </Route>


                        <Route
                            path="/projects"
                            element={
                                <ProtectedRoute>
                                    <Projects />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/account-settings"
                            element={
                                <ProtectedRoute>
                                    <AccountSettings />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ProjectProvider>
        </AuthProvider>
    )
}

export default App
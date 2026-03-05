import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProjectProvider } from './context/ProjectContext.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { AppLayout } from './components/AppLayout.jsx'
import { Register } from './pages/Register.jsx'
import { Login } from './pages/Login.jsx'

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
                            path="/app/*"
                            element={
                                <ProtectedRoute>
                                    <AppLayout />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ProjectProvider>
        </AuthProvider>
    )
}

export default App
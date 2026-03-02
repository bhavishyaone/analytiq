import { createContext, useContext, useState } from 'react'

const ProjectContext  = createContext(null)

export function ProjectProvider({ children }) {

    const [activeProject, setActiveProjectState] = useState(() => {
        const stored = localStorage.getItem('activeProject')
        return stored ? JSON.parse(stored) : null
    })

    const setActiveProject = (project) => {
        setActiveProjectState(project)
        if (project) {
            localStorage.setItem('activeProject', JSON.stringify(project))
        } else {
            localStorage.removeItem('activeProject')
        }
    }

    return (
        <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
            {children}
        </ProjectContext.Provider>
    )
}


export function useProject() {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error('useProject must be used inside ProjectProvider')
    return ctx
}
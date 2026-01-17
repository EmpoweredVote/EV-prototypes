import { createContext, useContext, useState, useEffect } from 'react'

const VolunteerContext = createContext()

const STORAGE_KEY = 'volunteer_name'

export function VolunteerProvider({ children }) {
  const [volunteerName, setVolunteerName] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || ''
  })

  useEffect(() => {
    if (volunteerName) {
      localStorage.setItem(STORAGE_KEY, volunteerName)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [volunteerName])

  const login = (name) => {
    setVolunteerName(name.trim())
  }

  const logout = () => {
    setVolunteerName('')
  }

  const changeName = (newName) => {
    setVolunteerName(newName.trim())
  }

  return (
    <VolunteerContext.Provider value={{ volunteerName, login, logout, changeName }}>
      {children}
    </VolunteerContext.Provider>
  )
}

export function useVolunteer() {
  const context = useContext(VolunteerContext)
  if (!context) {
    throw new Error('useVolunteer must be used within a VolunteerProvider')
  }
  return context
}

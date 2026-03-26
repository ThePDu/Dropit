
import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dropit_location')) || {
        address: 'Sawantwadi, Maharashtra',
        city: 'Sawantwadi',
        lat: null,
        lng: null,
        isAutoDetected: false
      }
    } catch {
      return { address: 'Sawantwadi, Maharashtra', city: 'Sawantwadi', isAutoDetected: false }
    }
  })

  const updateLocation = (newLoc) => {
    const locData = { ...location, ...newLoc }
    setLocation(locData)
    localStorage.setItem('dropit_location', JSON.stringify(locData))
  }

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported')
      return
    }

    setLoading(true)
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            // Using OSM Nominatim for reverse geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            const data = await res.json()
            
            const newLoc = {
              address: data.display_name,
              city: data.address.city || data.address.town || data.address.village || 'Sawantwadi',
              lat: latitude,
              lng: longitude,
              isAutoDetected: true
            }
            updateLocation(newLoc)
            setLoading(false)
            resolve(newLoc)
          } catch (err) {
            // Fallback if geocoding fails
            const fallback = { lat: latitude, lng: longitude, isAutoDetected: true }
            updateLocation(fallback)
            setLoading(false)
            resolve(fallback)
          }
        },
        (error) => {
          console.error('Error detecting location:', error)
          setLoading(false)
          reject(error)
        }
      )
    })
  }

  return (
    <LocationContext.Provider value={{ location, updateLocation, detectLocation, loading }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => useContext(LocationContext)

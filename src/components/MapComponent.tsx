'use client'

import { useEffect, useRef, useState } from 'react'

interface MapComponentProps {
  startPoint?: {
    lat: number
    lng: number
    name: string
  }
  endPoint?: {
    lat: number
    lng: number
    name: string
  }
  stops?: Array<{
    lat: number
    lng: number
    name: string
  }>
  height?: string
  className?: string
}

export default function MapComponent({
  startPoint,
  endPoint,
  stops = [],
  height = '308px',
  className = '',
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')

        if (!mapContainer.current) return

        if (!map.current) {
          map.current = L.map(mapContainer.current).setView(
            [startPoint?.lat || -19.8226, startPoint?.lng || -43.9441],
            12
          )

          L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19,
            }
          ).addTo(map.current)
        }

        map.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.current.removeLayer(layer)
          }
        })

        if (startPoint) {
          L.marker([startPoint.lat, startPoint.lng], {
            icon: L.icon({
              iconUrl:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIGZpbGw9IiMxQTJCNEEiIHJ4PSI4Ii8+PHRleHQgeD0iMTYiIHk9IjI0IiBmb250LXNpemU9IjIwIiBmaWxsPSIjRjVCODAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Szwvc3ZnPg==',
              iconSize: [32, 42],
              iconAnchor: [16, 42],
              popupAnchor: [0, -42],
            }),
          })
            .bindPopup(`<b>${startPoint.name}</b><br/>Início`)
            .addTo(map.current)
            .openPopup()
        }

        if (endPoint) {
          L.marker([endPoint.lat, endPoint.lng], {
            icon: L.icon({
              iconUrl:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCAzMiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iNDIiIGZpbGw9IiNGNUI4MDAiIHJ4PSI4Ii8+PHRleHQgeD0iMTYiIHk9IjI0IiBmb250LXNpemU9IjIwIiBmaWxsPSIjMUEyQjRBIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rjwvc3ZnPg==',
              iconSize: [32, 42],
              iconAnchor: [16, 42],
              popupAnchor: [0, -42],
            }),
          })
            .bindPopup(`<b>${endPoint.name}</b><br/>Fim`)
            .addTo(map.current)
        }

        stops.forEach((stop) => {
          L.marker([stop.lat, stop.lng], {
            icon: L.icon({
              iconUrl:
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMiIgZmlsbD0iI0Y1QjgwMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjYiIGZpbGw9IiMxQTJCNEEiLz48L3N2Zz4=',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
              popupAnchor: [0, -12],
            }),
          })
            .bindPopup(`<b>${stop.name}</b><br/>Parada`)
            .addTo(map.current)
        })

        if (startPoint && endPoint) {
          const routePoints = [
            [startPoint.lat, startPoint.lng] as [number, number],
            ...stops.map((s) => [s.lat, s.lng] as [number, number]),
            [endPoint.lat, endPoint.lng] as [number, number],
          ]

          L.polyline(routePoints, {
            color: '#1A2B4A',
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1.0,
          }).addTo(map.current)

          const bounds = L.latLngBounds(routePoints)
          map.current.fitBounds(bounds, { padding: [50, 50] })
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Erro ao carregar mapa:', error)
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      //
    }
  }, [startPoint, endPoint, stops])

  return (
    <div
      ref={mapContainer}
      className={className}
      style={{
        height,
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(26,43,74,0.1)',
        background: isLoading ? '#F4F6FA' : 'transparent',
      }}
    />
  )
}

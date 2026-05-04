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
        // @ts-ignore
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
              attribution: '© OpenStreetMap',
              maxZoom: 19,
            }
          ).addTo(map.current)
        }

        map.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.current.removeLayer(layer)
          }
        })

        // Marcador de início (A - Azul Navy)
        if (startPoint) {
          const startIcon = L.divIcon({
            html: `<div style="
              background: #01233F;
              color: white;
              border-radius: 50%;
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 16px;
              box-shadow: 0 2px 8px rgba(1, 35, 63, 0.3);
              border: 3px solid white;
              font-family: Segoe UI, sans-serif;
            ">A</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -20],
            className: ''
          })

          L.marker([startPoint.lat, startPoint.lng], { icon: startIcon })
            .bindPopup(`<div style="font-family: Segoe UI, sans-serif; font-size: 13px; text-align: center;"><strong style="color: #01233F; display: block; font-weight: 900;">SAÍDA</strong><span style="color: #666; font-size: 12px;">${startPoint.name}</span></div>`, {
              className: 'map-popup-custom'
            })
            .addTo(map.current)
            .openPopup()
        }

        // Marcador de fim (B - Amarelo)
        if (endPoint) {
          const endIcon = L.divIcon({
            html: `<div style="
              background: #f1bb13;
              color: #01233F;
              border-radius: 50%;
              width: 38px;
              height: 38px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              font-size: 16px;
              box-shadow: 0 2px 8px rgba(241, 187, 19, 0.3);
              border: 3px solid white;
              font-family: Segoe UI, sans-serif;
            ">B</div>`,
            iconSize: [38, 38],
            iconAnchor: [19, 19],
            popupAnchor: [0, -20],
            className: ''
          })

          L.marker([endPoint.lat, endPoint.lng], { icon: endIcon })
            .bindPopup(`<div style="font-family: Segoe UI, sans-serif; font-size: 13px; text-align: center;"><strong style="color: #01233F; display: block; font-weight: 900;">CHEGADA</strong><span style="color: #666; font-size: 12px;">${endPoint.name}</span></div>`, {
              className: 'map-popup-custom'
            })
            .addTo(map.current)
        }

        // Marcadores de paradas intermediárias
        stops.forEach((stop, index) => {
          const stopIcon = L.divIcon({
            html: `<div style="
              background: #f1bb13;
              color: #01233F;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 12px;
              box-shadow: 0 2px 6px rgba(241, 187, 19, 0.2);
              border: 2px solid white;
              font-family: Segoe UI, sans-serif;
            ">${index + 1}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
            className: ''
          })

          L.marker([stop.lat, stop.lng], { icon: stopIcon })
            .bindPopup(`<div style="font-family: Segoe UI, sans-serif; font-size: 13px; text-align: center;"><strong style="color: #01233F; display: block; font-weight: 800;">PARADA</strong><span style="color: #666; font-size: 12px;">${stop.name}</span></div>`, {
              className: 'map-popup-custom'
            })
            .addTo(map.current)
        })

        // Desenhar rota
        if (startPoint && endPoint) {
          const routePoints = [
            [startPoint.lat, startPoint.lng] as [number, number],
            ...stops.map((s) => [s.lat, s.lng] as [number, number]),
            [endPoint.lat, endPoint.lng] as [number, number],
          ]

          L.polyline(routePoints, {
            color: '#01233F',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 5',
            smoothFactor: 1.0,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map.current)

          const bounds = L.latLngBounds(routePoints)
          map.current.fitBounds(bounds, { padding: [60, 60] })
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
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(1, 35, 63, 0.12)',
        background: isLoading ? '#f9f9f9' : 'transparent',
        border: '1px solid #e8e8e8',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9f9f9',
          zIndex: 10,
          fontSize: '13px',
          color: '#666',
          fontFamily: 'Segoe UI, sans-serif'
        }}>
          ⏳ Carregando mapa...
        </div>
      )}
    </div>
  )
}

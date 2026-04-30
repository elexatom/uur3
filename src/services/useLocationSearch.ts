/**
 * Sluzba pro vyhledavani adres pomoci Photon API.
 * Vraci pole adres a loading stav. Omezeno na okres Plzen-mesto.
 */

/*
Finalni revize - 100%
 */
import {useEffect, useState} from "react"
import type {FormatedFeature} from "../types/network.ts"

interface Feature {
  properties: {
    name: string;
    street: string;
    housenumber: string;
    city: string;
    state: string;
    osm_id: string;
    osm_type: string;
  },
  geometry: {
    coordinates: [number, number];
  }
}

const formatFeature = (feature: Feature) => {
  const p = feature.properties
  const main = p.name || p.street || p.city
  const detail = [p.street, p.housenumber, p.city, p.state].filter(Boolean).join(', ')
  const lat = feature.geometry.coordinates[1]
  const lon = feature.geometry.coordinates[0]
  return {
    id: `${p.osm_id}${p.osm_type}`,
    main,
    detail: detail !== main ? detail : '',
    lat,
    lon,
  }
}

const PLZEN_BBOX = "13.25,49.65,13.50,49.85"

export const useLocationSearch = (query: string) => {
  const [results, setResults] = useState<FormatedFeature[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    let alive = true
    setLoading(true)

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lon=13.3776&lat=49.7475&bbox=${PLZEN_BBOX}`
        )
        const data = await res.json()
        if (alive) setResults(data.features.map(formatFeature))
      } catch (error) {
        console.error("Photon API error:", error)
      } finally {
        if (alive) setLoading(false)
      }
    }, 400)

    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [query])

  return {results, loading}
}
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'

// Fix leaflet default marker icon bug
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Manual city coordinates mapping
const CITY_COORDS = {
    'Edinburgh': [55.9533, -3.1883],
    'Tokyo': [35.6762, 139.6503],
    'San Francisco': [37.7749, -122.4194],
    'New York': [40.7128, -74.0060],
    'London': [51.5074, -0.1278],
    'Singapore': [1.3521, 103.8198],
    'Sidney': [-33.8688, 151.2093],
}

function Analytics() {
    const [auditImage, setAuditImage] = useState(null)
    const [employees, setEmployees] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const img = localStorage.getItem('auditImage')
        const emp = localStorage.getItem('employees')
        if (img) setAuditImage(img)
        if (emp) setEmployees(JSON.parse(emp))
    }, [])

  // Calculate salary per city for SVG chart
    const cityData = employees.reduce((acc, emp) => {
    const city = emp[2]
    const salary = parseInt(emp[5].replace(/[$,]/g, '')) || 0
    acc[city] = (acc[city] || 0) + salary
    return acc
    }, {})

    const cities = Object.keys(cityData)
    const maxSalary = Math.max(...Object.values(cityData))
    const BAR_WIDTH = 50
    const BAR_GAP = 30
    const CHART_HEIGHT = 200
    const SVG_WIDTH = cities.length * (BAR_WIDTH + BAR_GAP) + BAR_GAP

  // Unique cities for map
    const uniqueCities = [...new Set(employees.map(emp => emp[2]))]

    return (
    <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/list')}>← Back to List</button>
        <h2 style={styles.title}>Analytics Dashboard</h2>

      {/* Audit Image */}
        <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Audit Image</h3>
        {auditImage
            ? <img src={auditImage} style={styles.auditImg} alt="audit" />
            : <p style={styles.empty}>No audit image yet. Complete identity verification first.</p>
        }
        </div>

      {/* SVG Salary Chart */}
        <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Salary Distribution by City</h3>
        {cities.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
            <svg width={SVG_WIDTH} height={CHART_HEIGHT + 60}>
                {cities.map((city, i) => {
                const barHeight = (cityData[city] / maxSalary) * CHART_HEIGHT
                const x = BAR_GAP + i * (BAR_WIDTH + BAR_GAP)
                const y = CHART_HEIGHT - barHeight

                return (
                    <g key={city}>
                    {/* Bar */}
                    <rect
                        x={x}
                        y={y}
                        width={BAR_WIDTH}
                        height={barHeight}
                        fill="#1a56db"
                        rx={4}
                    />
                    {/* Value on top */}
                    <text
                        x={x + BAR_WIDTH / 2}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#333"
                    >
                        {(cityData[city] / 1000000).toFixed(1)}M
                    </text>
                    {/* City label */}
                    <text
                        x={x + BAR_WIDTH / 2}
                        y={CHART_HEIGHT + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#555"
                        transform={`rotate(-30, ${x + BAR_WIDTH / 2}, ${CHART_HEIGHT + 20})`}
                    >
                        {city}
                    </text>
                    </g>
                )
                })}
              {/* Baseline */}
                <line
                x1={0}
                y1={CHART_HEIGHT}
                x2={SVG_WIDTH}
                y2={CHART_HEIGHT}
                stroke="#e2e8f0"
                strokeWidth={2}
                />
            </svg>
            </div>
        )}
        </div>

      {/* Map */}
        <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Employee Locations</h3>
        <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {uniqueCities.map(city => {
                const coords = CITY_COORDS[city]
                if (!coords) return null
                return (
                    <Marker key={city} position={coords}>
                    <Popup>
                    <strong>{city}</strong><br />
                    {employees.filter(e => e[2] === city).length} employees
                    </Popup>
                </Marker>
                )
            })}
            </MapContainer>
        </div>
        <p style={styles.mapNote}>
            City coordinates manually mapped. Cities matched to lat/lng via a static lookup table (CITY_COORDS) since the API only returns city names without geospatial data.
        </p>
        </div>
    </div>
    )
}

const styles = {
    container: { padding: '1.5rem', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' },
    back: { background: 'none', border: 'none', cursor: 'pointer', color: '#1a56db', fontSize: '14px', marginBottom: '1rem' },
    title: { color: '#1a1a2e', marginBottom: '1.5rem' },
    section: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1.5rem' },
    sectionTitle: { margin: '0 0 1rem 0', color: '#1a1a2e', fontSize: '16px' },
    auditImg: { width: '100%', maxWidth: '400px', borderRadius: '8px', display: 'block' },
    empty: { color: '#888', fontSize: '14px', margin: 0 },
    mapNote: { fontSize: '12px', color: '#888', marginTop: '0.5rem' }
}

export default Analytics
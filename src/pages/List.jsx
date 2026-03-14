import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROW_HEIGHT = 48
const VISIBLE_HEIGHT = window.innerHeight - 200
const BUFFER = 3

function List() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [scrollTop, setScrollTop] = useState(0)
    const { logout } = useAuth()
    const navigate = useNavigate()
    const containerRef = useRef(null)

    useEffect(() => {
    fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: '123456' })
    })
        .then(res => res.json())
        .then(data => {
        setEmployees(data.TABLE_DATA.data)
        setLoading(false)
        })
        .catch(() => {
        setError('Failed to fetch data')
        setLoading(false)
        })
    }, [])

    const handleScroll = useCallback(() => {
    if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop)
    }
    }, [])

  const totalHeight = employees.length * ROW_HEIGHT
    const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
    const endIndex = Math.min(
    employees.length,
    startIndex + Math.ceil(VISIBLE_HEIGHT / ROW_HEIGHT) + BUFFER * 2
    )
    const visibleEmployees = employees.slice(startIndex, endIndex)
  const offsetY = startIndex * ROW_HEIGHT

    if (loading) return <div style={styles.center}>Loading employees...</div>
    if (error) return <div style={styles.center}>{error}</div>

    return (
    <div style={styles.container}>
        <div style={styles.header}>
        <h2 style={styles.title}>Employee Insights Dashboard</h2>
        <button style={styles.logout} onClick={logout}>Logout</button>
        </div>

        <div style={styles.gridHeader}>
        <span>ID</span>
        <span>Name</span>
        <span>City</span>
        <span>Salary</span>
        <span>Action</span>
        </div>

      {/* Scrollable container */}
        <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ ...styles.scrollContainer, height: VISIBLE_HEIGHT }}
        >
        {/* Full height div to make scrollbar correct size */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Only visible rows rendered, pushed down by offsetY */}
            <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleEmployees.map((emp, index) => (
                <div key={startIndex + index} style={styles.gridRow}>
                <span>{emp[3]}</span>
                <span>{emp[0]}</span>
                <span>{emp[2]}</span>
                <span>{emp[5]}</span>
                <button
                    style={styles.detailBtn}
                    onClick={() => navigate(`/details/${emp[3]}`)}
                >
                    View
                </button>
                </div>
            ))}
            </div>
        </div>
        </div>

        <div style={styles.footer}>
        Showing {visibleEmployees.length} of {employees.length} employees
        </div>
    </div>
    )
}

const styles = {
    container: { padding: '1.5rem', fontFamily: 'Arial, sans-serif', maxWidth: '100%', boxSizing: 'border-box'},
    center: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    title: { margin: 0, color: '#1a1a2e' },
    logout: { padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    gridHeader: {
    display: 'grid', gridTemplateColumns: '80px 2fr 1fr 1fr 100px',
    padding: '0 1rem', height: ROW_HEIGHT,
    backgroundColor: '#1a56db', color: 'white',
    fontWeight: 'bold', fontSize: '14px', alignItems: 'center',
    borderRadius: '8px 8px 0 0'
    },
    scrollContainer: { overflowY: 'auto', border: '1px solid #e2e8f0', borderTop: 'none' },
    gridRow: {
    display: 'grid', gridTemplateColumns: '80px 2fr 1fr 1fr 100px',
    padding: '0 1rem', height: ROW_HEIGHT,
    borderBottom: '1px solid #e2e8f0',
    fontSize: '14px', alignItems: 'center',
    backgroundColor: 'white'
    },
    detailBtn: { padding: '0.3rem 0.75rem', backgroundColor: '#1a56db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    footer: { padding: '0.5rem 1rem', fontSize: '12px', color: '#888', borderTop: '1px solid #e2e8f0' }
}

export default List
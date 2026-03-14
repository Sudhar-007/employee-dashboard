import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function List() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
    fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test', password: '123456' })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setEmployees(data.TABLE_DATA.data)
            setLoading(false)
        })
        .catch(() => {
            setError('Failed to fetch data')
            setLoading(false)
        })
    }, [])

    if (loading) return <div style={styles.center}>Loading employees...</div>
    if (error) return <div style={styles.center}>{error}</div>

    return (
    <div style={styles.container}>
        <div style={styles.header}>
        <h2 style={styles.title}>Employee Insights Dashboard</h2>
        <button style={styles.logout} onClick={logout}>Logout</button>
        </div>

        <div style={styles.grid}>
        <div style={styles.gridHeader}>
            <span>ID</span>
            <span>Name</span>
            <span>City</span>
            <span>Salary</span>
            <span>Action</span>
        </div>

        {employees.map((emp, index) => (
    <div key={index} style={styles.gridRow}>
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
    )
}

const styles = {
    container: { padding: '1.5rem', fontFamily: 'Arial, sans-serif' },
    center: { display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    title: { margin: 0, color: '#1a1a2e' },
    logout: { padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    grid: { border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' },
    gridHeader: {
    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 100px',
    padding: '0.75rem 1rem', backgroundColor: '#1a56db',
    color: 'white', fontWeight: 'bold', fontSize: '14px'
    },
    gridRow: {
    display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 100px',
    padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0',
    fontSize: '14px', alignItems: 'center'
    },
    detailBtn: { padding: '0.3rem 0.75rem', backgroundColor: '#1a56db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
}

export default List
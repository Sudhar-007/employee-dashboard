import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = () => {
    const success = login(username, password)
    if (success) {
        navigate('/list')
    } else {
        setError('Invalid credentials')
    }
    }

    return (
    <div style={styles.container}>
        <div style={styles.card}>
        <h2 style={styles.title}>Employee Insights</h2>
        <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
        <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin}>
            Login
        </button>
        </div>
    </div>
    )
}

const styles = {
    container: {
    height: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f0f2f5'
    },
    card: {
    background: 'white', padding: '2rem',
    borderRadius: '8px', display: 'flex',
    flexDirection: 'column', gap: '1rem',
    width: '320px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: { textAlign: 'center', margin: 0, color: '#1a1a2e' },
    input: {
    padding: '0.75rem', borderRadius: '4px',
    border: '1px solid #ccc', fontSize: '14px'
    },
    button: {
    padding: '0.75rem', backgroundColor: '#1a56db',
    color: 'white', border: 'none', borderRadius: '4px',
    cursor: 'pointer', fontSize: '14px'
    },
    error: { color: 'red', margin: 0, fontSize: '13px' }
}

export default Login
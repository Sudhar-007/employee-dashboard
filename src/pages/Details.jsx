import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Details() {
    const { id } = useParams()
    const navigate = useNavigate()

  // Camera states
  const [phase, setPhase] = useState('details') // 'details' | 'camera' | 'signature' | 'done'
    const [photo, setPhoto] = useState(null)
    const [mergedImage, setMergedImage] = useState(null)

  // Refs
    const videoRef = useRef(null)
    const photoCanvasRef = useRef(null)
    const signatureCanvasRef = useRef(null)
    const streamRef = useRef(null)
    const isDrawing = useRef(false)

  // Start camera
    const startCamera = async () => {
    try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    streamRef.current = stream
    setPhase('camera')
    // Wait for video element to render before setting stream
    setTimeout(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, 100)
    } catch (err) {
        console.log('Camera error:', err.name, err.message)
        alert(`Camera error: ${err.name} - ${err.message}`)
    }
}

  // Capture photo from video frame
    const capturePhoto = () => {
    const canvas = photoCanvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    setPhoto(canvas.toDataURL('image/png'))

    // Stop camera stream
    streamRef.current.getTracks().forEach(track => track.stop())
    setPhase('signature')
    }

  // Signature drawing
const startDrawing = (e) => {
    isDrawing.current = true
    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    ctx.beginPath()
    ctx.moveTo(
    (e.clientX - rect.left) * scaleX,
    (e.clientY - rect.top) * scaleY
    )
}

const draw = (e) => {
    if (!isDrawing.current) return
    const canvas = signatureCanvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    ctx.lineWidth = 2 / scaleX  // normalize line width to display size
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#ff0000'
    ctx.lineTo(
    (e.clientX - rect.left) * scaleX,
    (e.clientY - rect.top) * scaleY
    )
    ctx.stroke()
}
    const stopDrawing = () => { isDrawing.current = false }

  // Set up signature canvas size when phase changes
    useEffect(() => {
    if (phase === 'signature' && signatureCanvasRef.current && photoCanvasRef.current) {
    signatureCanvasRef.current.width = photoCanvasRef.current.width
    signatureCanvasRef.current.height = photoCanvasRef.current.height
    }
}, [phase])

  // BLOB MERGE — draw photo then signature onto final canvas
const mergeAndSave = () => {
    const final = document.createElement('canvas')
    const img = new Image()
    img.src = photo
    img.onload = () => {
    final.width = img.width
    final.height = img.height
    const ctx = final.getContext('2d')

    // Layer 1 — photo
    ctx.drawImage(img, 0, 0)
    // Layer 2 — signature on top
    ctx.drawImage(signatureCanvasRef.current, 0, 0)

    const merged = final.toDataURL('image/png')
    setMergedImage(merged)
    localStorage.setItem('auditImage', merged)
    setPhase('done')
    }
}

    return (
    <div style={styles.container}>
        <button style={styles.back} onClick={() => navigate('/list')}>← Back</button>
        <h2 style={styles.title}>Employee ID: {id}</h2>

        {phase === 'details' && (
        <div style={styles.card}>
            <p>Identity verification required for this employee.</p>
            <button style={styles.btn} onClick={startCamera}>
            Open Camera for Verification
            </button>
        </div>
        )}

        {phase === 'camera' && (
        <div style={styles.card}>
            <p style={styles.label}>Position face in frame and capture</p>
            <video
            ref={videoRef}
            autoPlay
            playsInline
            style={styles.video}
            />
            <canvas ref={photoCanvasRef} style={{ display: 'none' }} />
            <button style={styles.btn} onClick={capturePhoto}>
            Capture Photo
            </button>
        </div>
        )}

        {phase === 'signature' && (
        <div style={styles.card}>
            <p style={styles.label}>Sign your name over the photo</p>
            <div style={styles.canvasWrapper}>
            <img src={photo} style={styles.photoPreview} alt="captured" />
            <canvas
                ref={signatureCanvasRef}
                style={styles.signatureCanvas}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            </div>
            <button style={styles.btn} onClick={mergeAndSave}>
            Save Verification
            </button>
        </div>
        )}

        {phase === 'done' && (
        <div style={styles.card}>
            <p style={styles.label}>Verification Complete</p>
            <img src={mergedImage} style={styles.photoPreview} alt="audit" />
            <button style={styles.btn} onClick={() => navigate('/analytics')}>
            View Analytics →
            </button>
        </div>
        )}
    </div>
    )
}

const styles = {
    container: { padding: '1.5rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' },
    back: { background: 'none', border: 'none', cursor: 'pointer', color: '#1a56db', fontSize: '14px', marginBottom: '1rem' },
    title: { color: '#1a1a2e', marginBottom: '1.5rem' },
    card: { background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' },
    label: { margin: 0, color: '#555', fontSize: '14px' },
    video: { width: '100%', borderRadius: '8px', background: '#000' },
    btn: { padding: '0.75rem', backgroundColor: '#1a56db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' },
    canvasWrapper: { position: 'relative', width: '100%' },
    photoPreview: { width: '100%', borderRadius: '8px', display: 'block' },
    signatureCanvas: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'crosshair' }
}

export default Details
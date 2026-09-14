import { useState } from 'react'
import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '3rem' }}>
      <h1 style={{ color: '#b8c5ca' }}>🚀 LoL Tracker - Frontend Test</h1>
      <p>Jeśli to widzisz, React działa wewnątrz kontenera Dockera!</p>
      
      <div style={{ marginTop: '2rem' }}>
        <button 
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: '#1e293b',
            color: '#fff',
            border: 'none'
          }}
        >
          Kliknięcia: {count}
        </button>
      </div>
    </main>
  )
}
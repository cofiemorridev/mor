import React from 'react'

function App() {
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2d5016', fontSize: '3em' }}>🥥 Coconut Oil Store</h1>
      <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
        Welcome to our premium coconut oil store!
      </p>
      <div style={{
        backgroundColor: '#f0f7f0',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2>✅ React is working!</h2>
        <p>If you can see this, your React app is running correctly.</p>
        <p><strong>Server:</strong> Vite + React</p>
        <p><strong>Port:</strong> 5174</p>
      </div>
    </div>
  )
}

export default App

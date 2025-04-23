import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function pullData(token) {
  if (!token) throw new Error("No token")
  const [, payloadB64] = token.split('.')
  return JSON.parse(atob(payloadB64))
}

function Auth({ children }) {
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function verify() {
      const token = localStorage.getItem('token')
      try {
        console.log(pullData(token))     // quick decode / expiry check
        const res = await fetch('http://localhost:5001/api/validate', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: token
        })
        if (!res.ok) throw new Error('bad token')
        setValidated(true)
      } catch {
        navigate('/login')
      }
    }
    verify()
  }, [navigate])

  if (!validated) {
    return <div>Checking auth…</div>
  }
  return <>{children}</>
}

export default Auth

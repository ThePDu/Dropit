import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocation } from '../context/LocationContext.jsx'
import API from '../api.js'

export default function Login() {
  const [mode, setMode]     = useState('login')
  const [form, setForm]     = useState({ name:'', email:'', password:'', phone:'', hostel:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { detectLocation } = useLocation()
  const navigate  = useNavigate()

  const inp = {
    display:'block', width:'100%',
    background:'#f8f8f8', border:'1.5px solid #e0e0e0',
    color:'#1a1a1a', padding:'11px 14px',
    borderRadius:9, fontSize:14, marginBottom:10,
  }

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      const url = mode==='login' ? '/auth/login' : '/auth/register'
      const payload = mode==='login' ? { email:form.email, password:form.password } : form
      const { data } = await API.post(url, payload)
      login(data)
      try {
        await detectLocation()
      } catch (e) {
        console.log('Location detection skipped or failed')
      }
      navigate(data.role==='admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'#f8f8f8' }}>
      <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderRadius:20, padding:40, width:'100%', maxWidth:400, boxShadow:'0 4px 24px rgba(0,0,0,0.08)', animation:'slideUp 0.3s ease' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <div style={{ fontSize:32, fontWeight:900, letterSpacing:-1.5, color:'#1a1a1a' }}>
            Drop<span style={{ color:'#0c831f' }}>it</span>
          </div>
        </div>
        <h2 style={{ fontSize:20, fontWeight:900, letterSpacing:-0.5, textAlign:'center', marginBottom:6, color:'#1a1a1a' }}>
          {mode==='login' ? 'Welcome back!' : 'Create account'}
        </h2>
        <p style={{ color:'#888', fontSize:13, textAlign:'center', marginBottom:24 }}>
          {mode==='login' ? 'Login to your account' : 'Join DropIt today'}
        </p>

        {/* Toggle */}
        <div style={{ display:'flex', background:'#f8f8f8', border:'1px solid #e0e0e0', borderRadius:10, padding:4, marginBottom:22 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex:1, padding:8, borderRadius:8, border:'none',
              fontWeight:700, fontSize:13, cursor:'pointer',
              background: mode===m ? '#0c831f' : 'transparent',
              color: mode===m ? '#fff' : '#888',
              transition:'all 0.15s',
            }}>
              {m==='login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background:'#fce4ec', border:'1px solid #f48fb1', color:'#e23744', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:14 }}>
            {error}
          </div>
        )}

        {/* Form */}
        {mode==='register' && (
          <input style={inp} placeholder="Full name" value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})}
            onFocus={e=>e.target.style.borderColor='#0c831f'}
            onBlur={e=>e.target.style.borderColor='#e0e0e0'} />
        )}
        <input style={inp} type="email" placeholder="Email address" value={form.email}
          onChange={e=>setForm({...form,email:e.target.value})}
          onFocus={e=>e.target.style.borderColor='#0c831f'}
          onBlur={e=>e.target.style.borderColor='#e0e0e0'} />
        <input style={inp} type="password" placeholder="Password" value={form.password}
          onChange={e=>setForm({...form,password:e.target.value})}
          onFocus={e=>e.target.style.borderColor='#0c831f'}
          onBlur={e=>e.target.style.borderColor='#e0e0e0'} />
        {mode==='register' && (
          <>
            <input style={inp} placeholder="Phone number" value={form.phone}
              onChange={e=>setForm({...form,phone:e.target.value})}
              onFocus={e=>e.target.style.borderColor='#0c831f'}
              onBlur={e=>e.target.style.borderColor='#e0e0e0'} />
            <input style={{...inp,marginBottom:0}} placeholder="Hostel name (optional)" value={form.hostel}
              onChange={e=>setForm({...form,hostel:e.target.value})}
              onFocus={e=>e.target.style.borderColor='#0c831f'}
              onBlur={e=>e.target.style.borderColor='#e0e0e0'} />
          </>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width:'100%', background: loading?'#ccc':'#0c831f',
          color:'#fff', border:'none', padding:13,
          borderRadius:10, fontSize:15, fontWeight:900,
          cursor: loading?'not-allowed':'pointer', marginTop:16,
          transition:'all 0.15s',
        }}
          onMouseEnter={e=>{ if(!loading) e.target.style.background='#0a6b19' }}
          onMouseLeave={e=>{ if(!loading) e.target.style.background='#0c831f' }}>
          {loading ? 'Please wait...' : mode==='login' ? 'Login' : 'Create account'}
        </button>

        {/* Admin hint */}
        {mode==='login' && (
          <div style={{ marginTop:16, background:'#f0fff4', border:'1px solid #a5d6a7', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#555', textAlign:'center' }}>
            Admin: <span style={{ color:'#0c831f', fontWeight:700 }}>admin@dropit.com</span> / <span style={{ color:'#0c831f', fontWeight:700 }}>admin123</span>
          </div>
        )}
      </div>
    </div>
  )
}
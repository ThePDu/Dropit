import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API from '../api.js'

export default function Register() {
  const [form, setForm]       = useState({ name:'', email:'', password:'', address:'' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const inp = { display:'block', width:'100%', background:'#1c1c1c', border:'1px solid #2a2a2a', color:'#f0f0f0', padding:'11px 14px', borderRadius:9, fontSize:14, marginBottom:10 }

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      const { data } = await API.post('/auth/register', form)
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#141414', border:'1px solid #2a2a2a', borderRadius:20, padding:40, width:'100%', maxWidth:400 }}>
        <div style={{ fontSize:36, textAlign:'center', marginBottom:8 }}>🛵</div>
        <h2 style={{ fontSize:22, fontWeight:900, textAlign:'center', marginBottom:24 }}>Create account</h2>
        {error && <div style={{ background:'#2a0000', color:'#ff5252', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:14 }}>{error}</div>}
        <input style={inp} placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={e=>e.target.style.borderColor='#f5c518'} onBlur={e=>e.target.style.borderColor='#2a2a2a'} />
        <input style={inp} type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={e=>e.target.style.borderColor='#f5c518'} onBlur={e=>e.target.style.borderColor='#2a2a2a'} />
        <input style={inp} type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} onFocus={e=>e.target.style.borderColor='#f5c518'} onBlur={e=>e.target.style.borderColor='#2a2a2a'} />
        <input style={{...inp,marginBottom:20}} placeholder="Address (optional)" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} onFocus={e=>e.target.style.borderColor='#f5c518'} onBlur={e=>e.target.style.borderColor='#2a2a2a'} />
        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', background:loading?'#555':'#f5c518', color:'#000', border:'none', padding:13, borderRadius:10, fontSize:15, fontWeight:900, cursor:loading?'not-allowed':'pointer' }}>
          {loading ? 'Creating...' : 'Register'}
        </button>
        <p style={{ textAlign:'center', fontSize:13, color:'#555', marginTop:16 }}>
          Already have an account? <span onClick={() => navigate('/login')} style={{ color:'#f5c518', cursor:'pointer', fontWeight:700 }}>Login</span>
        </p>
      </div>
    </div>
  )
}
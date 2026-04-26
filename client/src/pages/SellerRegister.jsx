import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function SellerRegister() {
  const [form, setForm] = useState({ name: '', ownerName: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/seller/register', form);
      alert('Store created successfully! Please login.');
      navigate('/seller/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '40px', width: '100%', maxWidth: 480, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: '#FFF8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #FFE0B2' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px', marginBottom: 8 }}>DropIt Partner Signup</h2>
          <p style={{ fontSize: 15, color: '#666', fontWeight: 500 }}>Create your store and start selling locally</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Store Name</label>
            <input required type="text" placeholder="e.g. Fresh Mart" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{ width: '100%', padding: '14px 16px', background: '#f4f4f4', border: '1px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.1)' }} onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Owner Name</label>
            <input required type="text" placeholder="Your full name" value={form.ownerName} onChange={e=>setForm({...form, ownerName:e.target.value})} style={{ width: '100%', padding: '14px 16px', background: '#f4f4f4', border: '1px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.1)' }} onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Phone Number</label>
            <input required type="tel" placeholder="+91 xxxxx xxxxx" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} style={{ width: '100%', padding: '14px 16px', background: '#f4f4f4', border: '1px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.1)' }} onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</label>
            <input required type="email" placeholder="store@example.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={{ width: '100%', padding: '14px 16px', background: '#f4f4f4', border: '1px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.1)' }} onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
            <input required type="password" placeholder="Create a strong password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} style={{ width: '100%', padding: '14px 16px', background: '#f4f4f4', border: '1px solid transparent', borderRadius: 12, fontSize: 15, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 4px rgba(245,166,35,0.1)' }} onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }} />
          </div>
          
          <button disabled={loading} type="submit" style={{ width: '100%', padding: '16px', background: loading ? '#ccc' : '#F5A623', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 8, boxShadow: loading ? 'none' : '0 8px 16px rgba(245,166,35,0.3)' }} onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 20px rgba(245,166,35,0.4)' } }} onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(245,166,35,0.3)' } }}>
            {loading ? 'Creating account...' : 'Create Partner Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid #eee', fontSize: 15, color: '#666', fontWeight: 500 }}>
          Already a partner? <Link to="/seller/login" style={{ color: '#F5A623', fontWeight: 800, textDecoration: 'none', marginLeft: 4 }}>Login here</Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function SellerLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/seller/login', form);
      const data = res.data;
      localStorage.setItem('dropit_user', JSON.stringify({
        token: data.token,
        role: 'seller',
        _id: data.store._id,
        name: data.store.name,
        email: data.store.email
      }));
      window.dispatchEvent(new Event('storage'));
      navigate('/seller/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="card border-0" style={{ maxWidth: '420px', width: '100%', borderRadius: '20px', boxShadow: '0 10px 40px rgba(245,158,11,0.12)' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef3c7' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h2 style={{ color: '#1a1a1a', fontWeight: 900, letterSpacing: '-0.5px' }}>Seller Login</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Manage your store and incoming orders</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.9rem', color: '#444' }}>Email Address</label>
              <input required type="email" className="form-control" placeholder="store@example.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={{ padding: '12px 15px', borderRadius: '10px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: '0.9rem', color: '#444' }}>Password</label>
              <input required type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} style={{ padding: '12px 15px', borderRadius: '10px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }} />
            </div>
            <button disabled={loading} type="submit" className="btn w-100 fw-bold shadow-sm" style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '1.05rem', transition: 'all 0.2s' }}>
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>
          <div className="text-center mt-4 pt-2 border-top" style={{ fontSize: '0.95rem' }}>
            New to DropIt? <Link to="/seller/register" style={{ color: '#f59e0b', fontWeight: 800, textDecoration: 'none' }}>Create Store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

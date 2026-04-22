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
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h3 className="text-center mb-4" style={{ color: '#f59e0b', fontWeight: 800 }}>DropIt Partner Signup</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Store Name</label>
              <input required type="text" className="form-control" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Owner Name</label>
              <input required type="text" className="form-control" value={form.ownerName} onChange={e=>setForm({...form, ownerName:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input required type="tel" className="form-control" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input required type="email" className="form-control" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input required type="password" className="form-control" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
            </div>
            <button disabled={loading} type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#f59e0b', color: '#fff' }}>
              {loading ? 'Creating account...' : 'Create Partner Account'}
            </button>
          </form>
          <div className="text-center mt-3">
            Already a partner? <Link to="/seller/login" style={{ color: '#d97706' }}>Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

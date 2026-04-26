import { useState, useEffect } from 'react';
import API from '../../api';

export default function ProductManager({ storeId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: '', stock: 100, image: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/products/store/${storeId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', form);
      alert('Product added successfully!');
      setShowAddForm(false);
      setForm({ name: '', price: '', category: '', stock: 100, image: '' });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      alert('Product deleted!');
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h4 style={{ margin: 0, fontWeight: 900, color: '#111827', fontSize: 24, letterSpacing: '-0.5px' }}>Product Catalog</h4>
        <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: '#F5A623', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,166,35,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, marginBottom: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6' }}>
          <h5 style={{ margin: '0 0 20px 0', fontWeight: 800, color: '#111827', fontSize: 18 }}>Add New Product</h5>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Name</label>
              <input required style={{ width: '100%', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e=>{e.target.style.borderColor='#F5A623';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.background='#F9FAFB'}} value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Category</label>
              <input required style={{ width: '100%', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e=>{e.target.style.borderColor='#F5A623';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.background='#F9FAFB'}} value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Price (₹)</label>
              <input required type="number" style={{ width: '100%', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e=>{e.target.style.borderColor='#F5A623';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.background='#F9FAFB'}} value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Stock</label>
              <input required type="number" style={{ width: '100%', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e=>{e.target.style.borderColor='#F5A623';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.background='#F9FAFB'}} value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Image URL</label>
              <input style={{ width: '100%', padding: '12px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, outline: 'none', transition: 'all 0.2s', fontWeight: 600, boxSizing: 'border-box' }} onFocus={e=>{e.target.style.borderColor='#F5A623';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#E5E7EB';e.target.style.background='#F9FAFB'}} value={form.image} onChange={e=>setForm({...form, image: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
              <button type="submit" style={{ background: '#111827', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='#374151'} onMouseLeave={e=>e.currentTarget.style.background='#111827'}>Save Product</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 24, border: '1px dashed #D1D5DB' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#111827', fontWeight: 800 }}>No products yet</h3>
          <p style={{ margin: 0, color: '#6B7280' }}>Add your first product to start selling locally.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
          {products.map(p => (
            <div key={p._id} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ height: 160, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span style={{ fontSize: 48 }}>📦</span>}
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h6 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 800, color: '#111827' }}>{p.name}</h6>
                <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{p.category} • Stock: {p.stock}</p>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#059669' }}>₹{p.price}</span>
                  <button onClick={() => handleDelete(p._id)} style={{ background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

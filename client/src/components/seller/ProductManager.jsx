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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Products</h4>
        <button className="btn fw-bold text-white" style={{ backgroundColor: '#f59e0b' }} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="mb-3 fw-bold">Add New Product</h5>
            <form onSubmit={handleAddProduct}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input required className="form-control" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input required className="form-control" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price (₹)</label>
                  <input required type="number" className="form-control" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Stock</label>
                  <input required type="number" className="form-control" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Image URL</label>
                  <input className="form-control" value={form.image} onChange={e=>setForm({...form, image: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-dark mt-3 px-4">Save Product</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center p-5 text-muted bg-white shadow-sm rounded">
          <i className="bi bi-box fs-1"></i>
          <p className="mt-2 mb-0">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="row g-3">
          {products.map(p => (
            <div key={p._id} className="col-md-4 col-sm-6">
              <div className="card shadow-sm border-0 h-100">
                {p.image && <img src={p.image} className="card-img-top" alt={p.name} style={{ height: '150px', objectFit: 'contain', padding: '10px' }} />}
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold mb-1">{p.name}</h6>
                  <p className="text-muted small mb-2">{p.category} | Stock: {p.stock}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="fw-bold fs-5 text-success">₹{p.price}</span>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

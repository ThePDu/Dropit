export default function SellerNavbar({ store }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 py-3 shadow-sm" style={{ zIndex: 10 }}>
      <div className="container-fluid px-0">
        <span className="navbar-brand fw-bold mb-0">Seller Central</span>
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-success">Store Open</div>
          <div className="fw-bold text-dark">{store?.name}</div>
        </div>
      </div>
    </nav>
  );
}

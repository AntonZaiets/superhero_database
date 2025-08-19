export const DetailField = ({ label, value, className = '' }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <p className={className}>{value}</p>
  </div>
);

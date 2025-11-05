export default function StatusBadge({ status = 'pending' }) {
  const color = status === 'approved' ? '#16a34a' : status === 'rejected' ? '#dc2626' : '#6b7280';
  const style = {
    display: 'inline-block',
    padding: '0.125rem 0.5rem',
    borderRadius: 999,
    background: '#f3f4f6',
    color,
    fontSize: 12,
  };
  return <span style={style}>{status}</span>;
}



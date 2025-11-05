export default function TicketCounter({ count = 0 }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span>Tickets:</span>
      <strong>{count}</strong>
    </div>
  );
}



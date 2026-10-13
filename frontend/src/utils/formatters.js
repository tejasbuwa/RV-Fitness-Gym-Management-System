export function formatCurrency(amount) {
  const num = parseFloat(amount || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeClass(status) {
  const s = String(status).toLowerCase();
  switch (s) {
    case 'active':
    case 'paid':
    case 'open':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    case 'expiring_soon':
    case 'partially_paid':
    case 'holiday':
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'expired':
    case 'overdue':
    case 'closed':
    case 'inactive':
    case 'cancelled':
    case 'temporarily_closed':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}

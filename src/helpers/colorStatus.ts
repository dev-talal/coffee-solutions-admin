function getStatusColorDual(status: string): string {
  if (!status) return 'text-gray-600 bg-gray-100';
  switch (status.toString().toLowerCase()) {
    case 'paid':
    case 'delivered':
    case 'success':
    case 'income':
    case 'active':
    case 'credit':
      return 'text-green-600 bg-green-100';
    case '1':
      return 'text-green-600 bg-green-100';
    case 'shipping':
      return 'text-purple-600 bg-purple-100';
    case 'unpaid':
    case 'pending':
    case 'processing':
    case 'suspended':
    case 'unfulfilled':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelled':
    case 'refunded':
    case 'failed':
    case 'outcome':
    case 'inactive':
    case 'debit':
      return 'text-red-600 bg-red-100';
    case '0':
      return 'text-red-600 bg-red-100';
    case 'available':
      return 'text-green-600 bg-green-100';
    case 'out_of_stock':
      return 'text-amber-600 bg-amber-100';

    case 'bronze':
      return 'text-amber-950 bg-yellow-500';
    case 'silver':
      return 'text-gray-400 bg-gray-200';
    case 'gold':
      return 'text-yellow-600 bg-yellow-100';
    case 'platinum':
      return 'text-zinc-600 bg-zinc-100';
    case 'diamond':
      return 'text-blue-600 bg-blue-200';

    default:
      return 'text-gray-600 bg-gray-100';
  }
}

function getStatusColortext(status: string): string {
  switch (status.toString().toLowerCase()) {
    case 'paid':
    case 'delivered':
    case 'success':
    case 'income':
    case 'active':
      return 'text-green-600';
    case '1':
      return 'text-green-600';
    case 'shipping':
      return 'text-purple-600';
    case 'unpaid':
    case 'pending':
    case 'processing':
    case 'suspended':
    case 'unfulfilled':
      return 'text-yellow-600';
    case 'cancelled':
    case 'refunded':
    case 'failed':
    case 'outcome':
    case 'inactive':
      return 'text-red-600';
    case '0':
      return 'text-red-600';
    case 'available':
      return 'text-green-600';
    case 'out of stock':
      return 'text-red-600';

    case 'bronze':
      return 'text-amber-950';
    case 'silver':
      return 'text-gray-400';
    case 'gold':
      return 'text-yellow-600';
    case 'platinum':
      return 'text-zinc-600';
    case 'diamond':
      return 'text-blue-600';

    default:
      return 'text-gray-600';
  }
}

export { getStatusColortext, getStatusColorDual };

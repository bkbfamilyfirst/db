'use client';
import React, { useEffect, useState } from 'react';
import { getDistributionHistory } from '../../lib/api';
import type { DistributionHistory } from '../../lib/api';

const PAGE_SIZE = 10;

const DistributionHistoryTable: React.FC = () => {
  const [history, setHistory] = useState<DistributionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDistributionHistory({ page, limit: PAGE_SIZE })
      .then((res) => {
        setHistory(res.distributions);
        setTotal(res.total);
      })
      .catch((err) => {
        setError('Failed to load distribution history.');
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Distribution History</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && history.length === 0 && <div>No distribution history found.</div>}
      {!loading && !error && history.length > 0 && (
        <table className="min-w-full border text-sm">
          <thead>            <tr className="bg-gray-100">
              <th className="p-2 border">Retailer</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Batch</th>
            </tr>
          </thead>          <tbody>
            {history.map((item) => (
              <tr key={item.transferId}>
                <td className="p-2 border">{item.retailer?.name || '-'}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{new Date(item.date).toLocaleString()}</td>
                <td className="p-2 border">{item.status}</td>
                <td className="p-2 border">{item.batch || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DistributionHistoryTable;

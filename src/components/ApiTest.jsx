import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function ApiTest() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Using axios client which works with Vite proxy
        const res = await api.get('/api/test');
        setData(res.data);
      } catch (error) {
        console.error('API test failed', error);
        setErr(error.message || 'Request failed');
      }
    })();
  }, []);

  if (err) return <div className="p-4 text-red-600">Error: {err}</div>;
  if (!data) return <div className="p-4">Loading API test...</div>;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Backend API Test</h3>
      <pre className="mt-2 bg-gray-100 p-3 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

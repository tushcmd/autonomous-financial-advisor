'use client'
import { useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState(null);

  const fetchStock = async () => {
    const response = await fetch(`/api/stock?ticker=${ticker}`);
    const result = await response.json();
    setData(result);
  }


  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-xl font-bold'>Autonomous Financial Advisor</h1>
      <input
        type='text'
        placeholder='Enter Stock Symbol'
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        className='border p-2 rounded'
      />
      <button onClick={fetchStock} className='bg-blue-500 text-white p-2 rounded'>Fetch Price</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
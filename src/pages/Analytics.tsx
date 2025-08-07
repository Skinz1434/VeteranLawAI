import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = Array.from({length:12}).map((_,i)=>({ m:`M${i+1}`, cases: Math.round(40 + Math.random()*60) }));

export default function AnalyticsPage(){
  return (
    <div className="rounded-2xl p-5" style={{ background:'var(--panel)', border:'1px solid var(--border)' }}>
      <h2 className="text-lg font-semibold" style={{ color:'var(--text)' }}>Analytics (Demo)</h2>
      <div className="mt-4" style={{ width:'100%', height:320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="m" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="cases" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

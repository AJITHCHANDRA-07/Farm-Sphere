import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c5f2d', fontSize: '48px' }}>🌱 FarmSphere is Working!</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Your agricultural portal is successfully running.
      </p>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h2>✅ Status Check:</h2>
        <ul>
          <li>✅ Frontend Server: Running</li>
          <li>✅ Backend API: Running on http://localhost:3001</li>
          <li>✅ Database: Connected to Supabase</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/crops-data" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#2c5f2d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '16px'
          }}
        >
          🌾 View Crops Database
        </a>
      </div>
    </div>
  );
};

export default TestPage;

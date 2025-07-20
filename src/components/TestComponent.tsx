import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{
      background: 'yellow',
      color: 'black',
      padding: '50px',
      margin: '20px',
      border: '5px solid red',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      <h1>TEST COMPONENT IS RENDERING!</h1>
      <p>If you can see this, the routing is working.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestComponent; 
import React from 'react';

export default function Needle() {
  return (
    <div style={{ position: 'absolute', right: -30, top: 28 }}>
      <div style={{ width: 160, height: 6, background: '#6b7280', borderRadius: 6, transformOrigin: 'left top' }} />
      <div style={{ width: 18, height: 18, borderRadius: 4, background: '#374151', marginTop: -6, marginLeft: 140 }} />
    </div>
  );
}

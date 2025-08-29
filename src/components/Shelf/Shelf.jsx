import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export default function Shelf({ shelf = [], onSelect, onRemove }) {
  return (
    <div>
      <div style={{ marginBottom: 12, fontWeight: 600 }}>Shelf (max 5)</div>
      <Grid container spacing={2}>
        {shelf.map(a => (
          <Grid item key={a.id} xs={12} sm={6}>
            <Card variant="outlined">
              <CardContent>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 8, backgroundImage: `url(${a.images?.[0]?.url})`, backgroundSize: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{a.name}</div>
                    <div style={{ color: '#aaa' }}>{a.artists?.map(x => x.name).join(', ')}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Button variant="contained" size="small" onClick={() => onSelect(a)}>Load</Button>
                  <Button variant="outlined" size="small" onClick={() => onRemove(a.id)}>Remove</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

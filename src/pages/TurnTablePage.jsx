import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Turntable from '../components/Turntable/Turntable';
import Shelf from '../components/Shelf/Shelf';
import SpotifySearch from '../components/Search/SpotifySearch';
import { Box } from '@mui/material';

export default function TurntablePage({ token, isAuthenticated }) {
  const [shelf, setShelf] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dv_shelf') || '[]'); } catch(e) { return []; }
  });
  const [activeAlbum, setActiveAlbum] = useState(null);

  useEffect(() => {
    localStorage.setItem('dv_shelf', JSON.stringify(shelf));
  }, [shelf]);

  const addAlbumToShelf = (album) => {
    if (shelf.find(a => a.id === album.id)) return;
    if (shelf.length < 5) return setShelf([...shelf, album]);
    // if full: replace oldest by default for simplicity
    const next = [...shelf.slice(1), album];
    setShelf(next);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Paper sx={{ p: 2 }}>
          <Turntable album={activeAlbum} token={token} />
        </Paper>
        <Box mt={2}>
          <SpotifySearch onAddAlbum={addAlbumToShelf} token={token} isAuthenticated={isAuthenticated} />
        </Box>
      </Grid>

      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 2 }}>
          <Shelf shelf={shelf} onSelect={setActiveAlbum} onRemove={(id) => setShelf(shelf.filter(s => s.id !== id))} />
        </Paper>
      </Grid>
    </Grid>
  );
}

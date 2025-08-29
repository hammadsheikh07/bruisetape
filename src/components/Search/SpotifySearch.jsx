import React, { useState } from 'react';
import { searchAlbums, getAlbumTracks } from '../../utils/spotifyApi';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function SpotifySearch({ token, onAddAlbum, isAuthenticated }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);

  const doSearch = async () => {
    if (!q || !token) return;
    const res = await searchAlbums(q, token);
    setResults(res.items || []);
  };

  const addAlbum = async (album) => {
    // fetch tracks and transform
    const tracks = await getAlbumTracks(album.id, token);
    const alb = {
      id: album.id,
      name: album.name,
      images: album.images,
      artists: album.artists,
      tracks: tracks.map(t => ({ id: t.id, name: t.name, duration_ms: t.duration_ms, uri: t.uri, preview_url: t.preview_url }))
    };
    onAddAlbum(alb);
  };

  return (
    <Box>
      <Box display="flex" gap={1} mb={1}>
        <TextField size="small" fullWidth placeholder="Search albums on Spotify" value={q} onChange={(e) => setQ(e.target.value)} />
        <Button variant="contained" onClick={doSearch} disabled={!isAuthenticated}>Search</Button>
      </Box>

      <List>
        {results.map(r => (
          <ListItem key={r.id} secondaryAction={<Button onClick={() => addAlbum(r)}>Add</Button>}>
            <ListItemText primary={r.name} secondary={r.artists.map(a=>a.name).join(', ')} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

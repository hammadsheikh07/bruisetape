import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { usePlayback } from '../../hooks/usePlayback';
import Vinyl from './Vinyl';
import Needle from './Needle';
import Transport from './Transport';
import Visualizer from '../Visualizer';

export default function Turntable({ album, token }) {
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);
  const { playUri, pause, seek, isPlaying } = usePlayback(token);

  useEffect(() => {
    if (!album) { setTracks([]); setIndex(0); return; }
    setTracks(album.tracks || []);
    setIndex(0);
  }, [album]);

  const playTrack = async (t) => {
    if (!t) return;
    // prefer spotify uri
    const uri = t.uri || t.preview_url || t.external_urls?.spotify;
    if (!uri) return;
    await playUri(uri);
  };

  useEffect(() => {
    if (tracks.length === 0) return;
    playTrack(tracks[index]);
  }, [index, tracks]);

  const onScratch = (deltaSeconds) => {
    // naive scratch: seek forward/back by deltaSeconds
    seek((tracks[index]?.progress || 0) + deltaSeconds);
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
          <Box sx={{ width: 360 }}>
            <Vinyl isPlaying={isPlaying} onScratch={onScratch} cover={album?.images?.[0]?.url} />
            <Needle />
          </Box>

          <Box flex={1}>
            <div style={{ fontWeight: 600 }}>{album?.name || 'No album loaded'}</div>
            <div style={{ color: '#aaa', marginBottom: 8 }}>{album?.artists?.map(a=>a.name).join(', ')}</div>

            <Transport
              tracks={tracks}
              currentIndex={index}
              onPlay={() => playTrack(tracks[index])}
              onPause={pause}
              onNext={() => setIndex(i => (i + 1) % tracks.length)}
              onPrev={() => setIndex(i => (i - 1 + tracks.length) % tracks.length)}
            />

            <Box mt={2}><Visualizer /></Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

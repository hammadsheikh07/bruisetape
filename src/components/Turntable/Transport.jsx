import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Transport({ onPlay, onPause, onNext, onPrev, tracks, currentIndex }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" onClick={onPrev}>⏮</Button>
      <Button variant="contained" onClick={onPlay}>▶️</Button>
      <Button variant="outlined" onClick={onPause}>⏸</Button>
      <Button variant="outlined" onClick={onNext}>⏭</Button>
      <div style={{ marginLeft: 12 }}>{tracks?.[currentIndex]?.name}</div>
    </Stack>
  );
}

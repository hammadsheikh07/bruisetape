import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useSpotifyAuth } from './hooks/useSpotifyAuth';
import TurnTablePage from './pages/TurnTablePage';

export default function App() {
  const { token, isAuthenticated, login, logout, user } = useSpotifyAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <h1 style={{ margin: 0 }}>Digital Vinyl — Shelf</h1>
        <div>
          {!isAuthenticated ? (
            <button onClick={login} className="mui-btn">Login Spotify</button>
          ) : (
            <>
              <span style={{ marginRight: 12 }}>{user?.display_name || 'Signed in'}</span>
              <button onClick={logout} className="mui-btn">Logout</button>
            </>
          )}
        </div>
      </Box>

      <TurnTablePage token={token} isAuthenticated={isAuthenticated} />
    </Container>
  );
}

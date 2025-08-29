import { useEffect, useState, useCallback } from 'react';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin;
const SCOPE = 'user-read-private user-read-email streaming user-modify-playback-state user-read-playback-state';

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(digest);
}
function generateRandomString(len = 64) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(n => ('0' + n.toString(16)).slice(-2)).join('');
}

export function useSpotifyAuth() {
  const [token, setToken] = useState(() => sessionStorage.getItem('dv_token') || null);
  const [expiresAt, setExpiresAt] = useState(() => Number(sessionStorage.getItem('dv_expires') || '0'));
  const [user, setUser] = useState(null);

  const login = useCallback(async () => {
    const verifier = generateRandomString(64);
    const challenge = await generateCodeChallenge(verifier);
    sessionStorage.setItem('pkce_verifier', verifier);
    const url = new URL('https://accounts.spotify.com/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('scope', SCOPE);
    url.searchParams.set('redirect_uri', REDIRECT);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('code_challenge', challenge);
    window.location.href = url.toString();
  }, []);

  // After redirect with ?code=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code) {
      // exchange code for token via Spotify token endpoint using PKCE (no client secret)
      (async () => {
        const verifier = sessionStorage.getItem('pkce_verifier');
        if (!verifier) return;
        const body = new URLSearchParams();
        body.set('grant_type', 'authorization_code');
        body.set('code', code);
        body.set('redirect_uri', REDIRECT);
        body.set('client_id', CLIENT_ID);
        body.set('code_verifier', verifier);

        const res = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        });
        const data = await res.json();
        if (data.access_token) {
          const expireAt = Date.now() + (data.expires_in * 1000);
          sessionStorage.setItem('dv_token', data.access_token);
          sessionStorage.setItem('dv_expires', expireAt.toString());
          setToken(data.access_token);
          setExpiresAt(expireAt);
          window.history.replaceState({}, document.title, REDIRECT);
        } else {
          console.error('spotify token err', data);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    // fetch user profile
    (async () => {
      try {
        const r = await fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${token}` }});
        if (r.ok) {
          const j = await r.json(); setUser(j);
        } else {
          // expired or invalid
          setToken(null);
          sessionStorage.removeItem('dv_token');
          sessionStorage.removeItem('dv_expires');
        }
      } catch(e) { console.error(e); }
    })();
  }, [token]);

  const logout = () => {
    setToken(null); setUser(null);
    sessionStorage.removeItem('dv_token'); sessionStorage.removeItem('dv_expires');
  };

  return { token, isAuthenticated: !!token, login, logout, user };
}

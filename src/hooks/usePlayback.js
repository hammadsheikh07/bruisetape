import { useEffect, useRef, useState } from 'react';

// lightweight playback hook:
// - If Spotify Web Playback SDK is available & token is present -> can control playback (requires Premium).
// - Otherwise fallback to audio element playing track.preview_url.

export function usePlayback(token) {
  const audioRef = useRef(null);
  const [isPremiumDevice, setIsPremiumDevice] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const webPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    if (!token) return;
    // try to inject Web Playback SDK
    if (!window.Spotify) {
      const s = document.createElement('script');
      s.src = 'https://sdk.scdn.co/spotify-player.js';
      document.head.appendChild(s);
    }
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Digital Vinyl Player (web)',
        getOAuthToken: cb => cb(token)
      });
      webPlayerRef.current = player;

      player.addListener('ready', ({ device_id }) => { setPlayerReady(true); console.log('Ready', device_id); });
      player.addListener('not_ready', ({ device_id }) => console.log('Not ready', device_id));
      player.addListener('player_state_changed', (st) => {
        if (!st) return;
        setIsPlaying(!st.paused);
      });

      player.connect().then(success => {
        if (success) console.log('connected to spotify player');
      });
    };
  }, [token]);

  const playUri = async (uriOrUrl) => {
    // if it's a spotify: track uri and player ready, use Web API to transfer play to SDK device
    if (webPlayerRef.current && uriOrUrl.startsWith('spotify:')) {
      // get the device id from the connected player
      const player = webPlayerRef.current;
      const state = await player.getCurrentState();
      // We can't directly start playback via SDK; we call the Web API /me/player/play with device_id
      // But without backend we call without device id, Spotify may choose the web player.
      fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ uris: [uriOrUrl] })
      }).catch(e => console.warn('spotify web play failed', e));
      setCurrentTrack(uriOrUrl);
      setIsPlaying(true);
      return;
    }

    // fallback: treat as a direct preview_url or local file
    if (!audioRef.current) audioRef.current = new Audio();
    try {
      audioRef.current.src = uriOrUrl;
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentTrack(uriOrUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    } catch (e) {
      console.error('playback error', e);
    }
  };

  const pause = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  };

  const seek = (seconds) => {
    if (audioRef.current) audioRef.current.currentTime = seconds;
    // for Spotify SDK we'd call Web API seek endpoint
    if (token && webPlayerRef.current) {
      fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.round(seconds * 1000)}`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
  };

  return { playUri, pause, seek, isPlaying, playerReady, currentTrack };
}

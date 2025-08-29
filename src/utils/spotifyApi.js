import axios from 'axios';

export async function searchAlbums(q, token) {
  if (!token) return { items: [] };
  const res = await axios.get('https://api.spotify.com/v1/search', {
    params: { q, type: 'album', limit: 10 },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.albums;
}

export async function getAlbumTracks(albumId, token) {
  if (!token) return [];
  const res = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 50 }
  });
  return res.data.items;
}

import { AppState } from './state/appStateReducer'

const API_URL = 'http://localhost:5000'

export const save = (payload: AppState) => {
  return fetch(`${API_URL}/save`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("Error while saving state");
    }
  });
}

export const load = () => {
  return fetch(`${API_URL}/load`)
    .then((res) => {
      if (res.ok) {
        return res.json() as Promise<AppState>;
      } else {
        throw new Error("Error while loading state");
      }
    });
}
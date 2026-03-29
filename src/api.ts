import { AppState } from './state/appStateReducer'
declare const process: any;
const API_URL = process.env.REACT_APP_API_URL;

// 🔥 SAVE
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
};

// 🔥 LOAD (with retry)
export const load = async () => {
  try {
    const res = await fetch(`${API_URL}/load`);
    if (!res.ok) throw new Error("Failed");
    return await res.json();
  } catch (err) {
    console.log("Retrying backend (waking up)...");

    await new Promise(resolve => setTimeout(resolve, 5000));

    const res = await fetch(`${API_URL}/load`);
    return await res.json();
  }
};
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const trainLetter = async (letter: string, landmarks: { x:number, y:number, z:number }[]) => {
  const res = await axios.post(`${API_URL}/letters/train`, { label: letter, landmarks });
  return res.data;
};

export const predictLetter = async (landmarks: { x:number, y:number, z:number }[]) => {
  const res = await axios.post(`${API_URL}/letters/predict`, { landmarks });
  return res.data;
};

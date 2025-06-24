import axios from "axios";

const API_URL = "http://localhost:7172/api/account"; // Ändra om du kör på annan port

export async function register(username: string, email: string, password: string) {
  const res = await axios.post(`${API_URL}/register`, { username, email, password });
  return res.data;
}

export async function login(username: string, password: string) {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data;
}
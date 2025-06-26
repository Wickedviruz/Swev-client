import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login(username, password);
      if (result.success) {
        // Här sparar du user i localstorage/context och skickar till dashboard/game
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/accountmanagement");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <main>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Log in</button>
        {error && <div style={{color:"red"}}>{error}</div>}
      </form>
      <a href="/register">Create account</a>
    </main>
  );
};
export default LoginPage;

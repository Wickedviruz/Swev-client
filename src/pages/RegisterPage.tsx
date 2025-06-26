import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await register(username, email, password);
      if (result.success) {
        // Direkt till login
        navigate("/login");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err && (err as any).response?.data?.error) {
        setError((err as any).response.data.error);
      } else {
        setError("Something went wrong!");
      }
    }
  };

  return (
    <main>
      <h2>Create account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Create!</button>
        {error && <div style={{color:"red"}}>{error}</div>}
      </form>
      <a href="/login">Already have an account? Log in</a>
    </main>
  );
};
export default RegisterPage;

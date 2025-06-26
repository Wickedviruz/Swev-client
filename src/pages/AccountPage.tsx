import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

// Skapa interface för karaktär om du vill strikt typa
interface Character {
  id: number;
  name: string;
  level: number;
  // ...lägg till fler fält
}

const AccountPage = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Hämta karaktärer för inloggat konto
    axios
      .get(`http://localhost:7172/api/character/${user.id}`) // Du kan behöva lägga till /character endpoint i backend
      .then((res) => setCharacters(res.data.characters))
      .catch((err) => setError("Could not fetch characters"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handlePlay = (characterId: number) => {
    // Här kan du spara vilken karaktär som är vald (localStorage, context, state)
    localStorage.setItem("characterId", characterId.toString());
    navigate("/game");
  };

  return (
    <Layout>
      <h2>Account Management</h2>
      <div>
        <strong>User:</strong> {user?.username}
      </div>
      <h3>Your characters</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : characters.length === 0 ? (
        <div>No characters! create your first</div>
      ) : (
        <ul>
          {characters.map((c) => (
            <li key={c.id}>
              {c.name} (Lvl {c.level}){" "}
              <button onClick={() => handlePlay(c.id)}>Play as</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/create-character")}>Chreat new character!</button>
      <button onClick={() => {
        localStorage.removeItem("user");
        navigate("/");
      }}>Log out</button>
    </Layout>
  );
};

export default AccountPage;

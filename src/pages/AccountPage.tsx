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
      .catch((err) => setError("Kunde inte hämta karaktärer"))
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
        <strong>Användare:</strong> {user?.username}
      </div>
      <h3>Dina karaktärer</h3>
      {loading ? (
        <div>Laddar...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : characters.length === 0 ? (
        <div>Inga karaktärer – skapa din första!</div>
      ) : (
        <ul>
          {characters.map((c) => (
            <li key={c.id}>
              {c.name} (Lvl {c.level}){" "}
              <button onClick={() => handlePlay(c.id)}>Spela som</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/create-character")}>Skapa ny karaktär</button>
      <button onClick={() => {
        localStorage.removeItem("user");
        navigate("/login");
      }}>Logga ut</button>
    </Layout>
  );
};

export default AccountPage;

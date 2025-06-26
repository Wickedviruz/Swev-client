import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import CreateCharacterPage from "./pages/CreateCharacterPage";
import GamePage from "./pages/GamePage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/accountmanagement" element={<AccountPage />} />
      <Route path="/create-character" element={<CreateCharacterPage />} />
      <Route path="/game" element={<GamePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;

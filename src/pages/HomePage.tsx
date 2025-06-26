import Layout from "../components/Layout";

const HomePage = () => (
    <Layout>
    <h1>Swevolutions</h1>
    <nav>
      <a href="/login">Login</a> | <a href="/register">Register</a> | <a href="/game">Play</a>
      {/* Lägg till Highscore/About senare */}
    </nav>
    <section>
      <h2>Welcome!</h2>
      <p>Nyheter och info här...</p>
    </section>

  </Layout>
);
export default HomePage;

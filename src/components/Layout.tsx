import "./Layout.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aac-layout">
      <header>
        <div className="banner">Swevolutions</div>
        <nav>
          <a href="/">News</a>
          <a href="/register">Create Account</a>
          <a href="/downloads">Downloads</a>
          <a href="/forum">Forum</a>
        </nav>
      </header>
      <div className="main-area">
        <aside className="sidebar left">
          {/* Här kan du loopa ut sektion/länkar */}
          <section>
            <div className="sidebar-header">Home</div>
            <a href="#">Latest News</a>
            <a href="#">Rules</a>
            {/* ... */}
          </section>
          <section>
            <div className="sidebar-header">Community</div>
            <a href="#">Characters</a>
            <a href="#">Online</a>
            {/* ... */}
          </section>
          {/* ... */}
        </aside>
        <main className="center-content">
          {children}
        </main>
        <aside className="sidebar right">
          <section>
            <div className="sidebar-header">Status</div>
            {/* Server status här */}
          </section>
          <section>
            <div className="sidebar-header">Best players</div>
            {/* Lista toppspelare */}
          </section>
        </aside>
      </div>
      <footer>
        &copy; {new Date().getFullYear()} Swevolutions Devs
      </footer>
    </div>
  );
}

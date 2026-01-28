import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>ExamSecure</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/quiz/20">Start Quiz</Link>
        <Link style={styles.link} to="/leaderboard">Leaderboard</Link>
        <Link style={styles.link} to="/admin">Admin</Link>
      </nav>

      <button style={styles.logout} onClick={logout}>Logout</button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: 220,
    background: '#0b3a82',
    color: '#fff',
    height: '100vh',
    padding: 20,
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    marginBottom: 30,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  link: {
    color: '#dbeafe',
    textDecoration: 'none',
    fontWeight: 600,
  },
  logout: {
    marginTop: 40,
    background: '#ef4444',
    border: 'none',
    padding: 10,
    color: '#fff',
    borderRadius: 8,
    cursor: 'pointer',
  },
};

export default Sidebar;

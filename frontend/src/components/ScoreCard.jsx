const ScoreCard = ({ score, total }) => {
  const percentage = ((score / total) * 100).toFixed(2);

  return (
    <div style={styles.card}>
      <div style={styles.circle}>
        <span style={styles.score}>{score}</span>
        <span>/{total}</span>
      </div>
      <p><strong>{percentage}%</strong> Accuracy</p>
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    marginBottom: "25px",
  },
  circle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    margin: "0 auto 15px",
  },
  score: {
    fontSize: "42px",
    fontWeight: "700",
  },
};

export default ScoreCard;

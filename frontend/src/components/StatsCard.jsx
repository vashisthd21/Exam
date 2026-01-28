const StatsCard = ({ correct = 0, incorrect = 0, total = 0 }) => {
  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, background: "#dcfce7" }}>
        <h4>Correct</h4>
        <p>{correct}</p>
      </div>

      <div style={{ ...styles.card, background: "#fee2e2" }}>
        <h4>Incorrect</h4>
        <p>{incorrect}</p>
      </div>

      <div style={{ ...styles.card, background: "#e0f2fe" }}>
        <h4>Total</h4>
        <p>{total}</p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },
  card: {
    flex: 1,
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "600",
  },
};

export default StatsCard;

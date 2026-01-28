const TimeSummary = ({ quizType, timeTaken = 0, createdAt }) => {
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString()
    : "N/A";

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📘 Exam Summary</h3>

      <div style={styles.row}>
        <span>📝 Exam Type</span>
        <strong>{quizType}</strong>
      </div>

      <div style={styles.row}>
        <span>⏱ Time Taken</span>
        <strong>
          {minutes} min {seconds} sec
        </strong>
      </div>

      <div style={styles.row}>
        <span>📅 Attempted On</span>
        <strong>{formattedDate}</strong>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
    padding: "28px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
  },

  title: {
    fontSize: "20px",
    fontWeight: 800,
    marginBottom: "18px",
    color: "#0f172a",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "15px",
    color: "#1f2937",
  },
};

export default TimeSummary;

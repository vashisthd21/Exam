const SectionAnalysis = ({ questions, userAnswers }) => {
  const sectionData = {};

  questions.forEach((q, index) => {
    const section = q.section || "General";

    if (!sectionData[section]) {
      sectionData[section] = { total: 0, correct: 0 };
    }

    sectionData[section].total++;

    if (userAnswers[index] === q.correctAnswer) {
      sectionData[section].correct++;
    }
  });

  return (
    <div style={styles.card}>
      <h3>Section-wise Performance</h3>

      {Object.keys(sectionData).map((sec) => (
        <div key={sec} style={styles.row}>
          <span>{sec}</span>
          <span>
            {sectionData[sec].correct} / {sectionData[sec].total}
          </span>
        </div>
      ))}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "25px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default SectionAnalysis;

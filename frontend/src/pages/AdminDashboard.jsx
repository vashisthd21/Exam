import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

const API = "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/dashboard");

    setAdmin(user);
    fetchStats();
    fetchUsers();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/stats`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!admin) return null;

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const submissionData = stats?.dailySubmissions || [];
  const scoreData =
    users.slice(0, 5).map((u) => ({
      name: u.name,
      score: u.quizScore,
    })) || [];

  const renderDashboard = () => (
    <>
      <div style={styles.header}>
        <h1>Welcome, {admin.name} 👋</h1>
        <p>{new Date().toDateString()}</p>
      </div>

      <div style={styles.kpiGrid}>
        <KPI title="Total Users" value={stats?.totalUsers} />
        <KPI title="Total Quizzes" value={stats?.totalQuizzes} />
        <KPI title="Submissions Today" value={stats?.submissionsToday} />
        <KPI title="Active Exams" value={stats?.activeExams} />
        <KPI title="Avg Score" value={stats?.averageScore} />
      </div>

      <div style={styles.chartGrid}>
        <div style={styles.chartCard}>
          <h3>Submissions Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={submissionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3>Top Performers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={scoreData}
              margin={{ top: 20, right: 20, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
                tickFormatter={(value) =>
                  value.length > 10 ? value.substring(0, 10) + "..." : value
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div style={styles.userSection}>
      <h2>User Management</h2>

      <div style={styles.filterBar}>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Total Score</th>
            <th style={styles.th}>Quiz Score</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Joined</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u, index) => (
            <tr
              key={u._id}
              style={{
                background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
              }}
            >
              <td style={styles.tdBold}>{u.name}</td>
              <td style={styles.td}>{u.email}</td>

              <td>
                <span
                  style={{
                    ...styles.badge,
                    background:
                      u.role === "admin" ? "#ef4444" : "#3b82f6",
                  }}
                >
                  {u.role}
                </span>
              </td>

              <td style={styles.td}>{u.totalScore}</td>
              <td style={styles.td}>{u.quizScore}</td>

              <td>
                <span
                  style={{
                    ...styles.badge,
                    background:
                      u.quizSubmitted ? "#10b981" : "#f59e0b",
                  }}
                >
                  {u.quizSubmitted ? "Submitted" : "Pending"}
                </span>
              </td>

              <td style={styles.td}>
                {new Date(u.createdAt).toLocaleDateString()}
              </td>

              <td>
                <button style={styles.actionBtn}>Edit</button>
                <button style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.logo}>ExamSecure</h2>

          <div
            style={{
              ...styles.menuItem,
              ...(activeTab === "dashboard" && styles.activeMenu),
            }}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </div>

          <div
            style={{
              ...styles.menuItem,
              ...(activeTab === "users" && styles.activeMenu),
            }}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </div>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "users" && renderUsers()}
      </div>
    </div>
  );
};

const KPI = ({ title, value }) => (
  <div style={styles.kpiCard}>
    <h4>{title}</h4>
    <h2>{value || 0}</h2>
  </div>
);

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "Inter",
  },

  sidebar: {
    width: 250,
    background: "#0f172a",
    color: "white",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: { marginBottom: 30 },

  menuItem: {
    padding: 12,
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 10,
  },

  activeMenu: {
    background: "#1e293b",
  },

  logoutBtn: {
    padding: 12,
    background: "#ef4444",
    border: "none",
    borderRadius: 8,
    color: "white",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 40,
    overflowY: "auto",
    background: "#f1f5f9",
  },

  header: { marginBottom: 30 },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 20,
    marginBottom: 40,
  },

  kpiCard: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 40,
  },

  chartCard: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  userSection: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  },

  filterBar: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },

  searchInput: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    flex: 1,
  },

  select: {
    padding: 10,
    borderRadius: 8,
  },
  th: {
  textAlign: "left",
  padding: "14px",
  background: "#0f172a",
  color: "white",
  fontSize: 14,
},

td: {
  padding: "14px",
  fontSize: 14,
},

tdBold: {
  padding: "14px",
  fontWeight: 600,
},

badge: {
  padding: "5px 12px",
  borderRadius: 20,
  color: "white",
  fontSize: 12,
  fontWeight: 600,
},

actionBtn: {
  padding: "6px 12px",
  marginRight: 8,
  borderRadius: 6,
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
},

deleteBtn: {
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
},
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Shield,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  UsersRound,
  FileText,
  CheckCircle2,
  Trophy,
  Search,
  Bell,
  Activity,
  TrendingUp,
  Clock,
  Save,
  Sliders,
  Globe,
  Lock,
  Mail
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [examsList, setExamsList] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // --- Settings Form State ---
  const [settingsForm, setSettingsForm] = useState({
    siteName: "ExamSecure",
    supportEmail: "support@examsecure.io",
    enableRegistration: true,
    maintenanceMode: false,
    defaultExamDuration: 60,
    maxQuestionsPerExam: 100,
    autoGrading: true,
    emailNotifications: true,
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return navigate("/login");
    if (user.role !== "admin") return navigate("/dashboard");

    setAdmin(user);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, examsRes] = await Promise.all([
        axios.get(`${API}/api/admin/dashboard`, { withCredentials: true }),
        axios.get(`${API}/api/admin/users`, { withCredentials: true }),
        axios.get(`${API}/api/admin/exams`, { withCredentials: true }).catch(() => ({ data: [] })) 
      ]);
      
      setStats(statsRes.data);
      setUsersList(usersRes.data);
      
      const fetchedExams = Array.isArray(examsRes.data) 
        ? examsRes.data 
        : (examsRes.data.exams || []);
        
      setExamsList(fetchedExams);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  if (isLoading || !admin) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#64748B', fontWeight: 500 }}>Initializing Workspace...</p>
      </div>
    );
  }

  // --- Process Data ---
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const submissionData = stats?.dailySubmissions || [];
  const scoreData = stats?.topStudents?.map((u) => ({
    name: u.name,
    score: u.quizScore || 0,
  })) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // --- Render Functions ---

  const renderDashboard = () => (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>{getGreeting()}, {admin.name.split(' ')[0]}</h1>
          <p style={styles.pageSubtitle}>Everything looks healthy today. Here is your system overview.</p>
        </div>
      </div>

      <div style={styles.kpiGrid}>
        <KPI title="TOTAL USERS" value={stats?.totalUsers} icon={<UsersRound size={20} />} color="#2563EB" trend="+12%" />
        <KPI title="ACTIVE EXAMS" value={stats?.activeExams} icon={<FileText size={20} />} color="#F59E0B" trend="+4%" />
        <KPI title="SUBMISSIONS TODAY" value={stats?.submissionsToday} icon={<CheckCircle2 size={20} />} color="#10B981" trend="+24%" />
        <KPI title="HIGHEST SCORE" value={`${stats?.highestScore || 0} pts`} icon={<Trophy size={20} />} color="#8B5CF6" />
      </div>

      <div style={styles.dashboardGrid}>
        <div style={styles.mainContent}>
          <div className="glass-card" style={styles.chartCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <Activity size={18} color="#64748B" />
                <h3 style={styles.cardHeaderTitle}>Activity Trend (Last 7 Days)</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={submissionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={styles.chartCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <Trophy size={18} color="#64748B" />
                <h3 style={styles.cardHeaderTitle}>Top Performing Students</h3>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="score" fill="#10B981" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.sideContent}>
          <div className="glass-card" style={styles.chartCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <Settings size={18} color="#64748B" />
                <h3 style={styles.cardHeaderTitle}>System Breakdown</h3>
              </div>
            </div>
            <div style={styles.breakdownList}>
              <BreakdownItem label="Students" count={stats?.totalStudents} total={stats?.totalUsers} color="#2563EB" />
              <BreakdownItem label="Teachers" count={stats?.totalTeachers} total={stats?.totalUsers} color="#F59E0B" />
              <BreakdownItem label="Admins" count={stats?.totalAdmins} total={stats?.totalUsers} color="#EF4444" />
            </div>
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={styles.subtext}>Total Exams</span>
                <strong style={{color: '#0F172A'}}>{stats?.totalExams}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={styles.subtext}>Published Exams</span>
                <strong style={{color: '#0F172A'}}>{stats?.publishedExams}</strong>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{...styles.chartCard, flex: 1}}>
            <div style={styles.cardHeader}>
              <div style={styles.cardHeaderLeft}>
                <Clock size={18} color="#64748B" />
                <h3 style={styles.cardHeaderTitle}>Recent Activity</h3>
              </div>
            </div>
            <div style={styles.activityFeed}>
              {stats?.recentActivities?.length > 0 ? (
                stats.recentActivities.map((act, idx) => (
                  <div key={idx} style={styles.activityItem}>
                    <div style={styles.activityIcon}><TrendingUp size={14} /></div>
                    <div style={styles.activityDetails}>
                      <p style={styles.activityText}>
                        <span style={{color: '#0F172A', fontWeight: 600}}>{act.student}</span> submitted <span style={{fontWeight: 500}}>{act.exam}</span>
                      </p>
                      <p style={styles.activityTime}>{act.score} pts • {new Date(act.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={styles.subtext}>No recent activity found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>User Directory</h1>
          <p style={styles.pageSubtitle}>Manage access and roles across the platform.</p>
        </div>
      </div>

      <div className="glass-card" style={styles.userSection}>
        <div style={styles.filterBar}>
          <div style={styles.searchWrapper}>
            <Search size={16} style={styles.searchIcon} />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Score (Quiz/Total)</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} style={styles.tr} className="table-row">
                    <td style={styles.td}>
                      <div style={styles.userInfo}>
                        <div style={styles.avatar}>{u.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <p style={styles.tdBold}>{u.name}</p>
                          <p style={styles.tdSub}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                          ...styles.badge,
                          background: u.role === "admin" ? "#FEF2F2" : u.role === "teacher" ? "#FFFBEB" : "#EFF6FF",
                          color: u.role === "admin" ? "#EF4444" : u.role === "teacher" ? "#F59E0B" : "#2563EB",
                        }}
                      >
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.scoreText}>{u.quizScore || 0}</span> <span style={{color: '#94A3B8'}}>/ {u.totalScore || 0}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div>
                        <span style={styles.tdSub}>Active</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.tdSub}>{new Date(u.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn-outline" style={styles.actionBtn}>Edit</button>
                        <button className="btn-danger" style={styles.deleteBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={styles.emptyState}>No users found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="animate-fade-in">
      <div style={{ ...styles.header, marginBottom: 24 }}>
        <div>
          <h1 style={styles.pageTitle}>Exam Management</h1>
          <p style={styles.pageSubtitle}>Monitor and manage all system exams.</p>
        </div>
      </div>

      <div className="glass-card" style={styles.userSection}>
        {examsList && examsList.length > 0 ? (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Exam Details</th>
                  <th style={styles.th}>Teacher</th>
                  <th style={styles.th}>Difficulty</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Questions</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {examsList.map((exam) => {
                  const teacherDisplay =
                    typeof exam.teacher === "object" && exam.teacher?.name
                      ? exam.teacher.name
                      : typeof exam.createdBy === "object" && exam.createdBy?.name
                      ? exam.createdBy.name
                      : exam.teacherName || "Teacher";

                  return (
                    <tr key={exam._id} style={styles.tr} className="table-row">
                      <td style={styles.td}>
                        <p style={styles.tdBold}>{exam.title || exam.examTitle || "Untitled Exam"}</p>
                        <p style={styles.tdSub}>{exam.subject || exam.topic || "General"}</p>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.userInfo}>
                          <div style={{ ...styles.avatar, width: 28, height: 28, fontSize: 11 }}>
                            {teacherDisplay.charAt(0).toUpperCase()}
                          </div>
                          <p style={styles.tdBold}>{teacherDisplay}</p>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background: "#EFF6FF",
                            color: "#2563EB",
                            border: "1px solid #BFDBFE",
                          }}
                        >
                          {exam.difficulty || "Medium"}
                        </span>
                      </td>
                      <td style={styles.td}>{exam.duration ? `${exam.duration} mins` : "60 mins"}</td>
                      <td style={styles.td}>{exam.questions?.length || exam.totalQuestions || 0} Questions</td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn-outline" style={styles.actionBtn}>
                            Edit
                          </button>
                          <button className="btn-danger" style={styles.deleteBtn}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ ...styles.emptyState, padding: '80px 20px' }}>
            <div style={{ 
              width: 64, height: 64, borderRadius: '50%', background: '#F1F5F9', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 16px auto' 
            }}>
              <BookOpen size={28} color="#94A3B8" />
            </div>
            <h3 style={{ margin: '0 0 8px 0', color: '#0F172A', fontSize: 16, fontWeight: 600 }}>No Exams Found</h3>
            <p style={{ margin: 0, color: '#64748B', maxWidth: 350, marginInline: 'auto', lineHeight: 1.5 }}>
              There are currently no exams available in the system database.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // --- NEW FUNCTIONAL SETTINGS VIEW ---
  const renderSettings = () => (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>System Settings</h1>
          <p style={styles.pageSubtitle}>Configure global application rules, exam defaults, and security settings.</p>
        </div>
      </div>

      {settingsSaved && (
        <div style={styles.successAlert}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>System settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Section 1: General Platform Configuration */}
        <div className="glass-card" style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <Globe size={18} color="#2563EB" />
              <h3 style={styles.cardHeaderTitle}>General Platform Settings</h3>
            </div>
          </div>

          <div style={styles.settingsGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Platform Name</label>
              <input
                type="text"
                style={styles.formInput}
                value={settingsForm.siteName}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Support Email</label>
              <input
                type="email"
                style={styles.formInput}
                value={settingsForm.supportEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
              />
            </div>
          </div>

          <div style={styles.toggleRow}>
            <div>
              <p style={styles.toggleTitle}>Allow Public Student Registration</p>
              <p style={styles.toggleDesc}>Enable students to sign up independently without teacher invitation.</p>
            </div>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={settingsForm.enableRegistration}
              onChange={(e) => setSettingsForm({ ...settingsForm, enableRegistration: e.target.checked })}
            />
          </div>

          <div style={{ ...styles.toggleRow, borderBottom: 'none' }}>
            <div>
              <p style={styles.toggleTitle}>Maintenance Mode</p>
              <p style={styles.toggleDesc}>Disable exam taking temporarily for scheduled system updates.</p>
            </div>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={settingsForm.maintenanceMode}
              onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
            />
          </div>
        </div>

        {/* Section 2: Exam & Assessment Defaults */}
        <div className="glass-card" style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderLeft}>
              <Sliders size={18} color="#F59E0B" />
              <h3 style={styles.cardHeaderTitle}>Exam & Evaluation Defaults</h3>
            </div>
          </div>

          <div style={styles.settingsGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Default Exam Duration (Minutes)</label>
              <input
                type="number"
                style={styles.formInput}
                value={settingsForm.defaultExamDuration}
                onChange={(e) => setSettingsForm({ ...settingsForm, defaultExamDuration: Number(e.target.value) })}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Maximum Questions Per Exam</label>
              <input
                type="number"
                style={styles.formInput}
                value={settingsForm.maxQuestionsPerExam}
                onChange={(e) => setSettingsForm({ ...settingsForm, maxQuestionsPerExam: Number(e.target.value) })}
              />
            </div>
          </div>

          <div style={{ ...styles.toggleRow, borderBottom: 'none' }}>
            <div>
              <p style={styles.toggleTitle}>Automated Exam Grading</p>
              <p style={styles.toggleDesc}>Automatically evaluate multiple choice questions upon submission.</p>
            </div>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={settingsForm.autoGrading}
              onChange={(e) => setSettingsForm({ ...settingsForm, autoGrading: e.target.checked })}
            />
          </div>
        </div>

        {/* Save Button Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button type="submit" className="btn-primary" style={styles.primaryBtn}>
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.25s ease;
        }
        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        }
        
        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); background: #1D4ED8 !important; }
        .btn-outline { transition: all 0.2s ease; }
        .btn-outline:hover { background: #F1F5F9; border-color: #CBD5E1; }
        .btn-danger { transition: all 0.2s ease; }
        .btn-danger:hover { background: #DC2626; border-color: #DC2626; color: white !important; }
        .table-row:hover { background: #F8FAFC; }
        .sidebar-item:hover { background: #F1F5F9; color: #0F172A !important; }
        .logout-btn:hover { background: #FEE2E2; color: #EF4444 !important; }
        
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>

      <div style={styles.container}>
        <aside style={styles.sidebar}>
          <div>
            <div style={styles.logoContainer}>
              <Shield size={24} color="#2563EB" />
              <h2 style={styles.logoText}>ExamSecure</h2>
            </div>
            <nav style={styles.nav}>
              <div style={styles.navSectionTitle}>MENU</div>
              <div className="sidebar-item" style={activeTab === "dashboard" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("dashboard")}>
                <LayoutDashboard size={18} /> Dashboard
              </div>
              <div className="sidebar-item" style={activeTab === "users" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("users")}>
                <Users size={18} /> Users
              </div>
              <div className="sidebar-item" style={activeTab === "exams" ? styles.activeMenuItem : styles.menuItem} onClick={() => setActiveTab("exams")}>
                <BookOpen size={18} /> Exams
              </div>
              <div className="sidebar-item" style={styles.menuItem}>
                <BarChart3 size={18} /> Analytics
              </div>
              
              <div style={{...styles.navSectionTitle, marginTop: 24}}>SYSTEM</div>
              
              {/* Functional Settings Tab Button */}
              <div 
                className="sidebar-item" 
                style={activeTab === "settings" ? styles.activeMenuItem : styles.menuItem} 
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} /> Settings
              </div>
            </nav>
          </div>
          <div style={styles.sidebarFooter}>
            <button style={styles.logoutBtn} onClick={handleLogout} className="logout-btn">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </aside>

        <div style={styles.mainWrapper}>
          <header style={styles.topNav}>
            <div style={styles.topNavSearch}>
              <Search size={16} color="#64748B" />
              <input type="text" placeholder="Type to search..." style={styles.topNavInput} />
            </div>
            <div style={styles.topNavRight}>
              <button style={styles.iconBtn}><Bell size={18} color="#64748B" /></button>
              <div style={styles.topNavDivider}></div>
              <div style={styles.adminProfile}>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.adminName}>{admin.name}</p>
                  <p style={styles.adminRole}>Administrator</p>
                </div>
                <div style={styles.adminAvatar}>{admin.name.charAt(0).toUpperCase()}</div>
              </div>
            </div>
          </header>

          <main style={styles.main}>
            <div style={styles.mainInner}>
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "users" && renderUsers()}
              {activeTab === "exams" && renderExams()}
              {activeTab === "settings" && renderSettings()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// --- Sub Components ---

const KPI = ({ title, value, icon, color, trend }) => (
  <div className="glass-card" style={styles.kpiCard}>
    <div style={styles.kpiHeader}>
      <p style={styles.kpiTitle}>{title}</p>
      <div style={{ color: color, background: `${color}15`, padding: '8px', borderRadius: '8px' }}>{icon}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 }}>
      <h2 style={styles.kpiValue}>{value || 0}</h2>
      {trend && <span style={styles.trendBadge}>{trend}</span>}
    </div>
  </div>
);

const BreakdownItem = ({ label, count, total, color }) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div style={styles.breakdownItem}>
      <div style={styles.breakdownHeader}>
        <span style={styles.breakdownLabel}>{label}</span>
        <span style={styles.breakdownCount}>{count || 0}</span>
      </div>
      <div style={styles.progressBarBg}>
        <div style={{ ...styles.progressBarFill, width: `${percentage}%`, background: color }}></div>
      </div>
    </div>
  );
};

// --- Styles ---

const styles = {
  container: { display: "flex", height: "100vh", backgroundColor: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: '#F8FAFC' },
  spinner: { width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 16 },

  sidebar: { width: 260, background: "#FFFFFF", color: "#0F172A", display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: "1px solid #E2E8F0", zIndex: 10 },
  logoContainer: { display: 'flex', alignItems: 'center', gap: 10, padding: '24px 20px', borderBottom: '1px solid #F1F5F9' },
  logoText: { margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: '#0F172A' },
  nav: { padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 6 },
  navSectionTitle: { fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.1em', marginBottom: 10, paddingLeft: 12 },
  menuItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: "pointer", color: '#475569', fontSize: 14, fontWeight: 500, transition: 'all 0.2s ease' },
  activeMenuItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, cursor: "pointer", background: "#EFF6FF", color: '#2563EB', fontSize: 14, fontWeight: 600 },
  sidebarFooter: { padding: '20px 16px', borderTop: '1px solid #F1F5F9' },
  logoutBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: "transparent", border: "none", borderRadius: 8, color: "#64748B", fontSize: 14, cursor: "pointer", fontWeight: 500, transition: 'background 0.2s' },

  mainWrapper: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E8F0', zIndex: 5 },
  topNavSearch: { display: 'flex', alignItems: 'center', gap: 8, background: '#F1F5F9', padding: '10px 16px', borderRadius: '999px', width: '320px' },
  topNavInput: { border: 'none', background: 'transparent', outline: 'none', fontSize: 14, width: '100%', color: '#0F172A' },
  topNavRight: { display: 'flex', alignItems: 'center', gap: 24 },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 6, borderRadius: '50%' },
  topNavDivider: { width: 1, height: 24, background: '#E2E8F0' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: 12 },
  adminName: { margin: 0, fontSize: 14, fontWeight: 600, color: '#0F172A' },
  adminRole: { margin: 0, fontSize: 12, color: '#64748B' },
  adminAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #60A5FA)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 },

  main: { flex: 1, overflowY: "auto", padding: '32px' },
  mainInner: { maxWidth: 1200, margin: '0 auto' },
  header: { marginBottom: 32 },
  pageTitle: { margin: '0 0 6px 0', fontSize: 24, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.02em' },
  pageSubtitle: { margin: 0, fontSize: 14, color: '#64748B' },
  primaryBtn: { padding: '10px 18px', borderRadius: 8, border: 'none', background: '#2563EB', color: 'white', fontWeight: 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },

  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 32 },
  kpiCard: { padding: '24px 28px', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)' },
  kpiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  kpiTitle: { margin: 0, fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' },
  kpiValue: { margin: 0, fontSize: 32, fontWeight: 600, color: '#0F172A', letterSpacing: '-0.03em' },
  trendBadge: { background: '#ECFDF5', color: '#10B981', padding: '4px 10px', borderRadius: '999px', fontSize: 12, fontWeight: 600 },

  dashboardGrid: { display: 'flex', gap: 24, flexWrap: 'wrap' },
  mainContent: { flex: 2, minWidth: '600px', display: 'flex', flexDirection: 'column', gap: 24 },
  sideContent: { flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: 24 },
  chartCard: { padding: 28, borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' },
  cardHeader: { marginBottom: 24 },
  cardHeaderLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  cardHeaderTitle: { margin: 0, fontSize: 15, fontWeight: 600, color: '#0F172A' },

  breakdownList: { display: 'flex', flexDirection: 'column', gap: 16 },
  breakdownItem: { width: '100%' },
  breakdownHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  breakdownLabel: { fontSize: 13, fontWeight: 500, color: '#475569' },
  breakdownCount: { fontSize: 13, fontWeight: 600, color: '#0F172A' },
  progressBarBg: { width: '100%', height: 6, background: '#F1F5F9', borderRadius: 999 },
  progressBarFill: { height: '100%', borderRadius: 999 },
  subtext: { margin: 0, fontSize: 13, color: '#64748B' },

  activityFeed: { display: 'flex', flexDirection: 'column', gap: 18, flex: 1, overflowY: 'auto', maxHeight: '350px', paddingRight: '8px' },
  activityItem: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  activityIcon: { background: '#F1F5F9', color: '#64748B', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  activityDetails: { flex: 1 },
  activityText: { margin: '0 0 4px 0', fontSize: 13, color: '#475569', lineHeight: '1.4' },
  activityTime: { margin: 0, fontSize: 12, color: '#94A3B8' },

  userSection: { borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)', overflow: 'hidden' },
  filterBar: { display: "flex", gap: 16, padding: '20px 28px', borderBottom: '1px solid #F1F5F9', alignItems: 'center' },
  searchWrapper: { flex: 1, maxWidth: 320, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, color: '#94A3B8' },
  searchInput: { width: '100%', padding: '10px 12px 10px 36px', borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' },
  select: { padding: '10px 12px', borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 13, color: '#0F172A', background: '#fff', outline: 'none', cursor: 'pointer', minWidth: 140 },
  
  tableContainer: { overflowX: 'auto' },
  table: { width: "100%", borderCollapse: "collapse", textAlign: 'left' },
  th: { padding: "16px 28px", background: "#F8FAFC", color: "#64748B", fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0' },
  tr: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: "16px 28px", fontSize: 13, verticalAlign: 'middle', color: '#0F172A' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#F1F5F9', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13 },
  tdBold: { margin: 0, fontWeight: 500, color: '#0F172A' },
  tdSub: { margin: '2px 0 0 0', fontSize: 12, color: '#64748B' },
  scoreText: { fontWeight: 500, color: '#0F172A' },
  badge: { padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, display: 'inline-block', letterSpacing: '0.02em' },
  emptyState: { textAlign: 'center', padding: '48px', color: '#64748B', fontSize: 13 },
  actionBtn: { padding: "6px 14px", borderRadius: 6, border: "1px solid #E2E8F0", background: "transparent", color: "#0F172A", cursor: "pointer", fontSize: 12, fontWeight: 500 },
  deleteBtn: { padding: "6px 14px", borderRadius: 6, border: "1px solid transparent", background: "#FEE2E2", color: "#EF4444", cursor: "pointer", fontSize: 12, fontWeight: 500 },

  // Settings View Specific Styles
  settingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: 600, color: '#475569' },
  formInput: { padding: '10px 14px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', color: '#0F172A' },
  toggleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F1F5F9' },
  toggleTitle: { margin: 0, fontSize: 13, fontWeight: 600, color: '#0F172A' },
  toggleDesc: { margin: '2px 0 0 0', fontSize: 12, color: '#64748B' },
  checkbox: { width: 18, height: 18, cursor: 'pointer', accentColor: '#2563EB' },
  successAlert: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 20 }
};

export default AdminDashboard;
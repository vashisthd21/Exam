import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Plus,
  Sparkles,
  Database,
  BarChart3,
  Layers,
  LayoutDashboard,
  Users,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Topbar from "../components/Teacher/Topbar";
import StatCard from "../components/Teacher/StatCard";
import RecentExamTable from "../components/Teacher/RecentExamTable";
import DashboardSkeleton from "../components/Teacher/DashboardSkeleton";
import CreateExamModal from "../components/Teacher/CreateExamModal";
import GenerateAIModal from "../components/Teacher/GenerateAIModal";

import useTeacherDashboard from "../hooks/useTeacherDashboard";

const TeacherDashboard = () => {
  const {
    loading,
    dashboard,
    exams,
    refreshDashboard,
  } = useTeacherDashboard();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body { 
          margin: 0; 
          background: #FAFAFB; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          font-size: 13px;
          color: #475569;
        }
        
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

        .action-card {
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.01);
        }
        .action-card:hover {
          transform: translateY(-2px);
          border-color: #E2E8F0;
          box-shadow: 0 8px 16px -4px rgba(15, 23, 42, 0.04);
        }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
      `}</style>

      <div className="min-h-screen bg-[#FAFAFB] flex">
        {/* Modern Sidebar Component */}
        <Sidebar />

        <main className="ml-[280px] flex-1 p-8 min-h-screen animate-fade-in box-border">
          {/* Topbar */}
          <Topbar />

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
            <StatCard
              title="Total Exams"
              value={dashboard.totalExams}
              icon={<BookOpen size={18} />}
              color="bg-blue-500"
            />
            <StatCard
              title="Published Exams"
              value={dashboard.publishedExams}
              icon={<CheckCircle2 size={18} />}
              color="bg-emerald-500"
            />
            <StatCard
              title="Total Students"
              value={dashboard.totalStudents}
              icon={<GraduationCap size={18} />}
              color="bg-amber-500"
            />
            <StatCard
              title="Draft Exams"
              value={dashboard.unpublishedExams}
              icon={<Layers size={18} />}
              color="bg-purple-500"
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-10"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-800 tracking-tight">
                  Quick Actions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Frequently used administrative workflows and management tools.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              
              {/* Create Exam */}
              <div
                onClick={() => setShowCreateModal(true)}
                className="action-card group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:scale-105">
                  <Plus size={18} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Create Exam
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Design and configure a fresh assessment model for students.
                </p>
              </div>

              {/* AI Generator */}
              <div
                onClick={() => {
                  if (exams.length === 0) {
                    toast.error("Please create an exam module first.");
                    return;
                  }
                  setSelectedExam(exams[0]._id);
                  setShowGenerateModal(true);
                }}
                className="action-card group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-50/80 border border-purple-100/60 flex items-center justify-center text-purple-600 mb-4 transition-transform group-hover:scale-105">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Generate AI Exam
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically construct questions using AI parameters in seconds.
                </p>
              </div>

              {/* Question Bank */}
              <div className="action-card group">
                <div className="w-10 h-10 rounded-lg bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-105">
                  <Database size={18} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Question Bank
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Organize, categorize, and reuse assessment queries efficiently.
                </p>
              </div>

              {/* Analytics */}
              <div className="action-card group">
                <div className="w-10 h-10 rounded-lg bg-orange-50/80 border border-orange-100/60 flex items-center justify-center text-orange-600 mb-4 transition-transform group-hover:scale-105">
                  <BarChart3 size={18} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">
                  Analytics & Reports
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluate assessment performance trends and grade diagnostics.
                </p>
              </div>

            </div>
          </motion.div>

          {/* Recent Exams Table */}
          <div className="mt-10">
            <RecentExamTable
              exams={exams}
              refreshDashboard={refreshDashboard}
              setSelectedExam={setSelectedExam}
              setShowGenerateModal={setShowGenerateModal}
            />
          </div>

          {/* Modals */}
          <CreateExamModal
            open={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={refreshDashboard}
          />

          <GenerateAIModal
            open={showGenerateModal}
            examId={selectedExam}
            onClose={() => setShowGenerateModal(false)}
            onSuccess={refreshDashboard}
          />
        </main>
      </div>
    </>
  );
};

/* ================= SIDEBAR COMPONENT ================= */

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { title: "Dashboard", path: "/teacher/dashboard", icon: <LayoutDashboard size={18} /> },
    { title: "Exams", path: "/teacher/exams", icon: <BookOpen size={18} /> },
    { title: "Question Bank", path: "/teacher/question-bank", icon: <Database size={18} /> },
    { title: "Students", path: "/teacher/students", icon: <Users size={18} /> },
    { title: "Analytics", path: "/teacher/analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <>
      <style>{`
        .sidebar-container {
          width: 280px;
          height: 100vh;
          background: #FFFFFF;
          border-right: 1px solid #F1F5F9;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          padding: 24px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          z-index: 50;
          box-sizing: border-box;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 12px 24px 12px;
          border-bottom: 1px solid #F8FAFC;
        }

        .brand-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .brand-title {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          font-size: 11px;
          font-weight: 500;
          color: #64748B;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .sidebar-nav {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-item-active {
          background: #EFF6FF;
          color: #2563EB;
        }

        .nav-item-inactive {
          color: #64748B;
          background: transparent;
        }

        .nav-item-inactive:hover {
          background: #F8FAFC;
          color: #0F172A;
        }

        .sidebar-footer {
          border-top: 1px solid #F8FAFC;
          padding-top: 16px;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #FEF2F2;
          color: #DC2626;
          border: 1px solid #FEE2E2;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #FEE2E2;
          transform: translateY(-1px);
        }
      `}</style>

      <aside className="sidebar-container">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h1 className="brand-title">ExamSecure</h1>
            <p className="brand-subtitle">Teacher Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "nav-item-active" : "nav-item-inactive"}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default TeacherDashboard;
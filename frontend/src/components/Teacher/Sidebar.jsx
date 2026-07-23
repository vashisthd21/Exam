import {
    FaHome,
    FaBook,
    FaRobot,
    FaUserGraduate,
    FaChartBar,
    FaCog,
    FaSignOutAlt,
  } from "react-icons/fa";
  
  import { motion } from "framer-motion";
  import { useNavigate, useLocation } from "react-router-dom";
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/teacher/dashboard",
    },
    {
      title: "Exams",
      icon: <FaBook />,
      path: "/teacher/exams",
    },
    {
      title: "Question Bank",
      icon: <FaBook />,
      path: "/teacher/question-bank",
    },
    
    {
      title: "Students",
      icon: <FaUserGraduate />,
      path: "/teacher/students",
    },
    {
      title: "Analytics",
      icon: <FaChartBar />,
      path: "/teacher/analytics",
    },
    {
      title: "Settings",
      icon: <FaCog />,
      path: "/teacher/settings",
    },
  ];
  
  const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
  
    return (
  
      <motion.aside
  
        initial={{ x: -80, opacity: 0 }}
  
        animate={{ x: 0, opacity: 1 }}
  
        transition={{ duration: 0.5 }}
  
        className="
          fixed
          left-0
          top-0
          w-72
          h-screen
          bg-gradient-to-b
          from-blue-700
          to-blue-900
          text-white
          flex
          flex-col
          shadow-2xl
          z-50
        "
  
      >
  
        {/* Logo */}
  
        <div className="p-7 border-b border-blue-500">
  
          <h1 className="text-4xl font-extrabold tracking-wide">
  
            ExamAI
  
          </h1>
  
          <p className="text-blue-200 mt-2">
  
            Teacher Portal
  
          </p>
  
        </div>
  
        {/* Menu */}
  
        <div className="flex-1 overflow-y-auto py-6">
  
          {menuItems.map((item, index) => (
  
            <motion.div
            key={index}
            onClick={() => navigate(item.path)}
  
              whileHover={{
                x: 8,
                scale: 1.03,
              }}
  
              whileTap={{
                scale: 0.98,
              }}
  
              transition={{
                duration: 0.2,
              }}
  
              className={`
                mx-4
                mb-3
                px-5
                py-4
                rounded-xl
                cursor-pointer
                flex
                items-center
                gap-4
                transition-all
                duration-200
                ${
                  index === 0
                    ? "bg-blue-800 shadow-lg"
                    : "hover:bg-blue-800"
                }
              `}
  
            >
  
              <div className="text-xl">
  
                {item.icon}
  
              </div>
  
              <div className="font-semibold text-lg">
  
                {item.title}
  
              </div>
  
            </motion.div>
  
          ))}
  
        </div>
  
        {/* Bottom */}
  
        <div className="p-5 border-t border-blue-500">
  
          <motion.button
  
            whileHover={{
              scale: 1.03,
              backgroundColor: "#DC2626",
            }}
  
            whileTap={{
              scale: 0.97,
            }}
    onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }}
  
            className="
              w-full
              bg-red-500
              rounded-xl
              py-4
              font-semibold
              text-lg
              flex
              justify-center
              items-center
              gap-3
              transition-all
            "
  
          >
  
            <FaSignOutAlt />
  
            Logout
  
          </motion.button>
  
        </div>
  
      </motion.aside>
  
    );
  
  };
  
  export default Sidebar;
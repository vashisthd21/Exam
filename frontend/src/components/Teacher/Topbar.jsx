import { motion } from "framer-motion";
import {
  FaBell,
  FaSearch
} from "react-icons/fa";

const Topbar = () => {

  const today = new Date().toLocaleDateString("en-IN", {

    weekday: "long",

    day: "numeric",

    month: "long",

    year: "numeric",

  });

  return (

    <motion.div

      initial={{ y: -40, opacity: 0 }}

      animate={{ y: 0, opacity: 1 }}

      transition={{ duration: .5 }}

      className="bg-white rounded-2xl shadow-lg px-8 py-5 flex justify-between items-center"

    >

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-gray-800">

          Teacher Dashboard

        </h1>

        <p className="text-gray-500 mt-1">

          Welcome back 👋

        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 w-72">

          <FaSearch className="text-gray-400" />

          <input

            type="text"

            placeholder="Search..."

            className="bg-transparent ml-3 outline-none w-full"

          />

        </div>

        {/* Date */}

        <div className="text-right">

          <p className="font-semibold text-gray-700">

            {today}

          </p>

          <p className="text-sm text-gray-500">

            Have a productive day 🚀

          </p>

        </div>

        {/* Notification */}

        <motion.div

          whileHover={{

            scale: 1.15,

            rotate: 10,

          }}

          className="relative cursor-pointer"

        >

          <FaBell

            className="text-3xl text-blue-600"

          />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex justify-center items-center">

            3

          </span>

        </motion.div>

        {/* Profile */}

        <motion.div

          whileHover={{

            scale: 1.05

          }}

          className="flex items-center gap-3 cursor-pointer"

        >

          <img

            src="https://ui-avatars.com/api/?name=Teacher&background=2563EB&color=fff"

            alt="teacher"

            className="w-12 h-12 rounded-full shadow"

          />

          <div>

            <h3 className="font-bold text-gray-700">

              Teacher

            </h3>

            <p className="text-sm text-gray-500">

              AI Exam Creator

            </p>

          </div>

        </motion.div>

      </div>

    </motion.div>

  );

};

export default Topbar;
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  icon,
  color = "bg-blue-600",
  change = "",
}) => {

  return (

    <motion.div

      initial={{ opacity: 0, y: 30 }}

      animate={{ opacity: 1, y: 0 }}

      whileHover={{
        y: -8,
        scale: 1.03,
      }}

      transition={{
        duration: .35
      }}

      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 transition-all duration-300 cursor-pointer"

    >

      {/* Top */}

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm font-medium">

            {title}

          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">

            {value}

          </h2>

        </div>

        <div

          className={`${color}
          w-16
          h-16
          rounded-2xl
          flex
          justify-center
          items-center
          text-white
          text-3xl
          shadow-lg`}

        >

          {icon}

        </div>

      </div>

      {/* Bottom */}

      <div className="mt-6 flex justify-between items-center">

        <span className="text-sm text-gray-400">

          Updated just now

        </span>

        {

          change && (

            <span

              className={`px-3 py-1 rounded-full text-sm font-semibold
              
              ${
                change.includes("-")
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}

            >

              {change}

            </span>

          )

        }

      </div>

    </motion.div>

  );

};

export default StatCard;
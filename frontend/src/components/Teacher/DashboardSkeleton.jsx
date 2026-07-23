import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">

    <div className="flex justify-between">

      <div>

        <div className="w-28 h-4 bg-gray-200 rounded"></div>

        <div className="w-20 h-10 bg-gray-200 rounded mt-5"></div>

      </div>

      <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>

    </div>

    <div className="w-full h-2 bg-gray-200 rounded mt-8"></div>

  </div>
);

const DashboardSkeleton = () => {

  return (

    <motion.div

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      className="flex bg-gray-100 min-h-screen"

    >

      {/* Sidebar */}

      <div className="w-72 bg-white shadow-xl"></div>

      {/* Main */}

      <div className="flex-1 p-8">

        {/* Topbar */}

        <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">

          <div className="flex justify-between">

            <div>

              <div className="w-60 h-8 bg-gray-200 rounded"></div>

              <div className="w-40 h-4 bg-gray-200 rounded mt-4"></div>

            </div>

            <div className="flex gap-4">

              <div className="w-72 h-12 bg-gray-200 rounded-xl"></div>

              <div className="w-12 h-12 rounded-full bg-gray-200"></div>

            </div>

          </div>

        </div>

        {/* Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <SkeletonCard />

          <SkeletonCard />

          <SkeletonCard />

          <SkeletonCard />

        </div>

        {/* Quick Actions */}

        <div className="grid grid-cols-4 gap-6 mt-10">

          {[1,2,3,4].map(i=>(

            <div

              key={i}

              className="bg-white rounded-2xl h-40 animate-pulse"

            />

          ))}

        </div>

        {/* Table */}

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-6">

          <div className="w-52 h-6 bg-gray-200 rounded"></div>

          <div className="mt-6 space-y-5">

            {[1,2,3,4,5].map(i=>(

              <div

                key={i}

                className="w-full h-12 bg-gray-200 rounded"

              />

            ))}

          </div>

        </div>

      </div>

    </motion.div>

  );

};

export default DashboardSkeleton;
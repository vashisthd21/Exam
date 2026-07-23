import { motion } from "framer-motion";
import {
  FaEye,
  FaMagic,
  FaTrash,
  FaGlobe,
  FaLock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import teacherApi from "../../services/teacherAPI.js";

const RecentExamTable = ({
  exams = [],
  refreshDashboard,
  setSelectedExam,
  setShowGenerateModal,
}) => {

  const navigate = useNavigate();

  // ===========================
  // Publish / Unpublish
  // ===========================

  const handlePublish = async (exam) => {
    try {

      if (exam.isPublished) {

        await teacherApi.unpublishExam(exam._id);

        toast.success("Exam unpublished");

      } else {

        await teacherApi.publishExam(exam._id);

        toast.success("Exam published");

      }

      refreshDashboard();

    } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || err.message);
    }
  };

  // ===========================
  // Delete
  // ===========================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this exam?"
    );

    if (!confirmDelete) return;

    try {

      await teacherApi.deleteExam(id);

      toast.success("Exam deleted");

      refreshDashboard();

    } catch {

      toast.error("Unable to delete exam");

    }

  };

  return (

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}
      className="bg-white rounded-2xl shadow-lg mt-8 overflow-hidden"
    >

      {/* Header */}

      <div className="flex justify-between items-center p-6 border-b">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">

            Recent Exams

          </h2>

          <p className="text-gray-500 mt-1">

            Manage all your exams

          </p>

        </div>

        <button className="text-blue-600 font-semibold hover:underline">

          View All

        </button>

      </div>

      {/* Empty */}

      {exams.length === 0 ? (

        <div className="py-20 text-center">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
            className="w-28 mx-auto opacity-70"
          />

          <h3 className="text-xl font-semibold mt-5">

            No Exams Yet

          </h3>

          <p className="text-gray-500">

            Create your first exam.

          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left p-5">Title</th>

                <th className="text-left">Subject</th>

                <th className="text-center">Questions</th>

                <th className="text-center">Status</th>

                <th className="text-center">Date</th>

                <th className="text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {exams.map((exam, index) => (

                <motion.tr

                  key={exam._id}

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}

                  transition={{ delay: index * .05 }}

                  whileHover={{

                    backgroundColor: "#F9FAFB"

                  }}

                  className="border-b"

                >

                  <td className="p-5 font-semibold">

                    {exam.title}

                  </td>

                  <td>

                    {exam.subject}

                  </td>

                  <td className="text-center">

                    {exam.questions?.length || 0}

                  </td>

                  <td className="text-center">

                    {exam.isPublished ? (

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                        Published

                      </span>

                    ) : (

                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                        Draft

                      </span>

                    )}

                  </td>

                  <td className="text-center">

                    {new Date(exam.createdAt).toLocaleDateString()}

                  </td>

                  <td>

                    <div className="flex justify-center gap-3">

                      {/* Preview */}

                      <motion.button

                        whileHover={{ scale: 1.15 }}

                        onClick={() =>
                          navigate(`/teacher/exam/${exam._id}`)
                        }

                        className="bg-blue-100 text-blue-600 p-2 rounded-lg"

                      >

                        <FaEye />

                      </motion.button>

                      {/* Generate AI */}

                      <motion.button

                        whileHover={{ scale: 1.15 }}

                        onClick={() => {

                          setSelectedExam(exam._id);

                          setShowGenerateModal(true);

                        }}

                        className="bg-purple-100 text-purple-600 p-2 rounded-lg"

                      >

                        <FaMagic />

                      </motion.button>

                      {/* Publish */}

                      <motion.button

                        whileHover={{ scale: 1.15 }}

                        onClick={() => handlePublish(exam)}

                        className={`p-2 rounded-lg ${
                          exam.isPublished
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                        }`}

                      >

                        {exam.isPublished ? (

                          <FaLock />

                        ) : (

                          <FaGlobe />

                        )}

                      </motion.button>

                      {/* Delete */}

                      <motion.button

                        whileHover={{ scale: 1.15 }}

                        onClick={() =>
                          handleDelete(exam._id)
                        }

                        className="bg-red-100 text-red-600 p-2 rounded-lg"

                      >

                        <FaTrash />

                      </motion.button>

                    </div>

                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </motion.div>

  );

};

export default RecentExamTable;
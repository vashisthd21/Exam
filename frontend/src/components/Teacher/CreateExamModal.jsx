import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Clock, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import teacherApi from "../../services/teacherAPI.js";

const CreateExamModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    topic: "",
    duration: 60,
    difficulty: "Medium",
    totalMarks: 100,
    passingMarks: 40,
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      subject: "",
      topic: "",
      duration: 60,
      difficulty: "Medium",
      totalMarks: 100,
      passingMarks: 40,
      startTime: "",
      endTime: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await teacherApi.createExam(form);

      toast.success("Exam created successfully");

      resetForm();

      onSuccess();

      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to create exam"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden"
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            {/* Header */}

            <div className="flex justify-between items-center px-8 py-6 border-b">

              <div>
                <h2 className="text-3xl font-bold">
                  Create New Exam
                </h2>

                <p className="text-gray-500 mt-1">
                  Fill exam details below
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-5">

                <Input
                  label="Exam Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  icon={<BookOpen size={18} />}
                />

                <Input
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />

                <Input
                  label="Topic"
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                />

                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={form.duration}
                  onChange={handleChange}
                  icon={<Clock size={18} />}
                />

                <Select
                  label="Difficulty"
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  options={[
                    "Easy",
                    "Medium",
                    "Hard",
                  ]}
                />

                <Input
                  label="Total Marks"
                  name="totalMarks"
                  type="number"
                  value={form.totalMarks}
                  onChange={handleChange}
                />

                <Input
                  label="Passing Marks"
                  name="passingMarks"
                  type="number"
                  value={form.passingMarks}
                  onChange={handleChange}
                />

                <Input
                  label="Start Time"
                  name="startTime"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={handleChange}
                  icon={<Calendar size={18} />}
                />

                <Input
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={handleChange}
                  icon={<Calendar size={18} />}
                />

              </div>

              <div className="flex justify-end gap-4 pt-6 border-t">

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold"
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {loading
                    ? "Creating..."
                    : "Create Exam"}
                </button>

              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Input = ({
  label,
  icon,
  ...props
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">
      {label}
    </label>

    <div className="mt-2 flex items-center border rounded-xl px-4">
      {icon && (
        <div className="text-gray-400 mr-2">
          {icon}
        </div>
      )}

      <input
        {...props}
        required
        className="w-full py-3 outline-none"
      />
    </div>
  </div>
);

const Select = ({
  label,
  options,
  ...props
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">
      {label}
    </label>

    <select
      {...props}
      className="mt-2 w-full border rounded-xl px-4 py-3 outline-none"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default CreateExamModal;
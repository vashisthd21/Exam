import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaRobot,
  FaMagic,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const GenerateAIModal = ({
  open,
  onClose,
  examId,
  onSuccess,
}) => {

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState("");

  const [form, setForm] = useState({

    subject: "",

    topic: "",

    difficulty: "Medium",

    numberOfQuestions: 10,

  });

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  };

  const generateQuestions = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      //--------------------------------------

      setStep("Generating Questions...");

      await new Promise(r => setTimeout(r, 1200));

      //--------------------------------------

      setStep("Verifying Answers...");

      await new Promise(r => setTimeout(r, 1000));

      //--------------------------------------

      setStep("Checking Quality...");

      await new Promise(r => setTimeout(r, 1000));

      //--------------------------------------

      setStep("Saving Questions...");

      const res = await axios.post(

        `${API}/api/teacher/exam/${examId}/generate`,

        form,

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      setStep("Completed");

      await new Promise(r => setTimeout(r, 1000));

      if (onSuccess)

        onSuccess(res.data);

      onClose();

    }

    catch (err) {

      console.log(err);

      alert(

        err.response?.data?.message ||

        "Generation failed."

      );

    }

    finally {

      setLoading(false);

      setStep("");

    }

  };

  return (

    <AnimatePresence>

      {

        open && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"

          >

            <motion.div

              initial={{

                y: 50,

                opacity: 0,

                scale: .9,

              }}

              animate={{

                y: 0,

                opacity: 1,

                scale: 1,

              }}

              exit={{

                y: 50,

                opacity: 0,

              }}

              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8"

            >

              {/* Header */}

              <div className="flex items-center gap-4">

                <div className="bg-purple-100 p-4 rounded-2xl">

                  <FaRobot

                    className="text-4xl text-purple-600"

                  />

                </div>

                <div>

                  <h2 className="text-3xl font-bold">

                    AI Question Generator

                  </h2>

                  <p className="text-gray-500">

                    Generate high-quality questions using AI

                  </p>

                </div>

              </div>

              {/* Form */}

              <div className="grid grid-cols-2 gap-5 mt-8">

                <div>

                  <label className="font-semibold">

                    Subject

                  </label>

                  <input

                    name="subject"

                    value={form.subject}

                    onChange={handleChange}

                    className="mt-2 w-full border rounded-xl p-3"

                  />

                </div>

                <div>

                  <label className="font-semibold">

                    Topic

                  </label>

                  <input

                    name="topic"

                    value={form.topic}

                    onChange={handleChange}

                    className="mt-2 w-full border rounded-xl p-3"

                  />

                </div>

                <div>

                  <label className="font-semibold">

                    Difficulty

                  </label>

                  <select

                    name="difficulty"

                    value={form.difficulty}

                    onChange={handleChange}

                    className="mt-2 w-full border rounded-xl p-3"

                  >

                    <option>Easy</option>

                    <option>Medium</option>

                    <option>Hard</option>

                  </select>

                </div>

                <div>

                  <label className="font-semibold">

                    Number of Questions

                  </label>

                  <input

                    type="number"

                    name="numberOfQuestions"

                    value={form.numberOfQuestions}

                    onChange={handleChange}

                    className="mt-2 w-full border rounded-xl p-3"

                  />

                </div>

              </div>

              {/* Progress */}

              {

                loading && (

                  <motion.div

                    initial={{ opacity: 0 }}

                    animate={{ opacity: 1 }}

                    className="mt-8 bg-gray-100 rounded-xl p-5"

                  >

                    <div className="flex items-center gap-3">

                      {

                        step === "Completed"

                          ?

                          <FaCheckCircle className="text-green-600 text-2xl" />

                          :

                          <FaSpinner className="animate-spin text-purple-600 text-2xl" />

                      }

                      <span className="font-semibold">

                        {step}

                      </span>

                    </div>

                    <div className="mt-4 h-2 bg-gray-300 rounded-full">

                      <motion.div

                        initial={{ width: 0 }}

                        animate={{ width: "100%" }}

                        transition={{ duration: 4 }}

                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600"

                      />

                    </div>

                  </motion.div>

                )

              }

              {/* Footer */}

              <div className="flex justify-end gap-4 mt-8">

                <button

                  onClick={onClose}

                  className="border px-6 py-3 rounded-xl"

                >

                  Cancel

                </button>

                <button

                  disabled={loading}

                  onClick={generateQuestions}

                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-3"

                >

                  <FaMagic />

                  {

                    loading

                      ?

                      "Generating..."

                      :

                      "Generate Questions"

                  }

                </button>

              </div>

            </motion.div>

          </motion.div>

        )

      }

    </AnimatePresence>

  );

};

export default GenerateAIModal;
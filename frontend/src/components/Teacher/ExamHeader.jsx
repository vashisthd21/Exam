import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBook, FaClock, FaLayerGroup } from "react-icons/fa";

const ExamHeader = ({ exam }) => {

    const navigate = useNavigate();

    return (

        <div className="bg-white shadow rounded-2xl p-6 m-6">

            <button
                onClick={() => navigate("/teacher/dashboard")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-5"
            >
                <FaArrowLeft />
                Back to Dashboard
            </button>

            <div className="flex justify-between items-start">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        {exam.title}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Manage your AI-powered examination

                    </p>

                </div>

                <span
                    className={`px-4 py-2 rounded-full font-semibold ${
                        exam.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {exam.isPublished ? "Published" : "Draft"}
                </span>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-8">

                <div className="bg-gray-50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-blue-600">

                        <FaBook />

                        <span className="font-semibold">

                            Subject

                        </span>

                    </div>

                    <p className="mt-2 text-lg">

                        {exam.subject}

                    </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-purple-600">

                        <FaLayerGroup />

                        <span className="font-semibold">

                            Topic

                        </span>

                    </div>

                    <p className="mt-2 text-lg">

                        {exam.topic}

                    </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                    <div className="flex items-center gap-2 text-orange-600">

                        <FaClock />

                        <span className="font-semibold">

                            Duration

                        </span>

                    </div>

                    <p className="mt-2 text-lg">

                        {exam.duration} Minutes

                    </p>

                </div>

            </div>

        </div>

    );

};

export default ExamHeader;
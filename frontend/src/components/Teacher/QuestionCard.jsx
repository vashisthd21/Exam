import {
    FaEdit,
    FaTrash,
    FaRedo,
} from "react-icons/fa";

const QuestionCard = ({ question, index }) => {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between">

                <h3 className="font-bold text-lg">

                    Question {index + 1}

                </h3>

                <div className="flex gap-3">

                    <button className="text-blue-600">

                        <FaEdit />

                    </button>

                    <button className="text-purple-600">

                        <FaRedo />

                    </button>

                    <button className="text-red-600">

                        <FaTrash />

                    </button>

                </div>

            </div>

            <p className="mt-5 font-medium">

                {question.question}

            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">

                {question.options.map((option, i) => (

                    <div
                        key={i}
                        className={`border rounded-lg p-3 ${
                            option === question.answer
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                        }`}
                    >
                        {option}
                    </div>

                ))}

            </div>

            <div className="mt-5">

                <span className="font-semibold">

                    Explanation:

                </span>

                <p className="text-gray-600 mt-2">

                    {question.explanation}

                </p>

            </div>

        </div>

    );

};

export default QuestionCard;
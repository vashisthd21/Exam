import QuestionCard from "./QuestionCard";

const QuestionList = ({ questions }) => {

    return (

        <div className="mx-6 mt-6">

            <h2 className="text-2xl font-bold mb-6">

                Questions ({questions.length})

            </h2>

            <div className="space-y-5">

                {questions.length === 0 ? (

                    <div className="bg-white rounded-xl p-10 text-center shadow">

                        <h3 className="text-xl font-semibold">

                            No Questions Added

                        </h3>

                        <p className="text-gray-500 mt-2">

                            Generate AI questions or add manual questions.

                        </p>

                    </div>

                ) : (

                    questions.map((question, index) => (

                        <QuestionCard

                            key={question._id}

                            question={question}

                            index={index}

                        />

                    ))

                )}

            </div>

        </div>

    );

};

export default QuestionList;
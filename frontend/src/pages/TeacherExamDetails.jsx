import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import teacherApi from "../services/teacherAPI.js";

import ExamHeader from "../components/Teacher/ExamHeader.jsx";
import QuestionList from "../components/Teacher/QuestionList.jsx";

const TeacherExamDetails = () => {

    const { id } = useParams();

    const [exam, setExam] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchExam();

    }, []);

    const fetchExam = async () => {
        try {
    
            const res = await teacherApi.getExamById(id);
    
            console.log(res.data); // keep this temporarily
    
            setExam(res.data.exam);
    
        } catch (err) {
    
            console.error(err);
    
        } finally {
    
            setLoading(false);
    
        }
    };

    if (loading)

        return (
            <div className="p-10 text-xl">
                Loading...
            </div>
        );

    if (!exam)

        return (
            <div className="p-10 text-red-600">
                Exam not found
            </div>
        );

    return (

        <div className="min-h-screen bg-gray-100">

            <ExamHeader exam={exam} />

            <QuestionList
                questions={exam.questions}
            />

        </div>

    );

};

export default TeacherExamDetails;
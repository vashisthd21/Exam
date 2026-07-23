import { useEffect, useState } from "react";
import teacherApi from "../services/teacherAPI.js";

const useTeacherDashboard = () => {

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    totalExams: 0,
    publishedExams: 0,
    unpublishedExams: 0,
    totalStudents: 0,
  });

  const [exams, setExams] = useState([]);

  const refreshDashboard = async () => {
    try {

      const dashboardRes = await teacherApi.getDashboard();

      const examsRes = await teacherApi.getAllExams();

      setDashboard(dashboardRes.data.dashboard);

      setExams(examsRes.data.exams);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  return {
    loading,
    dashboard,
    exams,
    refreshDashboard,
  };
};

export default useTeacherDashboard;
import PerformanceService from "../services/PerformanceService.js";

class PerformanceTool{

    static async execute(userId){

        const performance =
            await PerformanceService.getUserPerformance(userId);

        return performance;

    }

}

export default PerformanceTool;
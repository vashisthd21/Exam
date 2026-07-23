import Violation from "../models/model.violation.js";
import { calculateRisk } from "../ai/risk/RiskEngine.js";

export const saveViolation = async (req, res) => {

  try {

    const {

      quizType,

      type,

      message,

      autoSubmitted

    } = req.body;

    const violation = await Violation.create({

      student: req.user._id,

      quizType,

      type,

      message,

      autoSubmitted,

      riskScore: calculateRisk(type)

    });

    res.status(201).json({

      success:true,

      violation

    });

  }

  catch(err){

    res.status(500).json({

      success:false,

      message:err.message

    });

  }

};
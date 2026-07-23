const violationScores = {

    TAB_SWITCH: 10,
  
    FULLSCREEN_EXIT: 15,
  
    RIGHT_CLICK: 5,
  
    COPY: 5,
  
    PASTE: 5,
  
    NO_FACE: 20,
  
    MULTIPLE_FACES: 40
  
  };
  
  export const calculateRiskScore = (violations) => {
  
    let score = 0;
  
    violations.forEach(v => {
  
      score += violationScores[v.type] || 0;
  
    });
  
    return Math.min(score,100);
  
  };
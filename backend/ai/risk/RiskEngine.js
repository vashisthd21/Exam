const scores = {

    TAB_SWITCH:10,

    FULLSCREEN_EXIT:10,

    COPY:5,

    PASTE:5,

    RIGHT_CLICK:5,

    NO_FACE:20,

    MULTIPLE_FACES:40,

    AUTO_SUBMIT:50

};

export const calculateRisk=(type)=>{

    return scores[type] || 0;

};
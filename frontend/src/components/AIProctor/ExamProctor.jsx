import {useEffect,useRef,useState} from "react";
import axios from "axios";
import BrowserMonitor from "./BrowserMonitor";
import FaceDetection from "./FaceDetector";
import ProctorMonitor from "./ProctorMonitor";
import WebcamFeed from "./WebcamFeed";

const API=import.meta.env.VITE_API_BASE_URL;

export default function ExamProctor({
examId,
webcamRef,
submitExam
}){

const fullscreenAllowed=useRef(true);
const submitting=useRef(false);

const [faceStatus,setFaceStatus]=useState("no-face");
const [violations,setViolations]=useState([]);

const logViolation=async(type,message)=>{

const violation={
type,
message,
timestamp:new Date().toISOString()
};

setViolations(prev=>[...prev,violation]);

try{

const token=localStorage.getItem("token");

await axios.post(

`${API}/api/proctor/violation`,

{
examId,
...violation
},

{
headers:{
Authorization:`Bearer ${token}`
}
}

);

}
catch(err){

console.log(err);

}

};

const autoSubmit=async(reason,type)=>{

if(submitting.current) return;

submitting.current=true;

await logViolation(type,reason);

await submitExam(reason);

};

useEffect(()=>{

const fullscreenListener=()=>{

if(
fullscreenAllowed.current &&
!document.fullscreenElement
){

autoSubmit(

"Fullscreen exited.",

"FULLSCREEN_EXIT"

);

}

};

document.addEventListener(

"fullscreenchange",

fullscreenListener

);

return()=>{

document.removeEventListener(

"fullscreenchange",

fullscreenListener

);

};

},[]);

useEffect(()=>{

const visibilityListener=()=>{

if(document.hidden){

logViolation(

"TAB_SWITCH",

"Student switched browser tab."

);

}

};

document.addEventListener(

"visibilitychange",

visibilityListener

);

return()=>{

document.removeEventListener(

"visibilitychange",

visibilityListener

);

};

},[]);

const handleBrowserViolation=async(event)=>{

await logViolation(

event.type,

event.message

);

};

const handleFaceSubmit=(reason)=>{

if(reason.includes("Multiple")){

autoSubmit(

reason,

"MULTIPLE_FACE"

);

}

else if(reason.includes("No")){

autoSubmit(

reason,

"NO_FACE"

);

}

};
useEffect(()=>{

    const startFullscreen=async()=>{
    
    if(document.fullscreenElement) return;
    
    try{
    
    await document.documentElement.requestFullscreen();
    
    }
    catch(err){
    
    console.log(err);
    
    }
    
    };
    
    startFullscreen();
    
    return()=>{
    
    fullscreenAllowed.current=false;
    
    if(document.fullscreenElement){
    
    document.exitFullscreen().catch(()=>{});
    
    }
    
    };
    
    },[]);
    
    return(
    
    <>
    
    <BrowserMonitor
    onViolation={handleBrowserViolation}
    />
    
    <FaceDetection
    webcamRef={webcamRef}
    setStatus={setFaceStatus}
    />
    
    <ProctorMonitor
    status={faceStatus}
    onAutoSubmit={handleFaceSubmit}
    />
    
    <WebcamFeed
    webcamRef={webcamRef}
    status={faceStatus}
    />
    
    </>
    
    );
    
    }
import {useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";
import studentAPI from "../services/studentAPI";

export default function StudentExamResult(){

const {attemptId}=useParams();

const navigate=useNavigate();

const [loading,setLoading]=useState(true);
const [attempt,setAttempt]=useState(null);

useEffect(()=>{

const load=async()=>{

try{

const res=await studentAPI.getAttempt(attemptId);

setAttempt(res.data.attempt);

}
catch(err){

console.log(err);

}
finally{

setLoading(false);

}

};

load();

},[]);

if(loading){

return<h2 style={{textAlign:"center",marginTop:100}}>
Loading...
</h2>;

}

return(

<div style={styles.page}>

<div style={styles.card}>

<h1>Exam Submitted ✅</h1>

<h2>

{attempt.score}/{attempt.totalQuestions}

</h2>

<p>

Accuracy : {attempt.accuracy}%

</p>

<p>

Time Taken : {attempt.timeTaken}s

</p>

<p>

Marks : {attempt.score}/{attempt.totalMarks}

</p>

<button
style={styles.btn}
onClick={()=>navigate("/dashboard")}
>

Back to Dashboard

</button>

</div>

</div>

);

}

const styles={

page:{
display:"flex",
justifyContent:"center",
alignItems:"center",
height:"100vh",
background:"#eef2ff"
},

card:{
width:450,
padding:40,
background:"#fff",
borderRadius:20,
textAlign:"center",
boxShadow:"0 10px 30px rgba(0,0,0,.1)"
},

btn:{
marginTop:25,
padding:"14px 25px",
border:"none",
background:"#2563eb",
color:"#fff",
borderRadius:10,
cursor:"pointer",
fontWeight:700
}

};
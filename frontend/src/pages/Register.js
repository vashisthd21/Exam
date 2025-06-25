import {useState} from 'react';
import axios from 'axios';

export default function Register() {
    const [form, setForm] = useState({
        name:'',
        email:'',
        password:''
    });

    const register = async(e) =>{
        e.preventDefault();
        await axios.post('http://localhost:5000/api/auth/register', form);     //Why to write full URL?
        alert('Registered successfully');
    };

    return (
        <form onSubmit = {register}>
            <input placeholder="Name" 
                    onChange={e=> setForm({...form , name: e.target.value})}/>
            <input placeholder="Email" 
                    onChange={e=> setForm({...form , name: e.target.value})}/>
            <input placeholder="Password" type = "password" 
                    onChange={e=> setForm({...form , name: e.target.value})}/>
            <button> Register </button>
        </form>
    );
}
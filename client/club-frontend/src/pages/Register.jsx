import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../App.css'
import '../pages/Register.css';

export default function Register() {
    const navigate = useNavigate();
    const[data, setData] = useState({
        name: '',
        email:'',
        password:'',
    })

    const registerUser = async (e) =>{
        e.preventDefault();
        const {name, email, password} = data
        try {
            const {data} = await axios.post('/register', {name, email, password})
            if(data.error){
                toast.error(data.error)
            } else{
                setData({
                    name: '',
                    email:'',
                    password:'',  
                })
                toast.success('Registro exitoso, por favor inicie sesión')
                navigate('/login')
            }
    } catch (error) {
            console.log(error)
    };
    };

  return (
    <div className='main-content user-forms'>
        <form onSubmit={registerUser} className='background-register'>
            <h2>Registrarse</h2>
            <div className='mb-3'>
            <label className='form-label' for="name" >Nombre</label>
            <input  className='form-control' id="name" type="text" placeholder='Ingrese nombre'  value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>
            </div>
            <div className='mb-3'>
            <label className='form-label' for="email" >Email</label>
            <input className='form-control' type="email" id='email' placeholder='Ingrese email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
            </div>
            <div className='mb-3'>
            <label className='form-label' for="password">Contraseña</label>
            <input className='form-control' type="password" id='password' placeholder='Ingrese contraseña' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
            </div>
            <button type='submit' class="btn logbtn">Siguiente</button>

        </form>
    </div>
  )
}

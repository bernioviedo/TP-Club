import { useState } from 'react'
import axios from 'axios'
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    <div>
        <form onSubmit={registerUser}>
            <label>Nombre</label>
            <input type="text" placeholder='Ingrese nombre'  value={data.name} onChange={(e) => setData({...data, name: e.target.value})}/>

            <label>Email</label>
            <input type="email" placeholder='Ingrese email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>

            <label>Contraseña</label>
            <input type="password" placeholder='Ingrese contraseña' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>

            <button type='submit'>Registrarse</button>
        </form>
    </div>
  )
}

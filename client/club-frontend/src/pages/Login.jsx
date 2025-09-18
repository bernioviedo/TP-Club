import React, { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { ContextUser } from '../../context/contextUser'
import '../App.css'
import '../pages/Login.css'

export default function Login() {
const navigate = useNavigate()
const { setUser } = useContext(ContextUser)
const[data, setData] = useState({
        email: '',
        password:'',
    })

const loginUser = async (e) =>{
    e.preventDefault()
    const {email, password} = data
    try {
      const{data: loginResponse} = await axios.post('/login', {
        email,
        password
      });
      if (loginResponse.error) {
        toast.error(loginResponse.error);
      } else { 
        setUser(loginResponse);
        
        setData({email: '', password: ''})
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      toast.error('Algo salió mal. Inténtalo de nuevo.');
    }
}

  return (
<div className='main-content user-forms'>
    <form onSubmit={loginUser}>
      <div class="mb-3">
            <label className='form-label' for="email">Email</label>
            <input className='form-control' type="email" id='email' placeholder='Ingrese email' value={data.email} onChange={(e) => setData({...data, email: e.target.value})}/>
      </div>
      <div class="mb-3">
            <label className='form-label' for="password">Contraseña</label>
            <input className='form-control' type="password" id='password' placeholder='Ingrese contraseña' value={data.password} onChange={(e) => setData({...data, password: e.target.value})}/>
      </div>
            <button type='submit' class="btn logbtn">Iniciar sesión</button>
    </form>
</div>

  )
}
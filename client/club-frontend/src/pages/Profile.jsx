import { useContext } from "react"
import { ContextUser } from "../../context/contextUser" 
import '../App.css'

export default function Profile() {
    const {user} = useContext(ContextUser)
  return (
    <div className='main-content'>
        <h1>Perfil</h1>
        {!! user && (<h2>Hola {user.name} </h2>)}
    </div>
  )
}

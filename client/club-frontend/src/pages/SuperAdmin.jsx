import { useContext } from "react"
import { ContextUser } from "../../context/contextUser" 
import '../App.css'

export default function SuperAdmin() {
    const {user} = useContext(ContextUser)
  return (
    <div className='main-content'>
        <h1>Administración de usuarios</h1>
        {!! (user.userType === "superadmin") && (<h2>Hola {user.name} </h2>)}
    </div>
  )
}

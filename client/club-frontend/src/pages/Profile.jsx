import { useContext } from "react"
import { ContextUser } from "../../context/contextUser" 

export default function Profile() {
    const {user} = useContext(ContextUser)
  return (
    <div>
        <h1>Perfil</h1>
        {!! user && (<h2>Hola {user.name} </h2>)}
    </div>
  )
}

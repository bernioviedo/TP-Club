import { useState}  from "react";
import { TfiMenu, TfiClose  } from "react-icons/tfi";
import './NavbarMobile.css'
import Navbar from "../Navbar/Navbar.jsx";


export default function NavbarMobile() {

    const [display, setDisplay] = useState(false)
    
    const handleClick = () => setDisplay(!display)

    
    return(
        
        <>
            <button className={display ? 'burguer-f' : "burguer"} onClick={handleClick}>
                <TfiMenu></TfiMenu>
            </button>
            <Navbar navStyle={display ? "nb-mob" : 'nb-mob-f'} ulStyle={'navbar__menu-mob'}>
                <button onClick={handleClick} className="close-btn"><TfiClose></TfiClose></button>
            </Navbar>
        </>
    )
}
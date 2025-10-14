import { TfiMenu, TfiClose  } from "react-icons/tfi";
import options from '../../utilities/navOptions.js'

export default function NavbarMobile() {
    return(
        <>
            <button className="sideButtonMenu">
                <TfiMenu></TfiMenu>
            </button>
        </>
    )
}
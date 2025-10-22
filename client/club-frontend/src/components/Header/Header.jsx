import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {motion as Motion, useScroll, useMotionValueEvent} from 'framer-motion'
import MediaQuery from 'react-responsive'
import NavbarMobile from '../NavbarMobile/NavbarMobile.jsx'
import Navbar from '../Navbar/Navbar.jsx';


export default function Header() {
    const { scrollY } = useScroll();

    const [hidden, setHidden] = useState(false);

    const [desktop, setDesktop] = useState(window.innerWidth > 768)

    useEffect(() => {
        const handleResize = () => setDesktop(window.innerWidth > 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useMotionValueEvent(scrollY, "change", (latest) => {
    if (!desktop) return
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 75) {
        setHidden(true);
    } else {
        setHidden(false);
    }
    })
    return(
        <>
        
        <Motion.header className='site-header' 
        variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -50, opacity: 0 }, 
        }}
        initial="visible"
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        >
            <div className=' spikes-shadow'></div>
            <div className=' spikes '></div>
            <div className='navbar__logo-section'>
                <Link to="/" className='navbar__logo-lin'>
                    <img 
                    src="../src/assets/LaGacelaFC.png" 
                    alt="La Gacela FC"
                    className='navbar__escudo' />
                </Link>
                <Link to="/" className='navbar__site-title' id='navbar__site-title'>Club Atlético La Gacela</Link>
            </div>
            <MediaQuery maxWidth={768}>
                <NavbarMobile></NavbarMobile>
            </MediaQuery>
            <Navbar navStyle={'navbar'} ulStyle={'navbar__menu'}></Navbar>
        </Motion.header>
        </>
    )
}
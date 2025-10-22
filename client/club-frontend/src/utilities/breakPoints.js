import { useMediaQuery } from 'react-responsive'

const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 520 })
    return isMobile ? children : null
}

const Tablet = ({ children }) => {
    const isTablet = useMediaQuery({minWidth: 521, maxWidth: 1024 })
    return isTablet ? children : null
}

export default { Mobile, Tablet}
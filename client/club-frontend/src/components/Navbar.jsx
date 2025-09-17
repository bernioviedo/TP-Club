import {Link} from 'react-router-dom'

export default function Navbar() {

  // manejo logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  return (
    <nav>
        <Link to='/'>Home</Link>
        <Link to='/register'>Register</Link>
        <Link to='/login'>Login</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

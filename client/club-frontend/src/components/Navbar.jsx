import {Link, useNavigate} from 'react-router-dom'

export default function Navbar() {

  const navigate = useNavigate();
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

  //navegación
  const handleHome = () => navigate('/');
  const handleRegister = () => navigate('/register');
  const handleLogin = () => navigate('/login');
  const handleProfile = () => navigate('/profile');

  return (
    <nav>
      <button onClick={handleHome}>Home</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleProfile}>Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

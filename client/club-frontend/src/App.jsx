import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './components/Home/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from "../context/ContextUserProvider";
import { CartProvider } from "../context/CartContext";
import Profile from './pages/Profile';
import Footer from './components/Footer/Footer'
import Media from './pages/Media' 
import SuperAdmin from './pages/SuperAdmin'
import AdminRoute from './components/AdminRoute/AdminRoute';
import News from './pages/News';
import UsersRoute from './components/UsersRoute/UsersRoute';
import NewsView from './pages/NewsView';
import Faqs from './pages/Faqs.jsx'
import Contact from './pages/Contact.jsx'
import Nosotros from './pages/Nosotros.jsx'
import Cuotas from './pages/Cuotas.jsx'
import Tienda from './pages/Tienda.jsx'
import Futbol from './pages/deportes/Futbol.jsx'
import Voley from './pages/deportes/Voley.jsx'
import Basquet from './pages/deportes/Basquet.jsx'
import Handball from './pages/deportes/Handball.jsx'
import Natacion from './pages/deportes/Natacion.jsx'
import Tenis from './pages/deportes/Tenis.jsx'

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
      <CartProvider>
        <Toaster position='bottom-right' toastOptions={{duration:3000}} />
        <Header position='top' />
        <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={
            <UsersRoute>
            <Register />
            </UsersRoute>
          } />
          <Route path='/login' element={
            <UsersRoute>
            <Login />
            </UsersRoute>
            } />
          <Route path='/profile' element={<Profile />} />
          <Route path='/media' element={<Media />} />
          <Route path='/superadmin' element={
            <AdminRoute>
              <SuperAdmin />
            </AdminRoute>
          } />
          <Route path='/news' element={<News />} />
          <Route path='/news/:id' element={<NewsView />} />
          <Route path='/faqs' element={<Faqs />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/us' element={<Nosotros />}></Route>
          <Route path='/cuotas' element={<Cuotas />} />
          <Route path='/tienda' element={<Tienda />} />
          <Route path='/deportes/futbol' element={<Futbol />} />
          <Route path='/deportes/voley' element={<Voley />} />
          <Route path='/deportes/basquet' element={<Basquet />} />
          <Route path='/deportes/handball' element={<Handball />} />
          <Route path='/deportes/natacion' element={<Natacion />} />
          <Route path='/deportes/tenis' element={<Tenis />} />
        </Routes>
        </main>
        <Footer />
      </CartProvider>
    </UserContextProvider>
  )
}

export default App
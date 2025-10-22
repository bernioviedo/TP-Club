import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './components/Home/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from '../context/ContextUserProvider'
import Profile from './pages/Profile';
import Footer from './components/Footer/Footer'
import Media from './pages/Media' 
import SuperAdmin from './pages/SuperAdmin'
import AdminRoute from './components/AdminRoute/AdminRoute';
import News from './pages/News';
import UsersRoute from './components/UsersRoute/UsersRoute';
import NewsView from './pages/NewsView';




axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;


function App() {
  return (
    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{duration:3000}} />
      <Header position='top' />
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
    </Routes>
      <Footer />
    </UserContextProvider>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../frontend/pages/Home';
import About from '../frontend/pages/About';
import Contact from '../frontend/pages/Contact';
import Service from '../frontend/pages/Service';
import Register from '../frontend/pages/Register';
import Login from '../frontend/pages/Login';
import FrontEndLayout from '../frontend/FrontEndLayout';
import Error from '../frontend/pages/Error';
import Logout from '../frontend/pages/Logout';
import AdminLayout from '../admin/Admin-Layout';
import AdminUsers from '../admin/pages/Admin-Users';
import AdminContacts from '../admin/pages/Admin-Contacts';
// import AdminServices from './pages/Admin-services';
// import AdminHome from './pages/Admin-Home';
import AdminUpdate from '../admin/pages/Admin-Update';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <FrontEndLayout />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/service' element={<Service />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<Error />} />
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='users' element={<AdminUsers />} />
            <Route path='users/:id/edit' element={<AdminUpdate />} />
            <Route path='contact' element={<AdminContacts />} />
            {/* <Route path='service' element={<AdminServices />} />
            <Route path='home' element={<AdminHome />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './routes/AppRoutes.jsx'
import './styles/admin.css'
import './styles/frontEnd.css'
import 'react-phone-input-2/lib/style.css';
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      {/* <App /> */}
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        bodyClassName="toastBody"
        // transition:Bounce,
      />
    </StrictMode>
  </AuthProvider>
)

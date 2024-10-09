import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import PhoneInput from "react-phone-input-2"
import 'react-phone-input-2/lib/style.css'
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';


export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { storeTokenInLs } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      phone: '',
      password: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .required("Username is required"),
      email: Yup.string()
        .email('Invalid email address')
        .required("Email is required"),
      phone: Yup.string()
        .min(12,'Phone must be at least 10 characters')
        .required("Phone Number is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters long")
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values)
        })

        if (response.ok) {
          const res_data = await response.json();
          storeTokenInLs(res_data.token);
          toast.success('Registration successful');
          navigate('/login');
        } else {
          const errorData = await response.json();
          // console.log(errorData)
          toast.error(errorData.extraDetails ? errorData.extraDetails : errorData.message);
        }
        
      } catch (error) {
        setError('Registration failed. Please try again.', error);
      }
    }
  });
  
  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image">
                <img src="assets/frontend-images/images/register.png" alt="register" width="400" height="500" />
              </div>
              <div className="registration-form">
                <h1 className="main-heading mb-3">Registration Form</h1>
                <br />

                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" placeholder="Enter your user name " id="username"  autoComplete="off" {...formik.getFieldProps('username')} />
                    {formik.touched.username && formik.errors.username ? (
                      <p style={{ color: 'red' }}>{formik.errors.username}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Enter your email" id="email"  autoComplete="off" {...formik.getFieldProps('email')} />
                    {formik.touched.email && formik.errors.email ? (
                      <p style={{ color: 'red' }}>{formik.errors.email}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="phone">Phone</label>
                    <PhoneInput country={'in'} value={formik.values.phone} onChange={phone => formik.setFieldValue('phone', phone)} />
                    {formik.touched.phone && formik.errors.phone ? (
                      <p style={{ color: 'red' }}>{formik.errors.phone}</p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Enter your password" id="password" autoComplete="off" {...formik.getFieldProps('password')} />
                    {formik.touched.password && formik.errors.password ? (
                      <p style={{ color: 'red' }}>{formik.errors.password}</p>
                    ) : null}
                  </div>

                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <br />
                  <button type="submit" className="btn btn-submit">Register Now</button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  )
}

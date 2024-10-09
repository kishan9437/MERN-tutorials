import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from 'react-toastify';

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { storeTokenInLs } = useAuth();

  // let handle the input field value
  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      })
      // console.log('Login',response);

      if (response.ok) {
        toast.success("Login successful")
        const res_data = await response.json();
        storeTokenInLs(res_data.token);
        // localStorage.setItem('token', res_data.token);
        setUser({ email: "", password: "", })
        navigate("/")
      } else {
        const errorData = await response.json();
        // console.log(errorData);
        toast.error(errorData.message)
        // console.log('Invalid login');
      }
    } catch (error) {
      // console.log(error);
      setError("Login failed. Please try again.", error)
    }
  }
  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/assets/frontend-images/images/login.png"
                  alt="a nurse with a cute look"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form" style={{ height: '400px' }} >
                <h1 className="main-heading mb-3">Login form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="Enter password"
                    />
                  </div>
                  {/* <br /> */}
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

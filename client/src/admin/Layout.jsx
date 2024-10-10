import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminLayout() {
    const {user,isLoading} = useAuth();
    // console.log(user);

    if(isLoading){
        return <p>Loading...</p>
    }

    if(!user.isAdmin) {
        return <Navigate to={'/'}/>
    }
  return (
    <>
        <header>
            <div className="container">
                <nav>
                    <ul>
                        <li><NavLink to='/admin/users'>Users</NavLink></li>
                        <li><NavLink to='/admin/contact'>Contacts</NavLink></li>
                        {/* <li><NavLink to='/admin/service'>Services</NavLink></li>
                        <li><NavLink to='/admin/home'>Home</NavLink></li> */}
                    </ul>
                </nav>
            </div>
        </header>
        <Outlet/>
    </>
  )
}

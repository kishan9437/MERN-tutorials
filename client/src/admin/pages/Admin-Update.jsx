import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";


export default function AdminUpdate() {
    const [data, setData] = useState({
        username: "",
        email: "",
        phone: "",
    })

    const navigate=useNavigate();

    const params = useParams();
    const { authorizationToken } = useAuth();
    const getSingleUserData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/${params.id}`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken
                },
            });
            const data = await response.json();
            setData(data);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getSingleUserData();
    }, [])
    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setData({
            ...data,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/update/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(data),
            });
            if(response.ok){
                toast.success('Updated successfully')
                navigate('/admin/users');
            }else{
                toast.error('Failed to update');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <section className="section-contact">
                <div className="contact-content container">
                    {/* <h1 className="main-heading">Update User Data</h1>  */}
                </div>

                <div className="container grid grid-two-cols">
                    <section className="section-form">
                        <h1 className="main-heading">Update User Data</h1>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" id="username" autoComplete="off" value={data.username} onChange={handleInput} required />
                            </div>
                            <div>
                                <label htmlFor="username">Email</label>
                                <input type="email" name="email" id="email" autoComplete="off" value={data.email} onChange={handleInput} required />
                            </div>
                            <div>
                                <label htmlFor="username">Mobile</label>
                                <input type="text" name="phone" id="phone" autoComplete="off" value={data.phone} onChange={handleInput} required />
                            </div>
                            <div>
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </section>
                </div>
            </section>
        </>
    )
}

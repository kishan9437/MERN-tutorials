import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";

export default function AdminContacts() {
  const { authorizationToken } = useAuth();
  const [contactData,setContactData]=useState([]);

  const getContactsData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/contacts', {
        method: 'GET',
        headers: {
          Authorization: authorizationToken,
        }
      })
      const data= await response.json();
      // console.log(data);
      if (response.ok){
        setContactData(data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const deleteContactById=async(id)=>{
    try {
      const response= await fetch(`http://localhost:5000/api/admin/contacts/delete/${id}`,{
        method: 'DELETE',
        headers: {
          Authorization: authorizationToken,
        }
      });
      if(response.ok){
        getContactsData();
        toast.success("Contact deleted successfully")
      }else{
        toast.error("Failed to delete contact")
      }
    } catch (error) { 
      console.log(error);
    }
  }
  useEffect(() => {
    getContactsData();
  }, [])
  return (
    <>
      <section className="admin-contacts-section">
        <h1 style={{marginLeft:"13rem"}}>Admin Contact Data</h1>
        <div className="container admin-users">
          {contactData.map((curData,index)=>{
            const {username,email,message,_id}=curData;
            return(
              <div key={index}>
                <p>Username : {username}</p>
                <p>Email : {email}</p>
                <p>Message : {message}</p>
                <button className="btn" onClick={()=>deleteContactById(_id)}>Delete</button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filterUsers, setFilterUsers] = useState([])
    const { authorizationToken } = useAuth();
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedStatus, setSelectedStatus] = useState('all');
    // const [selectedUser, setSelectedUser] = useState(null);  // Currently selected user for status change

    const getAllUsersData = async (order = "asc") => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users?order=${order}`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            })
            const data = await response.json()
            // console.log(data);
            setUsers(data);
            setFilterUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSeach = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setSearch(value);

        let filtered = users;

        if (selectedStatus !== "all") {
            filtered = filtered.filter(user => user.status === selectedStatus); // Filter by status
        }

        if (value === "") {
            setFilterUsers(filtered);
        } else {
            const searchTerm = value.split(' ');
            const filter = filtered.filter((user) => {
                return searchTerm.some((term) =>
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.phone.includes(term)
                )
            })
            setFilterUsers(filter);
        }
    }

    const handleSort = () => {
        // Toggle the sort order
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);

        // Sorting only on filtered data
        const sortedUsers = [...filterUsers].sort((a, b) => {
            if (newOrder === "asc") {
                return a.username.localeCompare(b.username);
            } else {
                return b.username.localeCompare(a.username);
            }
        });

        setFilterUsers(sortedUsers); // set sorted data to filtered users
    }

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const updateUsers = users.map((user) => user._id === userId ? { ...user, status: newStatus } : user)
            setUsers(updateUsers);
            setFilterUsers(updateUsers);

            const response = await fetch(`http://localhost:5000/api/admin/users/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authorizationToken,
                },
                body: JSON.stringify({ userId, status: newStatus }),
            });
            // console.log(response);
            if (response.status === 200) {
                alert('Status updated successfully');
            } else {
                alert('Error updating status');
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleStatus = (e) => {
        const status = e.target.value;
        setSelectedStatus(status);

        let filtered = users;

        if (status !== "all") {
            filtered = users.filter(user => user.status === status); // Filter users by status
        }

        if (search !== "") {
            const searchTerm = search.split(' ');
            filtered = filtered.filter((user) => {
                return searchTerm.some((term) =>
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.phone.includes(term)
                );
            });
        }

        setFilterUsers(filtered);
    }
    const deleteUser = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/users/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorizationToken,
                },
            })
            // console.log(response)
            await response.json()
            // console.log(`users after delete ${data}`);

            if (response.ok) {
                getAllUsersData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getAllUsersData();
    }, [])
    return (
        <>
            <section className="admin-users-section">
                <div className="container">
                    <h1>Admin User Data</h1>
                    <label htmlFor="status" style={{ position: 'relative', top: '22px', left: '290px' }}>Status : </label>
                    <select name="Status" value={selectedStatus} onChange={handleStatus} style={{ height: '32px', marginTop: '21px', width: '200px', marginLeft: '280px', cursor: 'pointer' }}>
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="reject">Reject</option>
                    </select>
                    <div className="search_name">
                        <input type="search" placeholder="Search" style={{ height: "30px", width: '200px', marginRight: '5px' ,fontSize:'16px',paddingLeft:'8px'}} value={search} onChange={handleSeach}></input>
                        {/* <button style={{ height: '30px', padding: "0px 8px", }}>Search</button> */}
                    </div>
                </div>
                <div className="container admin-users">
                    <table>
                        <thead>
                            <tr>
                                <th onClick={handleSort} style={{ cursor: "pointer" }}>Name {sortOrder === "asc" ? "↑" : "↓"}</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterUsers.length > 0 ? (
                                filterUsers.map((curUser, index) => {
                                    return <tr key={index}>
                                        <td>{curUser.username}</td>
                                        <td>{curUser.email}</td>
                                        <td>{curUser.phone}</td>
                                        <td>
                                            <Popup trigger={<span style={{ cursor: "pointer", color: "blue" }}>{curUser.status}</span>}
                                                position="right center" modal closeOnDocumentClick>
                                                {(close) => (
                                                    <div>
                                                        <h3 style={{ fontSize: '20px', textAlign: 'center' }}>Change Status for {curUser.username}</h3>
                                                        <div style={{ display: 'flex', flexDirection: 'column', margin: "10px" }}>
                                                            <button style={{ marginTop: '5px' }} onClick={() => { handleStatusChange(curUser._id, 'active'); close() }}>Active</button>
                                                            <button style={{ marginTop: '5px' }} onClick={() => { handleStatusChange(curUser._id, 'inactive'); close() }}>Inactive</button>
                                                            <button style={{ marginTop: '5px' }} onClick={() => { handleStatusChange(curUser._id, 'reject'); close() }}>Reject</button>
                                                            <button style={{ marginTop: '5px' }} onClick={close}>Cancel</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Popup>
                                        </td>
                                        <td><Link to={`/admin/users/${curUser._id}/edit`}>Edit</Link></td>
                                        <td><button onClick={() => deleteUser(curUser._id)}>Delete</button></td>
                                    </tr>
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5">User not found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

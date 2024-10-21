import { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filterUsers, setFilterUsers] = useState([])
    const { authorizationToken } = useAuth();
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const usersPerPage=5;

    const getAllUsersData = async (page = 1, order = "asc") => {
        try {
            setLoading(true);  // Show loading spinner while fetching data

            const response = await fetch(`http://localhost:5000/api/admin/users?order=${order}&page=${page}&limit=5`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            })
            const data = await response.json()
            // console.log(data.users);
            setUsers(data.users);
            // console.log(data)
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            // console.log(currentPage)
            // console.log(totalPages)
            setFilterUsers(data.users);
            // console.log(filterUsers)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
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
            filtered = filtered.filter((user) => {
                return searchTerm.some((term) =>
                    user.username.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.phone.includes(term)
                )
            })
            // console.log(filterUsers);
            setFilterUsers(filtered);
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
            filtered = filtered.filter(user => user.status === status);
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
            await response.json()

            if (response.ok) {
                getAllUsersData();
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            getAllUsersData(page, sortOrder);
        }
    }
    useEffect(() => {
        getAllUsersData(currentPage, sortOrder);
    }, [currentPage, sortOrder]);
    return (
        <>
            <div className="custom-screen custom-bg custom-text">
                <main className="custom-container custom-padding">
                    <div className="custom-header">
                        <h1 className="custom-heading">Admin User Data</h1>
                    </div>
                    <div className="custom-table-margin">
                        <label className="custom-flex custom-items-baseline custom-gap">
                            <span className="custom-text">Search: </span>
                            <input
                                type="search"
                                className="custom-input"
                                value={search}
                                onChange={handleSeach}
                                placeholder="Search"
                            />
                            <label className="custom-label">
                                <span className="custom-text">Status: </span>
                                <select
                                    className="custom-select"
                                    name="Status"
                                    value={selectedStatus}
                                    onChange={handleStatus}
                                >
                                    <option value="all">All</option>
                                    <option value="ACTIVE">Active</option>
                                    <option value="INACTIVE">Inactive</option>
                                    <option value="REJECT">Reject</option>
                                </select>
                            </label>
                        </label>
                        <div className="admin-users" style={{ marginTop: "15px" }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th onClick={handleSort}>Name {sortOrder === "asc" ? "↑" : "↓"}</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array(5).fill().map((_, index) => (
                                            <tr key={index}>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td><Skeleton width={100} /></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))
                                    ) : filterUsers.length > 0 ? (
                                        filterUsers.map((curUser, index) => (
                                            <tr key={curUser._id}>
                                                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                                <td>{curUser.username}</td>
                                                <td>{curUser.email}</td>
                                                <td>{curUser.phone}</td>
                                                <td>
                                                    <Popup trigger={<span className={`cursor-pointer ${curUser.status.toLowerCase() === 'active' ? 'status-active' : curUser.status.toLowerCase() === 'inactive' ? 'status-inactive' : 'status-offline'}`}>{curUser.status}</span>}
                                                        position="right center" modal closeOnDocumentClick>
                                                        {(close) => (
                                                            <div className="popup">
                                                                <h3 style={{ textAlign: 'center', fontSize: 'large', marginTop: "10px" }}>Change Status for {curUser.username}</h3>
                                                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '10px' }}>
                                                                    <button className="active" onClick={() => { handleStatusChange(curUser._id, 'ACTIVE'); close() }}>ACTIVE</button>
                                                                    <button className="inactive" style={{ marginTop: "10px" }} onClick={() => { handleStatusChange(curUser._id, 'INACTIVE'); close() }}>INACTIVE</button>
                                                                    <button className="reject" style={{ marginTop: "10px" }} onClick={() => { handleStatusChange(curUser._id, 'REJECT'); close() }}>REJECT</button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Popup>
                                                </td>
                                                <td><Link to={`/admin/users/${curUser._id}/edit`}>Edit</Link></td>
                                                <td><button onClick={() => deleteUser(curUser._id)}>Delete</button></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6">User not found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination-container">
                                <div className="pagination">
                                    <span>Page {currentPage} of {totalPages}</span>
                                    <div className="pagination-buttons">
                                        <button
                                            className="pagination-btn"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            ← Prev
                                        </button>
                                        <button className="show-total-btn">Total Page {totalPages}</button>

                                        <button
                                            className="pagination-btn"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    )
}

import { createContext, useContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState([]);
    const authorizationToken = `Bearer ${token}`;

    const storeTokenInLs = (serverToken) => {
        setToken(serverToken);
        return localStorage.setItem("token", serverToken)
    }

    let isLoggedIn = !!token;

    const LogoutUser = () => {
        setToken('');
        return localStorage.removeItem('token');
    }

    // function to check the user Authentication or not
    const userAuthentication = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:5000/api/auth/user", {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            })

            if (response.ok) {
                const data = await response.json();
                // console.log("User data",data);
                setUser(data.userData);
                setIsLoading(false);
            }
            else {
                console.error("Error fetching user data");
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fetching services from the server
    const getService = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/data/service", {
                method: "GET"
            })

            if (response.ok) {
                const data = await response.json();
                // console.log("Services data",data.msg);
                setServices(data.msg);
            }
        } catch (error) {
            console.log(`services frontend error : ${error}`)
        }
    }
    useEffect(() => {
        userAuthentication();
        getService();
    }, [])
    return <AuthContext.Provider value={{ isLoggedIn, storeTokenInLs, LogoutUser, user, services, authorizationToken, isLoading }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth used outside of the Provider")
    }
    return authContextValue;
};
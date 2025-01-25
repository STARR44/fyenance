import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (e )=> {
        e.preventDefault()
        let response = await fetch('http://127.0.0.1:8000/accounts/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate('/dashboard')
        }else{
            alert('Something went wrong!')
        }
    }


    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login', { replace: true })
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        loginUser:loginUser,
        logoutUser:logoutUser,
    }

    useEffect(() => {
        const loadTokens = () => {
            const tokens = localStorage.getItem('authTokens');
            if (tokens) {
                setAuthTokens(JSON.parse(tokens));
                setUser(jwtDecode(JSON.parse(tokens).access));
            }
            setLoading(false);
        };
    
        loadTokens();
        setLoading(false);
    }, []);

    

    // useEffect(() => {
    //     const refreshToken = async () => {
    //         if (authTokens?.refresh) {
    //             const refreshDecoded = jwtDecode(authTokens.refresh);
    //             const isRefreshExpired = dayjs.unix(refreshDecoded.exp).diff(dayjs()) < 1;
    
    //             if (!isRefreshExpired) {
    //                 try {
    //                     const response = await fetch('http://127.0.0.1:8000/accounts/token/refresh/', {
    //                         method: 'POST',
    //                         headers: { 'Content-Type': 'application/json' },
    //                         body: JSON.stringify({ refresh: authTokens.refresh }),
    //                     });
    
    //                     if (response.status === 200) {
    //                         const data = await response.json();
    //                         setAuthTokens(data);
    //                         setUser(jwtDecode(data.access));
    //                         localStorage.setItem('authTokens', JSON.stringify(data));
    //                     } else {
    //                         logoutUser();
    //                     }
    //                 } catch (error) {
    //                     console.error("Error during token refresh:", error);
    //                     logoutUser();
    //                 }
    //             } else {
    //                 logoutUser();
    //             }
    //         }
    //     };
    
    //     refreshToken();
    //     setLoading(false);
    // }, []);


    // useEffect(()=> {

    //     if(authTokens){
    //         setUser(jwtDecode(authTokens.access))
    //     }
    //     setLoading(false)


    // }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData} >
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
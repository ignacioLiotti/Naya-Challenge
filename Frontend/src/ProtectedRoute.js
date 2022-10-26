import React, {Children, useState, useEffect} from 'react'
import { useNavigate, Outlet } from 'react-router-dom';
import { auth } from './firebase/config'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,} from 'firebase/auth'

function ProtectedRoute() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user)
            } else {
                navigate('/')
            }    
        });
        return () => unsubscribe
    }, []);

    if (!user) return (
        <h1>Loading</h1>
    )

    return user ? <Outlet context={{user}} /> : '';
}

export default ProtectedRoute
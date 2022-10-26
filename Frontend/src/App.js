import { useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
 } from 'firebase/auth'
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { auth, createUserDocument, putUser } from './firebase/config'
import Canvas from './Canvas'
import Projects from './Projects'
import ProtectedRoute from './ProtectedRoute';
import styled from 'styled-components';
// make a router with the app and canvas components

export default function App() {

  
  return (
    <>
    <Routes>
      <Route path="/" element={<SignUp />}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/projects" element={<Projects />} />
        <Route path="/canvas" element={<Canvas/>} />
      </Route>
    </Routes>
    </>
  )
}

function SignUp() {
   let navigate = useNavigate();

  // user login with email and password and sign up with email, password and name and last name with firebase auth and store data in firestore database

  const [user, setUser] = useState(null)
  const [alreadyUser, setAlreadyUser] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await putUser(user, { displayName, lastName })
      setLoading(false)
      navigate("/projects");
      // await createUserDocument(user, { displayName, lastName })
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {  
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoading(false)

      navigate("/projects");
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setError(error.message)
      navigate("/");
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if(user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }
  , [])


// make router with the app and canvas components




  return (
    <Wrapper>
      {!alreadyUser ? (
        <FormWrapper>
          <FormTitle>Sign Up</FormTitle>
          <StyledForm onSubmit={handleSignUp}>
            <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="text" placeholder="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <input type="text" placeholder="last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <button type="submit">Sign Up</button>
          </StyledForm>

          <ChangeButton>Already have an account? <span onClick={() => setAlreadyUser(true)}>Log In</span></ChangeButton>
        </FormWrapper>
      ) : (
        <FormWrapper>
          <FormTitle>Login to continue</FormTitle>
          <StyledForm onSubmit={handleLogin}>
            <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </StyledForm>
          <ChangeButton>Don't have an account? <span onClick={() => setAlreadyUser(false)}>Sign Up</span></ChangeButton>
        </FormWrapper>
        )}
      {/* <button onClick={handleLogout}>Logout</button>
      {user && <p>{user.email}</p>}
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>} */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  `

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px; 
  gap: 20px;
  `

const FormTitle = styled.h1`
  font-size: 2.25rem;
  color: #4F00C1;
  `

const StyledForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  input {
    width: 100%;
    height: 40px;
    border: 1px solid #989898;
    border-radius: 5px;
    margin: 10px 0;
    padding: 0 10px;
  }

  button {
    width: 100%;
    height: 40px;
    margin-top: 20px;
    border: none;
    border-radius: 5px;
    background-color: #4F00C1;
    color: #fff;
    font-size: 1.25rem;
    font-weight: 500;
    cursor: pointer;
  }
  `

const ChangeButton = styled.p`
  font-size: 0.80rem;
  font-weight: 500;
  color: #424242;
  span{
    color: #4F00C1;
    cursor: pointer;
  }
  `



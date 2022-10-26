// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc} from 'firebase/firestore';
// import getUserDocument 


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const firestore = getFirestore(app);

export const putUser = async (user) => {
  try {
    const postOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
    const response = await fetch(`${base_url}${user.uid}.json`, postOptions)
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const putColaborator = async (owner, user, project) => {
  try {
    const postOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({'colaborator' : user.uid})
    }
    const response = await fetch(`${base_url}${owner}/projects/${project}/colaborators.json`, postOptions)
    const data = await response.json()
    console.log(`${base_url}${owner}/projects/${project}/colaborators.json`)
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getUser = async (user) => {
  try {
    const postOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${base_url}${user}.json`, postOptions)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getProject = async (user,project) => {
  try {
    const postOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${base_url}${user.uid}/projects/${project}.json`, postOptions)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const getColaborators = async (user,project) => {
  try {
    const postOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }
    const response = await fetch(`${base_url}${user}/projects/${project}/colaborators.json`, postOptions)
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const postProject = async (user, image) => {
  try {
    const postOptions = {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({image, colaborators:{colaborator: user.uid}})
    }
    const response = await fetch(`${base_url}${user.uid}/projects.json`, postOptions)
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

// add data from signup form to firestore database
export const createUserDocument = async (user, additionalData) => {
  if(!user) return
  const userRef = doc(firestore, `users/${user.uid}`)
  const snapshot = await getDoc(userRef)
  if(!snapshot.exists()) {
    const { email, displayName, lastName } = user
    try {
      await setDoc(userRef, {
        displayName,
        lastName,
        email,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user', error.message)
    }
  }
  return getUserDocument(user.uid)
}

// get user data from firestore database
export const getUserDocument = async (uid) => {
  if(!uid) return null
  try {
    const userDocument = await getDoc(doc(firestore, `users/${uid}`))
    return {
      uid,
      ...userDocument.data()
    }
  } catch (error) {
    console.log('error fetching user', error.message)
  }
}


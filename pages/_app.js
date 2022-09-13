import React, {useEffect} from 'react';
import '../styles/globals.css'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from '../components/Login'
import Loading from '../components/Loading'
import { serverTimestamp, collection ,setDoc, doc } from 'firebase/firestore';
function MyApp({ Component, pageProps }) {

  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user){
      setDoc(doc(collection(db, 'users'), user.uid), {
        email: user.email,
        lastSeen:  serverTimestamp(),
        photoURL: user.photoURL,
      }, {merge: true})
    }
  }, [user])
  if(loading) return <Loading />
  if (!user) return <Login /> 


  return <Component {...pageProps} />
}

export default MyApp

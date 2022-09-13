import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Button from '@mui/material/Button';
import { signInWithPopup} from 'firebase/auth';
import { auth, provider } from '../firebase';
function Login() {
  const handelSignin = () => {
    signInWithPopup(auth, provider).catch((error) => console.log(error));
  }
  return(
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo 
        src=
        "https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=w240-h480-rw" 
        alt="logo"/>
        <Button variant="outlined" onClick={handelSignin}>Sign In with Google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;
const LoginContainer = styled.div`
  display: flex;
  padding: 100px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7)
`;
const Logo = styled.img`
  height: 200px;
  margin-bottom: 50px; 
  border-radius: 50%;
  width: 200px;     
`;
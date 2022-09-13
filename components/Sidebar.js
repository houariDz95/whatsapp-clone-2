import React from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import * as EmailValidator from 'email-validator';
import { signOut } from "firebase/auth";
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import {collection, addDoc, query, where} from 'firebase/firestore';
import Chat from './Chat';
function Sidebare(){
  const [user] = useAuthState(auth);
  const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user.email));
  const [chatsSnapshot] = useCollection(userChatRef); 
  const createChat = () => {
    const input = prompt("please enter the user you desire to chat with");
    if(!input) return null

    if(
      EmailValidator.validate(input) && 
      !chatAlreadyExists(input) && 
      input !== user.email
    ){
      addDoc(collection(db, 'chats'), {
        users: [input, user.email],
      })
    }
  }
  const chatAlreadyExists = (recipientEmail) =>( 
  !!chatsSnapshot?.docs?.find(chat => chat.data().users.find(user => user === recipientEmail)?.length > 0)
  )

  const handelSignout = () => {
    signOut(auth)
  }
  return(
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={handelSignout}/>
        <IconContainer >
          <ChatIcon />
          <MoreVertIcon />
        </IconContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chat"/>
      </Search>
      <SidebarButton onClick={createChat}>Start A New Chat</SidebarButton>

      {chatsSnapshot?.docs.map(chat => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  )
}

export default Sidebare

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar{
    display: none;
  }
`;  

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;  

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  &:hover{
    opacity: 0.8;
  }
`; 

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;

`;

const SearchInput = styled.input`
  border: none;
  outline-width: 0;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&&{
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;    
  }
`;
const IconContainer = styled.div`   
`;
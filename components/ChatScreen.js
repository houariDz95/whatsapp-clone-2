import React, {useState} from 'react'
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFile  from '@mui/icons-material/AttachFile';
import InsretEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Button from '@mui/material/Button'
import { query, where, collection, doc, orderBy, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import Message from './Message';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import { useRef } from 'react';


function ChatScreen({chat, messages}) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(query(collection(doc(collection(db, 'chats'), router.query.id), 'messages'), orderBy("timestamp", 'asc')));
  const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where("email", "==", getRecipientEmail(chat.users, user.email))));
  const [input, setInput] = useState('');
  const endOfMessageRef = useRef(null)
  const showMessages = () => {
    if(messagesSnapshot){
      return messagesSnapshot?.docs.map(message => (
        <Message 
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate(),
          }}
        />
      ))
    }else {
      return JSON.parse(messages).map(message => (
        <Message key={message.id} user={message.user} message={message} />
      ))
    }
  }
  const sendMessage = (e) => {
    e.preventDefault();
    setDoc(doc(collection(db, 'users'), user.uid), {
      lastSeen: serverTimestamp(),
    }, {merge: true});

    addDoc(collection(doc(collection(db, 'chats'), router.query.id), 'messages'), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })
    setInput('');
    scrollToButton();
  }

  const recipientEmail = getRecipientEmail(chat.users, user.email);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const scrollToButton = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });    
  }
  return (
    <Container>
      <Header>
        {recipient ? (<Avatar src={recipient?.photoURL} />) : (<Avatar>{recipientEmail[0]}</Avatar>)}
        <HeaderInformation >
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? 
          (<p>
            Last active...
            {recipient?.lastSeen?.toDate() ? (<TimeAgo datetime={recipient?.lastSeen?.toDate()} />) : ("Unavailable")}
          </p>) : 
          (<p>Loading last active...</p>)}
        </HeaderInformation>
        <HeaderIcon>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
          <MoreVertIcon />
          </IconButton>
        </HeaderIcon>
      </Header>
      <MessagesContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessagesContainer>

      <InputContainer>
        <InsretEmoticonIcon  />
        <Input value={input} onChange={(e) => setInput(e.target.value)}/>
        <button hidden disabled={!Input} type="submit" onClick={sendMessage}>send message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen

const Container = styled.div``;
const Header = styled.div`
  position:sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3{
    margin-bottom: 3px;

  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcon =styled.div`
  display: flex;

`

const IconButton = styled(Button)`
`;
const MessagesContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: whitesmoke;
`;
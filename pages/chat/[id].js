import React from 'react';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import Head from 'next/head';
import styled from 'styled-components';
import { collection, getDocs, getDoc, doc, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({messages, chat}) {
  const [user] = useAuthState(auth)
  return(
    <Container>
      <Head>
        <title>chat with {getRecipientEmail(chat.users, user.email)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
    const ref = doc(collection(db, 'chats'), context.query.id);
    const messagesRes = await getDocs(query(collection(ref, 'messages'), orderBy('timestamp', 'asc')));
    const messages = messagesRes.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).map(messages => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime()
    }))

    const chatRes = await getDoc(ref)
    const chat = {
      id:chatRes.id,
      ...chatRes.data(),
    }
    return{
      props: {
        messages: JSON.stringify(messages),
        chat: chat,
      }
    }
}
const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar{
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
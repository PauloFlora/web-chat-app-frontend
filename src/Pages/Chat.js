import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router';
import UserContext from '../context/userContext';
import io from 'socket.io-client';
import { IoMdSend } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg'

// const ENDPOINT =  'https://whatsepp-backend.herokuapp.com/';
const ENDPOINT =  'http://localhost:4001/';
const socket = io(ENDPOINT);

function Chat () {
  const { user, isLoggedIn, users, setUsers } = useContext(UserContext);
  const [message, updateMessage] = useState('');
  const [messages, updateMessages] = useState([]);

  const navigate = useNavigate();
  
  const chatRef = useRef();

  const id = user.id;

  const onChange = ({ target }) => {
    updateMessage(target.value);
  };

  // Envia mensagem para todos os usuários
  const onSubmit = (event) => {
    event.preventDefault();
    if(message.trim()) {
      socket.emit('chat-message', { id, username: user.username, message })
      updateMessage('');
    }
  };

  // Gera a hora em que a mensagem foi enviada
  const getTime = () => {
    const date = new Date();
    const hour = date.getHours()
    const minutes = date.getMinutes()
    if (minutes > 9) return `${hour}:${minutes}`
    return `${hour}:0${minutes}`
  }

  //Previne que usuários não logados entrem nesta página.
  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [])

  // Recebe do servidor os dados de um novo usuário logado.
  useEffect(() => {
    socket.on('login', (u) => {
      users.push(u)
      setUsers(users);
    });
    socket.off('login');
  }, [users, setUsers])

  //Envio / recebimento de mensagens
  useEffect(() => {
    socket.on('chat-message', (m) => {
      updateMessages([...messages,m]);
    });
    return () => {
    socket.off('chat-message');
    }
  }, [messages]);

  // solução para o scroll chegar ao final da página automaticamente ao receber/enviar novas mensagens
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ block: 'end' })
    }
  },
  [messages])

  return (
    <div
      className="bg-emerald-100 h-screen grid place-items-center"
    >
      <div
        id="App"
        className="w-[100vw] h-[100vh] md:w-[90vw] md:h-[90vh] bg-emerald-800 shadow-2xl flex"
      >
        <div
          id="Sidebar"
          className="hidden flex-0 bg-emerald-900 flex-col md:visible md:flex-[0.20] md:flex" 
        >
          <div
            className="bg-emerald-50 flex-1 overflow-y-auto"
          >
            <h1 
              className="p-2 text-center text-[25px] text-emerald-900 mt-3 mb-3"
            >
              Participantes
            </h1>
            <div
              className="flex-1 text-center text-[20px] p-2 text-emerald-900"
            >
              { users.length > 0 ? users.map((u) => {
                return(
                  <div className="flex-1 border border-gray bg-emerald-200 duration-200 ease-in-out text-center text-[20px] p-2 text-emerald-900"
                    key={ Math.random() }
                  >
                    <p className="hover:bg-emerald-300"> 
                      { u.username }
                    </p>
                  </div>)
              }) : (<p> Nenhum participante logado </p>) }
            </div>
          </div>
        </div>
        <div
          id="Chat"
          className="flex-1 md:flex-[0.8] flex flex-col"
        >
          <div id="header"
            className="flex-[0.07] md:flex-[0.05] bg-emerald-600 flex place-items-center"
          >
            <div
              className="ml-4 md:ml-10 text-4xl md:text-5xl text-emerald-50"
            >
              <CgProfile />
            </div>
            <p 
              className=" text-3xl text-emerald-50 ml-2 "
            >
              { user.username }
            </p>
            <div className="flex-1">
            <h1 className="text-xl md:text-4xl text-emerald-50 md:m-4 m-4 text-center"> WhatesEpp do Paulo </h1>
            </div>
          </div>
          <div
            id="chat-body"
            className="flex-1 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-300"
          >
            { messages.map((m) => {
              return (
                <div
                  key={ Math.random() }
                  className={`flex flex-col max-w-[70%] m-6 w-[fit-content]
                  ${ m.id === user.id && 'ml-auto' }
                   `}
                >
                  { m.id === user.id ? false : (
                    <p
                      className="m-0 p-0 font-bold text-emerald-200"
                    >
                      { m.username }
                    </p>
                  ) }
                  <p
                    className={`relative text-[16px] p-4 bg-emerald-100 w-[fit-content] rounded break-all text-emerald-900 
                    shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.38)]
                    ${ m.id === user.id && 'ml-auto bg-emerald-500' }
                    `} 
                  >
                    { m.message }
                    <span
                      className="absolute bottom-0 right-[5px] ml-2 text-[12px] text-grey-500 text-emerald-900"
                    >
                      { getTime() }
                    </span>
                  </p>
                </div>
              )
            }) }
            {/* solução para o scroll chegar ao final da página automaticamente */}
            <span id="chat-span" ref={ chatRef }></span>
          </div>
          <div
            className="flex items-center justify-between h-[62px] bg-emerald-900 border-gray-300 px-2"
          >
            <form
              onSubmit={ onSubmit }
              className="flex flex-1"
            >
              <input
                type='text'
                value={ message }
                onChange={ onChange }
                placeholder='Digite uma mensagem'
                className="flex-[0.99] rounded-[30px] p-2 border-none outline-none"
              />
              <button className="flex-[0.01] grid justify-end ml-2 text-emerald-100 text-4xl">
                <IoMdSend />
              </button>
            </form>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Chat;

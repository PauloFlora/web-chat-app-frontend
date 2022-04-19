import React, { useState, useContext, useEffect } from 'react';
import UserContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { v4 } from 'uuid';
const ENDPOINT = 'https://whatsepp-backend.herokuapp.com/';
const socket = io(ENDPOINT);

//Gera um id para o usuário atual.
const id = v4();

function Login () {
  const { users, setUsers, setUser, setIsLoggedIn } = useContext(UserContext);
  const [ username, setUsername ] = useState('');
  
  const navigate = useNavigate();

  const handleUsername = ({ target: { value } }) => setUsername(value);

  const verifyUsername = (name) => {
    if(!name || name.trim() === '') {
      window.alert('Seu nome de usuário é inválido')
      return false;
    }
    if (name.length < 3) {
        window.alert('Seu nome de usuário é muito pequeno')
        return false;
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (verifyUsername(username)) {
      const user = { id, username };
      users.push(user);
      setUser(user);
      socket.emit('login', user );
      navigate('/Chat');
    }
  };

  // Envia dados do usuário logado ao servidor.
  useEffect(() => {
    socket.on('login', (u) => {
      setUsers(u);
    });
    setIsLoggedIn(true);
    // socket.off('login');
  });

  return (
    <div
      className="min-h-screen grid place-items-center bg-emerald-900"
    >
      <div
        className="bg-emerald-100 p-8 rounded shadow-2xl md:w-1/2 w-5/6 h-1/2 md:grid place-items-center"
      >
        <div 
          className="flex[0.2] md:w-1/2"
        >
          <div 
            className="p-4 grid place-items-center"
          >
          <h2
            className=" text-2xl md:text-4xl font-bold text-emerald-900 mb-20 md:mb-10"
          >
            Escolha seu nome !
          </h2>
          </div>
          <div
            className="w-full"
          >
            <form
              onSubmit={ handleSubmit }
            >
              <div
            className=""
              >
                <input
                  type="text"
                  onChange={ handleUsername }
                  value={ username }
                  placeholder="UserName"
                  className="placeholder-emerald-500 bg-emerald-50 font-bold text-emerald-900 p-2 rounded-lg mb-10 w-full focus:bg-emerald-200 text-2xl text-center"
                />
              </div>
              <div
                className=""
              >
                <button
                  type="submit"
                  className="font-bold text-emerald-50 pb-2 pt-2 pl-8 pr-8 bg-emerald-900 rounded-lg w-full text-xl"
                >
                  ENTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

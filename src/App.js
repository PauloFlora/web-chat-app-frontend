import Chat from "./Pages/Chat";
import Login from "./Pages/Login";
import './index.css';
import * as React from "react";
import { Routes, Route } from "react-router-dom";

import UserProvider from "./context/userProvider";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/Chat" element={ <Chat /> } />
      </Routes>
    </UserProvider>
  );
}

export default App;

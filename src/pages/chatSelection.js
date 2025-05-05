import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function ChatSelection() {
    const [chatrooms, setChatrooms] = useState([1]);
    var i = 0;
    var chatroomObjects = chatrooms.map(room => {
        i++;
        return <Link to="/chat" key={i}>
            <button onClick={localStorage.setItem("chatroom", room)} className="bttn">Room: {room}</button>
        </Link>;
    }
    );
    console.log(JSON.parse(localStorage.getItem('token')));

    return (
        <div className="App">
            <a href='/' className="app-title">Cavemanomics</a>
            <header className="header">
                <h1>Chats</h1>
                {chatroomObjects}
            </header>
        </div>
    );
}

export default ChatSelection;
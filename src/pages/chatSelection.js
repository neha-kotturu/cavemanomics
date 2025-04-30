import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chat from "./chat"

function ChatSelection() {
    const [chatrooms, setChatrooms] = useState([0]);
    var chatroomObjects = chatrooms.map(room => <Link to="/chat"><button className="bttn">Room: {room}</button></Link>);

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
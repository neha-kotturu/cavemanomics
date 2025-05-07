import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const pullData = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

function ChatSelection() {
    const [chatrooms, setChatrooms] = useState([]);

    var i = 0;
    var chatroomObjects = chatrooms.map(room => {
        i++;
        return <Link to="/chat" key={i}>
            <button onClick={localStorage.setItem("chatroom", room)} className="bttn">Room: {room}</button>
        </Link>;
    }
    );

    useEffect(() => {
        const ID = pullData(localStorage.getItem('token'));
        var rooms = loadChatrooms(ID);
        rooms.then(rooms => { if (rooms != null) { setChatrooms(rooms.map(room => room.id)); } });
    }, []);

    async function loadChatrooms(userId) {
        try {
            const response = await fetch("http://localhost:5001/api/getMatches", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId })
            });

            if (!response.ok) {
                throw new Error("Error getting matches");
            }

            const data = (await response.json()).rows;
            data.sort((a, b) => a.id - b.id);
            console.log("Matches obtained: ", data);
            return data;
        } catch (error) {
            console.error("Error getting matches:", error);
            return null;
        }
    }

    return (
        <div className="App">
            <a href='/' className="app-title">Cavemanomics</a>
            <header className="header">
                <h1>Chats</h1>
                {chatroomObjects.length == 0 ? <p>You are not in any chats</p> : chatroomObjects}
            </header>
        </div>
    );
}

export default ChatSelection;
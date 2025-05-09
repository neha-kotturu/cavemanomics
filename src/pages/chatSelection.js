import React, { useEffect, useState } from "react";
import '../css/chat.css'
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

async function confirmTrade(matchId) {
    const user = pullData(localStorage.getItem("token"));
    if (!user) return alert("You must be logged in.");

    try {
        const response = await fetch("http://localhost:5001/api/confirmTrade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matchId, userId: user })
        });

        const result = await response.json();
        if (result.completed) {
            alert("Trade confirmed by both users. Items removed.");
            setChatrooms(chatrooms.filter(room => room.id !== matchId));
        } else {
            alert("Your confirmation has been recorded. Waiting for the other user.");
        }
    } catch (error) {
        console.error("Error confirming trade:", error);
    }
}


function ChatSelection() {
    const [chatrooms, setChatrooms] = useState([]);

    var i = 0;
    var chatroomObjects = chatrooms.map(room => {
        return (
            <div key={room.id} className="chatroom-block">
                <div className="chatroom-flex">
                    <Link to="/chat" className="chat-link">
                        <div onClick={() => localStorage.setItem("chatroom", room.id)} className="chat-id-box">
                            {room.item}
                        </div>
                    </Link>
                    <div
                        className="confirm-div"
                        onClick={() => confirmTrade(room.id)}
                    >
                        Confirm Trade
                    </div>
                </div>
            </div>




        );
    });
    

    useEffect(() => {
        const ID = pullData(localStorage.getItem('token'));
        var rooms = loadChatrooms(ID);
        rooms.then(rooms => { if (rooms != null) { setChatrooms(rooms); } });
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

            const data = await response.json();
            console.log("Matches obtained: ", data);
            return data;
        } catch (error) {
            console.error("Error getting matches:", error);
            return null;
        }
    }

    return (
        <div className="App">
            <a href='/main' className="app-title">Cavemanomics</a>
            <header className="header">
                <h1>Chats</h1>
                {chatroomObjects.length == 0 ? <p>You are not in any chats</p> : chatroomObjects}
            </header>
        </div>
    );
}

export default ChatSelection;
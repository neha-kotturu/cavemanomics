import React, { useEffect, useState } from "react";
import '../css/login.css'
import { useNavigate } from "react-router-dom";

function Chat() {
    const [texts, setTexts] = useState([]);
    var i = 0;
    var roomId = localStorage.getItem("chatroom");
    var textObjects = texts.map(s => { i++; return <p key={i}>{s}</p>; });

    useEffect(() => { loadTexts() }, []);

    async function loadTexts() {
        const jsonTexts = await getTexts(roomId);
        const newTexts = [];
        if (jsonTexts != null) {
            jsonTexts.forEach((text) => {
                newTexts.push(text.text);
            });
            setTexts(newTexts);
        }
    }

    async function submitText() {
        const newTexts = texts.slice();
        const text = document.getElementById("textInput");
        const index = await getIndex(roomId);
        if (index != null && await uploadText(roomId, text.value, index)) {
            newTexts.push(text.value);
            setTexts(newTexts);
        }
    }

    async function getTexts(matchedId) {
        try {
            const response = await fetch("http://localhost:5001/api/getTexts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchedId })
            });

            if (!response.ok) {
                throw new Error("Error getting texts");
            }

            const data = await response.json();
            data.sort((a, b) => a.index - b.index);
            console.log("Texts obtained: ", data);
            return data;
        } catch (error) {
            console.error("Error getting texts:", error);
            return null;
        }
    }

    async function getIndex(matchedId) {
        try {
            const response = await fetch("http://localhost:5001/api/getIndices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ matchedId })
            });

            if (!response.ok) {
                throw new Error("Error querying indices");
            }

            const data = await response.json();
            console.log("Indices obtained: ", data);
            let max = 0;
            for (let i = 0; i < data.length; i++) {
                if (parseInt(data[i].index) > max) max = parseInt(data[i].index);
            }
            return max + 1;
        } catch (error) {
            console.error("Error querying indices:", error);
            return null;
        }
    }

    async function uploadText(matchedId, text, index) {
        try {
            const response = await fetch("http://localhost:5001/api/postText", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( {matchedId, text, index, "username":""} )
            });
            if (!response.ok) {
                throw new Error("Error submitting text");
            }

            const data = await response.json();
            console.log("Text submitted successfully:", data);
            return true;
        } catch (error) {
            console.error("Error submitting:", error);
            return false;
        }
    }

    return (
        <div className="App">
            <a href='/' className="app-title">Cavemanomics</a>
            <header className="header">
                <h1>Chat</h1>
                <div className="chatbox">
                    {textObjects}
                </div>
                <input id="textInput" type="text" placeholder="Message" className="input-field" />
                <button className="bttn" onClick={submitText}>Send</button>
            </header>
        </div>
    );
}

export default Chat;
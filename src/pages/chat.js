import React, { useState } from "react";
import '../css/login.css'
import { useNavigate } from "react-router-dom";

function Chat() {
    const [texts, setTexts] = useState([]);
    var i = 0;
    var textObjects = texts.map(s => { i++; return <p key={i}>{s}</p>; });

    async function submitText() {
        const newTexts = texts.slice();
        const text = document.getElementById("textInput");
        const index = await getIndex(1);
        if (index != null && await uploadText(1, text.value, index)) {
            newTexts.push(text.value);
            setTexts(newTexts);
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
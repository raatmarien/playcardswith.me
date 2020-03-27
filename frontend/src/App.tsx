import React from 'react';
import './App.css';
import * as Colyseus from "colyseus.js";

function App() {
    let client = new Colyseus.Client("ws://localhost:3000");
    client.joinOrCreate("room").then(room => {
        console.log("joined");
        room.onStateChange.once(function(state) {
            console.log("initial room state:", state);
        });

        // new room state
        room.onStateChange(function(state) {
            // this signal is triggered on each patch
            console.log("New state:", state);
        });

        // listen to patches coming from the server
        room.onMessage(function(message) {
            console.log("New message", message);
        });
    });


    return (
        <div className="App">
            Hoi!
        </div>
    );
}

export default App;

import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import SingleChat from './component/SingleChat';

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMsg, setReceivedMsg] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [toggle,setToggle] = useState(false)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3010", {
      reconnectionDelayMax: 10000,
      reconnection: true,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('error');
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array as we only want to initialize once

  // Message event handler
  useEffect(() => {
    if (!socket) return; // Guard clause

    const handleBroadcastMsg = (data) => {
      console.log('Received:', data);
      setReceivedMsg(data);
    };

    socket.on('Broadcast_msg', handleBroadcastMsg);

    // Cleanup listener when component unmounts or socket changes
    return () => {
      socket.off('Broadcast_msg', handleBroadcastMsg);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket) {
      console.error('Socket not initialized');
      return;
    }

    if (message.trim() !== "") {
      socket.emit('Client_send_msg', { message });
      setMessage('');
    }
  };

  return (
  <>
  <h3>want to join single chat  </h3> 
  <button onClick={()=>setToggle(!toggle)}>singleChat</button>
  {toggle == true ? <> <SingleChat socket={socket} /></> : 

    <div className="p-4">
      <div className="mb-4">
        Connection Status: <span className="font-bold">{connectionStatus}</span>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          className="border p-2 rounded"
          placeholder="Type your message..."
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!socket || connectionStatus !== 'connected'}
        >
          Send Message
        </button>
      </div>

      <div className="mt-4">
        <h2 className="font-bold mb-2">Received Messages:</h2>
        <div className="border p-4 rounded">
          {receivedMsg || 'No messages yet'}
        </div>
      </div>
     

    </div>
  }
  </>
  );
}

export default App;
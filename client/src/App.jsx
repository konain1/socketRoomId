  import React, { useState,useEffect } from 'react'
  import { io } from "socket.io-client";


  const socket = io("http://localhost:3010");
  function App() {

    const [message,setMessage]=useState('')
    const [recieved_msg,setRecievedMsg]=useState('')

    useEffect(()=>{
      
      socket.on('Server_msg',(data)=>{
        console.log(data)
        setRecievedMsg(data)
      })
     
    },[socket])

    const sendMessage= ()=>{

      socket.emit('Client_send_msg',{message})
      setMessage('')
    }
    return (
      <div>
        <input type='text' onChange={(event)=>{setMessage(event.target.value)}} value={message} />
        <button onClick={sendMessage}>sendMessage</button>
        <h1>broadcast : 
        {recieved_msg}</h1>
      </div>
    )
  }

  export default App
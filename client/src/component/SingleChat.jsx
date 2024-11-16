import React, { useEffect, useState } from 'react'

function SingleChat({socket}) {

    const [room,setRoom]=useState('')
    const [message,setMessage]=useState('')
    const [recieve,setRecieve]=useState('')
    const [IsInRoom,setIsInRoom]=useState(false)

    const handleJoinRoom = ()=>{
        if(!socket)return

    if(room != ""){
        socket.emit('join_room',room)
        setIsInRoom(true)
    }
    }

    const handleMessagesRoom=()=>{
        if(!socket || !room) return
        if(message == ""){
            alert('please type message')
        }

        socket.emit('send_message',{message:message,
            room:room
        })
    }

    useEffect(()=>{
        if(!socket) return
        
        socket.on('receive_message',(data)=>{
            console.log(data)
            setRecieve(data)
        })


        return () => {
            socket.off('receive_message');
          };
    },[socket])

  return (
   <>   
   <label>Room number</label>
   <input type='number' onChange={(e)=>setRoom(e.target.value)} /> 

   <button onClick={handleJoinRoom}>join room</button>
   <label>message </label>
   <input type='text' onChange={(e)=>setMessage(e.target.value)} value={message} /> 

   <button onClick={handleMessagesRoom}>send Message in the room</button>
   <h3>recieved message : {recieve || 'No messages yet'}</h3>
  
   </>
  )
}

export default SingleChat
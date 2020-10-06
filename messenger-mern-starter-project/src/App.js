import React, { useEffect, useState } from 'react';
import './App.css';
import { FormControl,Input } from '@material-ui/core'
import Message from './Message';
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import Axios from './axios';
import Pusher from 'pusher-js'

var pusher = new Pusher('9821e4c17f110498f1db', {
  cluster: 'ap1'
});

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')

  const sync = async () =>{
    await Axios.get('/retreieve/conversation').then((res)=>{
      console.log(res.data)
      setMessages(res.data)
    })
  }

  

  useEffect(() => {
    sync()
  }, [])

  useEffect(() => {
    const channel = pusher.subscribe('messages')
    channel.bind('newMessage', (data) => {
      sync()
    })
  }, [username])

  useEffect(() => {
    setUsername(prompt('Please enter your name'))
  }, [])

  const sendMessage = (e) => {
    e.preventDefault() 

    Axios.post('/save/messages',{
      username : username,
      message: input,
      timestamp: Date.now()
    })

    setInput('')
  }

  return (
    <div className="App">
      <img src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=100&h=100" alt="messenger logo" />
      <h2>Welcome {username}</h2>

      <form className='app__form' >
        <FormControl className='app__formControl' >
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} onClick={sendMessage} type="submit" >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {
          messages.map(message => (
            <Message key={message._id} message={message} username={username} />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;

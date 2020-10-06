// import the dependenies
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'Pusher'
import cors from 'cors'

import mongoMessages from './messageModel.js'

//app config 
const app = express()
const port = process.env.PORT || 9000

var pusher = new Pusher({
    appId: '1085836',
    key: '9821e4c17f110498f1db',
    secret: '023a4bdbaa9288972400',
    cluster: 'ap1',
    useTLS: true
});

// middlewares
app.use(express.json())
app.use(cors())

//db config 
const mongoURI ='mongodb+srv://admin:qwertyuiop@cluster0.968ak.mongodb.net/messengerDB?retryWrites=true&w=majority'
mongoose.connect(mongoURI,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', ()=>{
    console.log('DB CONNECTED')

    const changeStream = mongoose.connection.collection('messages').watch()
    changeStream.on('change', (change) =>{
        pusher.trigger('messages', 'newMessage', {
            'change' : change
        });
    })
})

// api routes
app.get('/',(req,res) => res.status(200).send('hello world '))

app.post('/save/messages',(req,res)=> {
    const dbMessage = req.body

    mongoMessages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        } else{
            res.status(201).send(data)
        }
    })
} )

app.get('/retreieve/conversation',(req,res)=>{
    mongoMessages.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        } else{
            data.sort((b,a) => {
                return a.timestamp - b.timestamp;
            })
            res.status(200).send(data)
        }
    })
})
    

//listen 
app.listen(port ,() =>console.log(`listening on localhost: ${port}`))
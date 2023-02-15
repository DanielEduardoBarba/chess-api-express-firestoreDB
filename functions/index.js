import express from "express"
import {getBoard, getLobby, resetBoard, updateActivity, updateBoard} from "./chess.js"
import cors from "cors"
import functions from "firebase-functions"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/getlobby", async (req,res)=>{
    getLobby()
    .then((lobbies)=>{
       console.log({lobbies})
        res.status(201).send({lobbies})
    })
    .catch(console.error)

})
app.get("/getboard/:gameID", async (req,res)=>{
    getBoard(req.params.gameID)
    .then((g)=>{
       // console.log(g)
        res.status(201).send(g)
    })
    .catch(console.error)

})
app.get("/resetboard/:gameID", (req,res)=>{
   resetBoard(req.params.gameID)
   .then(res.status(201).send({message:"Board Reset!"}))
   .catch(console.error) 
   })

app.post("/move/:gameID", (req, res)=>{
    //console.log('-------------- POST MADE ---------------')
    if(req.params.gameID!=0){

        const {from,to} = req.body
        //console.log(from ,"---RECIEVED---", to,"GAME---",req.params.gameID)
        updateBoard(req.params.gameID,from, to)
        .then((g)=>{
            // console.log(g)
            //g body is deconstructed during back end functions, this returns an obj
             res.status(201).send({g})
         })
         .catch(console.error)
    }
})
app.post("/activity/:gameID", (req, res)=>{
   // console.log('-------------- POST MADE ---------------')
    if(req.params.gameID!=0){

        const {messages} = req.body
       // console.log("---RECIEVED---",messages,"GAME---",req.params.gameID)
        updateActivity(req.params.gameID, messages)
        res.status(201).send({message:"Chat Sent!"})
    }
})


export const api = functions.https.onRequest(app)


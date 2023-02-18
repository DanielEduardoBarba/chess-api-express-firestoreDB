import functions from "firebase-functions"
import express from "express"
import cors from "cors"
import {exitPlayer, getBoard, getLobby} from "./chess.js"
import {resetBoard, updateActivity, updateBoard} from "./chess.js"

const app = express()
app.use(cors())
app.use(express.json())


app.get("/getlobby", async (req,res)=>{

    getLobby()
    .then((lobbies)=>{
        res.status(201).send({lobbies})
    })
    .catch(console.error)
})
app.get("/getboard/:gameID", async (req,res)=>{

    getBoard(req.params.gameID)
    .then((g)=>{
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

    if(req.params.gameID!=0){

        const {from,to} = req.body
        updateBoard(req.params.gameID,from, to, req, res)
    }
})

app.post("/activity/:gameID", (req, res)=>{
   
    if(req.params.gameID!=0){
        
     updateActivity(req.params.gameID, req.body, req, res)
    }
})

app.patch("/exit/:gameID", (req, res)=>{
 
    if(req.params.gameID!=0){

        exitPlayer(req.params.gameID, req.body.exit, req, res)
    }
})


export const api = functions.https.onRequest(app)


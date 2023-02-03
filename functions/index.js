import express from "express"
import {getBoard, resetBoard, updateBoard} from "./chess.js"
import cors from "cors"
import functions from "firebase-functions"

const app = express()
app.use(cors())
app.use(express.json())

app.get("/getboard", async (req,res)=>{
    getBoard()
    .then((currentBoard)=>{
        res.send(currentBoard)
    })
    .catch(console.error)

})
app.get("/resetboard", (req,res)=>{
   resetBoard()
   res.send("Board Reset")
    })

app.post("/move/:from/:to", (req, res)=>{
    updateBoard(req.params.from, req.params.to)
    res.send("Move Made!")
})


export const api = functions.https.onRequest(app)


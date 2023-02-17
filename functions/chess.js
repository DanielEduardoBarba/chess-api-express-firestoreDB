// import PromptSync from "prompt-sync"
// const prompt=PromptSync({sigint:true})

import { initializeApp, cert } from "firebase-admin/app"
import {getFirestore} from "firebase-admin/firestore"
import {service_account} from "./secrets.js"
import { Timestamp } from "firebase-admin/firestore"

initializeApp({
    credential:cert(service_account)
})

const db=getFirestore()

const gameType=db.collection("chess")
//const session="game10"

//should come from http request param
//add hidden react security key later
//const gameBoardID = 10

 let RESET={
    //only game board ID is needed when resetting
    whitePos: ["01","11","21","31","41","51","61","71","00","10","20","30","40","50","60","70"],
    blackPos: ["06","16","26","36","46","56","66","76","07","17","27","37","47","57","67","77"],
    messages: [],
    players:["","",""],
    mutualCmds:[],
    _lastMove: 0,
    turn: 1
 }



//from database
const wPieces ="♟♟♟♟♟♟♟♟♜♞♝♛♚♝♞♜"
const bPieces ="♙♙♙♙♙♙♙♙♖♘♗♕♔♗♘♖"



let currentState={
    gameBoardID: 0,
    whitePos:[],
    blackPos: []
 }


 const lobbySize = 5
 
 
 
 export const gameWarden = async (gameBoardID, gameTimeout) =>{
    //  resetBoard(gameBoardID)
    //  return
     const board = await getBoard(gameBoardID)
     let toRESET = {...RESET}
     toRESET.players=board.players
     toRESET._lastMove=board._lastMove
     if((Timestamp.now().seconds - board._lastMove)>gameTimeout && board._lastMove>0){

         if(board.players[1]!="" || board.players[1].includes("*")){
            console.log('p1 out')
            if(board.players[1].includes("***"))toRESET.players[1]=""
            else toRESET.players[1]+="*"
         }
         if(board.players[2]!="" || board.players[2].includes("*")){
            console.log('p2 out')
            if(board.players[2].includes("***"))toRESET.players[2]=""
            else toRESET.players[2]+="*"
         }
         
         toRESET.boardID=gameBoardID
        gameType.doc(String(gameBoardID)).set(toRESET)
        .then((doc)=>{
            console.log(`Session ${gameBoardID} reset/created`)
           }).catch(console.error)
        }
        // .then(g=>{
            
            //     g.players[playerNum]=""
            //     console.log(g.players)
            //     gameType.doc(String(gameBoardID)).update(g)
            //     .then(doc=>{
                //        console.log( doc)
                //        res.send({isSuccess: true})
                //     }).catch(console.error)
                // })
            }
            
            
 export const resetBoard = (gameBoardID)=>{
     RESET.boardID=gameBoardID
     gameType.doc(String(gameBoardID)).set(RESET)
     .then((doc)=>{
         console.log(`Session ${gameBoardID} reset/created`)
        }).catch(console.error)
    }
    
    export const createBoard = async (gameBoardID)=>{
        RESET.boardID=gameBoardID
        try{
            await gameType.doc(String(gameBoardID)).set(RESET)
            return `Session ${gameBoardID} created`
        }
        catch{
        }
    }
    
    export const setBoard = async (gameBoardID,g)=>{
        //    console.log("-----------------IM HERE!!!!! SETBOARD-------------------------") 
        //    console.log(typeof gameBoardID)
        //    console.log(String(gameBoardID))
        //    console.log(g)
            try{
                await gameType.doc(String(gameBoardID)).update(g)
                //console.log("Setting Board SUCCESS!") 
                return g
            }catch{
                //console.log("Setting Board FAILED!") 
            }
        // console.log("Move made")
    }
    export const updateActivity = (gameBoardID,activity)=>{
        //    console.log("-----------------IM HERE!!!!! SETBOARD-------------------------") 
        //    console.log(typeof gameBoardID)
        //    console.log(String(gameBoardID))
        activity._lastMove=Timestamp.now().seconds
        gameType.doc(String(gameBoardID)).update(activity)
        .then((doc)=>{
            // console.log("Move made")
            return "Activity updated!"
        }).catch(console.error)
    }
    export const exitPlayer = (gameBoardID, playerNum, req, res)=>{
        //    console.log("-----------------IM HERE!!!!! SETBOARD-------------------------") 
        //    console.log(typeof gameBoardID)
        //    console.log(String(gameBoardID))
        getBoard(gameBoardID)
        .then(g=>{
            
            g.players[playerNum]=""

            //console.log(g.players)

            gameType.doc(String(gameBoardID)).update(g)
            .then(doc=>{
                console.log( doc)
           res.send({isSuccess: true})
        }).catch(console.error)
    })
}

export const getLobby = async ()=>{
    
    //console.log("HERE")
    let incoming = []
    const raw = await gameType.get()
    raw.docs.map(doc=> {
        incoming.push(doc.data())
    })
    
    
    //console.log(incoming)
    return [...incoming]
}
export const getBoard = async (gameBoardID)=>{
    
    //console.log("HERE")
    let recieved = {}
    const raw = await gameType.get()
    const  incoming= raw.docs.map(doc=>{
        const {boardID}=doc.data()
        
        if(boardID==gameBoardID) recieved = doc.data()      
    })
    
    
    // console.log(recieved)
    // console.log(typeof recieved)
    return {...recieved}
    
    
    
}


export const layoutBoard = () => {
    //console.log("IM OKAAAA")
    let render=""
    
    let black=`<button  style= "color: white"class="black"/> hey`
    let white=`<button  class="white"/>hey`
    
    for(let i=0; i<8;i++){
        for(let j=0; j<8;j++){
            if(i%2){
                if(j%2)render+= white
                else render+= black
            }
            else{
                if(j%2)render+= black
                else render+= white
            }
        }
        
    }
    
    // const currentPiece = (i,j,)
    //console.log(render)
    
    // document.getElementById("board").innerHTML = render
}

export const displayBoard = () =>{
    let boardXY=[]
    let boardX=[]
    for(let j=0; j<8;j++){
        for(let i=0; i<8;i++){
            
            const check =`${i}${j}`
            
            if(currentState.whitePos.includes(check) || currentState.blackPos.includes(check)){
                if(currentState.whitePos.includes(check) ) boardX[i] = wPieces[currentState.whitePos.indexOf(check)]
                if(currentState.blackPos.includes(check) ) boardX[i] = bPieces[currentState.blackPos.indexOf(check)]
            }
            else{
                boardX[i]=" "
            }
            
        }
        boardXY[j]=[...boardX]
    }
    const grid=[...boardXY]
    
    console.table(grid)
}


export const updateBoard = async (gameBoardID,posA, posB, req, res) => {
    
    //console.log("INSIDE UPDATE BOARD: ", gameBoardID)
    getBoard(gameBoardID)
    .then((g)=>{
        //console.log("GOT THIS BOARD: ", g)
        if(g.whitePos.includes(posA) || g.blackPos.includes(posA)){
            
            if(g.whitePos.includes(posA) ){
                g.whitePos[g.whitePos.indexOf(posA)]=posB
                if(g.blackPos.includes(posB) ) g.blackPos[g.blackPos.indexOf(posB)]=" "
            }
            if(g.blackPos.includes(posA) ){
                g.blackPos[g.blackPos.indexOf(posA)]=posB
                if(g.whitePos.includes(posB) ) g.whitePos[g.whitePos.indexOf(posB)]=" "
            }
        }
        g._lastMove= Timestamp.now().seconds
        
        //console.log("Board AFTER mod: ", g)
        setBoard(gameBoardID,g)
        .then(g=>{ 
            //console.log("__________________OUTBOUND TO REACT: ", g)
            //g body is deconstructed during back end functions, this returns an obj
             res.status(201).send(g)
        })
        
        
    })
    .catch(console.error)
    
    }
    
    
    const scriptMakeBoards = async () =>{
        //set game boards
        for(let i =1 ;i<=lobbySize;i++){
            const res= await createBoard(i)
            console.log(res)
        }
        
        //specific board
        //createBoard(2);
        
    }
    
    //scriptMakeBoards()
    
    
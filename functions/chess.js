// import PromptSync from "prompt-sync"
// const prompt=PromptSync({sigint:true})

import { initializeApp, cert } from "firebase-admin/app"
import {getFirestore} from "firebase-admin/firestore"
import {service_account} from "./secrets.js"

initializeApp({
    credential:cert(service_account)
})

const db=getFirestore()

const gameType=db.collection("chess")
const session="game2"

const gameBoardID = 2


const RESETold={
    boardID: 2,
    whitePos: ["01","11","21","31","41","51","61","71","00","10","20","30","40","50","60","70"],
    blackPos: ["06","16","26","36","46","56","66","76","07","17","27","37","47","57","67","77"]
 }
 const RESET={
    boardID: 3,
    whitePos: ["01","11","21","31","41","51","61","71","00","10","20","30","40","50","60","70"],
    blackPos: ["06","16","26","36","46","56","66","76","07","17","27","37","47","57","67","77"]
 }

let boardY=[]
let boardX=[]

//from database
const wPieces ="♟♟♟♟♟♟♟♟♜♞♝♛♚♝♞♜"
const bPieces ="♙♙♙♙♙♙♙♙♖♘♗♕♔♗♘♖"



let currentState={
    gameBoardID: 0,
    whitePos:[],
    blackPos: []
 }



 export const resetBoard = ()=>{
  
    gameType.doc(session).set(RESET)
    .then((doc)=>{
        console.log("Board Set")
    }).catch(console.error)
}

export const setBoard = (g)=>{
    gameType.doc(session).set(g)
    .then((doc)=>{
        console.log("Move made")
    }).catch(console.error)
}

export const getBoard = async ()=>{

        //console.log("HERE")
        let recieved={}
        const raw = await gameType.get()
        const incoming = raw.docs.map(doc=>{
           const {boardID}=doc.data()
          
           if(boardID===gameBoardID) {
                console.log("BID: ", boardID," GBID: ", gameBoardID)
                recieved = doc.data()
                //return doc.data() //returns everything as it maps that matched
           }
        })
        
        
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
        boardY[j]=[...boardX]
    }
    const grid=[...boardY]
    
    console.table(grid)
}


export const  updateBoard = (posA, posB) => {

    let g = getBoard()
    .then(()=>{
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
    
        setBoard(g)
        //console.log(g)
        //return

    })
    .catch(console.error)

    }

    
  
//getBoard()
export const askUser = ()=>{

    displayBoard()
    //  let from = prompt("Select piece:")
    //  let to = prompt("Select destination:")
     //console.log(currentState)
    updateBoard(from, to)
    setBoard()
    displayBoard()
}




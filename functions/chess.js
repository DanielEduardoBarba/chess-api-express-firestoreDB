// import PromptSync from "prompt-sync"
// const prompt=PromptSync({sigint:true})

import { initializeApp, cert } from "firebase-admin/app"
import {getFirestore} from "firebase-admin/firestore"
import {service_account} from "./secrets.js"

initializeApp({
    credential:cert(service_account)
})

const db=getFirestore()

const gameBoard=db.collection("chess")




let boardY=[]
let boardX=[]

//from database
const wPieces ="♟♟♟♟♟♟♟♟♜♞♝♛♚♝♞♜"
const bPieces ="♙♙♙♙♙♙♙♙♖♘♗♕♔♗♘♖"



const currentState={
    whitePos:[],
    blackPos: []
 }



 export const resetBoard = ()=>{
    const RESET={
        whitePos: ["01","11","21","31","41","51","61","71","00","10","20","30","40","50","60","70"],
        blackPos: ["06","16","26","36","46","56","66","76","07","17","27","37","47","57","67","77"]
     }
    gameBoard.doc("game").set(RESET)
    .then((doc)=>{
        console.log("Board Set")
    }).catch(console.error)
}

export const setBoard = ()=>{
    gameBoard.doc("game").set(currentState)
    .then((doc)=>{
        console.log("Move made")
    }).catch(console.error)
}

export const getBoard = async ()=>{

        let recieved={}
        const raw = await gameBoard.get()
        const incoming = raw.docs.map(doc=>doc.data())

        recieved=incoming[0]

        currentState.whitePos=[...recieved.whitePos]
        currentState.blackPos=[...recieved.blackPos]

        
        return currentState
    
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

    console.log("HEY")
    getBoard()
    .then(()=>{
        if(currentState.whitePos.includes(posA) || currentState.blackPos.includes(posA)){
            
            if(currentState.whitePos.includes(posA) ){
                currentState.whitePos[currentState.whitePos.indexOf(posA)]=posB
                if(currentState.blackPos.includes(posB) ) currentState.blackPos[currentState.blackPos.indexOf(posB)]=" "
            }
            if(currentState.blackPos.includes(posA) ){
                    currentState.blackPos[currentState.blackPos.indexOf(posA)]=posB
                    if(currentState.whitePos.includes(posB) ) currentState.whitePos[currentState.whitePos.indexOf(posB)]=" "
                }
         }
    
        setBoard()
        //console.log(currentState)
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












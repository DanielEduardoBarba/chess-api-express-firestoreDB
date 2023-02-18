import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { service_account } from "./secrets.js"
import { Timestamp } from "firebase-admin/firestore"
// import PromptSync from "prompt-sync"
// const prompt=PromptSync({sigint:true})


initializeApp({
    credential: cert(service_account)
})

const db = getFirestore()

const gameType = db.collection("chess")

let RESET = {
    //only game board ID is needed when resetting
    whitePos: ["01", "11", "21", "31", "41", "51", "61", "71", "00", "10", "20", "30", "40", "50", "60", "70"],
    blackPos: ["06", "16", "26", "36", "46", "56", "66", "76", "07", "17", "27", "37", "47", "57", "67", "77"],
    messages: [],
    players: ["", "", ""],
    mutualCmds: [],
    _lastMove: 0,
    turn: 1
}



const wPieces = "♟♟♟♟♟♟♟♟♜♞♝♛♚♝♞♜"
const bPieces = "♙♙♙♙♙♙♙♙♖♘♗♕♔♗♘♖"



let currentState = {
    gameBoardID: 0,
    whitePos: [],
    blackPos: []
}

export const gameWarden = async (gameBoardID, gameTimeout) => {

    //  resetBoard(gameBoardID)
    //  return
    const board = await getBoard(gameBoardID)
    let toRESET = { ...RESET }

    toRESET.players = board.players
    
    if ((Timestamp.now().seconds - board._lastMove) > gameTimeout && board._lastMove > 0) {
        
        if (board.players[1] != "" || board.players[1].includes("*")) {
            
            toRESET._lastMove = board._lastMove
            console.log('Player1 called out')
            
            if (board.players[1].includes("***")) toRESET.players[1] = ""
            else toRESET.players[1] += "*"
        }
        if (board.players[2] != "" || board.players[2].includes("*")) {
            
            toRESET._lastMove = board._lastMove
            console.log('Player2 called out')

            if (board.players[2].includes("***")) toRESET.players[2] = ""
            else toRESET.players[2] += "*"
        }

        toRESET.boardID = gameBoardID

        gameType.doc(String(gameBoardID)).set(toRESET)
            .then((doc) => {
                console.log(`Session ${gameBoardID} reset/created`)
            }).catch(console.error)

    }

}


export const resetBoard = (gameBoardID) => {

    RESET.boardID = gameBoardID

    gameType.doc(String(gameBoardID)).set(RESET)
        .then((doc) => {
            console.log(`Session ${gameBoardID} reset/created`)
        }).catch(console.error)
}

export const createBoard = async (gameBoardID) => {

    RESET.boardID = gameBoardID
    
    try {
        await gameType.doc(String(gameBoardID)).set(RESET)
        return `Session ${gameBoardID} created`
    }
    catch {
        console.log("Create Board FAILED!")
    }
}

export const setBoard = async (gameBoardID, g) => {

    try {
        await gameType.doc(String(gameBoardID)).update(g)
        return g
    } catch {
        console.log("Setting Board FAILED!")
    }
}
export const updateActivity = (gameBoardID, activity) => {

    activity._lastMove = Timestamp.now().seconds

    gameType.doc(String(gameBoardID)).update(activity)
        .then((doc) => {
            res.status(201).send({ message: "Chat Sent!" })
        }).catch(console.error)
}
export const exitPlayer = (gameBoardID, playerNum, req, res) => {

    getBoard(gameBoardID)
        .then(g => {

            g.players[playerNum] = ""

            gameType.doc(String(gameBoardID)).update(g)
                .then(doc => {
                    console.log(doc)
                    res.send({ isSuccess: true })
                }).catch(console.error)
        })
}

export const getLobby = async () => {

    const raw = await gameType.get()
    const incoming = raw.docs.map(doc => doc.data())

    return [...incoming]
}
export const getBoard = async (gameBoardID) => {

    let recieved = {}

    const raw = await gameType.get()
    const incoming = raw.docs.map(doc => {
                        const { boardID } = doc.data()
                        if (boardID == gameBoardID) recieved = doc.data()
                    })

    return { ...recieved }
}

export const updateBoard = async (gameBoardID, posA, posB, req, res) => {

    getBoard(gameBoardID)
        .then((g) => {

            if (g.whitePos.includes(posA) || g.blackPos.includes(posA)) {

                if (g.whitePos.includes(posA)) {
                    g.whitePos[g.whitePos.indexOf(posA)] = posB
                    if (g.blackPos.includes(posB)) g.blackPos[g.blackPos.indexOf(posB)] = " "
                }
                if (g.blackPos.includes(posA)) {
                    g.blackPos[g.blackPos.indexOf(posA)] = posB
                    if (g.whitePos.includes(posB)) g.whitePos[g.whitePos.indexOf(posB)] = " "
                }
            }

            g._lastMove = Timestamp.now().seconds

            setBoard(gameBoardID, g)
                .then(g => {
                    res.status(201).send(g)
                })
                .catch(console.error)

        })
        .catch(console.error)

}


const scriptMakeBoards = async (lobbySize) => {

    //set game boards
    for (let i = 1; i <= lobbySize; i++) {

        const res = await createBoard(i)
        console.log(res)
    }

    //specific board
    //createBoard(2);
}

//scriptMakeBoards(5)


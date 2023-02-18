import cron from "node-cron"
import { gameWarden } from "./chess.js"

const gameTimeout = 60
const interval = "* * * * *"
const lobbySize = 5

const runOnce = 0

//checks every set of time (every 10 sec */10 * * * * *)(1 minute at * * * * * ) 
//and removes players from dead games
//cleans up when players exit poorly ie exiting
//without logging out

if(runOnce){

    for(let i = 1 ; i<=lobbySize;i++){
            
        await  gameWarden(i, gameTimeout) 
     }
    console.log("The warden had to make 40 hrs this week.....")
}

cron.schedule(interval, async() => {

    console.log("Cleaning up server from dormant games.....")

    for(let i = 1 ; i<=lobbySize;i++){
        
       await  gameWarden(i, gameTimeout) 
    }
    console.log("The warden did his rounds.....")
});
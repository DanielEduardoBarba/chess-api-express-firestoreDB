import cron from "node-cron"
import { gameWarden } from "./chess.js"

const gameTimeout = 60
const interval = "* * * * *"
const lobbySize = 5
//checks every set of time (every 10 sec */10 * * * * *)(1 minute at * * * * * ) and removes players from dead games
cron.schedule(interval, async() => {
    console.log("Cleaning up server from dormant games....")
    for(let i = 1 ; i<=lobbySize;i++){
        // console.log("Finished")
       await  gameWarden(i, gameTimeout)
        
    }
    console.log("All clean :) !..........")
});
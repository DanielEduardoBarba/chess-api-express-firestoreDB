import cron from "node-cron"
import { gameWarden } from "./chess"


//checks every set of time(1 minute at * * * * * ) and removes players from dead games
cron.schedule('* * * * *', () => {
  for(let i = 1 ; i<5;i++){
    //gameWarden(i)
  }
});
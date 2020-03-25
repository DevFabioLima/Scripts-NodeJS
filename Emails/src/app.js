import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import './database';

import Plan from './app/controllers/Plan';

class App {
    constructor(){
        this.server = express();
        this.plan();
       
    }
    
    plan(){
        cron.schedule("13 8 * * *", Plan);
    }
    
}
export default new App().server;
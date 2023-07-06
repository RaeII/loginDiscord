import express from 'express'
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';
import cookieParser from "cookie-parser";
import session from "express-session";
import path from 'path'
import {fileURLToPath} from 'url';
import http from 'http'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
import apiRouter from "../api/routes/index.js";
import viewRouter from "../api/routes/view.js";
let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
}
 app.use(allowCrossDomain);

 app.use(cookieParser())

 app.use(session({
    secret:'615243_MOnkey',
    resave: false,
    saveUninitialized:true,
    cookie:{
            maxAge:1000 * 60 * 60 * 24,
            sameSite: "strict"
    }
 }))

 app.use(serveStatic(path.join(__dirname,'../../public')))

 app.use("/api/", apiRouter);
 app.use("/", viewRouter);

  app.use((req, res) => {

    if(req.url == '/favicon.ico') return

    console.log('NOT FOUND =>',req.url)

    return res.status(404).json({
      status:'fail',
      message:'Not Found'
    });
    
  });
  
  const serverHttp = http.createServer(app)

  export {serverHttp} 
  
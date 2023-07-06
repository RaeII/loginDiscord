import discordService from "../2.services/discord.service.js";
import {errorApi} from "../../helpers/error.js";
import path from 'path'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const pathPublic = '../../../public'


class DiscordController {

  auth = async (req , res) => {
    try { 
        
      const response = await discordService.auth(req.body)

      return res.status(200).json({
        status:'success',
        data:response
      });
          
    } catch (e) {              
      errorApi(res,e)
    }
  }

  authLoginTokenAccess = async (req , res) => {
    try { 
        
      const response = await discordService.authLoginTokenAccess(req.body)
      
      return res.status(200).json({
        status:'success',
        data:response
      });
          
    } catch (e) {              
      errorApi(res,e)
    }
  }


  addBotServer = async (req , res) => {

    try { 
     
      const response = await discordService.addBotServer(req.body)
      return res.status(200).json({
        status:'success',
        data:response
      });
      
    } catch (e) {
          errorApi(res,e)
    }
  }

  getBotServers = async (req , res) => {

    try { 
     
      const response = await discordService.getBotServers()
      return res.status(200).json({
        status:'success',
        data:response
      });
      
    } catch (e) {
          errorApi(res,e)
    }
  }

  authRedirect = async (req , res) => {
    return res.status(202).json()
  };

  home = async (req , res) => {
    console.log('PATH',path.join(__filename,pathPublic,index.html))
    return res.sendFile('view.html', { root: '../../../public' });
  };


  eventTest = async (req , res) => {

    try { 
    
      const response = await discordService.eventTest()

      return res.status(200).json({
        status:'success',
        data:response
      });
      
    } catch (e) {
          
      errorApi(res,e)
     }
  }


};
  
export default new DiscordController();
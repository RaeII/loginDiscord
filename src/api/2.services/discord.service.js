import colors from 'colors/safe.js';
import axios from 'axios'
import env from '../../config/index.js';
import jwt from "jsonwebtoken";

class DiscordService {

  auth = async (data,sql) => {

    if(!data?.code || false) throw {type:1,msg:'Código Discord de autorização não encontrado'}

    console.log('CODE ==>', data.code)

    const dataRequest = {    
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code:data.code,
      redirect_uri: env.REDIRECT_URI
    }

    const auth = await axios.post(`${env.API_ENDPOINT}/oauth2/token`, dataRequest, {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/x-www-form-urlencoded'
      }
    });

    const authRefresh = await this.refreshToken(auth.data.refresh_token)

    const [user,serves,servesBot,dateBr] = await Promise.all([
      this.getApi('/users/@me',authRefresh.access_token),
      this.getApi('/users/@me/guilds',authRefresh.access_token),
      this.getApi('/users/@me/guilds',authRefresh.access_token,{
        authorization: `Bot ${env.DISCORD_TOKEN}`
      }),
      this.getDateBr(authRefresh.expires_in)
    ]) 
    
    const serverManager = []
    for(const server of serves){

      const hasServerManagerPermission = !!(server.permissions & env.GUILD_MANAGER_PERMISSION);

      if(hasServerManagerPermission){
        
        const checkBotInserver = servesBot.filter(e => e.id == server.id)

        console.log(
          colors.bold.magenta('\n============= checkBotInserver =============\n'),
          checkBotInserver,
          colors.bold.magenta('\n============= checkBotInserver =============\n'),
        )
       
        server.bot_in_server = checkBotInserver.length ? true : false

        serverManager.push(server)
      } 
      
    }

    const access_token = jwt.sign({
      access_token:authRefresh.access_token
      }, 
       env.ENCRYPT,
      { 
        expiresIn: "365d" 
      }
    );

    console.log('token',access_token)

    return {
      user:user,
      serves:serverManager,
      time_expire_token:dateBr.getTime(),
      access_token:access_token
    }

  };

  authLoginTokenAccess = async (data) => {

    console.log(
      colors.bold.magenta('\n============= authLoginTokenAccess =============\n'),
      data,
      colors.bold.magenta('\n============= authLoginTokenAccess =============\n'),
    )

    const token = jwt.verify(String(data.access_token), env.ENCRYPT);
    
    console.log('token',token)

    const [user,serves,servesBot] = await Promise.all([
      this.getApi('/users/@me',token.access_token),
      this.getApi('/users/@me/guilds',token.access_token),
      this.getApi('/users/@me/guilds',token.access_token,{
        authorization: `Bot ${env.DISCORD_TOKEN}`
      })
    ]) 

    const serverManager = []
    for(const server of serves){

      const hasServerManagerPermission = !!(server.permissions & env.GUILD_MANAGER_PERMISSION);

      if(hasServerManagerPermission){
        
        const checkBotInServer = servesBot.filter(e => e.id == server.id)

        console.log(
          colors.bold.magenta('\n============= checkBotInServer =============\n'),
          checkBotInServer,
          colors.bold.magenta('\n============= checkBotInServer =============\n'),
        )
       
        server.bot_in_server = checkBotInServer.length ? true : false

        serverManager.push(server)
      } 
      
    }

    return {
      user:user,
      serves:serverManager 
    }
  }

  refreshToken = async (refreshToken) =>{

    console.log('refresh')
    const data = {    
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };

    console.log(
      colors.bold.magenta('\n============= data refreshToken =============\n'),
      data,
      colors.bold.magenta('\n============= data refreshToken =============\n'),
    )

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/x-www-form-urlencoded'
    };

    const response = await axios.post(`${env.API_ENDPOINT}/oauth2/token`, data, {headers});
    console.log(
      colors.bold.green('\n============= response refreshToken =============\n'),
      response.data,
      colors.bold.green('\n============= response refreshToken =============\n'),
    )

    return response.data
  }

  addBotServer = async (data) => {


    if(!data?.server_discord_id || false) throw {type:1,msg:'Server discord id não disponivel'}

    const server = await this.getApi(`/guilds/${data.server_discord_id}`,'',{
        authorization: `Bot ${env.DISCORD_TOKEN}`
    })
    
    console.log(
      colors.bold.magenta('\n============= server =============\n'),
      server,
      colors.bold.magenta('\n============= server =============\n'),
    )

    return server

  };

  getBotServers = async () => {
    
    const response = await this.getApi('/users/@me/guilds','',{
      authorization: `Bot ${env.DISCORD_TOKEN}`
    })

    return response

  }


  getApi = async (params,tokenBearer,headers = null) => {
    
    headers = headers ? headers : {authorization: `Bearer ${tokenBearer}`}

    const response = await axios.get(`${env.API_ENDPOINT}${params}`, {
      headers: headers
    });

    return response.data

  }

  getDateBr = async (expires_in) => {
    const date = new Date()
    const dateBr = new Date((date.getTime()) + (expires_in * 1000))
    console.log('DATE dateBr', dateBr)
   
    return dateBr
  }

  getServe

}

export default new DiscordService(); 
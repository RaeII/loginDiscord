/**
 *CLIQUE BOTÃO DE LOGIN
 *ABRE ABA DE PERMISSÃO DO DISCORD 
*/

$('#login-discord').click(function() {
   
    const innerHeight = window.innerHeight;
    
    const domain = window.location.hostname;
    const linkDiscord = domain == 'localhost' ? 
    'https://discord.com/api/oauth2/authorize?client_id=1126506531798655100&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2FauthRedirect&response_type=code&scope=identify%20guilds%20email' :
    'https://discord.com/api/oauth2/authorize?client_id=1065775158062755880&redirect_uri=https%3A%2F%2Flucy-adm.monkeybranch.com.br%2Fdiscord%2FauthRedirect&response_type=code&scope=identify%20guilds%20email%20applications.commands.permissions.update' 
    

    const WindowPopup = window.open(
        linkDiscord, 
        'discord',
        `width=600,height=${innerHeight}`
    );
    
    let lastURL = WindowPopup.location.href;
    let checkPopupURL = setInterval(function() {

        try {

            if (WindowPopup.closed) {

                clearInterval(checkPopupURL);
                
            } else {

                let currentURL = WindowPopup.location.href;
                if (currentURL !== lastURL) {

                    lastURL = currentURL;
                    //console.log("A janela popup foi atualizada. URL atual: " + currentURL);

                    if(currentURL.includes('code')){

                        clearInterval(checkPopupURL);
                        var code = WindowPopup.location.search.replace('?code=', '');
                        //console.log('Código:', code);
                        WindowPopup.close()
                        
                        login(code)

                        return
            
                    }else if(WindowPopup.location.search.includes('error')){
                        clearInterval(checkPopupURL);
                        //console.log('CANCELADO')
                        WindowPopup.close()
                    }

                }
            }

        } catch (error) {
            //console.log('error')
        }

    }, 500);

});

/**
 * APÓS USER ACEITAR AUTH DO DISCORD
*/
const login = async(code) => {
    
    console.log('CODE ==>',code)

    const data = {code:code}

    const response = await fetchApi(`discord/auth`,data,'POST')

    console.log({time_expire_token:response.data.time_expire_token,
        access_token:response.data.access_token})

    console.log('LOGIN ==>',response)

    $('#login').val(true)

    await Promise.all([
        $('#login-discord').addClass('none'),
        loadInfoUser(response.data.user),
        loadServes(response.data.serves),
        setDataSession('session-discord',{
            time_expire_token:response.data.time_expire_token,
            access_token:response.data.access_token
        })
    ])

}

/**
 *CARREGA NA TELA INFO DO USER 
*/

const loadInfoUser = (user) => {
    
    const avatar = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "./image/discord-log.png"

    $('#user-data-header').removeClass('none')
    $('#user-img').attr('src', avatar);
    $('#user-name').html(user.username);

}

/**
 *CARREGA NA TELA SERVIDORES QUE O USER TEM PERMISSÃO DE ADICIONAR BOT 
*/

const loadServes = (dataServes) => {
    
    $('#container-button').addClass('none')
    const containerServes = $('#container-serves')
    containerServes.removeClass('none')
    containerServes.html('')

    if(dataServes.length == 0){

        containerServes.html('<p>Você não possui servidores com permissão para adicionar Lucy</p>')
        return

    } 

    dataServes.forEach(server => {
        
        const icon = server.icon ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : "./image/discord-log.png"
        const displayButton = server.bot_in_server ? 
        `<button data-id="${server.id}" server-icon="${icon}" onclick="loadCommands(this)" class="blue-button server-button">Administrar</button>` : 
        `<button onclick="addBotServerPopup(this)" server-icon="${icon}" class="blue-button server-button">Adiconar Lucy</button>`

        if(server.bot_in_server){

        }

        containerServes.prepend(
            `<div class="server right wrap">
                <div class="name">${server.name}</div>
                <div class="logo center">
                    <div class="cont-img-server center">
                       <img src="${icon}" alt="${server.name}">
                    </div>
                </div>
                ${displayButton}
            </div>`
        )
    })
}


/**
 *SE ACCESS_TOKEN TIVER NA SESSÃO FAZ LOGIN AUTOMATICO 
*/
const authLoginTokenAccess = async () => {
    const tokenSession = await getDataSession('session-discord')

    if(!tokenSession) return 
 
    console.log('tokenSession',tokenSession)
    response = await fetchApi('discord/authLoginTokenAccess',tokenSession,'POST')
    console.log('authLoginTokenAccess', response)

    await Promise.all([
        loadInfoUser(response.data.user),
        loadServes(response.data.serves)
    ])

    $('#login').val(true)
 
}
//authLoginTokenAccess()


const updateServes = async (code) => {

    const data = {code:code}

    const response = await fetchApi('discord/add_bot_server',data,'POST')
    console.log('SERVER USER',response.data)
    loadServes(response.data.serverManager)
}

const loadCommandsAddBot = async (server) => {

    try {

        $('#container-serves').addClass('none')
        $('#container-commands').removeClass('none')
        const icon = server.icon ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png` : "./image/discord-log.png"
        console.log('icon',icon)
        $('#server-icon').html(`<img src="${icon}" alt="">`)

        $('#server_discord_id').val(server.id)

        console.log('DISCORD SERVER IDDDD', server.id)

        // const display = $('#container-commands').css('display')
        // console.log('DISPLAY CONTAINER COMMANDS', display)
        // if(display == 'none') return  
        
        const commands = await fetchApi(`commands/getActiveCommandsInServer/${server.id}`)

        console.log('COMMANDS', commands)

        const inputCommands = $('.input-command-checkBox')
        for(const command of inputCommands){
            $(command).prop('checked', false)
        }
        
        for(const command of commands.data){
            console.log('COMMAND NAME', command.name)
            $(`#${command.name}`).prop('checked', true)
        }
        
    } catch (error) {
        
        console.log('ERROR',error)

    }

}

/**
 * Habilitar e desabilitar comando no servidor do discord
 * @param {*} e this do checkBox
 *  
 */
async function inputCommand(e){

    try {

        const commandName = $(e).attr('commad-name');
        const status = $(e).prop("checked")
        const server_discord_id = $('#server_discord_id').val()
    
        console.log('COMAND NAME',commandName)
        console.log('STATUS', $(e).prop("checked"))
    
        const data = {
            server_discord_id:server_discord_id,
            command:commandName
        }
        
        let response = {};
        
        if(status){
            response = await fetchApi('commands/deployCommandServer',data,'POST')
        }else{
            response = await fetchApi('commands/removeCommandServer',data,'DELETE')
        }
        
        console.log('RESPONSE', response)
        
    } catch (error) {
        
        console.log('ERROR',error)

    }

}

/**
 * Função carrega os comandos ativos no servidor e habilita os checkBox dos comando retornados ativos
 * @param {*} e this do botão de clique que ativa a função
 */
const loadCommands = async (e) => {

    try {

        $('#container-serves').addClass('none')
        $('#container-commands').removeClass('none')

        const icon = $(e).attr('server-icon')
        console.log('icon',icon)
        $('#server-icon').html(`<img src="${icon}" alt="">`)

       const server_discord_id = $(e).attr('data-id')

       console.log('DISCORD SERVER IDDDD', server_discord_id)

        $('#server_discord_id').val(server_discord_id)

        // const display = $('#container-commands').css('display')
        // console.log('DISPLAY CONTAINER COMMANDS', display)
        // if(display == 'none') return  
        
        const commands = await fetchApi(`/commands/getActiveCommandsInServer/${server_discord_id}`)

        console.log('COMMANDS', commands)
        
        const inputCommands = $('.input-command-checkBox')
        for(const command of inputCommands){
            $(command).prop('checked', false)
        }
        
        for(const command of commands.data){
            console.log('COMMAND NAME', command.name)
            $(`#${command.name}`).prop('checked', true)
        }
        
    } catch (error) {
        
        console.log('ERROR',error)

    }

}

const addBotServerPopup = async (e) => {
    
    const innerHeight = window.innerHeight;
    const server_discord_id = $(e).attr('data-id')

    $('#server_discord_id').val(server_discord_id)

    const domain = window.location.hostname;
    const linkDiscord = domain == 'localhost' ? 
    'https://discord.com/api/oauth2/authorize?client_id=1001866877175336991&permissions=534992387184&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fdiscord%2FauthRedirect&response_type=code&scope=guilds%20bot%20applications.commands' : 
    'https://discord.com/api/oauth2/authorize?client_id=1065775158062755880&permissions=534992387184&redirect_uri=https%3A%2F%2Flucy-adm.monkeybranch.com.br%2Fdiscord%2FauthRedirect&response_type=code&scope=guilds%20bot%20applications.commands'
    
    console.log('linkDisocord',linkDiscord)

    WindowPopup = window.open(
        linkDiscord, 
        'discord', 
        `width=600,height=${innerHeight}`
    );
    let lastURL = WindowPopup.location.href;
    let checkPopupURL = setInterval( async function() {
        try {
            if (WindowPopup.closed) {
                clearInterval(checkPopupURL);
                console.log("A janela popup foi fechada.");
            } else {
                
                let currentURL = WindowPopup.location.href;
                if (currentURL !== lastURL) {
                    lastURL = currentURL;
                    //console.log("A janela popup foi atualizada. URL atual: " + currentURL);
                    if(currentURL.includes('guild_id')){
                        clearInterval(checkPopupURL);
                        const match = WindowPopup.location.search.match(/guild_id=(\d+)/);
                
                        console.log('macth',match)
        
                        if(!match) throw new Error('Id do servidor não encontrado na adição do bot ao servidor!')
        
                        const serverId = match[1]
        
                        //console.log('server_id:', serverId);
                        WindowPopup.close()
                        
                        data = {server_discord_id:serverId}
        
                        const response = await fetchApi(`discord/add_bot_server`,data,'POST')
                        //console.log('RESPONSE ADD_BOTSERVER',response)
                        await loadCommandsAddBot(response.data)
                        return
            
                    }else if(WindowPopup.location.search.includes('error')){
                        
                        clearInterval(checkPopupURL);
                    // console.log('CANCELADO')
                        WindowPopup.close()
                    }
                }
            }
        } catch (e) {
            
        }

    }, 500);
    
    WindowPopup.focus();

}

$('#server-menu').click(()=>{
    const login = $('#login').val()
    console.log(login)
    
    if(!login) return 

    $('#container-serves').removeClass('none')
    $('#container-commands').addClass('none')
})


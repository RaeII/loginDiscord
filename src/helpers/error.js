import colors from "colors/safe.js";

const error = async (error,i) => {
    
    log.error(colors.bold.red('ERROR'))
    console.log(error);
    const e = {error:""}
    if (error.response) {

        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        
        e.error = `❌  **${error.response.data.error.message} ${error.response.status}**`

    } else if (error.request) {
       console.log(error.request);
       e.error = `❌ ${error.request}`
    } else {
        console.log('Error', error?.message || error);
        e.error = `❌ ${error?.message || error}`
    }

    if(i.deferred) await i.editReply(e.error)
    else if(i.replied) await i.followUp(e.error)
    else await i.reply(e.error);
}

const errorApi = (res, e) => {

    if (e.response) {

        console.log('RESPONSE DATA =>', e.response.data)
        console.log('RESPONSE DATA ERRORS=>', e?.response?.data?.errors || 'NOPE')
        console.log('RESPONSE DATA ERRORS NAME =>', e?.response?.data?.errors?.name || 'NOPE')
        

    } else if (e.request) {

        console.log('messageErrorRequest',`❌ ${e.request}`)

    } else {

        console.log(`❌ ${e?.message || e.msg || e}`)
    }
    
    const message = {error:''}

    if(typeof e === "string") message.error = e
        else if(e instanceof Error) message.error = e.message
            else if(e?.type || false) message.error = e.msg
    
    console.log(colors.bold(`❌ ERROR ❌\n\n${colors.red(message?.error || '')}\n${e?.stack || ''}\n❌ ERROR ❌`))

    return res.status(400).json({
        status:'fail',
        message:message.error
    });
}

const getRandomErrorPhrase = async () => {
    const phrases = [
        "Desculpe-me, estou lidando com uma alta demanda de usuários neste momento. Por favor, seja paciente e tente novamente em breve. 🙂",
        "Peço desculpas pela espera. Estou atendendo muitos usuários agora. Por favor, aguarde um momento e tente novamente. 😉",
        "Lamentamos informar que estamos com um grande volume de usuários no momento, o que pode afetar o tempo de resposta. Por favor, tente novamente em alguns instantes. 😌",
        "No momento, estou ocupado atendendo vários usuários simultaneamente. Solicito que aguarde um momento e tente novamente. 🥲",
        "Estou enfrentando uma grande demanda de usuários agora. Por favor, seja paciente e tente novamente em breve. 🥺",
        "Devido à alta demanda, estou lidando com muitos usuários no momento. Peço desculpas pelo inconveniente e sugiro que tente novamente mais tarde. 🫣",
        "Ops! Estou com um número elevado de usuários para atender neste momento. Por favor, aguarde um instante e tente novamente. 😬",
        "Pedimos desculpas pela demora. Estamos com uma grande demanda de usuários no momento. Solicitamos que você aguarde um momento e tente novamente. 😪",
        "Infelizmente, estou sobrecarregado com um grande número de usuários no momento. Peço desculpas pela espera e recomendo que tente novamente mais tarde. 🙃",
        "Devido ao alto fluxo de usuários, estou enfrentando dificuldades no momento. Por favor, seja paciente e tente novamente em breve. 🥹",
    ];

    const randomIndex = Math.floor(Math.random() * (phrases.length - 1));
    return phrases[randomIndex];
}

//type = 1 erro de sistema
//type = 2 erro de usuário
const errorDiscordBot = async (error,i) => {

    let errorSistem = false
    const e = {error: '', ephemeral: false}

    console.log(error)
    
    if(error?.type || false){
        if(error.type == 2){
            e.error = error.msg
            e.ephemeral = error?.ephemeral || false
        }
        else if(error.type == 1){
           errorSistem = true
        } 

    }else{
        e.error = await getRandomErrorPhrase()
    }

    if (error.response) {

        console.log(`❌${error?.response?.data || ''}`)

        console.log('❌',error?.response?.data?.error || '','❌')
        

    } else if (error.request) {

        console.log(`❌ ${error.request}`)

    } else {

        console.log(`❌ ${error?.message || error.msg || error}`)
    }


    
    try {

      if(i.deferred) await i.editReply({content:e.error,ephemeral:e.ephemeral})
      else if(i.replied) await i.followUp({content:e.error,ephemeral:e.ephemeral})
      else await i.reply({content:e.error,ephemeral:e.ephemeral});

    } catch (error) {

        console.log('Error ao replicar a mensagem')
    }    
    
}

export {error,errorDiscordBot,errorApi}
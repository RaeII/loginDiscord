import colors from "colors/safe";

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
        "Houve um pequeno imprevisto, por favor, tente novamente. 🙂",
        "Tive um contratempo, aguarde um pouco e tente de novo. 😉",
        "Encontrei um obstáculo, tente novamente. 😌",
        "Estou lidando com uma situação inesperada, tente de novo. 🥲",
        "Houve um pequeno imprevisto, por favor, tente novamente. 🥺",
        "Tive um contratempo, tente novamente, por favor. 🫣",
        "Encontrei um obstáculo, tente de novo.  😬",
        "Estou lidando com uma situação inesperada, tente de novo. 😪",
        "Houve um pequeno imprevisto, por favor, tente novamente. 🙃",
        "Houve um imprevisto, por favor, tente novamente. 🥹"
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
           e.error = await getRandomErrorPhrase()
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
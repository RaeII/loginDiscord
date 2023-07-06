/**
 * Status 
 * 2 - Em atendimento (atribuido)
 * 7 - Aceito
 * 1 - Novo
 * 3 - Em atendimento (planejado)
 * 4 - pendente
 * 5 - solucionado 
 * 
 * Responsvel - tipo = 1
 * Observador - tipo = 3
 * Area de origem - tipo = 2 
*/
const dominio = window.location.hostname;
console.log("Domínio:", dominio);

const fetchApi = async (param, datas = '',method = 'GET') =>{

    const options = {
      method: method,
      headers: {
        'Content-type': 'application/json',
      },
    };
  
    if(method !== 'GET') options.body = JSON.stringify(datas);

    const domain = window.location.hostname;
    const url = domain == 'localhost' ? 'http://localhost:3000' : 'https://lucy-adm.monkeybranch.com.br'
    
    const response = await fetch(`${url}/api/${param}`, options)
    const text = await response.text();

    const json = JSON.parse(text);

    console.log('json',json)
  
    if(!json) {
      console.log('ERRO NO JSON',text)
      throw 'Resposta retornada nao condiz com um json';
    }
  
    if(json.status == 'fail') throw json.message
    
    return json;
}

/**
 * SESSION
 * 
 * session-discord - token e data de espiração do token
 * 
 */
const setDataSession = async (sessionName,data) => {
  
  sessionStorage.setItem(sessionName, JSON.stringify(data))

  return true
}

const getDataSession = async (sessionName) => {
 
  return JSON.parse(sessionStorage.getItem(sessionName))

}


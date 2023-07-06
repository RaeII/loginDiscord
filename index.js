import env from './src/config/index.js';
import {serverHttp} from './src/loaders/express.js';
import colors from 'colors/safe.js';

const api = async () => {

    serverHttp.listen(env.PORT_SERVER,'0.0.0.0', () => console.log(
        colors.yellow.bold(
            colors.rainbow(' -=============================-\n'),
            'Login Discord🤖\n  Server listening on port:'+env.PORT_SERVER+'\n',
            colors.rainbow('-=============================-'))
        )
    )

}

await api()





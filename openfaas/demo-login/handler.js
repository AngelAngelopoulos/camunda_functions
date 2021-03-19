/* Required Libraries */
const zb = require("zeebe-node")

var callbacks = new Map();

var result;

/**
 * @constant {credentials} credentials Is a object with the client codes and Secrets, to run this with Camunda 
 * Cloud or any cloud instance of Zeebe operator
 * 
 */
const credentials = {
    /** @name camundaCloud */
    
};

/**
 * 
 */
const zbc = new zb.ZBClient(credentials, { loglevel: 'INFO' })



// * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// STRUCTURE OF ANY PROCESS: //

/**
 * 
 * Function to login in the example, this will be adjusted to favorite login method of the user
 * @param {variables} - variables with a body like {user, "username", pass: "passowrd"}
 * @returns {processLoginValidate} As a success or Error response
 */
function processLogin(variables) {
    var errorResponse = processLoginValidate(variables)
    console.log(errorResponse)
    return errorResponse
}

/**
 * 
 * Function to validate the login info submited by the user, it can be replaced with another method inside
 * @param {variables} - variables with a body like {user, "username", pass: "passowrd"}
 * @returns {object} As a success (json) or Error response (null)
 */
function processLoginValidate(variables) {
    var result = null;
    console.log(variables);
    if (variables != null && variables.user != null && variables.pass != null)
    {
        const {user, pass} = variables;
        if (user === 'user' &&  pass === '123456') {
            //if (variables.user === 'moy' && variables.pass === '123456')
                result = { rs: true, sessionId: `${user}1212332131` };
        }
        else {
            result = { rs: false, err: "Fields required: user, pass" };
        }
    }
    
    return result;
}

/**
 * Function to identify that a job has been completed
 * @param {*} id - ID of the key map
 * @param {*} se_pudo - String to indicate whether the task is complete
 */
const hazalgo =  async(id, se_pudo = false) =>
{
    //await new Promise(r => setTimeout(r, 2000));
    callbacks.set(id, se_pudo);
    se_pudo ? 
    zbc.completeJob({jobKey: id}):
    zbc.failJob({jobKey: id})
    
    console.log(`Trabajo ${id} completado`);
}

/**
 * Creation of system workers
 * @param {*} zbc 
 */
const createWorkers = async(zbc) => {

    /** 
     * Worker dedicated to  authenticate user
     * 
    */
    zbc.createWorker('worker-system-log1', 'output-log', async (job,complete) => {
        const {key, variables} = job;
        console.log(`** Usuario ${variables.user} autenticado`);
        complete.success({rs:true})
    })

    /**
     * This worker was created to warn that the user could not authenticate
     */
    zbc.createWorker('worker-system-log2', 'output-log-detailed', (job,complete) => {
        const {key, variables} = job;
        console.log(`** El usuario ${variables.user} no se pudo autenticar correctamente`)
        console.log(job)
        complete.success({rs:true})
    })

    /** 
     * This worker was created to send emails to the administrator after a successful task
     * * * * * */
    zbc.createWorker('worker-system-email1', 'output-email', (job,complete) => {
        console.log("** Enviando email al administrador...")
        setTimeout(() => {
            console.log("Email enviado");
            complete.success({rs:true});
          }, 8000);
    })

    /**
     * This worker was created to send SMS to the user after a successful task
     */
    zbc.createWorker('worker-system-sms1', 'output-sms', (job,complete) => {
        const {key, variables} = job;
        console.log(`** Enviando SMS de autenticación al usuario ${variables.user}`)
        setTimeout(() => {
            console.log("SMS enviado");
        
            complete.success({rs:true});
          }, 8000);  })

    // DECLARATION OF ANY PROCESS:
    zbc.createWorker('worker-users-login','pr-login', (job,complete) => {
        const {key, variables} = job;
        console.info(`* Iniciando login: ${variables}`);
        var response = processLogin(job.variables)
        response ? 
        complete.success(response):
        complete.failied(response)
        console.info(`* Terminando Login: ${variables}`);
    })
}



/**
 * @module demo-login 
 * @param {FunctionContext} context - As the previous status context provided by the server outside the faas.
 * @param {callback} callback - As a callback with atributes and methods related with the response.
 * @returns {callback} Callback to handle the response, with status.
 */
module.exports = async (context, callback) => {

    const method = context.method;
    /**
     * Only POST requests
     */
    switch (method) {
        case 'POST':
            /**
             * @constant {ZBClient} zbc - An object with all the config info about the Zeebe client (supports Camunda Cloud)
             */
            
            const newsbc = createWorkers(zbc)
            const wfi = await zbc.createWorkflowInstance("demo-workflow", context.body);
            //callbacks.set(wfi.workflowInstanceKey, outcome => res.json(outcome));
            callback.succeed({ res: true, callbacks});
            break;
        default:
            callback.status(405).succeed({ res: false });
            break;
    }
    //const zbc = new ZBClient( 'localhost:26500', {loglevel:'INFO'} )




}


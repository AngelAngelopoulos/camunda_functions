## Modules

<dl>
<dt><a href="#module_demo-login">demo-login</a> ⇒ <code>callback</code></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#camundaCloud">camundaCloud</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#credentials">credentials</a> : <code><a href="#credentials">credentials</a></code></dt>
<dd><p>Is a object with the client codes and Secrets, to run this with Camunda 
Cloud or any cloud instance of Zeebe operator</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#processLogin">processLogin(variables)</a> ⇒ <code><a href="#processLoginValidate">processLoginValidate</a></code></dt>
<dd><p>Function to login in the example, this will be adjusted to favorite login method of the user</p>
</dd>
<dt><a href="#processLoginValidate">processLoginValidate(variables)</a> ⇒ <code>object</code></dt>
<dd><p>Function to validate the login info submited by the user, it can be replaced with another method inside</p>
</dd>
</dl>

<a name="module_demo-login"></a>

## demo-login ⇒ <code>callback</code>
**Returns**: <code>callback</code> - Callback to handle the response, with status.  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>FunctionContext</code> | As the previous status context provided by the server outside the faas. |
| callback | <code>callback</code> | As a callback with atributes and methods related with the response. |

<a name="module_demo-login..zbc"></a>

### demo-login~zbc : <code>ZBClient</code>
An object with all the config info about the Zeebe client (supports Camunda Cloud)

**Kind**: inner constant of [<code>demo-login</code>](#module_demo-login)  
<a name="camundaCloud"></a>

## camundaCloud
**Kind**: global variable  
<a name="camundaCloud.clientId Client code from the API menu in operate"></a>

### camundaCloud.clientId Client code from the API menu in operate
**Kind**: static property of [<code>camundaCloud</code>](#camundaCloud)  
<a name="credentials"></a>

## credentials : [<code>credentials</code>](#credentials)
Is a object with the client codes and Secrets, to run this with Camunda 
Cloud or any cloud instance of Zeebe operator

**Kind**: global constant  
<a name="processLogin"></a>

## processLogin(variables) ⇒ [<code>processLoginValidate</code>](#processLoginValidate)
Function to login in the example, this will be adjusted to favorite login method of the user

**Kind**: global function  
**Returns**: [<code>processLoginValidate</code>](#processLoginValidate) - As a success or Error response  

| Param | Type | Description |
| --- | --- | --- |
| variables | <code>variables</code> | variables with a body like {user, "username", pass: "passowrd"} |

<a name="processLoginValidate"></a>

## processLoginValidate(variables) ⇒ <code>object</code>
Function to validate the login info submited by the user, it can be replaced with another method inside

**Kind**: global function  
**Returns**: <code>object</code> - As a success (json) or Error response (null)  

| Param | Type | Description |
| --- | --- | --- |
| variables | <code>variables</code> | variables with a body like {user, "username", pass: "passowrd"} |


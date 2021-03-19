// Copyright (c) Alex Ellis 2021. All rights reserved.
// Copyright (c) OpenFaaS Author(s) 2021. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"

const express = require('express')
const app = express()
const handler = require('./openfaas/demo-login/handler');
const bodyParser = require('body-parser')

const defaultMaxSize = '100kb' // body-parser default

app.disable('x-powered-by');

const rawLimit = process.env.MAX_RAW_SIZE || defaultMaxSize
const jsonLimit = process.env.MAX_JSON_SIZE || defaultMaxSize

/** 
 * When no content-type is given, the body element is set to 
    nil, and has been a source of contention for new users.
    * * * * * */
app.use(function addDefaultContentType(req, res, next) {
 

    if(!req.headers['content-type']) {
        req.headers['content-type'] = "text/plain"
    }
    next()
})

if (process.env.RAW_BODY === 'true') {
    app.use(bodyParser.raw({ type: '*/*' , limit: rawLimit }))
} else {
    app.use(bodyParser.text({ type : "text/*" }));
    app.use(bodyParser.json({ limit: jsonLimit}));
    app.use(bodyParser.urlencoded({ extended: true }));
}

const isArray = (a) => {
    return (!!a) && (a.constructor === Array);
};

const isObject = (a) => {
    return (!!a) && (a.constructor === Object);
};

/* @class */
class FunctionEvent {
    /**
     * @memberof FunctionEvent
     * @param {*} req 
     */
    constructor(req) {
        this.body = req.body;
        this.headers = req.headers;
        this.method = req.method;
        this.query = req.query;
        this.path = req.path;
    }
}

/** @class 
 * 
*/
class FunctionContext {
    constructor(cb) {
        /**
         * @memberof FunctionContext
         */
        this.value = 200;
        this.cb = cb;
        this.headerValues = {};
        this.cbCalled = 0;
    }
    /**
     * Status event
     * @param {*} value 
     * @returns 
     */
    status(value) {
        if(!value) {
            return this.value;
        }

        this.value = value;
        return this;
    }
    /**
     * headers event
     * @param {*} value 
     * @returns 
     */
    headers(value) {
        if(!value) {
            return this.headerValues;
        }

        this.headerValues = value;
        return this;    
    }

    /**
     * Suceed event
     * @param {*} value 
     */
    succeed(value) {
        let err;
        this.cbCalled++;
        this.cb(err, value);
    }

    /**
     * Fail event
     * @param {} value 
     */
    fail(value) {
        let message;
        this.cbCalled++;
        this.cb(value, message);
    }
}

/**
 * Context of route, verify that incorrect data is not sent (garbage)
 * @param {*} req 
 * @param {*} res 
 */
const middleware = async (req, res) => {
    /**
     * 
     * @param {*} err 
     * @param {*} functionResult 
     * @returns 
     */
    const cb = (err, functionResult) => {
        if (err) {
            console.error(err);

            return res.status(500)
                .send(err.toString ? err.toString() : err);
        }

        if(isArray(functionResult) || isObject(functionResult)) {
            res.set(fnContext.headers())
                .status(fnContext.status()).send(JSON.stringify(functionResult));
        } else {
            res.set(fnContext.headers())
                .status(fnContext.status())
                .send(functionResult);
        }
    };

    const fnEvent = new FunctionEvent(req);
    const fnContext = new FunctionContext(cb);

    /**
     * Promise that if an event arrives, put a succeed, if it arrives with an error, put an error in its context
     */
    Promise.resolve(handler(fnEvent, fnContext, cb))
    .then(res => {
        if(!fnContext.cbCalled) {
            fnContext.succeed(res);
        }
    })
    .catch(e => {
        cb(e);
    });
};

/** 
 * upload a docker to a route and start context in any type of method* * * */
app.post('/*', middleware);
app.get('/*', middleware);
app.patch('/*', middleware);
app.put('/*', middleware);
app.delete('/*', middleware);
app.options('/*', middleware);

const port = process.env.http_port || 3000;

/** 
 * function for which data node of certain port
 * * * * */
app.listen(port, () => {
    console.log(`node14 listening on port: ${port}`)
});



#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies.
 */
const http_1 = __importDefault(require("http"));
const app_js_1 = require("../app.js");
/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = (val) => {
    const parsedPort = parseInt(val, 10);
    if (Number.isNaN(parsedPort)) {
        // named pipe
        return val;
    }
    if (parsedPort >= 0) {
        // port number
        return parsedPort;
    }
    return false;
};
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3001');
app_js_1.app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_js_1.app);
/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
    const addr = server.address();
    const bind = addr ? (typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`) : '';
    console.log(`Listening on ${bind}`);
};
/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log("Server listening...");

const express = require('express')
const { ExpressPeerServer } = require('peer');

const app = express()

const PORT = process.env.PORT || 3000
const DEBUG = process.env.DEBUG || true

srv = app.listen(PORT)

app.use('/peerjs', ExpressPeerServer(srv, {
    debug: DEBUG,
}))

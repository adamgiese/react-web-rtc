export default {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  path: '/peerjs',
  debug: process.env.DEBUG ? 2 : 0,
}


const config = () => {
   return process.env.NODE_ENV === 'development' ?
      {
         // dev config
         SERVER_URL: 'http://localhost:3000/api',
         SOCKET_URL: 'ws://localhost:3000/socket'
      } : {
         // prod config
         SERVER_URL: 'http://localhost:3000/api',
         SOCKET_URL: 'ws://localhost:3000/socket'
      }
}

export default config();
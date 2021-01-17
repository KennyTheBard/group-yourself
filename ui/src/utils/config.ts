
const config = () => {
   return process.env.NODE_ENV === 'development' ?
      {
         // dev config
         SERVER_URL: 'http://localhost:3000/api',
         SOCKET_URL: 'ws://localhost:3000/api'
      } : {
         // prod config
         SERVER_URL: 'http://localhost:3000/api',
         SOCKET_URL: 'ws://localhost:3000/api'
      }
}

export default config();
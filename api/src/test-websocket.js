// THIS IS ONLY A TEST FILE USED BY OCTAV TO HACK HIS WAY TO SOCKETS SUCCESS

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/socket?groupCollectionId=1&studentId=1', {
  perMessageDeflate: false
});

ws.onmessage = (msg) => {
  console.log(msg.data);
}


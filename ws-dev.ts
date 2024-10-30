const socket = new WebSocket('ws://localhost:8000/ws');

socket.onmessage = (event) => {
  console.log(`RECEIVED: ${event.data}`);
};

socket.onopen = () => {
  console.log('CONNECTED');

  socket.send('helloworld');
};

socket.onclose = (event) => {
  console.log(event);

  console.log('DISCONNECTED');
};

socket.onerror = (error) => {
  console.error('ERROR');

  console.log(String(error));
};

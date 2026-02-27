// test-mqtt.js
const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://mosquitto:1883', {
  username: 'mosquitto',
  password: 'Zacita123.',
});

client.on('connect', () => {
  console.log('✅ Conectado a MQTT');
  client.publish('usuarios/test/ubicacion', JSON.stringify({ lat: 10, lng: 20 }));
  client.end();
});

client.on('error', (err) => {
  console.error('❌ Error MQTT:', err.message);
});
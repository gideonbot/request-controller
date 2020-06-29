const request_controller = require('./index');
let controller = new request_controller.controller();
controller.on('test', () => console.log('test!'));
controller.emit('test');
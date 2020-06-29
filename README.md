# request-controller
A npm module for blocking spam


## Installation
`npm i gideonbot/request-controller` (requires git)

## Usage
```js
const { controller } = require('request-controller');
let my_controller = new controller({
    file_path: __dirname, //dir in which the list of banned ips will be stored [default is where the main .js is stored]
    ban_threshold_count: 20, //how much requests does it take to get banned [default 30]
    ban_threshold_time: 5, //how often the request count is measured (aka doing more than 20 requests/5 seconds will get you banned) [default 10]
    whitelisted_ips: ['64.233.160.25'], //list of ips that cannot get banned
    respond_to_banned_ips: true, //if false the request will just time out, otherwise 'banned_ip_response' is sent [default true]
    banned_ip_response: 'Bad! Stop spamming!' // [default 'You are banned from accessing this server'] *can also be a path to a file*
});

app.use(my_controller.middleware);

my_controller.on('ip_banned', ip => console.log(ip + ' was banned for spamming'));
my_controller.on('ip_unbanned', ip => console.log(ip + ' was unbanned'));
my_controller.on('request_denied', req => console.log(req.ip + ' was denied access to ' + req.path));

my_controller.unban('64.233.160.22');
my_controller.ban('64.233.160.21');
```

## API
MIA

## Feature list
MIA

## Bug list
MIA

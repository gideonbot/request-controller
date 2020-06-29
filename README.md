# request-controller
A npm module for blocking spam


## Installation
`npm i gideonbot/request-controller` (requires git)

## Usage
```js
const { Controller } = require('request-controller');
let my_controller = new Controller({
    file_path: __dirname, //dir in which the list of banned ips will be stored [default is where the main .js is stored]
    ban_threshold_count: 20, //how much requests does it take to get banned [default 30]
    ban_threshold_time: 5, //how often the request count is measured (aka doing more than 20 requests/5 seconds will get you banned) [default 10]
    whitelisted_ips: ['64.233.160.25'], //list of ips that cannot get banned
    response: { //response that is sent to banned IPs, if undefined the request will just time out
        code: 403, //status code for response [default 403]
        ctype: 'text/plain', //content type for response [default text/plain]
        body: 'Stop spamming my site' //body for response [default 'You are banned from accessing this server'] (can be a path to a file)
    }
});

app.use(my_controller.middleware);

my_controller.on('ip_banned', ip => console.log(ip + ' was banned for spamming'));
my_controller.on('ip_unbanned', ip => console.log(ip + ' was unbanned'));
my_controller.on('request_denied', req => console.log(req.ip + ' was denied access to ' + req.path));

my_controller.unban('64.233.160.22');
my_controller.ban('64.233.160.21');
```

## API

### .middleware
The middleware you use in `app.use`

### .ban(ip: string)
Adds the IP to the list of banned IPs

Return value is boolean - true if successful otherwise false

### .unban(ip: string)
Removes the IP from the list of banned IPs

Return value is boolean - true if successful otherwise false

### .load()
Loads the ban list from ipbans.txt (you shouldn't have to call this)

## Events
### .on('ip_banned', ip => {...})
Occurs when an IP gets banned, first argument is the IP that was banned

### .on('ip_unbanned', ip => {...})
Occurs when an IP gets unbanned, first argument is the IP that was unbanned

### .on('request_denied', req => {...})
Occurs when a banned IP attempts to make a request, first argument is the request object received from Express

## Feature list
- Configurable automatic IP bans
- Configurable response for banned IPs
- Events for IP banning/unbanning
- Can be used with [express-rate-limit](https://www.npmjs.com/package/express-rate-limit) to
  automatically ban IPs after certain amount of 429s

## Bug/Todo list
- proper response handling

## Changelog
- 29.06.2020 - Init

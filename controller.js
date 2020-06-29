const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');
const Util = require('./Util');

class Controller extends EventEmitter {
    constructor(options) {
        super();

        this.settings = {};
        this.banned_ips = [];
        this.request_count = {};

        if ('file_path' in options) {
            if (typeof(options.file_path) == 'string') {
                this.settings.file_path = options.file_path + '/ipbans.txt';
            }
            else throw new Error('Invalid ban_threshold_count');
        }
        else this.settings.file_path = path.parse(process.argv[1]).dir + '/ipbans.txt';

        if ('ban_threshold_count' in options) {
            if (typeof(options.ban_threshold_count) == 'number') {
                this.settings.max_requests = Math.abs(options.ban_threshold_count);
            }
            else throw new Error('Invalid ban_threshold_count');
        }
        else this.settings.max_requests = 30;

        if ('ban_threshold_time' in options) {
            if (typeof(options.ban_threshold_time) == 'number') {
                this.settings.time_window = Math.abs(options.ban_threshold_time);
            }
            else throw new Error('Invalid ban_threshold_time');
        }
        else this.settings.time_window = 10;

        if ('whitelisted_ips' in options) {
            if (Array.isArray(options.whitelisted_ips)) {
                this.settings.whitelisted_ips = options.whitelisted_ips.filter(x => typeof(x) == 'string');
            }
            else throw new Error('Invalid whitelisted_ips');
        }
        else this.settings.whitelisted_ips = [];

        if ('response' in options) {
            if (!Util.IsObject(options.response)) {
                throw new Error('Invalid respond_to_banned_ips');
            }
            
            this.settings.response = {
                code: options.response.code && typeof(options.response.code) == 'number' ? options.response.code : 403,
                ctype: options.response.ctype && typeof(options.response.ctype) == 'string' ? options.response.ctype : 'text/plain',
                body: options.response.body && typeof(options.response.body) == 'string' ? options.response.body : 'You are banned from accessing this server',
            };

            if (fs.existsSync(this.settings.response.body)) {
                this.settings.response.body = fs.readFileSync(this.settings.response.body).toString();
            }
        }

        this._middleware = (req, res, next) => {
            const IP = Util.IPFromRequest(req);

            if (this.settings.whitelisted_ips.includes(IP)) return next();

            if (this.banned_ips.includes(IP)) {
                this.emit('request_denied', req);

                if (this.settings.response) {
                    res.setHeader('Content-Type', this.settings.response.ctype);
                    res.status(this.settings.response.code).send(this.settings.response.body);
                }
                return;
            }

            if (IP in this.request_count) this.request_count[IP]++;
            else this.request_count[IP] = 1;

            next();
        };

        this._ban = ip => {
            if (this.banned_ips.includes(ip)) return false;
            
            this.emit('ip_banned', ip);
            this.banned_ips.push(ip);
            this._save();
            
            return true;
        };

        this._unban = ip => {
            if (!this.banned_ips.includes(ip)) return false;
            
            this.emit('ip_unbanned', ip);
            this.banned_ips.splice(this.banned_ips.indexOf(ip), 1);
            this._save();
            
            return true;
        };

        this._load = () => {
            if (fs.existsSync(this.settings.file_path)) {
                this.banned_ips = fs.readFileSync(this.settings.file_path).toString().split('\n').map(x => x.trim());
            }
            else fs.writeFileSync(this.settings.file_path, '');
        };

        this._save = () => {
            fs.writeFileSync(this.settings.file_path, this.banned_ips.join('\n'));
        };

        this._check = () => {
            for (let ip in this.request_count) {
                if (this.request_count[ip] >= this.settings.max_requests) {
                    this._ban(ip);   
                }
            }
        
            this.request_count = {};
        };

        this._load();

        setInterval(() => this._check(), this.settings.time_window * 1000);
    }

    get middleware() {
        return this._middleware;
    }

    ban(ip) {
        if (!ip || !Util.IsIPAddress(ip)) return;
        return this._ban(ip);
    }
    
    unban(ip) {
        if (!ip || !Util.IsIPAddress(ip)) return;
        return this._unban(ip);
    }

    load() {
        this._load();
    }
}

module.exports = Controller;
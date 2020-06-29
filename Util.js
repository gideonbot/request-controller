const validator = require('validator');

class Util {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    /**
     * @param {Express.Request} req 
     * @return {string}
     */
    static IPFromRequest(req) {
        let IP = req.ip;
        return this.CleanIP(IP);
    }

    /**
     * @param {string} IP 
     */
    static CleanIP(IP) {
        if (!IP) return 'MISSING IP';

        IP = IP.replace('::ffff:', '').replace('::1', '');
        return !IP ? '127.0.0.1' : IP;
    }

    /**
     * @param {string} str 
     * @returns {boolean}
     */
    static IsIPAddress(str) {
        if (typeof(str) != 'string') return false;

        for (let item of str.split(':')) if (validator.isIP(item, '4')) return true;
        return validator.isIP(str, '4');
    }

    static IsObject(o) {
        if (Array.isArray(o)) return false;
        return o === Object(o);
    }
}

module.exports = Util;
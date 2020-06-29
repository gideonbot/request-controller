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
}

module.exports = Util;
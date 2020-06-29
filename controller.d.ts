import { EventEmitter } from "events";
import { ClientRequest, IncomingMessage } from "http";
import Util = require("./Util");

export class Controller extends EventEmitter {
    constructor(options: Options);
    middleware: (req: Request, res: Response, next: () => {}) => void;
    ban(ip: string): boolean;
    unban(ip: string): boolean;
    load(): void;
    public on<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
    public once<K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this;
}

interface Options {
    file_path?: string;
    ban_threshold_count: number;
    ban_threshold_time: number;
    whitelisted_ips?: string[];
    response?: _Response;
}

interface _Response {
    code: number;
    ctype: string;
    body: string;
}

interface ClientEvents {
    request_denied: [Request];
    ip_banned: [string];
    ip_unbanned: [string];
}
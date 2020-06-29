import { EventEmitter } from "events";
import { ClientRequest, IncomingMessage } from "http";
import Util = require("./Util");

export class Controller extends EventEmitter {
    constructor(options: Options);

}

interface Options {
    file_path?: string;
    ban_threshold_count: number;
    ban_threshold_time: number;
    whitelisted_ips?: string[];
    response?: _Response;
    middleware: (req: Request, res: Response, next: () => {}) => void;
    ban(ip: string): boolean;
    unban(ip: string): boolean;
    load(): void;
}

interface _Response {
    code: number;
    ctype: string;
    body: string;
}
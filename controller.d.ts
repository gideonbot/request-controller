import { EventEmitter } from "events";

export class Controller extends EventEmitter {
    constructor(options: Options);
    
    middleware: (req: Request, res: Response, next: () => {}) => void;
    ban(ip: string): boolean;
    unban(ip: string): boolean;
    load(): void;

    public on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    public once<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
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

interface Events {
    request_denied: [Request];
    ip_banned: [string];
    ip_unbanned: [string];
}
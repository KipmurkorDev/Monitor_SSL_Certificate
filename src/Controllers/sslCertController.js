"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationCertDate = void 0;
const check_cert_expiration_1 = __importDefault(require("check-cert-expiration"));
const node_fs_1 = __importDefault(require("node:fs"));
const child_process_1 = require("child_process");
async function expirationCertDate() {
    try {
        // checking the expiration date, and update if it is less than 2
        const { daysLeft, host, port } = await (0, check_cert_expiration_1.default)("teta.com");
        if (daysLeft < 2) {
            (0, child_process_1.exec)("sudo certbot renew", (err, stdout, stderr) => {
                if (err) {
                    throw new Error(`exec error: ${err}`);
                }
                // watching for changes in the keys files
                node_fs_1.default.watch("/etc/letsencrypt/", (curr, prev) => {
                    (0, child_process_1.exec)("pm2 restart all", (err, stdout, stderr) => {
                        if (err) {
                            console.error(`exec error: ${err}`);
                            throw new Error(`exec error: ${err}`);
                        }
                        console.log("Pm2 process was restarted");
                    });
                });
            });
        }
        process.exit(0);
    }
    catch (error) {
        let errorMessage = '';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
    }
    ;
}
exports.expirationCertDate = expirationCertDate;

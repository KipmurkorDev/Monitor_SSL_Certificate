"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirationCertDate = void 0;
const check_cert_expiration_1 = __importDefault(require("check-cert-expiration"));
const node_fs_1 = __importDefault(require("node:fs"));
const child_process_1 = require("child_process");
function expirationCertDate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // checking the expiration date, and update if it is less than 2
            const { daysLeft, host, port } = yield (0, check_cert_expiration_1.default)("teta.com");
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
    });
}
exports.expirationCertDate = expirationCertDate;

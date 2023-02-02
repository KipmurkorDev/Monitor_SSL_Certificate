"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sslCertController_1 = require("../Controllers/sslCertController");
const sslRouter = (0, express_1.Router)();
sslRouter.get('/ssl/expiration/date', sslCertController_1.expirationCertDate);
exports.default = sslRouter;

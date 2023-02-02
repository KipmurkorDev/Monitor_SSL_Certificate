import { Router, json } from 'express';

import {expirationCertDate} from '../Controllers/sslCertController'

const sslRouter=Router();

sslRouter.get('/ssl/expiration/date', expirationCertDate)











export default sslRouter
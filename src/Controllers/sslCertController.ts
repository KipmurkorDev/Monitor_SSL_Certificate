import checkCertExpiration from 'check-cert-expiration';
import express,{Request, Response, json } from 'express'
import fs from "node:fs"
import {exec} from 'child_process';

export async function expirationCertDate (req:Request, res:Response){
  try {
    // checking the expiration date, and update if it is less than 2
    const { daysLeft, host, port } = await checkCertExpiration("teta.com");
  
    if (daysLeft < 2) {
      exec("sudo certbot renew", (err, stdout, stderr) => {
        if (err) {
          throw new Error(`exec error: ${err}`);
        }
        // watching for changes in the keys files
        fs.watch("/etc/letsencrypt/", (curr:string, prev:string) => {
          exec("pm2 restart all", (err, stdout, stderr )=> {
            if (err) {
              console.error(`exec error: ${err}`);
              return res.status(500).json({ error: err});
            }
            return res.status(200).json("Pm2 successfull restarted");
          })
        });
      });
    }

    process.exit(0);
  } catch (error) {
    let errorMessage:string = ''
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({ error: errorMessage });

  };

  }

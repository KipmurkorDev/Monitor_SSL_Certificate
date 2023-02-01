const checkCertExpiration = require("check-cert-expiration");
const pm2 = require("pm2");
const fs = require("fs");
const { exec } = require("child_process");

const expereataionCertDate = async () => {
  try {
    // checking the experataion date, and update if it is less than 2
    const { daysLeft, host, port } = await checkCertExpiration("teta.com");
    console.log(
      `${daysLeft} days until the certificate expires for ${host}:${port}`
    );
    if (daysLeft < 2) {
      exec("sudo certbot renew", (err, stdout, stderr) => {
        if (err) {
          console.error(`exec error: ${err}`);
          return;
        }
        // watching for changes in the keys files
        fs.watch("/etc/letsencrypt/", (curr, prev) => {
          pm2.connect(() => {
            for (let i = 0; i < NUMBER_OF_WORKERS; i++) {
              let proxyPort = port + i;
              pm2.restart({
                name: "worker-" + proxyPort,
                script: "app.js",
                exec_mode: "cluster_mode",
                force: true,
                instances: 1,
                args: [proxyPort],
              });
            }
          });
        });
      });
    }

    process.exit(0);
  } catch (err) {
    console.log(`${err.name}:${err.message}`);
    process.exit(1);
  }
};

expereataionCertDate()
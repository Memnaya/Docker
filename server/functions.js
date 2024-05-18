import net from 'net';
import https from 'https';

function checkProxyHeaders(headers) {
    if (headers['x-forwarded-for'] || headers.via || headers.forwarded || headers['x-proxy-id']) {
        return true;
    }
    return false;
}

async function checkPort(ip, port) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.setTimeout(2000);
        socket.connect(port, ip);

        socket.on('connect', () => {
            socket.destroy();
            resolve(true);
        });

        socket.on('error', (error) => {
            socket.destroy();
            resolve(false);
        });

        socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
        });
    });
}

async function checkProxy() {
    return new Promise((resolve, reject) => {
        https.get('https://ipinfo.io/json', (res) => {
            let data = '';
            let headers = res.headers;

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.bogon || checkProxyHeaders(headers)) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.error('Error with request:', err);
            resolve(false);
        });
    });
}

export {checkPort, checkProxy};
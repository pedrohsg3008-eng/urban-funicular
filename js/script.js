// ========================================
// VALIDADOR DE SITES
// ========================================

function validarSite() {
    const url = document.getElementById('urlInput').value.trim();
    const resultadoDiv = document.getElementById('resultado');
    const detalhesDiv = document.getElementById('detalhesResultado');
    const tituloDiv = document.getElementById('tituloResultado');
    
    // Validar se o campo está vazio
    if (!url) {
        alert('Por favor, digite uma URL!');
        return;
    }
    
    // Análise da URL
    let statusSeguranca = analisarURL(url);
    
    // Exibir resultado
    mostrarResultado(statusSeguranca, url, tituloDiv, detalhesDiv, resultadoDiv);
}

// ========================================
// FUNÇÃO DE ANÁLISE DA URL
// ========================================

function analisarURL(url) {
    let url_lower = url.toLowerCase();
    let resultado = {
        status: 'seguro',
        confianca: 100,
        motivos: [],
        avisos: []
    };
    
    // 1. Verificar se usa HTTPS
    if (!url_lower.startsWith('https://')) {
        if (url_lower.startsWith('http://')) {
            resultado.status = 'cuidado';
            resultado.confianca = 60;
            resultado.avisos.push('⚠️ Site usa HTTP (não criptografado). Prefira HTTPS.');
        } else {
            resultado.status = 'cuidado';
            resultado.confianca = 70;
            resultado.motivos.push('❌ URL não começa com https:// ou http://');
        }
    }
    
    // 2. Verificar sinais de phishing
    let sinais_phishing = verificarPhishing(url_lower);
    if (sinais_phishing.length > 0) {
        resultado.status = 'perigoso';
        resultado.confianca = 20;
        resultado.motivos = sinais_phishing;
    }
    
    // 3. Verificar se é um site conhecido e confiável
    let eh_conhecida = verificarSiteConhecido(url_lower);
    if (!eh_conhecida && resultado.status === 'seguro') {
        resultado.status = 'cuidado';
        resultado.confianca = 65;
        resultado.avisos.push('⚠️ Site desconhecido. Verifique se é realmente o site que procura.');
    }
    
    // 4. Adicionar informações positivas
    if (url_lower.startsWith('https://')) {
        resultado.motivos.push('✅ Site usa HTTPS (criptografado)');
    }
    
    return resultado;
}

// ========================================
// VERIFICAR SINAIS DE PHISHING
// ========================================

function verificarPhishing(url) {
    let avisos = [];
    
    // Palavras-chave suspeitas
    const palavras_suspeitas = [
        'verify', 'confirm', 'update', 'validate',
        'urgent', 'act', 'click', 'now',
        'atualizar', 'confirmar', 'verificar',
        'urgente', 'clique'
    ];
    
    // Padrões de phishing
    const padroes_phishing = [
        /\b(bitc0in|bitcoim|paypa1|amazo|faceb0ok)/i,  // Nomes misspelled
        /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,        // IP direto
        /banc0|sen|-ha|se-nh/i                          // Senhas/bancaria misspelled
    ];
    
    // Verificar palavras suspeitas
    for (let palavra of palavras_suspeitas) {
        if (url.includes(palavra)) {
            avisos.push('🚨 Contém palavras suspeitas: "' + palavra + '"');
        }
    }
    
    // Verificar padrões
    for (let padrao of padroes_phishing) {
        if (padrao.test(url)) {
            avisos.push('🚨 Padrão suspeito detectado no URL');
            break;
        }
    }
    
    // Muito longo ou estranho
    if (url.length > 100) {
        avisos.push('🚨 URL muito longo (pode tentar ocultar destino real)');
    }
    
    return avisos;
}

// ========================================
// VERIFICAR SE SITE É CONHECIDO
// ========================================

function verificarSiteConhecido(url) {
    // Lista de sites conhecidos e confiáveis
    const sites_conhecidos = [
        'google.com', 'facebook.com', 'instagram.com', 'youtube.com',
        'bb.com.br', 'caixa.gov.br', 'itau.com.br', 'bradesco.com.br',
        'gov.br', 'saude.gov.br', 'inss.gov.br', 'receita.fazenda.gov.br',
        'gmail.com', 'outlook.com', 'hotmail.com',
        'wikipedia.org', 'whatsapp.com', 'telegram.org',
        'maps.google.com', 'translate.google.com',
        'amazon.com.br', 'mercadolivre.com.br'
    ];
    
    for (let site of sites_conhecidos) {
        if (url.includes(site)) {
            return true;
        }
    }
    return false;
}

// ========================================
// EXIBIR RESULTADO
// ========================================

function mostrarResultado(resultado, url, tituloDiv, detalhesDiv, resultadoDiv) {
    let emoji_status = '';
    let classe_status = '';
    let mensagem_status = '';
    
    if (resultado.status === 'seguro') {
        emoji_status = '🟢';
        classe_status = 'seguro';
        mensagem_status = 'SITE SEGURO';
    } else if (resultado.status === 'cuidado') {
        emoji_status = '🟡';
        classe_status = 'cuidado';
        mensagem_status = 'CUIDADO';
    } else {
        emoji_status = '🔴';
        classe_status = 'perigoso';
        mensagem_status = 'SITE PERIGOSO';
    }
    
    // Montar HTML do resultado
    let html = `
        <div class="${classe_status}">
            <h2>${emoji_status} ${mensagem_status}</h2>
            
            <h3>URL Analisada:</h3>
            <p><code>${escaparHTML(url)}</code></p>
            
            <h3>Análise Detalhada:</h3>
    `;
    
    // Adicionar motivos positivos/negativos
    if (resultado.motivos.length > 0) {
        html += '<ul>';
        for (let motivo of resultado.motivos) {
            html += `<li>${motivo}</li>`;
        }
        html += '</ul>';
    }
    
    // Adicionar avisos
    if (resultado.avisos.length > 0) {
        html += '<h3>Avisos:</h3><ul>';
        for (let aviso of resultado.avisos) {
            html += `<li>${aviso}</li>`;
        }
        html += '</ul>';
    }
    
    // Adicionar recomendação
    if (resultado.status === 'seguro') {
        html += `<p><strong>✅ Recomendação: É seguro acessar este site.</strong></p>`;
    } else if (resultado.status === 'cuidado') {
        html += `<p><strong>⚠️ Recomendação: Tenha cuidado ao acessar. Verifique se este é realmente o site que procura.</strong></p>`;
    } else {
        html += `<p><strong>❌ Recomendação: NÃO ACESSE este site! Pode ser uma fraude.</strong></p>`;
    }
    
    html += `</div>`;
    
    // Atualizar DOM
    tituloDiv.textContent = `${emoji_status} ${mensagem_status}`;
    detalhesDiv.innerHTML = html;
    resultadoDiv.style.display = 'block';
    
    // Scroll até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// FUNÇÃO AUXILIAR: ESCAPAR HTML
// ========================================

function escaparHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// EVENT LISTENERS
// ========================================

// Permitir validar ao pressionar Enter
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    if (urlInput) {
        urlInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                validarSite();
            }
        });
    }
});
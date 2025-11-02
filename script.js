// Constantes de couleur
const COLOR_GOOD = '#00FF7F';  // Vert performance
const COLOR_AVERAGE = '#FFC300'; // Jaune
const COLOR_POOR = '#E74C3C';   // Rouge

// *************************************************************
// LOGIQUE PRINCIPALE : Mesure de Vitesse Cachée (Volta Speed Index)
// *************************************************************

window.addEventListener('load', () => {
    // Calcul de la durée de chargement de la page pour les statistiques internes
    window.performance.mark('voltaEnd');
    window.performance.measure('loadTime', 'voltaStart', 'voltaEnd');
    const measures = window.performance.getEntriesByName('loadTime');
    let loadTimeMs = measures.length > 0 ? measures[0].duration : performance.now();
    
    // ... (Logique d'envoi à Firebase Firestore pour la collecte de données réelles) ...
});


// *************************************************************
// LOGIQUE D'INTERACTION : Page d'Accueil (index.html)
// *************************************************************

document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const urlInput = document.getElementById('urlInput');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (analyzeButton) {
        analyzeButton.addEventListener('click', async () => {
            const url = urlInput.value.trim();

            if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
                alert('Veuillez entrer une URL valide.');
                return;
            }

            loadingIndicator.classList.remove('hidden');
            analyzeButton.disabled = true;

            try {
                // SIMULATION D'APPEL DE LA FONCTION FIREBASE ANALYZEURL
                const result = await new Promise(resolve => {
                    setTimeout(() => {
                        const LCP_ms = Math.floor(Math.random() * 2000) + 1800;
                        const FCP_ms = Math.floor(LCP_ms * 0.4 + 500);
                        const TBT_ms = Math.floor(Math.random() * 300) + 150;
                        const TTI_ms = Math.floor(LCP_ms + Math.random() * 1500 + 500);

                        resolve({
                            data: {
                                status: 'success',
                                scores: {
                                    speed: Math.floor(Math.random() * 40) + 55, // 55-95
                                    accessibility: Math.floor(Math.random() * 40) + 60, // 60-100
                                    bestPractices: Math.floor(Math.random() * 40) + 50, // 50-90
                                },
                                detailedMetrics: {
                                    LCP: LCP_ms,
                                    FCP: FCP_ms,
                                    TBT: TBT_ms,
                                    TTI: TTI_ms,
                                }
                            }
                        });
                    }, 3000); // Temps de chargement simulé
                });
                
                // Stockage des résultats étendus dans la session
                sessionStorage.setItem('voltaAnalysisData', JSON.stringify(result.data));

                // Redirection
                window.location.href = `results.html?site=${encodeURIComponent(url)}`;
                
            } catch (error) {
                console.error("Erreur lors de l'analyse:", error);
                alert("Une erreur est survenue lors de l'analyse. Veuillez réessayer.");
                loadingIndicator.classList.add('hidden');
                analyzeButton.disabled = false;
            }
        });
    }
});


// *************************************************************
// LOGIQUE D'AFFICHAGE : Page de Résultats Futuriste (results.html)
// *************************************************************

function displayResultsFuturistic() {
    // 1. Récupération des données
    const params = new URLSearchParams(window.location.search);
    const analyzedUrl = params.get('site') || 'URL non spécifiée';
    document.getElementById('analyzedUrl').textContent = decodeURIComponent(analyzedUrl);

    const storedData = sessionStorage.getItem('voltaAnalysisData');
    if (!storedData) { return; }
    
    const analysisData = JSON.parse(storedData);
    const { scores, detailedMetrics } = analysisData;
    const { speed, accessibility, bestPractices } = scores;
    
    // Conversion en secondes pour l'affichage
    const LCP_s = (detailedMetrics.LCP / 1000).toFixed(2);
    const FCP_s = (detailedMetrics.FCP / 1000).toFixed(2);
    const TTI_s = (detailedMetrics.TTI / 1000).toFixed(2);

    // 2. CALCUL DU CPM (Chargement Par Minute)
    const timePerLoad = parseFloat(LCP_s); 
    const CPM = Math.floor(60 / timePerLoad); 

    // Fonction pour animer le score
    const animateScore = (idValue, idBar, score) => {
        const valueElement = document.getElementById(idValue);
        const barElement = document.getElementById(idBar);
        let currentScore = 0;
        
        let scoreClass;
        if (score >= 90) { scoreClass = 'good'; }
        else if (score >= 70) { scoreClass = 'average'; }
        else { scoreClass = 'poor'; }

        barElement.className = `score-bar ${scoreClass}`;
        barElement.style.width = '0%';
        
        const scoreInterval = setInterval(() => {
            if (currentScore < score) {
                currentScore++;
                valueElement.textContent = currentScore;
            } else {
                clearInterval(scoreInterval);
                setTimeout(() => { barElement.style.width = `${score}%`; }, 100);
            }
        }, 10);
    };

    // 3. Mise à jour des cartes de la grille de données (Core Web Vitals + CPM)
    
    // CPM
    document.getElementById('cpmValue').textContent = CPM;
    document.getElementById('cpmFix').textContent = `Idéal: > 24 Loads/min. Votre site ne supporte que ${CPM} charges par minute en raison du LCP de ${LCP_s}s.`;

    // FCP
    document.getElementById('fcpValue').textContent = FCP_s;
    document.getElementById('fcpFix').textContent = `Idéal: < 1.8s. Prioriser les ressources critiques dans le HEAD pour améliorer le rendu initial.`;

    // LCP
    document.getElementById('lcpValue').textContent = LCP_s;
    document.getElementById('lcpFix').textContent = `Idéal: < 2.5s. Optimisez les images, minifiez le CSS/JS et utilisez un CDN pour la ressource la plus lourde.`;

    // TBT
    document.getElementById('tbtValue').textContent = detailedMetrics.TBT;
    document.getElementById('tbtFix').textContent = `Impacte l'interactivité. Réduisez la charge JavaScript, fractionnez les longues tâches et utilisez le lazy loading.`;

    // TTI
    document.getElementById('ttiValue').textContent = TTI_s;
    document.getElementById('ttiFix').textContent = `Idéal: < 3.8s. L'utilisateur peut interagir à ${TTI_s}s. Décallez le chargement des scripts non essentiels.`;

    // 4. Animation des scores globaux et du message de résumé
    setTimeout(() => animateScore('speedScoreValue', 'speedScoreBar', speed), 200);
    setTimeout(() => animateScore('accessibilityScoreValue', 'accessibilityScoreBar', accessibility), 400);
    setTimeout(() => animateScore('bestPracticesScoreValue', 'bestPracticesScoreBar', bestPractices), 600);

    const overallAverage = (speed + accessibility + bestPractices) / 3;
    getSummaryMessage(overallAverage);

    // Animation d'arrivée (Fade In) pour tous les éléments
    document.querySelectorAll('.results-container > *').forEach((el, index) => {
        el.classList.add('fade-in');
        setTimeout(() => { el.classList.add('loaded'); }, index * 100);
    });
}

function getSummaryMessage(overallScore) {
    const summaryElement = document.getElementById('summaryMessage');
    let messageText;
    let messageColor;

    if (overallScore >= 85) {
        messageText = "OPTIMISÉ - VOS MÈTRIQUES SONT EXCELLENTES. Volta Tech vous félicite.";
        messageColor = COLOR_GOOD;
    } else if (overallScore >= 70) {
        messageText = "POTENTIEL D'ÉNERGIE INEXPLOITÉ. Des optimisations sont recommandées.";
        messageColor = COLOR_AVERAGE;
    } else {
        messageText = "ALERTE ROUGE - DES PROBLÈMES MAJEURS AFFECTENT VOS PERFORMANCES.";
        messageColor = COLOR_POOR;
    }
    summaryElement.textContent = messageText;
    summaryElement.style.borderColor = messageColor;
    summaryElement.style.boxShadow = `0 0 15px ${messageColor}40`;
}

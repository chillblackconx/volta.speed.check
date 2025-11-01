document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const urlInput = document.getElementById('urlInput');
    const loadingIndicator = document.getElementById('loadingIndicator');

    analyzeButton.addEventListener('click', () => {
        const url = urlInput.value.trim();

        if (!url) {
            alert('Veuillez entrer une URL valide.');
            return;
        }
        
        // Validation simple de l'URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('L\'URL doit commencer par http:// ou https://');
            return;
        }

        // 1. Afficher l'indicateur de chargement
        loadingIndicator.classList.remove('hidden');
        analyzeButton.disabled = true;

        // 2. SIMULATION DE L'ANALYSE (Remplacer par l'appel API réel)
        setTimeout(() => {
            // Cacher l'indicateur de chargement
            loadingIndicator.classList.add('hidden');
            analyzeButton.disabled = false;

            // Redirection vers la page de résultats (que nous devrons créer ensuite)
            // Pour l'instant, nous redirigeons vers une page simulée
            window.location.href = `results.html?site=${encodeURIComponent(url)}`;
            
        }, 3000); // Simule un temps de chargement de 3 secondes
    });
});

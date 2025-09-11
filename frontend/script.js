// Configuration de l'application
const CONFIG = {
    API_BASE_URL: 'http://localhost:3000',
    DEMO_DURATION: 3000,
    ANIMATION_DELAY: 100
};

// Gestionnaire d'état de l'application
class AppState {
    constructor() {
        this.isLoading = false;
        this.currentAgent = 'frontend';
        this.demoRunning = false;
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.updateLoadingState();
    }

    updateLoadingState() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            if (this.isLoading) {
                btn.classList.add('loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        });
    }

    setCurrentAgent(agent) {
        this.currentAgent = agent;
        this.updateAgentState();
    }

    updateAgentState() {
        const agentCards = document.querySelectorAll('.agent-card');
        agentCards.forEach(card => {
            card.classList.remove('active');
        });

        const currentCard = document.querySelector(`.agent-card.${this.currentAgent}`);
        if (currentCard) {
            currentCard.classList.add('active');
        }
    }
}

// Utilitaires pour les requêtes API
class ApiService {
    static async fetchWelcome() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/welcome`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('API Error:', error);
            return { 
                success: false, 
                error: error.message || 'Erreur de connexion au serveur backend'
            };
        }
    }

    static async testConnection() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/health`, {
                method: 'GET',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Gestionnaire d'interface utilisateur
class UIManager {
    static showApiResponse(content, isError = false) {
        const responseDiv = document.getElementById('api-response');
        if (!responseDiv) return;

        responseDiv.innerHTML = content;
        responseDiv.className = `api-response show ${isError ? 'error' : ''}`;
        
        // Auto-hide après 5 secondes si pas d'erreur
        if (!isError) {
            setTimeout(() => {
                responseDiv.classList.remove('show');
            }, 5000);
        }
    }

    static hideApiResponse() {
        const responseDiv = document.getElementById('api-response');
        if (responseDiv) {
            responseDiv.classList.remove('show');
        }
    }

    static scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    static animateAgentCards() {
        const agents = ['frontend', 'backend', 'marketing', 'automation'];
        let currentIndex = 0;

        const rotateAgents = () => {
            appState.setCurrentAgent(agents[currentIndex]);
            currentIndex = (currentIndex + 1) % agents.length;
        };

        // Animation initiale
        setTimeout(() => {
            rotateAgents();
            // Rotation continue
            setInterval(rotateAgents, 2000);
        }, 1000);
    }

    static addScrollEffects() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Header background opacity
            if (currentScrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }

            lastScrollY = currentScrollY;
        });
    }

    static addIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observer les éléments animés
        const animatedElements = document.querySelectorAll('.feature-card, .agent-detail');
        animatedElements.forEach(el => observer.observe(el));
    }
}

// Gestionnaires d'événements
class EventHandlers {
    static async handleLoadWelcome() {
        appState.setLoading(true);
        UIManager.hideApiResponse();

        // Vérifier d'abord la connexion
        const isConnected = await ApiService.testConnection();
        
        if (!isConnected) {
            UIManager.showApiResponse(`
                <h4>⚠️ Serveur Backend Non Disponible</h4>
                <p>Le serveur backend sur <code>http://localhost:3000</code> n'est pas accessible.</p>
                <p><strong>Pour démarrer le backend :</strong></p>
                <ol>
                    <li>Naviguez vers le dossier <code>/backend</code></li>
                    <li>Exécutez <code>npm install</code></li>
                    <li>Lancez <code>node server.js</code></li>
                </ol>
            `, true);
            appState.setLoading(false);
            return;
        }

        // Charger le message de bienvenue
        const result = await ApiService.fetchWelcome();
        
        if (result.success) {
            const { message, timestamp, version } = result.data;
            UIManager.showApiResponse(`
                <h4>✅ Connexion Backend Réussie</h4>
                <p><strong>Message:</strong> ${message}</p>
                <p><strong>Version API:</strong> ${version}</p>
                <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString('fr-FR')}</p>
            `);
        } else {
            UIManager.showApiResponse(`
                <h4>❌ Erreur API Backend</h4>
                <p>${result.error}</p>
                <p>Vérifiez que le serveur backend est démarré et accessible.</p>
            `, true);
        }

        appState.setLoading(false);
    }

    static handleStartDemo() {
        if (appState.demoRunning) return;
        
        appState.demoRunning = true;
        appState.setLoading(true);

        UIManager.showApiResponse(`
            <h4>🚀 Démarrage de la Démonstration</h4>
            <p>Simulation de la collaboration entre agents...</p>
            <div style="margin-top: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span>🎨</span> <strong>Frontend Expert:</strong> Création de l'interface utilisateur...
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span>⚙️</span> <strong>Backend Expert:</strong> Configuration des APIs...
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span>📈</span> <strong>Marketing Expert:</strong> Optimisation UX...
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>🤖</span> <strong>Automation Expert:</strong> Déploiement automatisé...
                </div>
            </div>
        `);

        // Simulation de la démo
        setTimeout(() => {
            UIManager.showApiResponse(`
                <h4>✅ Démonstration Terminée</h4>
                <p>Collaboration réussie ! Tous les agents ont contribué à la création de cette interface moderne et performante.</p>
                <p><strong>Résultats :</strong></p>
                <ul style="margin-top: 0.5rem; margin-left: 1rem;">
                    <li>Interface responsive créée</li>
                    <li>API backend intégrée</li>
                    <li>Optimisations UX appliquées</li>
                    <li>Tests automatisés validés</li>
                </ul>
            `);
            
            appState.setLoading(false);
            appState.demoRunning = false;
        }, CONFIG.DEMO_DURATION);
    }

    static handleNavigation(event) {
        event.preventDefault();
        const href = event.target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            UIManager.scrollToSection(sectionId);
        }
    }
}

// Instance globale de l'état
const appState = new AppState();

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Frontend Expert Interface - Initialisation');

    // Configuration des gestionnaires d'événements
    const startDemoBtn = document.getElementById('start-demo');
    const loadWelcomeBtn = document.getElementById('load-welcome');
    const navLinks = document.querySelectorAll('.nav-link');

    if (startDemoBtn) {
        startDemoBtn.addEventListener('click', EventHandlers.handleStartDemo);
    }

    if (loadWelcomeBtn) {
        loadWelcomeBtn.addEventListener('click', EventHandlers.handleLoadWelcome);
    }

    // Navigation smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', EventHandlers.handleNavigation);
    });

    // Effets d'interface
    UIManager.addScrollEffects();
    UIManager.addIntersectionObserver();
    UIManager.animateAgentCards();

    // Initialisation de l'état des agents
    appState.setCurrentAgent('frontend');

    // Message d'accueil dans la console
    console.log(`
    🎨 Frontend Expert - Interface Ready
    
    Fonctionnalités disponibles:
    • Design responsive moderne
    • Intégration API backend
    • Animations et interactions
    • Optimisation Core Web Vitals
    • Accessibilité WCAG 2.1
    
    API Backend: ${CONFIG.API_BASE_URL}
    `);

    // Test de connexion initial (optionnel et silencieux)
    ApiService.testConnection().then(connected => {
        if (connected) {
            console.log('✅ Backend API disponible');
        } else {
            console.log('⚠️ Backend API non disponible');
        }
    });
});

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise non gérée:', event.reason);
});

// Export pour utilisation externe si nécessaire
window.FrontendApp = {
    state: appState,
    api: ApiService,
    ui: UIManager,
    handlers: EventHandlers
};


# 🎯 ÉTAPE 1 : DÉTECTION & DÉCLENCHEMENT

**QUI:** Multi-Agent-Manager détecte la demande projet
**ACTION:** Analyser le projet décrit par l'utilisateur

---

# 🎫 ÉTAPE 2 : MULTI-AGENT-MANAGER FAIT TOUT

**QUI:** Multi-Agent-Manager uniquement

## TÂCHES à faire par Multi-Agent-Manager:

1. Créer repository GitHub unique pour le projet
2. Cloner dans `/Users/nicolaschalopin/Documents/github/`
3. Créer structure de dossiers adaptée au projet (selon type fintech/saas/etc.)
4. Ouvrir dans VSCode
5. Créer/utiliser GitHub Project Dashboard 'Multi-Agents-Dashboard'
6. Créer/vérifier TOUS les labels suivants (via GitHub MCP uniquement):

### LABELS AGENTS:
- `backend-expert` (couleur: #96CEB4) - Tâches backend et API
- `frontend-expert` (couleur: #FECA57) - Tâches frontend et UI
- `marketing-expert` (couleur: #FF6B6B) - Tâches marketing et stratégie
- `finance-expert` (couleur: #4ECDC4) - Tâches finance et économie
- `legal-expert` (couleur: #45B7D1) - Tâches légales et compliance
- `automation-expert` (couleur: #FF9FF3) - Tâches CI/CD et automatisation

### LABELS WORKFLOW:
- `project` (couleur: #800080) - Ticket principal du projet
- `multi-agent` (couleur: #008000) - Géré par système multi-agents
- `in-progress` (couleur: #FFA500) - Tâche en cours
- `done` (couleur: #00FF00) - Tâche terminée
- `solo` (couleur: #87CEEB) - Tâche avec un seul agent
- `collaboration` (couleur: #DDA0DD) - Tâche multi-agents

> **IMPORTANT:** Utiliser UNIQUEMENT l'outil GitHub MCP pour créer/gérer les labels

7. Créer 1 ticket GitHub principal avec découpage en tâches INDÉPENDANTES
   - **IMPORTANT:** Chaque tâche doit être indépendante (pas de dépendances)
   - Domaines séparés (ex: API Backend, Frontend, Marketing, etc.)
   - Éviter: HTML+CSS, Frontend+Backend liés, etc.
8. Ajouter ticket au dashboard project

> **IMPORTANT:** Utiliser EXCLUSIVEMENT les outils GitHub MCP pour toutes les opérations GitHub
> **RÉSULTAT:** Infrastructure GitHub complète prête pour github-automation-manager

---

# 🐙 ÉTAPE 3 : GITHUB-AUTOMATION-MANAGER FAIT TOUT

**QUI:** GitHub-Automation-Manager uniquement

## TÂCHES à faire par GitHub-Automation-Manager:

1. Analyser le ticket principal créé par multi-agent-manager
2. Identifier le nombre de tâches (dynamique selon le ticket)
3. Créer 1 PR par tâche (1 tâche = 1 PR = 1 branche)
4. Assigner agents sur chaque PR avec labels correspondants (via GitHub MCP)
   - Appliquer labels agents (backend-expert, frontend-expert, etc.)
   - Appliquer labels workflow (solo/collaboration, in-progress)
   - Assigner utilisateur + agents spécialisés sur chaque PR
   - Ajouter chaque PR au dashboard project (ticket parent)
   - Utiliser UNIQUEMENT GitHub MCP pour toutes opérations
5. EXÉCUTER VRAIMENT les commandes tmux (utiliser outil Bash)
   - 1 panneau tmux = 1 tâche = 1 PR
   - Lancer Claude dans CHAQUE panneau avec les bons prompts
   - PAS JUSTE ECHO - VRAIMENT EXÉCUTER avec l'outil Bash

## COMMANDES TMUX À EXÉCUTER VRAIMENT:

```bash
# 1. Créer session tmux
tmux new-session -d -s '[nom-projet]'

# 2. PANNEAU PRINCIPAL 0 - Multi-Agent-Manager Surveillance
tmux send-keys -t '[nom-projet].0' 'echo "👑 SURVEILLANCE - Multi-Agent-Manager"' Enter
tmux send-keys -t '[nom-projet].0' 'echo "🎯 PRÊT POUR MULTI-AGENT-MANAGER"' Enter
tmux send-keys -t '[nom-projet].0' 'claude' Enter
tmux send-keys -t '[nom-projet].0' Enter
tmux send-keys -t '[nom-projet].0' 'Tu es multi-agent-manager en surveillance permanente. Surveille PRs pour détecter validations. Dès que toutes tâches validées, lance clôture projet.' Enter

# 3. POUR CHAQUE TÂCHE: Créer panneau + lancer Claude
# (Répéter pour chaque tâche identifiée)
tmux split-window -t '[nom-projet]' -v
tmux send-keys -t '[nom-projet].1' 'echo "🛠️ TÂCHE [X] - [nom tâche] (PR #[N])"' Enter
tmux send-keys -t '[nom-projet].1' 'git checkout feature/[branch-name]' Enter
tmux send-keys -t '[nom-projet].1' 'claude' Enter
tmux send-keys -t '[nom-projet].1' Enter
tmux send-keys -t '[nom-projet].1' 'Tu es github-automation-manager pour tâche [nom tâche]. Lance [agent spécialisé] pour écrire son fichier MD. Une fois terminé, valide et commente PR.' Enter

# 4. Organisation finale
tmux select-layout -t '[nom-projet]' tiled
```

> **CRUCIAL:** Utiliser l'outil Bash pour exécuter ces commandes, PAS echo !
> **FLUX:** Agent → GitHub-Agent (même panneau) → Multi-Agent-Manager (panneau 0)

> **IMPORTANT:** Toutes les opérations GitHub via MCP uniquement (PRs, labels, commentaires)
> **RÉSULTAT:** PRs créées + panneaux tmux prêts pour exécution agents

---

# ⚡ ÉTAPE 4 : AGENTS SPÉCIALISÉS TRAVAILLENT

**QUI:** GitHub-Automation-Manager + Agents spécialisés par panneau

## ARCHITECTURE PANNEAUX:
- **PANNEAU 0:** Multi-Agent-Manager en surveillance permanente
- **PANNEAUX 1,2,3...:** GitHub-Agent + Agent(s) spécialisé(s) par tâche

## FLUX DE TRAVAIL PAR PANNEAU TÂCHE:

### SOLO (1 agent par tâche):
1. GitHub-Agent (panneau N) lance Agent spécialisé
2. Agent travaille → écrit `'i am [agent] agent, all good for me bro'`
3. Agent notifie GitHub-Agent (même panneau)
4. GitHub-Agent vérifie travail → commit validation dans PR
5. GitHub-Agent commente PR: `'Tâche [X] validée par Multi-Agent-Manager'`
6. Multi-Agent-Manager (panneau 0) détecte le message de validation

### COLLABORATION (plusieurs agents par tâche):
1. GitHub-Agent lance Agent 1
2. Agent 1 travaille → notifie GitHub-Agent
3. GitHub-Agent lance Agent 2 (même panneau)
4. Agent 2 travaille → notifie GitHub-Agent
5. GitHub-Agent vérifie travail global → commit validation
6. GitHub-Agent commente PR: `'Tâche [X] validée par Multi-Agent-Manager'`
7. Multi-Agent-Manager (panneau 0) détecte le message

## SURVEILLANCE MULTI-AGENT-MANAGER (Panneau 0):
- Surveille en permanence tous les commits et PRs
- Détecte les messages de validation des tâches
- Comptabilise tâches terminées vs tâches totales
- **QUAND TOUTES VALIDÉES →** Lance ÉTAPE 5 (clôture projet)

---

# ✅ ÉTAPE 5 : MULTI-AGENT-MANAGER CLÔTURE AUTOMATIQUE

**QUI:** Multi-Agent-Manager (DÉCLENCHEMENT AUTOMATIQUE)
**DÉCLENCHEMENT:** Quand Multi-Agent-Manager détecte TOUTES les validations

## TÂCHES AUTOMATIQUES du Multi-Agent-Manager:
1. Détection que toutes tâches ont le message de validation
2. Vérification finale de chaque PR (via GitHub MCP)
3. Merger toutes les PRs validées (via GitHub MCP)
4. Fermer ticket principal avec statut 'Done' (via GitHub MCP)
5. Commente projet: `'Projet [nom] terminé avec succès - Multi-Agent-Manager'`
6. Nettoyer sessions tmux
7. Notification utilisateur: Projet terminé

## MESSAGES DE VALIDATION À DÉTECTER:
**Format:** `'Tâche [X] validée par Multi-Agent-Manager'` dans commentaires PR
**Exemple:** `'Tâche Backend API validée par Multi-Agent-Manager'`

---

# 📋 RÉSUMÉ POUR CLAUDE

## Tu dois maintenant:

1. Lire ce fichier workflow_final.sh complet
2. **OBLIGATOIRE:** Créer TodoWrite DÉTAILLÉ avec TOUTES les sous-étapes:

### STRUCTURE TODOWRITE OBLIGATOIRE:

#### 🎯 ÉTAPE 1: Détection & Déclenchement
- ☐ Analyser demande utilisateur
- ☐ Identifier type projet (fintech/saas/e-commerce/general)

#### 🎫 ÉTAPE 2: Multi-Agent-Manager Infrastructure (8 sous-tâches)
- ☐ Créer repository GitHub unique
- ☐ Cloner dans /Users/nicolaschalopin/Documents/github/
- ☐ Créer structure dossiers adaptée au projet
- ☐ Ouvrir dans VSCode
- ☐ Créer/utiliser GitHub Project Dashboard 'Multi-Agents-Dashboard'
- ☐ Créer/vérifier 12 labels (6 agents + 6 workflow)
- ☐ Créer ticket GitHub principal avec tâches indépendantes
- ☐ Ajouter ticket au dashboard project

#### 🐙 ÉTAPE 3: GitHub-Automation-Manager PRs & Tmux (5 sous-tâches)
- ☐ Analyser ticket principal créé
- ☐ Identifier nombre de tâches dynamiquement
- ☐ Créer 1 PR par tâche (1 tâche = 1 PR = 1 branche)
- ☐ Assigner agents + labels + ajouter PRs au dashboard
- ☐ EXÉCUTER commandes tmux + lancer Claude dans chaque panneau

#### ⚡ ÉTAPE 4: Agents Spécialisés Exécution (par panneau)
- ☐ Panneau 0: Multi-Agent-Manager surveillance permanente
- ☐ Panneaux 1,2,3...: GitHub-Agent + Agents spécialisés
- ☐ Agents écrivent 'i am [agent] agent, all good for me bro'
- ☐ GitHub-Agent valide et commente PRs
- ☐ Multi-Agent-Manager détecte validations

#### ✅ ÉTAPE 5: Multi-Agent-Manager Clôture (7 sous-tâches)
- ☐ Détecter toutes tâches validées
- ☐ Vérification finale des PRs
- ☐ Merger toutes les PRs
- ☐ Fermer ticket principal (statut 'Done')
- ☐ Commenter projet terminé
- ☐ Nettoyer sessions tmux
- ☐ Notifier utilisateur

3. Commencer IMMÉDIATEMENT par l'ÉTAPE 1
4. Suivre SÉQUENTIELLEMENT chaque étape
5. Utiliser Task tools pour lancer les agents appropriés
6. EXCLUSIVEMENT GitHub MCP pour toutes opérations GitHub
7. METTRE À JOUR le TodoWrite après chaque sous-étape terminée
8. **CRUCIAL:** GitHub-Automation-Manager doit utiliser l'outil Bash pour EXÉCUTER les commandes tmux
   Ne pas faire echo des commandes - LES EXÉCUTER VRAIMENT !

---

## 🎯 DIRECTIVES FINALES

- **VISIBILITÉ MAXIMALE:** TodoWrite = roadmap complète du projet
- **TRACKING:** Marquer chaque sous-étape in_progress puis completed
- **TRAÇABILITÉ:** Commenter chaque action dans les PRs

# ✨ GO CLAUDE, TODOWRITE DÉTAILLÉ PUIS COMMENCE !
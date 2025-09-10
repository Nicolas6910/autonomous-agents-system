# 🗃️ Système de Backup Agents Multi-Agents

**Location**: `/home/nicol/projects/autonomous-agents-system/agents-backup/`

## 📋 **Structure**

```
agents-backup/
├── README.md           # Ce fichier
├── VERSION-HISTORY.md  # Historique complet des évolutions
├── v2.0/              # Agents Version 2.0 (Architecture Bicouche)
├── v2.1/              # Agents Version 2.1 (Intelligence Automatique)
└── v2.x/              # Versions futures
```

## 🔄 **Gestion des Versions**

### **Créer un Backup de la Version Actuelle**
```bash
# Créer nouveau dossier version
mkdir -p /home/nicol/projects/autonomous-agents-system/agents-backup/v2.X/

# Copier agents actuels
cp /home/nicol/.claude/agents/*.md /home/nicol/projects/autonomous-agents-system/agents-backup/v2.X/
```

### **Restaurer une Version**
```bash
# Restaurer V2.1
cp /home/nicol/projects/autonomous-agents-system/agents-backup/v2.1/* /home/nicol/.claude/agents/

# Vérifier restauration
ls -la /home/nicol/.claude/agents/
```

### **Comparer Versions**
```bash
# Comparer deux versions
diff -r v2.0/ v2.1/
```

## 📊 **Statut Versions**

| Version | Date | Status | Agents | Fonctionnalités |
|---------|------|---------|---------|------------------|
| **V2.0** | Septembre 2025 | Archive | 8 | Architecture bicouche |
| **V2.1** | 9 Sept 2025 | ✅ Active | 8 | Intelligence automatique |
| **V2.2** | À venir | 🔄 Planifié | 8+ | Performance ML |

## ⚡ **Actions Rapides**

### **Backup Urgent**
```bash
# Backup rapide avec timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p agents-backup/backup_$TIMESTAMP
cp /home/nicol/.claude/agents/*.md agents-backup/backup_$TIMESTAMP/
```

### **Nettoyage Versions Anciennes**
```bash
# Supprimer backups > 30 jours (à adapter selon besoin)
find agents-backup/ -name "backup_*" -mtime +30 -type d -exec rm -rf {} \;
```

## 🎯 **Règles de Backup**

1. **Backup AVANT modification** : Toujours sauvegarder avant mise à jour
2. **Documentation** : Mettre à jour VERSION-HISTORY.md
3. **Test** : Valider nouvelle version avant suppression ancienne
4. **Archive** : Conserver minimum 2 versions fonctionnelles

## 📞 **Support**

- **Restauration urgente** : Copier depuis v2.1/ (version stable)
- **Problème version** : Consulter VERSION-HISTORY.md
- **Nouvelle fonctionnalité** : Créer backup AVANT développement

---

*Système de backup créé le 9 septembre 2025*  
*Maintient la continuité et sécurité du système multi-agents* 🛡️
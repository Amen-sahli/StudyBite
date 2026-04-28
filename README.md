# Projet Web — Espace VIP de Coworking

Application web de réservation de postes de travail dans un espace VIP de coworking.

## Description

Ce projet est une application web front-end permettant à des utilisateurs de :

- **Créer un compte** et se **connecter**
- **Réserver un poste de travail** dans l'un des trois espaces disponibles (Zone Alpha, Zone Beta, Zone Gamma)
- **Choisir une boisson** préférée (Café, Thé, Jus)

## Structure du projet

```
projet-web/
├── front/                  # Application front-end
│   ├── login.html          # Page de connexion
│   ├── login.css           # Styles de la page de connexion
│   ├── signup.html         # Page d'inscription
│   ├── signup.css          # Styles de la page d'inscription
│   ├── place.html          # Page de réservation de poste
│   ├── place.css           # Styles de la page de réservation
│   ├── index.js            # Logique JavaScript (validation, sélection de siège)
│   └── logo.png            # Logo de l'application
└── back/                   # Répertoire back-end (à implémenter)
```

## Technologies utilisées

- **HTML5** — Structure des pages
- **CSS3** — Mise en page (Flexbox, CSS Grid, Media Queries)
- **JavaScript (Vanilla)** — Validation des formulaires, sélection interactive des sièges
- **Police** : Poppins (via CSS natif)

## Fonctionnalités

### Page de connexion (`login.html`)
- Saisie de l'adresse email et du mot de passe
- Validation côté client (champs requis, longueur minimale du mot de passe)
- Redirection vers la page de réservation après connexion
- Lien vers la page d'inscription

### Page d'inscription (`signup.html`)
- Saisie du nom complet, email, mot de passe et confirmation du mot de passe
- Validation côté client (champs requis, longueur minimale, correspondance des mots de passe)
- Redirection vers la page de connexion après inscription
- Lien vers la page de connexion

### Page de réservation (`place.html`)
- Formulaire d'informations personnelles (nom, email, téléphone)
- Sélection de la boisson préférée via boutons radio
- Plan de salle interactif :
  - **Zone Alpha** — 6 places (A1–A6)
  - **Zone Beta** — 6 places (B1–B6)
  - **Zone Gamma** — 6 places (C1–C6)
  - Statuts : Disponible / Sélectionné / Occupé
- Validation avant soumission (nom, email et siège requis)
- Confirmation visuelle après réservation
- Tarif : **25 DT / Jour**

## Lancement en local

Ce projet ne nécessite aucun serveur ni dépendance externe. Il peut être ouvert directement dans un navigateur web.

```bash
# Option 1 : ouvrir directement dans le navigateur
open front/login.html

# Option 2 : serveur HTTP local (recommandé)
python -m http.server 8000
# Puis visiter : http://localhost:8000/front/login.html
```

## Design

| Élément       | Valeur                      |
|---------------|-----------------------------|
| Couleur principale | `#f4c430` (or/doré)   |
| Couleur secondaire | `#e0b020` (or foncé)  |
| Fond          | `#f5f5f5` (gris clair)      |
| Police        | Poppins, Arial, sans-serif  |
| Coins arrondis | 20–25px                    |

## Améliorations futures

- [ ] Développer le back-end (API REST, authentification JWT)
- [ ] Connecter les formulaires à une base de données
- [ ] Ajouter un système de gestion des réservations (historique, annulation)
- [ ] Implémenter un vrai système d'authentification
- [ ] Déployer l'application sur un serveur

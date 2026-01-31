# WEB LOUISES REMIM

## Description

Projet de sampler audio réalisé en binôme dans le cadre du cours de Web Technologies M1 Info 2025-2026.

Le projet se compose de trois parties :
- **Backend** : API REST développée avec NestJS et MongoDB pour la gestion des presets
- **Sampler Audio** : Application frontend en vanilla JavaScript utilisant la Web Audio API
- **Interface Angular** : Application de gestion des presets avec Angular et Angular Material

## Lancement du Sampler

1. Ouvrir un terminal et naviguer dans le dossier `./sampler-app`
```bash
npx http-server -p 8080 -c-1
```

2. Ouvrir le navigateur sur http://localhost:8080

**Mode Headless** : Pour tester le moteur audio sans interface graphique, accéder à http://localhost:8080/headless.html

## Lancement de l'app Angular
1. Créer un fichier .env
ajouter avec la bonne URI de la DB
```
MONGO_URI=*****
```

2. Ouvrir un terminal et naviger dans le dossier ./backend
Executer :
```
npm i
npm run start
```

3. Ouvrir un terminal et naviger dans le dossier ./ui
Executer :
```
npm i
npm run start
```
4. Aller sur http://localhost:4200/


## Contributions

### Remi

Dans ce projet j'ai réalisé la partie **Sampler Audio** (frontend vanilla JavaScript).

#### Architecture du Sampler

J'ai développé une architecture modulaire en séparant clairement le moteur audio de l'interface graphique :

- **AudioEngine.js** : Moteur audio isolé utilisant l'API Web Audio. Il gère le chargement des samples, la lecture avec gestion du trim (début/fin), et expose une API simple pour être utilisé avec ou sans interface graphique.

- **PresetService.js** : Service dédié à la communication avec le backend via fetch (requêtes GET). Il récupère la liste des presets et leurs détails depuis l'API REST.

- **main.js** : Contrôleur principal qui fait le lien entre l'interface utilisateur et le moteur audio.

#### Fonctionnalités implémentées

1. **Menu de presets dynamique** : Construction du menu déroulant via une requête fetch GET sur le backend. Les presets sont chargés au démarrage et le menu est peuplé dynamiquement (inspiré de `Seance5/ClientWithDynamicDropDownMenu`).

2. **Filtrage par catégories** : Boutons de catégories générés dynamiquement selon les presets disponibles (drum, kit, synth, fx, etc.). Permet de filtrer les presets affichés dans le menu.

3. **Grille de pads interactive** : Les pads sont générés dynamiquement selon le nombre de samples du preset. Le pad 0 (kick pour un kit de batterie) est positionné en bas à gauche, avec un remplissage de gauche à droite et de bas en haut, conformément au sujet.

4. **Barres de progression animées** : Lors du chargement des samples, chaque pad affiche sa propre barre de progression animée. Une barre de progression globale indique également l'avancement total (ex: "Chargement 3/8...").

5. **Visualisation waveform** : Affichage de la forme d'onde du sample sélectionné sur un canvas, positionné à droite des pads. Les zones de trim sont visualisées avec des zones grisées et des indicateurs visuels rouges (inspiré de `Seance4_IntroWebAudio/Example2`).

6. **Trim des samples** : Interface avec sliders pour ajuster les points de début et de fin de chaque sample. La modification est appliquée en temps réel et visible sur la waveform. Bouton de réinitialisation pour revenir à l'état initial.

7. **Layout en 2 colonnes** : Interface organisée avec les pads à gauche et le panneau waveform/trim à droite, comme dans les exemples du cours.

8. **Mapping clavier** : Les touches A, Z, E, R (ligne du bas) et Q, S, D, F (ligne du haut) sont mappées sur les pads pour jouer les sons au clavier. Chaque pad affiche sa touche associée (inspiré de `Seance4_IntroWebAudio/Assignment/js/SamplerGUI.js`).

9. **Mode Headless** : Page de test (`headless.html`) permettant de tester le moteur audio de manière isolée, sans interface graphique. Toutes les fonctionnalités sont accessibles via des boutons et les résultats s'affichent dans une console intégrée.

#### Technologies utilisées

- **Web Audio API** : Pour la gestion audio (AudioContext, AudioBuffer, AudioBufferSourceNode)
- **Fetch API** : Pour les requêtes HTTP vers le backend
- **Canvas API** : Pour le dessin de la waveform
- **ES6 Modules** : Pour la modularité du code
- **CSS Grid** : Pour le layout responsive en 2 colonnes

#### Structure des fichiers

```
sampler-app/
├── index.html              # Interface principale
├── headless.html           # Mode test sans GUI
├── styles/
│   └── main.css            # Styles personnalisés
└── src/
    ├── main.js             # Contrôleur principal
    ├── engine/
    │   └── AudioEngine.js  # Moteur audio isolé
    └── services/
        └── PresetService.js # Communication avec le backend
```


#### Utilisation de l'IA

J'ai utilisé GitHub Copilot (Claude) pour :
- L'architecture globale du sampler (séparation moteur audio / GUI)
- La structure des classes AudioEngine et PresetService
- Le débogage des problèmes de CORS et de connexion MongoDB
- L'implémentation du dessin de la waveform sur canvas
- La génération du CSS

Le code a été adapté et personnalisé selon les besoins du projet.

### Louise

Dans ce projet j'ai réalisé la partie server et la partie Angular.

Premièrement, pour la partie Server, j'ai utilisé le framework Nest. J'ai pu découvrir ce qu'offrait ce framework afin de persister les données dans une Base de donnée Mongo. J'ai trouvé que les schemas et la validations des données grace aux décorateurs rendaient cette partie beaucoup plus claire et lisible.
```
@Prop({ required: true })
```

Dans cette partie server j'aurais souhaité implémenter une validation de données côté serveur, située immédiatement après la réception des requêtes dans le contrôleur. Cette validation garantit que les données sont conformes, même si la première couche de validation côté Angular venait à être contournée (par exemple via un outil comme Postman ou une modification malveillante du client). Elle permet aussi d'identifier et rejeter les formats invalides avant qu'ils ne sollicitent la logique métier ou la base de données, en renvoyant une erreur claire (souvent une 400 Bad Request) au client. Je n'ai malheureusement pas eu le temps d'ajouter ca masi nous pouvons réaliser cette validation grace au module class validator de Nestjs :
https://docs.nestjs.com/techniques/validation

Dans cette partie server je n'ai pas utilisé l'IA, seulement la complétion de copilot à certains moments.

J'ai aussi développé l'interface utilisateur avec le framework Angular. J'ai rendu mes composants standalone car c'est ce qui est apparement recommandé depuis la version 15 d'angular et qui permet de ne plus déclarer le composant dans un @NgModule. J'ai réalisé le preset.service et les models.

Pour cette interface utilisateur, j'ai utilisé la librairie Angular Material. J'ai réalisé le composants preset-list-component, pour les deux autres qui sont des popup (add-preset-form-component & update-preset-form-component), j'ai demandé à Gemini de me les générer. Gemini à aussi généré tous les fichiers css.
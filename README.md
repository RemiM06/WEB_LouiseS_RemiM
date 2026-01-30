# WEB LOUISES REMIM

## Description

## Lancement du Sampler

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
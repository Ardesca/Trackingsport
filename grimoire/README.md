# Grimoire de Fer

Site de suivi de programme de sport, ambiance vampire noble et voûtes d'ogives (HTML / CSS / JavaScript + petit serveur Node sans dépendance, base de données dans `data.json`).

## Lancer

1. Installer Node.js (version 18 ou plus)
2. Dans ce dossier : `node server.js`
3. Ouvrir http://localhost:3000

## Structure

- **Bestiaire** : base d'exercices (nom, muscle, matériel, notes)
- **Programme** : programme > semaines > séances nommées > exercices > séries.
  Chaque série a son type (Force, Hypertrophie, Échauffement), ses reps et ses kg.
  « Dupliquer cette semaine » copie tout vers une nouvelle semaine avec une augmentation de charge au choix.
- **Suivi** : cocher les séries faites, saisir reps et kg réalisés, voir le record et le volume par exercice
  (les échauffements ne comptent pas dans les records).

Les anciennes données (ancien format) sont converties automatiquement au premier chargement.
Sans serveur, `public/index.html` fonctionne aussi mais sauvegarde dans le navigateur. Export / import JSON en bas de page.

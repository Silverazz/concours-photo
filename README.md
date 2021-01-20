# concours-photo

Projet pour l'UE programmation web à l'Université de Bordeaux.

## Installation du projet
- Build front in `/front` : `ng build --prod`
- Build back in `/back` : `mvn package`, or with intellij `Build/Build Artifact...` > `back:war` > `build`
- Start the project in `/` with `docker-compose up` (or `docker-compose up --force-recreate --build` to update the containers)
- To reset the database, add `--renew-anon-volumes` in the docker-compose command.
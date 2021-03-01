docker rm -f $(docker ps -aq)
docker network rm $(docker network ls -q)
docker image rm $(docker image ls -q)
docker-compose up --build --remove-orphans
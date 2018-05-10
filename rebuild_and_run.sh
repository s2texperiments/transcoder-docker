docker stop s2t
docker rm s2t
docker build . -t s2t/transcoder
docker run -p 8080:8080 --name s2t s2t/transcoder

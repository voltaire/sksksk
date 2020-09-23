FROM openjdk:8-alpine
EXPOSE 25565

ADD start /srv/mc/run
RUN chmod +x /srv/mc/run

ADD https://dynmap.us/builds/dynmap/Dynmap-3.1-beta4-spigot.jar /srv/mc/plugins/dynmap.jar

# install spigot
ADD https://papermc.io/api/v1/paper/1.16.3/204/download /srv/mc/paper.jar

RUN echo "eula=true" > /srv/mc/eula.txt

WORKDIR /srv/mc/
CMD ["/srv/mc/run"]
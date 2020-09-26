FROM amazoncorretto:11-alpine
EXPOSE 25565
EXPOSE 8123

ADD https://dynmap.us/builds/dynmap/Dynmap-3.1-SNAPSHOT-spigot.jar /srv/mc/plugins/dynmap.jar

# install spigot
ADD https://papermc.io/api/v1/paper/1.16.3/204/download /srv/mc/paper.jar

RUN echo "eula=true" > /srv/mc/eula.txt
ADD ops.json /srv/mc/ops.json

ADD start /srv/mc/run
RUN chmod +x /srv/mc/run

ADD server.properties /srv/mc/server.properties
ADD dynmap.txt /srv/mc/plugins/dynmap/configuration.txt

WORKDIR /srv/mc/
ENTRYPOINT ["/bin/sh", "/srv/mc/run"]
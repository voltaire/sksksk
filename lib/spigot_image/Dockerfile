FROM anapsix/alpine-java
EXPOSE 25565

RUN apk add --update-cache git

ADD start /service/spigot/run
RUN chmod +x /service/spigot/run

ADD https://dynmap.us/releases/Dynmap-3.1-beta-3a-spigot.jar /srv/spigot/plugins/dynmap.jar

# install spigot
ADD https://hub.spigotmc.org/jenkins/job/BuildTools/lastSuccessfulBuild/artifact/target/BuildTools.jar /srv/spigot/BuildTools.jar

WORKDIR /srv/spigot/
RUN java -Xmx1024M -jar /srv/spigot/BuildTools.jar --rev 1.16.3
RUN echo "eula=true" > /srv/spigot/eula.txt

CMD ["/service/spigot/run", "1.16.3"]
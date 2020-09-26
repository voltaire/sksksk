FROM centos:7

VOLUME /output

RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

ADD https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip /root/awscli.zip
RUN yum install -y unzip && unzip /root/awscli.zip && ./aws/install

ADD https://overviewer.org/rpms/overviewer.repo /etc/yum.repos.d/overviewer.repo
RUN yum install -y Minecraft-Overviewer
ADD https://overviewer.org/textures/1.16.3 /root/.minecraft/versions/1.16.3/1.16.3.jar

ADD wrapper.sh /wrapper
RUN chmod +x /wrapper
ADD overviewer_cfg.py /overviewer_cfg.py

CMD ["/bin/bash", "/wrapper"]
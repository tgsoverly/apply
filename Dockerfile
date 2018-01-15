FROM mhart/alpine-node:6.2

ENV LANG en_US.UTF-8

WORKDIR /srv/apply
EXPOSE 8080

ADD app.js /srv/apply/
ADD package.json /srv/apply/
ADD npm-shrinkwrap.json /srv/apply/
RUN cd /srv/apply/ && npm install
ADD lib /srv/apply/lib/

ENTRYPOINT ["/usr/bin/node", "/srv/apply/app.js"]
FROM node:5.4
MAINTAINER LeReunionais

EXPOSE 3020
EXPOSE 3021

RUN apt-get update
RUN apt-get install libtool -y
RUN apt-get install pkg-config -y
RUN apt-get install build-essential -y
RUN apt-get install autoconf -y
RUN apt-get install automake -y
RUN apt-get install libsodium-dev -y

ADD /zmq /temp
WORKDIR /temp
RUN tar -xzf zeromq-4.1.4.tar.gz
WORKDIR /temp/zeromq-4.1.4
RUN ./configure
RUN make
RUN make install
RUN ldconfig

WORKDIR /blog

ADD package.json /blog/package.json
RUN npm install

ADD . /blog

CMD npm start

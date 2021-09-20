FROM node:12-alpine

LABEL org.opencontainers.image.source https://github.com/pingjs/agent

WORKDIR /opt/app

ENV DOCKER true
ENV LANG en_US.UTF-8
ENV TZ Asia/Shanghai
ENV PORT 8080

COPY package.json .
COPY yarn.lock .

RUN apk add curl \
    && yarn install --production \
    && yarn cache clean \
    && rm -rf /opt/yarn-v*

COPY . .

EXPOSE 8080
CMD [ "node", "production.js" ]
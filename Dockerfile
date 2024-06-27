FROM node:20.11.1-alpine3.19  as build

WORKDIR /usr/src/app

COPY . .

RUN apk upgrade --update && apk --no-cache add git

RUN NODE_OPTIONS=--openssl-legacy-provider

RUN NODE_OPTIONS="--max-old-space-size=4096" npm install --legacy-peer-deps

RUN NODE_OPTIONS=--openssl-legacy-provider

RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

FROM nginx:1.25.3-alpine3.18-slim

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY --from=build /usr/src/app/conf/inject.template.js /usr/share/nginx/html/inject.template.js
COPY --from=build /usr/src/app/conf/nginx.conf /etc/nginx/conf.d/configfile.template
COPY --from=build /usr/src/app/conf/entrypoint.sh /

ENV PORT 80

ENV HOST 0.0.0.0

RUN sh -c "envsubst '\$PORT'  < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

EXPOSE 80

RUN chmod +x /entrypoint.sh
ENTRYPOINT [ "sh", "/entrypoint.sh" ]

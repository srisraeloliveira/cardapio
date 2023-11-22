# # Build stage
# FROM node:18.18-alpine3.17 AS build
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --production && \
#     npm cache clean --force && \
#     rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/* /var/cache/apk/* /root/.npm /root/.node-gyp
# COPY . .
# # RUN npm run build  # Replace with your build command if needed

# # Production stage
# FROM node:18.18-alpine3.17
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app .
# EXPOSE 3000
FROM node:18.18-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package*.json server.js ./
RUN npm install --production && \
    npm cache clean --force && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/* /var/cache/apk/* /root/.npm /root/.node-gyp && \
    rm -f server1.js serverBlob.js .gitignore .dockerignore Dockerfile
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]


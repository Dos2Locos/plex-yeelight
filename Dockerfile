FROM node:10

# Define environment variables
#  required
ENV PLAYER_UUID=<your-player-uuid>
ENV LIGHT_IP=<your-yeelight-ip>
#  optional
ENV LIGHT_PORT=55443

# 1 = Color temperature, 2 = RGB
ENV PLAY_MODE=2
ENV PLAY_CT=6500
ENV PLAY_RGB="[20,20,50]"
ENV PLAY_BRIGHT=50
ENV PAUSE_MODE=1
ENV PAUSE_CT=1700
ENV PAUSE_RGB="[255,255,255]"
ENV PAUSE_BRIGHT=50
ENV STOP_MODE=1
ENV STOP_CT=6500
ENV STOP_RGB="[255,255,255]"
ENV STOP_BRIGHT=100

ENV LATITUDE=40.416936
ENV LONGITUDE=-3.703529

ENV TZ=Europe/Madrid

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 12000
CMD [ "node", "server.js" ]
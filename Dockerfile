# Download base Image
FROM node:24.19.0 

# creat Working Dir
WORKDIR /app

# copy package.json to working app
COPY package.json /app/

# Run install npm 
RUN npm install

# copy sorce code like index.js to container
COPY . .

# decomntation port app running on it 
# use run command < docker run -d -p 4000:4000 to make app working on this port
EXPOSE 4000

# command to run app is store in package.json in scripts 
CMD [ "npm", "start" ]
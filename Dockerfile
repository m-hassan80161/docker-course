# Download base Image
FROM node:latest AS base

WORKDIR /app

# copy package.json to working app
COPY package.json /app


# copy sorce code like index.js to container
COPY . .

# decomntation port app running on it 
# use run command < docker run -d -p 4000:4000 to make app working on this port
EXPOSE 4000



FROM base AS development

# Run install npm 
RUN npm install 


# command to run app is store in package.json in scripts 

CMD [ "npm", "run", "start-dev" ]

FROM base AS production


# Run install npm 
RUN npm install --only=production

# command to run app is store in package.json in scripts 
CMD [ "npm", "start" ]

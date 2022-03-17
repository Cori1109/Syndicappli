# Declare our base image
FROM node:11-alpine

# Set Node environment
ENV NODE_ENV production

# Create working app directory
RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

# Set Working app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker caching mechanism
COPY package*.json ./

# Use the predefined non-root node user
USER node

# Install production dependencies
RUN npm set progress false && npm install --only=production --loglevel warn

# Bundle app source as the non-root node user
COPY --chown=node:node . .

# Expose port
EXPOSE 4000
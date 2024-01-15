# File Name: Dockerfile
# Author: Alexandre Kévin De Freitas Martins
# Creation Date: 2024
# Description: Dockerfile for the frontend of the application
#
# Copyright (c) 2024 Tux Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the 'Software'), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

########################
# BUILD FOR PRODUCTION #
########################

# Build stage
FROM node:latest as build-stage

# Create app directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN yarn install

# Bundle app source
COPY . .

# Build app
RUN yarn run build

########################
#      PRODUCTION      #
########################

# Production stage
FROM node:latest as production-stage

# Copy build from build-stage
COPY --from=build-stage /usr/src/app/dist /app/

# Set workdir
WORKDIR /app

# Expose port
EXPOSE 8080

# Run serve
CMD ["node", "server.js"]

# Use an official Node.js runtime as a parent image
FROM node:16 as builder

# Set the working directory to /app
WORKDIR /app

# Bundle app source
COPY . .

# Install any needed packages
ARG CACHE_BUST=1
RUN npm install

# Build the app
RUN npm run build --verbose

# Use a lightweight Nginx image to serve the app
FROM nginx:1.21.3-alpine

# Copy the built app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the nginx config file
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
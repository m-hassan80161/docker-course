# Use the official Nginx base image
FROM nginx:alpine

# Remove default configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration into the container
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
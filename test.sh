#!/bin/bash

# Start the dependent services in detached mode
docker-compose up -d kafka mongodb

# Define a function to check the health of a service
check_health() {
    service_name="$1"
    max_retries=10
    retries=0
    until docker-compose ps "$service_name" | grep "healthy"; do
        if [ "$retries" -ge "$max_retries" ]; then
            echo "Health check for $service_name failed after $max_retries retries."
            docker-compose down
            exit 1
        fi
        echo "Waiting for $service_name to become healthy..."
        sleep 5
        retries=$((retries+1))
    done
    echo "$service_name is healthy."
}

# Check the health of dependent services
check_health kafka
check_health mongodb

# Start the remaining services
docker-compose up -d your_service

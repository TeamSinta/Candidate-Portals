#!/bin/bash

DB_CONTAINER_NAME="demo-postgres"
DB_NAME="sinta-candidate-portals"
DB_USER="postgres"
DB_PORT="5432"
ENV_FILE=".env"

# Check for Docker installation
if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Load existing .env variables if they exist
if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

# Check or generate DB_PASSWORD
if [[ -z "$DB_PASSWORD" || "$DB_PASSWORD" == "password" ]]; then
  echo "Generating a new random database password..."
  DB_PASSWORD=$(openssl rand -base64 12)

  # Update DATABASE_URL in .env or create it if not present
  NEW_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
  
  if grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    # Update the DATABASE_URL line
    sed -i -E "s|^DATABASE_URL=.*|DATABASE_URL=$NEW_DATABASE_URL|" "$ENV_FILE"
  else
    # Append DATABASE_URL if it doesn’t exist
    echo "DATABASE_URL=$NEW_DATABASE_URL" >> "$ENV_FILE"
  fi

  # Also add DB_PASSWORD to .env if needed for consistency
  if grep -q "^DB_PASSWORD=" "$ENV_FILE"; then
    sed -i -E "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" "$ENV_FILE"
  else
    echo "DB_PASSWORD=$DB_PASSWORD" >> "$ENV_FILE"
  fi
else
  # Construct DATABASE_URL from existing DB_PASSWORD
  NEW_DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}"
  if ! grep -q "^DATABASE_URL=" "$ENV_FILE"; then
    echo "DATABASE_URL=$NEW_DATABASE_URL" >> "$ENV_FILE"
  fi
fi

echo "Updated .env with the new DATABASE_URL and DB_PASSWORD."

# Start or create the Docker container
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  docker start $DB_CONTAINER_NAME
  echo "Database container started."
else
  docker run --name $DB_CONTAINER_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=$DB_NAME -d -p $DB_PORT:5432 postgres
  echo "Database container created with name: $DB_CONTAINER_NAME"
fi

# Display the updated DATABASE_URL for verification
echo "Your new DATABASE_URL is: $(grep DATABASE_URL "$ENV_FILE")"

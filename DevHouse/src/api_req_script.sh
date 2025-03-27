#!/bin/bash

# Base URL (fixed for all requests)
BASE_URL="http://localhost:3333"

# Function to read user input
read_input() {
    read -p "$1" input
    echo $input
}

# Request Method (e.g., POST, GET)
METHOD=$(read_input "Enter request method (POST, GET, etc.): ")

# API Endpoint (you only enter the endpoint part)
ENDPOINT=$(read_input "Enter API endpoint (e.g., /api/login): ")

# Combine base URL with the endpoint
URL="$BASE_URL$ENDPOINT"

# If it's POST or PUT, we ask for data
if [[ "$METHOD" == "POST" ]] || [[ "$METHOD" == "PUT" ]]; then
    DATA=$(read_input "Enter JSON data (leave empty for none): ")
fi

# Print the details before executing the request
echo -e "\n--- Request Details ---"
echo "Method: $METHOD"
echo "Full URL: $URL"
echo "Data: $DATA"
echo "------------------------"

# Construct the curl command
CURL_COMMAND="curl -X $METHOD \"$URL\""

# Add headers for JSON
CURL_COMMAND="$CURL_COMMAND -H \"Content-Type: application/json\""

# Add data if POST or PUT
if [[ -n "$DATA" ]]; then
    CURL_COMMAND="$CURL_COMMAND -d '$DATA'"
fi

# Execute the curl command
echo -e "\nExecuting request...\n"
eval "$CURL_COMMAND | jq"

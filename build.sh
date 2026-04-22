#!/bin/bash

# Exit on error
set -e

# Define registry prefix. Defaults to 'srtechops' if no argument is provided.
REGISTRY=${1:-"srtechops"}

echo "Using registry prefix: $REGISTRY"
echo "Creating/starting multi-arch builder..."

# Create a new builder if it doesn't exist
if ! docker buildx ls | grep -q "multiarch-builder"; then
  echo "Creating new builder 'multiarch-builder'..."
  docker buildx create --name multiarch-builder --use
else
  echo "Using existing 'multiarch-builder'..."
  docker buildx use multiarch-builder
fi

# Ensure the builder is running
docker buildx inspect --bootstrap

echo ""
echo "=========================================="
echo "Building Backend (linux/amd64, linux/arm64)"
echo "=========================================="
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "${REGISTRY}/three-tier-k8s-project:backend-latest" \
  --push \
  ./backend

echo ""
echo "=========================================="
echo "Building Frontend (linux/amd64, linux/arm64)"
echo "=========================================="
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t "${REGISTRY}/three-tier-k8s-project:frontend-latest" \
  --push \
  ./frontend

echo ""
echo "=========================================="
echo "Build and push successful!"
echo "Images Published to Registry:"
echo " - ${REGISTRY}/three-tier-k8s-project:backend-latest"
echo " - ${REGISTRY}/three-tier-k8s-project:frontend-latest"
echo "=========================================="

#!/bin/bash

set -e # Exit on any error

# Get the root directory
REPO_ROOT="$(git rev-parse --show-toplevel)"

# Read current version from package.json
CURRENT_VERSION=$(jq -r '.version' "$REPO_ROOT/package.json")

echo "========================================="
echo "NPM Package Publishing Script"
echo "========================================="
echo "Current version: $CURRENT_VERSION"
echo ""

# Check if user is logged in to npm
if ! npm whoami &>/dev/null; then
    echo "Error: You are not logged in to npm"
    echo "Please run: npm login"
    exit 1
fi

echo "Logged in as: $(npm whoami)"
echo ""

# Confirm publication
read -p "Do you want to publish version $CURRENT_VERSION to npm? [y/N]: " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 0
fi

# Publish to npm (prepublishOnly will run build:lib automatically)
echo ""
echo "Publishing to npm..."
npm publish --access public

echo ""
echo "========================================="
echo "✓ Successfully published v$CURRENT_VERSION to npm!"
echo "========================================="
echo ""
echo "View your package at:"
echo "https://www.npmjs.com/package/$(jq -r '.name' "$REPO_ROOT/package.json")"

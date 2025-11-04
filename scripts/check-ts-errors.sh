#!/bin/bash

# Script to check for TypeScript errors using npx tsc
# This script will run TypeScript compiler in noEmit mode to catch errors without generating files

echo "🔍 Checking for TypeScript errors..."

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Warning: node_modules not found. Installing dependencies..."
    npm install
fi

# Run TypeScript compiler
echo "📝 Running TypeScript compiler..."
npx tsc --noEmit --skipLibCheck

# Check the exit code
if [ $? -eq 0 ]; then
    echo "✅ No TypeScript errors found!"
else
    echo "❌ TypeScript errors detected. Please review the output above."
    exit 1
fi

echo "✅ TypeScript check completed successfully."
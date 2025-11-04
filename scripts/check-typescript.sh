#!/bin/bash

# Comprehensive TypeScript Error Checking Script
# This script helps find TypeScript errors using npx tsc with various options

set -e  # Exit on any error

echo "🔍 TypeScript Error Checker"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  Warning: node_modules not found. Installing dependencies...${NC}"
    npm install
fi

# Function to check TypeScript errors
check_ts_errors() {
    local check_name="$1"
    local ts_args="$2"
    
    echo -e "\n${BLUE}📝 Running: $check_name${NC}"
    echo "Command: npx tsc $ts_args"
    
    if npx tsc $ts_args; then
        echo -e "${GREEN}✅ $check_name: No errors found!${NC}"
        return 0
    else
        echo -e "${RED}❌ $check_name: Errors detected${NC}"
        return 1
    fi
}

# Function to check specific file patterns
check_specific_files() {
    local pattern="$1"
    local check_name="$2"
    
    echo -e "\n${BLUE}📁 Checking: $check_name${NC}"
    
    # Find TypeScript files matching the pattern, excluding gitignored files
    files=$(find . -name "*.ts" -o -name "*.tsx" | grep -E "$pattern" | while read -r file; do if ! git check-ignore --quiet "$file" 2>/dev/null; then echo "$file"; fi; done)
    
    if [ -z "$files" ]; then
        echo -e "${YELLOW}⚠️  No files found matching pattern: $pattern${NC}"
        return 0
    fi
    
    echo "Files to check:"
    echo "$files" | while read -r file; do
        echo "  - $file"
    done
    
    # Run TypeScript check on specific files
    if npx tsc --noEmit --skipLibCheck $files; then
        echo -e "${GREEN}✅ $check_name: No errors found!${NC}"
        return 0
    else
        echo -e "${RED}❌ $check_name: Errors detected${NC}"
        return 1
    fi
}

# Main checks
echo -e "\n${BLUE}🚀 Starting comprehensive TypeScript checks...${NC}"

# Check 1: Basic TypeScript compilation (no emit)
check_ts_errors "Basic TypeScript Check" "--noEmit --skipLibCheck"

# Check 2: Strict mode check
check_ts_errors "Strict Mode Check" "--noEmit --skipLibCheck --strict"

# Check 3: Check only API routes
check_specific_files "api/" "API Routes"

# Check 4: Check only components
check_specific_files "components/" "Components"

# Check 5: Check only services
check_specific_files "services/" "Services"

# Check 6: Check only hooks
check_specific_files "hooks/" "Hooks"

# Check 7: Check only utils
check_specific_files "utils/" "Utils"

# Summary
echo -e "\n${BLUE}📊 Summary${NC}"
echo "============"

# Count total errors (this is a simplified approach)
echo -e "\n${BLUE}💡 Quick Tips:${NC}"
echo "• Run './scripts/check-ts-errors.sh' for a quick check"
echo "• Run './scripts/check-typescript.sh' for comprehensive checks"
echo "• Use 'npx tsc --noEmit' to check without generating files"
echo "• Use 'npx tsc --noEmit --strict' for strict mode checking"
echo "• Add '--incremental' for faster subsequent checks"

echo -e "\n${GREEN}✅ TypeScript checking completed!${NC}"
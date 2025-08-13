#!/bin/bash

# VeteranLawAI Platform Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 Starting VeteranLawAI Platform Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git first."
        exit 1
    fi
    
    print_success "All dependencies are available"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    if npm run test:coverage; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Please fix the issues before deploying."
        exit 1
    fi
}

# Lint and format code
lint_and_format() {
    print_status "Linting and formatting code..."
    
    if npm run lint:fix; then
        print_success "Code linting completed"
    else
        print_warning "Linting issues found. Please review and fix them."
    fi
    
    if npm run format; then
        print_success "Code formatting completed"
    else
        print_warning "Formatting issues found. Please review and fix them."
    fi
}

# Build the application
build_application() {
    print_status "Building application..."
    
    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed. Please check the error messages."
        exit 1
    fi
}

# Check build output
check_build() {
    print_status "Checking build output..."
    
    if [ -d "dist" ]; then
        print_success "Build output directory 'dist' created"
        
        # Check if key files exist
        if [ -f "dist/index.html" ]; then
            print_success "Main HTML file found"
        else
            print_error "Main HTML file not found in build output"
            exit 1
        fi
        
        # Check build size
        BUILD_SIZE=$(du -sh dist | cut -f1)
        print_status "Build size: $BUILD_SIZE"
        
    else
        print_error "Build output directory 'dist' not found"
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_warning "Not logged in to Vercel. Please log in first."
        vercel login
    fi
    
    # Deploy
    if vercel --prod; then
        print_success "Deployment completed successfully!"
    else
        print_error "Deployment failed. Please check the error messages."
        exit 1
    fi
}

# Update deployment info
update_deployment_info() {
    print_status "Updating deployment information..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep "veteranlawai" | head -1 | awk '{print $2}')
    
    if [ ! -z "$DEPLOYMENT_URL" ]; then
        print_success "Deployment URL: $DEPLOYMENT_URL"
        
        # Update README with deployment info
        echo "" >> README.md
        echo "## 🌐 Live Deployment" >> README.md
        echo "" >> README.md
        echo "**Latest Deployment:** $(date)" >> README.md
        echo "**URL:** $DEPLOYMENT_URL" >> README.md
        echo "**Status:** ✅ Live" >> README.md
        
        print_success "Deployment information updated in README"
    else
        print_warning "Could not retrieve deployment URL"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check current git status
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes detected. Please commit or stash them before deploying."
        git status --short
        read -p "Continue with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "Current branch: $CURRENT_BRANCH"
    
    # Check if we're on main/master branch
    if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
        print_warning "Not on main/master branch. Consider switching to main for production deployment."
        read -p "Continue with deployment from $CURRENT_BRANCH? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_status "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    # Run deployment steps
    check_dependencies
    install_dependencies
    run_tests
    lint_and_format
    build_application
    check_build
    deploy_to_vercel
    update_deployment_info
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Your VeteranLawAI Platform is now live!"
    
    # Show next steps
    echo ""
    echo "📋 Next Steps:"
    echo "1. Test the deployed application"
    echo "2. Monitor for any issues"
    echo "3. Update documentation if needed"
    echo "4. Share the deployment URL with your team"
    echo ""
}

# Run main function
main "$@"

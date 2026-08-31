This project is designed to practice a complete DevOps workflow using GitHub Actions, Terraform, Azure Web Apps and Node.js.

The application is a simple web portal that presents notes from my technical learning journey.

When changes are pushed to GitHub, the CI pipeline runs automated checks such as code linting, unit tests, Markdown validation and spelling checks.

After changes are reviewed and merged into the main branch, the application is automatically deployed to a staging environment. Production deployment is triggered through a release tag or manual approval.

The Azure infrastructure, including the App Service Plan, Web App, staging slot and monitoring resources, is provisioned and managed using Terraform.

## Tech Stack

- Node.js
- Markdown
- Terraform
- Azure App Service
- GitHub Actions
- Docker
- Azure Container Registry
- Kubernetes and Helm

## ✅ Version 1

Completed

- Node.js documentation platform
- Terraform infrastructure
- Azure App Service deployment
- Live Azure website

## ✅ Version 2

### CI/CD with GitHub Actions

The goal of Version 2 is to automate application validation and deployment using GitHub Actions.

### CI

When code is pushed to GitHub, a CI workflow will run automatically.

The pipeline will:

- Install Node.js dependencies
- Run Node.js checks and tests
- Validate Markdown files
- Run spelling checks
- Package the application as a ZIP artifact

If any validation step fails, the pipeline should stop and the application should not be deployed.

### CD

The deployment workflow will only run after the CI pipeline has completed successfully.

The pipeline will:

- Retrieve the application artifact produced by CI
- Authenticate with Azure
- Deploy the application to Azure App Service
- Verify that the deployment completes successfully

### Target Workflow

Code Change
    ↓
Git Push
    ↓
GitHub Actions
    ↓
CI
├── Install dependencies
├── Node.js checks
├── Markdown validation
├── Spelling checks
└── Package application
    ↓
CI Passed
    ↓
CD
    ↓
Deploy to Azure App Service

## ✅ Version 3

Dockerize the application

- Create a Dockerfile for the Node.js application
- Create a `.dockerignore` file
- Build and run the Docker image locally
- Add Docker image build validation to the CI pipeline

## Version 4 - future improvement

Container-based deployment

- Push the Docker image to Azure Container Registry (ACR)
- Deploy the containerized application to Azure

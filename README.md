This project is designed to practice a complete DevOps workflow using GitHub Actions, Terraform, Azure Web Apps and Node.js.

The application is a simple web portal that presents notes from my technical learning journey.

When changes are pushed to GitHub, the CI pipeline runs automated checks such as code linting, unit tests, Markdown validation and spelling checks.

After changes are reviewed and merged into the main branch, the application is automatically deployed to a staging environment. Production deployment is triggered through a release tag or manual approval.

The Azure infrastructure, including the App Service Plan, Web App, staging slot and monitoring resources, is provisioned and managed using Terraform.

## Tech Stack

- Node.js
- GitHub Actions
- Terraform
- Azure App Service
- Azure Deployment Slots
- Application Insights
- Markdown

Version 1
Azure Web App deployment

Version 2
Dockerize the application

Version 3
Push image to Azure Container Registry

Version 4
Deploy to AKS with Helm
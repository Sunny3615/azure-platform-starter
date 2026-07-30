# What confused me

When I first started learning Azure App Service, I found the relationship between App Service, App Service Plan, Web App, and Virtual Machines confusing. Specifically, I was cofused:
- What exactly is an App Service Plan? Isn't it fully managed by Microsoft?
- ❌ When I first learned about App Service and Web App, I thought they had a parent-child relationship, similar to Virtual Network and Subnet.

# What I learned

## Basic Concepts

### VM (resource)
A Virtual Machine (VM) is an Infrastructure as a Service (IaaS) resource that provides full control over the operating system, networking, storage, and installed software.

With a VM, you are responsible for:
- Operating system updates
- Runtime installation
- Network configuration
- Security patches
- Application deployment

### Azure App service（service）
Azure App Service is a fully managed Platform-as-a-Service (PaaS) that allows you to build, deploy, and scale web applications, mobile backends, and RESTful APIs without managing the underlying servers or infrastructure.
> Azure manages the operating system, runtime, scaling, load balancing, and security patches.

### App service plan (resource)
An App Service Plan defines the compute resources used by one or more Web Apps.

It determines:

- Region
- Operating System
- Pricing Tier
- CPU
- Memory

### Web App (resource)
A Web App is an Azure resource that runs your web application on the Azure App Service platform.
A Web App contains your application code. 
For example:
- Node.js
- Java
- Python
- .NET

### SKU（Stock Keeping Unit）
SKU defines the pricing tier and available resources of an App Service Plan.
It determines CPU, memory, features, cost
Examples include:
- Free (F1)
- Basic (B1)
- Standard (S1)
- Premium (P1V3)

## Relationship

Azure App Service is a service, not an Azure resource.
It provides the platform on which Web Apps run.

```
Azure App Service (PaaS)
│
├── App Service Plan
│        │
│        └── Provides compute resources
│
└── Web App
         │
         └── Runs on an App Service Plan
```
Azure App Service is a service, not a resource.
When deploying applications, you create resources such as:
- App Service Plan
- Web App
instead of creating an "App Service" resource directly.


# What Do You Actually Create?
## VM

| Configuration | Purpose |
|--------------|---------|
| Region | Determines where the VM is deployed |
| VM Size | Defines the CPU and memory allocated to the VM |
| Operating System | Selects the OS (Linux or Windows) |
| Username / Password | Credentials used to access the VM |
| Virtual Network | Connects the VM to a virtual network |
| Subnet | Specifies which subnet the VM belongs to |
| Public IP | Allows Internet access to the VM (optional) |
| Network Security Group (NSG) | Controls inbound and outbound network traffic |
| Disk | Defines the OS disk and any additional data disks |
| Availability Options | Improves availability using Availability Sets or Availability Zones |

then you will get:
```
Azure VM
│
├── Ubuntu
├── IP
├── Disk
└── SSH
```
> You can connect to the VM using SSH (Linux) or RDP (Windows), install software, configure the operating system, and manage the server yourself.

## App service plan
| Configuration                         | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| Name                                  | The name of the App Service Plan                     |
| Region                                | Determines where the compute resources are located   |
| Operating System                      | Linux or Windows                                     |
| Pricing Tier (SKU)                    | Defines the CPU, memory, and available features      |
| Zone Redundancy (supported SKUs only) | Provides high availability across Availability Zones |
> Unlike a Virtual Machine, Azure manages the underlying infrastructure for an App Service Plan.

## Web App
| Configuration    | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| Subscription     | The Azure subscription that owns the resource                       |
| Resource Group   | The resource group where the Web App is created                     |
| Web App Name     | The name of the application                                         |
| Publish          | Deploy code directly or use a Docker container                      |
| Runtime Stack    | Selects the application runtime (Node.js, Python, Java, .NET, etc.) |
| Operating System | Linux or Windows (must match the App Service Plan)                  |
| Region           | The Azure region (must match the App Service Plan)                  |
| App Service Plan | Specifies which App Service Plan hosts the Web App                  |
> A Web App cannot exist without an App Service Plan.

# Summary

```
                    Azure App Service
                   (PaaS Platform)
                           │
          ┌────────────────┴────────────────┐
          │                                 │
   App Service Plan                  Web App
 (CPU / Memory / Region)        (Application Code)
          │
          └────────────── Hosts ─────────────┘
```

| Resource | Responsibility |
|----------|----------------|
| Virtual Machine | Provides a complete server that you manage. |
| App Service Plan | Provides the compute resources for hosting one or more Web Apps. |
| Web App | Hosts your application code and runs on an App Service Plan. |

A Virtual Machine gives you full control over the operating system and infrastructure.

An App Service Plan provides managed compute resources, while a Web App contains your application code. Azure manages the underlying infrastructure, allowing you to focus on building and deploying your application.
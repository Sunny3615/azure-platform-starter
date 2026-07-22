# What confused me

When I first learned Microsoft Entra ID, I was confused about the relationship between these concepts:

- Authentication
- Authorization
- Microsoft Entra ID
- Security Groups
- Azure RBAC

I wondered:
> Does Entra ID handle authentication?
> Are security groups responsible for authorization?
> Where does Azure RBAC fit into the whole process?

# What I learned

## What is authentication

Authentication verifies a user's identity.

It answers the question:

> Who are you?

## What is entra ID?
Microsoft Entra ID is Microsoft's cloud identity and access management (IAM) service.

It is responsible for authenticating users and managing identities.

## What is authorization
Authorization determines what an authenticated user is allowed to do.

It answers the question:

> What are you allowed to do?

## What is RBAC?
Azure RBAC is responsible for assigning permissions to users or groups.

## What is security groups?

A Security Group is an object in Microsoft Entra ID.

```
Microsoft Entra ID
│
├── Users
├── Groups  ← Security Groups belong to here
├── Applications
├── Enterprise Applications
├── Service Principals
└── Devices
```

In other words:

Authentication → Microsoft Entra ID

Identity Management → Microsoft Entra ID Groups

Authorization → Azure RBAC

## Example

For example, Alice joins a new company as a DevOps Engineer. One of her responsibilities is managing a resource group in Azure.

### Step 1 - create the user

The IT administrator first creates Alice's account in Microsoft Entra ID.

At this point:
> she has an identity
> she can sign in to Microsoft services
> BUT, she still can't access any azure resources

### Step 2 – Add Alice to a Security Group

Since Alice is a member of the DevOps team, the administrator adds her to the DevOps Security Group.

```
Microsoft Entra ID

DevOps Security Group
├── Bob
├── Charlie
└── Alice
```

### Step 3 – Assign an Azure Role (One-time setup)
> This step is not necessary for Alice if the DevOps Security Group was already assigned the Contributor role when Bob or Charlie joined the company.
> Once Alice is added to the DevOps Security Group, she automatically inherits the same permissions.

Next, the administrator creates an Azure RBAC role assignment.

```
Resource Group: Production-RG
Role: Contributor
Assigned to: DevOps Security Group
```

Instead of assigning the Contributor role to Alice directly, the administrator assigns it to the DevOps Security Group.

This makes permission management much easier because every new DevOps engineer only needs to be added to the group.


### Step 4 – Alice signs in

When Alice signs in to the Azure Portal:

1. Microsoft Entra ID authenticates Alice's identity.
2. Azure checks which Security Groups Alice belongs to.
3. Azure RBAC finds that the DevOps Security Group has the Contributor role on the resource group.
4. Alice is granted permission to manage the resource group.

```
Step 1
Create User
        │
        ▼
Authentication
        │
        ▼
Step 2
Join DevOps Security Group
        │
        ▼
Identity Organization
        │
        ▼
Step 3
RBAC Role Assignment
        │
        ▼
Authorization
        │
        ▼
Step 4
Access Azure Resource
```

# In summary

Microsoft Entra ID is responsible for authentication and identity management.
Security Groups are used to organize users.
Azure RBAC is responsible for authorization by assigning permissions to users or groups.
Together, they provide a way to manage access in Azure.
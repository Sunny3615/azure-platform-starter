# Active Directory vs Microsoft Entra ID

## What confused me

When I first started learning Microsoft Entra ID, I couldn't understand why Active Directory (AD DS) still existed.

I kept asking myself:

- If Microsoft Entra ID manages users, why do companies still use Active Directory?
- When a new employee joins a company, where is their account actually created?
- Which service authenticates them when they log in to their computer?
- What about Teams, Outlook, or Azure Portal?

After learning more about enterprise identity management, I realized that Active Directory and Microsoft Entra ID solve different problems.

---

## What I learned

### What is Active Directory Domain Services (AD DS)?

Active Directory Domain Services (AD DS) is Microsoft's on-premises directory service.

It is mainly responsible for managing identities, computers, and policies inside a company's internal network.

Typical responsibilities include:

- Windows domain login
- Managing company computers
- Group Policy
- Shared folders
- Internal servers

Traditionally, employees logged into their Windows computers using Active Directory.

---

### What is Microsoft Entra ID?

Microsoft Entra ID is Microsoft's cloud-based Identity and Access Management (IAM) service.

It is responsible for authenticating users and providing access to cloud services such as:

- Microsoft 365
- Teams
- Outlook
- Azure Portal
- Azure resources
- Third-party SaaS applications

Unlike AD DS, Entra ID is designed for cloud environments.

---

## A New Employee Example

Suppose Bob joins a traditional company ABC today.

His IT administrator needs to prepare:

- a company account
- an email address
- Microsoft Teams
- Outlook
- a company laptop

Let's see how Active Directory and Microsoft Entra ID work together.

---

### Step 1 — Create Bob's account

In many traditional companies such as ABC, Bob's account is first created in Active Directory.

```text
Active Directory

Users
└── Bob
```

Many companies then synchronize this account to Microsoft Entra ID using Azure AD Connect or Cloud Sync.

```text
Active Directory
        │
        ▼
Azure AD Connect
        │
        ▼
Microsoft Entra ID
```

As a result, Bob has one company identity that exists both on-premises and in the cloud.

---

### Step 2 — Bob logs into his computer

There are two common scenarios.

#### Traditional Domain-Joined Computer

If Bob's laptop is joined to the company's Windows domain,

```text
Bob
    │
    ▼
Windows Login
    │
    ▼
Active Directory
```

Active Directory authenticates Bob.

---

#### Microsoft Entra ID Joined Computer

If the company uses modern cloud management,

```text
Bob
    │
    ▼
Windows Login
    │
    ▼
Microsoft Entra ID
```

Microsoft Entra ID authenticates Bob instead.

---

### Step 3 — Bob opens Microsoft Teams

When Bob opens Teams,

```text
Teams
    │
    ▼
Microsoft Entra ID
    │
    ▼
Authentication
```

Teams trusts Microsoft Entra ID to verify Bob's identity.

---

### Step 4 — Bob opens Outlook

The process is almost the same.

```text
Outlook
    │
    ▼
Microsoft Entra ID
    │
    ▼
Authentication
```

---

### Step 5 — Bob accesses Azure Portal

When Bob opens Azure Portal,

```text
portal.azure.com
        │
        ▼
Microsoft Entra ID
(Authentication)
        │
        ▼
Azure RBAC
(Authorization)
```

Microsoft Entra ID verifies who Bob is.

Azure RBAC then decides whether Bob is allowed to manage Azure resources.

---

## Hybrid Identity

Many large enterprises do not replace Active Directory with Microsoft Entra ID.

Instead, they use both.

```text
                Active Directory
               (On-premises)
                      │
      Azure AD Connect / Cloud Sync
                      │
                      ▼
          Microsoft Entra ID
                      │
      ┌───────────────┼────────────────┐
      ▼               ▼                ▼
   Teams          Outlook        Azure Portal
```

This architecture is called **Hybrid Identity**.

Employees only have one company account, but it can be used for both on-premises and cloud services.

---

## Active Directory vs Microsoft Entra ID

| Active Directory (AD DS) | Microsoft Entra ID |
| --------------------------- | -------------------- |
| On-premises | Cloud |
| Windows domain login | Cloud authentication |
| Group Policy | Microsoft 365 |
| File servers | Teams |
| Internal applications | Outlook |
| Domain-joined devices | Azure Portal |
| Traditional enterprise network | Cloud applications |

---

## My Understanding

At first, I thought Microsoft Entra ID was simply the cloud version of Active Directory.

Later, I realized they have different responsibilities.

Active Directory mainly manages identities inside a company's internal network.

Microsoft Entra ID manages identities in the cloud and provides authentication for cloud applications and Azure.

Many large enterprises use both together.

```text
                Employee
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
Active Directory       Microsoft Entra ID
(On-premises)             (Cloud)
         │                     │
         ▼                     ▼
 Windows Login        Teams / Outlook /
                      Azure Portal /
                      SaaS Applications
```

For me, the biggest takeaway is:

> Active Directory is mainly responsible for managing identities inside a company's network, while Microsoft Entra ID extends those identities to cloud services and modern applications.

This is a study note for VNet, Subnet and NSG

# What confused me

From what did I learn, VNet(virtual network) allow resources to communicate with each other.

In this situation:
- Why do we need subnets?
- Why do we need NSG?
- What is the connection among VNet, subnets and NSG?


# What I learned

## VNet - virtual network

A virtual network is fundamental networking building block in Azure.

It provides a private network where Azure resources can communicate securely.

A VNet defines the overall network boundary, inside the Vnet, resources can communicate using private IP addresses.

For example: VNet: 10.0.0.0/16

### quick review of IP address

IPV4: IPv4 addresses are 32 bits long and are represented as four decimal numbers separated by dots. such as 10.0.0.0 

CIDR (Classless Inter-Domain Routing): CIDR is a notation used to represent an IP network and its prefix length.
For example: 10.0.0.0/24
- 10.0.0.0 is the network address
- /16 is called the prefix length

Prefix Length: Using 10.0.0.0/24 as an example
- The first 24 bits represent the network portion.
- The remaining 8 bits represent the host portion.
This network contains 256 IP addresses: 10.0.0.0 - 10.0.0.255
> 10.0.0.0 is the network address, 10.0.0.255 is the broadcast address. Usable host addresses range from: 10.0.0.1 - 10.0.0.254

## Subnet

A subnet divides a VNet into smaller network segments.

For exampe: 
```
VNet: 10.0.0.0/16
├── Web Subnet: 10.0.1.0/24
├── App Subnet: 10.0.2.0/24
└── DB Subnet: 10.0.3.0/24
```

### why use subnets?
It will help:
- organize resources
- isolate workloads
- simplify security management
- apply different network policies

## Network Security Group (NSG)

An NSG controls network traffic entering and leaving Azure resources.

Azure uses NSG rules to, allow traffic and deny traffic.
NSGs can be associated with: a subnet or a network interface(NIC).

## VNet vs Subnet vs NSG

| Component | Responsibility                    |
| --------- | --------------------------------- |
| VNet      | Defines the network boundary      |
| Subnet    | Organizes and separates resources |
| NSG       | Controls traffic flow             |

## How they work together

For example we have the follwoing architecture:
```
VNet (10.0.0.0/16)
├── Web Subnet(10.0.1.0/24)
│    └── NSG-Web
│
├── App Subnet(10.0.2.0/24)
│    └── NSG-App
│
└── DB Subnet(10.0.3.0/24)
     └── NSG-DB
```
Traffic flow:
```
Internet
    ↓
Web Server
    ↓
Application Server
    ↓
Database Server
```
Because we don't want the database to be directly accessible from the internet.

In this case, each subnet can have different security rules.
- NSG-Web: allow http, https
- NSG-App: allow only traffix from Web Subnet
- NSG-DB: allow only from App Subnet, block directly internet access

## Azure default NSG rules

### Default inbound rules

| Priority | Rule                          | Source             | Destination    | Action |
| -------- | ----------------------------- | -------------------|--------------- | ------ |
| 65000    | AllowVnetInBound              | VirtualNetwork     | VirtualNetwork | Allow  |
| 65001    | AllowAzureLoadBalancerInBound | AzureLoadBalancer  | Any            | Allow  |
| 65500    | DenyAllInBound                | Any                | Any            | Deny   |


### Default outbound rules

| Priority | Rule                  | Source             | Destination    | Action |
| -------- | --------------------- | -------------------|--------------- | ------ |
| 65000    | AllowVnetOutBound     | VirtualNetwork     | VirtualNetwork | Allow  |
| 65001    | AllowInternetOutBound | Any                | Internet       | Allow  |
| 65500    | DenyAllOutBound       | Any                | Any            | Deny   |

> The lower priority number, higher Priority.

# Mistake during the practice

At first, I mistakenly thought that a subnet could be defined using a host IP address.
For example, when working with the VNet: 10.0.0.0/24. I created 10.0.0.1/26 and 10.0.0.2/26 as the subnets, which gave me an error.

Then I reviewed CIDR and did the calculation: /24 contains 256 addresses in total, if I choose to divide a /24 network into /26 subnets, /26 network has 64 IP addresses(2^6=64), then 256 ÷ 64 = 4 subnets.

Therefore, the valid subnet ranges are:
- 10.0.0.0/26
- 10.0.0.64/26
- 10.0.0.128/26
- 10.0.0.192/26

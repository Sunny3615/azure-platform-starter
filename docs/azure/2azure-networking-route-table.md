# What confused me

## Next Hop

Previously, I thought the next hop was the final destination. My question was:

> If the next hop is not the destination, where does the packet go next? How does it eventually reach the final destination?

In reality:

- Destination never changes.
- Each device checks its own routing table.
- The routing table decides the next hop.
- The packet is forwarded hop by hop until it reaches its final destination.


## Example

VM:

```text
10.0.1.4
```

Trying to reach:

```text
8.8.8.8
```

VM Route Table:

| Destination | Next Hop |
|------------|-----------|
| 0.0.0.0/0 | 10.0.2.4 |

Firewall:

```text
10.0.2.4
```

Firewall Route Table:

| Destination | Next Hop |
|------------|-----------|
| 0.0.0.0/0 | Internet |

Traffic Flow:

```text
VM (10.0.1.4)
    |
    v
Firewall (10.0.2.4)
    |
    v
Internet
    |
    v
8.8.8.8
```

Summary:

The packet destination remains 8.8.8.8 throughout the entire journey.

Each device only decides the next hop.

# What I learned

## Azure Networking

### Route

A route determines where network traffic should go.

Each route contains:

- Destination (Address Prefix)
- Next Hop

Example:

| Destination | Next Hop |
|------------|-----------|
| 0.0.0.0/0 | Internet |


### Types of Azure Routes

#### 1. System Routes

Automatically created by Azure.

Examples:

| Destination | Next Hop |
|------------|-----------|
| 10.0.0.0/16 | Virtual Network |
| 0.0.0.0/0 | Internet |

Azure manages these routes automatically.


#### 2. BGP Routes

BGP (Border Gateway Protocol) routes are commonly used for communication between:

- Azure
- On-Premises environments

Examples:

- ExpressRoute
- Site-to-Site VPN


#### 3. User Defined Routes (UDR)

Custom routes created by users.

Common enterprise scenario:

All outbound traffic must pass through a firewall before reaching the Internet.

Example:

| Destination | Next Hop |
|------------|-----------|
| 0.0.0.0/0 | Firewall |


## Network Virtual Appliance (NVA)

NVA stands for Network Virtual Appliance.

Examples:

- Firewall
- Router
- WAN Optimizer
- Load Balancer

NVAs are commonly deployed as virtual machines inside Azure.


## Application Gateway

Azure Application Gateway is a Layer 7 load balancing service.

It can route traffic to:

- Azure Virtual Machines
- Virtual Machine Scale Sets
- Azure App Service
- On-Premises servers

Typical use cases:

- URL-based routing
- SSL termination
- Web Application Firewall (WAF)


## Network Watcher

Azure Network Watcher provides tools for:

### Monitoring

- Network metrics
- Logs

### Diagnostics

- Connection troubleshooting
- Packet capture

### Traffic Analysis

- Traffic flow monitoring
- Security analysis

Supported resources include:

- Virtual Machines
- Virtual Networks
- Application Gateways
- Load Balancers




## Route Table vs Gateway vs Load Balancer

Today I summarized their responsibilities:

| Component | Responsibility |
|------------|---------------|
| Route Table | Where should traffic go? |
| Gateway | How does traffic leave the network? |
| Load Balancer | Which backend should receive the traffic? |


### Simple Example

```text
Internet
    |
Public IP
    |
Load Balancer
    |
+-------+-------+
|       |       |
Web01  Web02  Web03
```

#### Load Balancer

Determines:

```text
Which web server receives the request?
```

#### Route Table

Determines:

```text
How to reach another network?
```

Example:

```text
192.168.0.0/24 -> VPN Gateway
```

#### Gateway

Provides the actual connection path.

Example:

```text
Azure
   |
VPN Gateway
   |
VPN Tunnel
   |
On-Premises Datacenter
```



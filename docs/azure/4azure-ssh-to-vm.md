# What confused me

After I create an Azure VM, I can use ssh from my laptop to the azure resource, I would like to understand:
- What Actually Happens When I SSH from My Laptop to an Azure VM?

# What I learned

## Example
> Using the same example in the **tf-exercises/terraform-net-exe** folder.
I have an application with 3 layers:
- web as the frontend layer
- app as the application layer
- db as the database layer

As the administrator, I need to access all the 3 VMs for management purposes.
The web VM can communicate with app VM, and the appVM can communicate with the db VM.
For security reasons, the Database VM cannot be accessed directly from the Internet or from the Web VM. It only accepts traffic from the App VM.

```
Internet
    │
Application Users
    │
    ▼
Web VM (Public IP)
    │
    ▼
App VM (Private IP)
    │
    ▼
Database VM (Private IP)


Administrator
      │
      ▼
Azure Bastion
      │
      ├── Web VM
      ├── App VM
      └── Database VM
```

Before creating VMs, I first created a virtual network and three subnets.
```
VNet: 10.0.0.0/16
├── Web Subnet: 10.0.1.0/24
├── App Subnet: 10.0.2.0/24
└── DB Subnet: 10.0.3.0/24
```
Then I created 3 VMs:
```
Web VM
│
├── Network Interface (NIC)
├── Private IP (10.0.1.4)
├── Public IP (optional)
├── OS Disk
├── Virtual Network
└── Web Subnet
```
> All three VMs have the same configuration except for their private IP addresses.

The VM does not connect directly to the Virtual Network.
Instead, Azure attaches a Network Interface (NIC) to the VM.
The NIC is placed inside a subnet and receives a private IP address from that subnet.

## What actually happens when I SSH into an Azure VM?

Now let's assume that all three VMs have been deployed and are running. the Web VM public ip is 20.100.50.10.
I run the following command on my laptop:
```bash
ssh azureuser@20.100.50.10
```

Firstly, I thought my laptop connected directly to the virtual machine, however, it would be:

```
My Laptop
      │
      ▼
Home Router
      │
      ▼
Internet
      │
      ▼
Azure Public IP
      │
      ▼
Azure Network
      │
      ▼
Network Interface (NIC)
      │
      ▼
Network Security Group (NSG)
      │
      ▼
Virtual Machine
```

### step 1
The SSH client starts a TCP connection to the destination IP address.

The destination is:
- Destination IP: 20.100.50.10
- Destination Port: 22 (the default SSH port)

The first packet contains information:
- Source IP: My Laptop
- Destination IP: 20.100.50.10
- Destination Port: 22
- Protocol: TCP

### step 2
Before sending the packet, my Mac checks whether the destination IP address belongs to the same local network. My Mac has its own IP address assigned by my home router through DHCP.
- IP Address:    192.168.1.10
- Subnet Mask:   255.255.255.0
This means my local network range is: 192.168.1.0 - 192.168.1.255
Apparently, 20.100.50.10 is not within my local network.

Instead of trying to send the packet directly, my Mac forwards it to the default gateway, which is my home router.
In this case, the router does not know the complete path to the destination. Instead, it forwards the packet to the next hop based on its routing table. 

The router forwards the packet to my Internet Service Provider (ISP). The ISP uses Internet routing information (such as Border Gateway Protocol-BGP) to determine that the destination belongs to Microsoft's network.

Once the packet reaches Microsoft's global network, Microsoft's network routes the packet to the correct Azure region. The packet eventually reaches the Azure datacenter in the West Europe region, where Azure begins processing it.

### step 3

Azure looks up the public IP address and finds that it is associated with the Network Interface (NIC) of the Web VM.

Azure then performs a network address translation (NAT), forwarding the traffic from the public IP address to the VM's private IP address.

### step 4
After the packet reaches the NIC, NSG would start to check the packet
- Source: Internet
- Destination Port: 22
- Protocol: TCP
> allowed

### step 5
The VM finally receives the SSH request then SSH server starts the authentication process. If the username and authentication credentials (password or SSH key) are valid, the SSH session is established, and I can log in to the Web VM.
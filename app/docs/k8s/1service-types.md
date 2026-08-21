# Service types

## What confused me

I was confused about `port`, `targetPort`, and `nodePort` in a NodePort Service, so I reviewed the different Kubernetes Service types and made the following notes.

One thing that confused me was that when we create a NodePort Service, it also has a ClusterIP:

```bash
kubectl get svc

NAME            TYPE       CLUSTER-IP     PORT(S)
nginx-service   NodePort   10.96.0.10     80:30080/TCP
```

Why does a NodePort Service also have a ClusterIP?

To understand this, I first reviewed the four common Kubernetes Service types.

## What did I learn?

### Summary of the four Service types

| Service Type     | Main Purpose                                          | Typical Traffic Direction                |
| ---------------- | ----------------------------------------------------- | ---------------------------------------- |
| **ClusterIP**    | Expose an application inside the cluster              | Cluster → Service → Pod                  |
| **NodePort**     | Expose a Service through a port on each Node          | External → Node → Service → Pod          |
| **LoadBalancer** | Expose a Service through an external load balancer    | External → Load Balancer → Service → Pod |
| **ExternalName** | Map a Kubernetes Service name to an external DNS name | Pod → External Service                   |

## ClusterIP

### Definition

A ClusterIP is a virtual IP address used to access a Service from within the Kubernetes cluster.

First of all, what does **cluster** mean here?

A Kubernetes cluster consists of a **control plane** and one or more **worker nodes**.

For example:

```text
┌────────────── Kubernetes Cluster ──────────────┐
│                                                │
│   Control Plane                               │
│   ├── API Server                              │
│   ├── Scheduler                               │
│   ├── Controller Manager                      │
│   └── etcd                                    │
│                                                │
│   Worker Node 1       Worker Node 2           │
│   ├── kubelet          ├── kubelet            │
│   ├── kube-proxy       ├── kube-proxy         │
│   ├── CNI              ├── CNI                │
│   └── Pods             └── Pods               │
│                                                │
└────────────────────────────────────────────────┘
```

A ClusterIP Service provides a stable virtual IP for applications that need to communicate inside this cluster.

For example, imagine that we have three backend Pods:

```text
Pod A: 10.10.1.10
Pod B: 10.10.1.11
Pod C: 10.10.2.10
```

Pod IP addresses are not guaranteed to remain the same. If a Pod is recreated, it may receive a new IP address.

Instead of other applications communicating directly with these Pod IPs, we can create a Service:

```text
Backend Service
ClusterIP: 10.96.0.10
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Pod A  Pod B  Pod C
```

Other applications can access the Service through its stable ClusterIP or, more commonly, through its DNS name.

### Use case

ClusterIP is the default Service type.

It is generally used for applications that only need to be accessible from inside the Kubernetes cluster.

For example:

```text
Frontend Pod
     ↓
backend-service
     ↓
ClusterIP
     ↓
Backend Pods
```

The backend application does not necessarily need to be directly exposed outside the cluster.

---

## NodePort

### Definition

NodePort exposes a Service on a static port on every Kubernetes Node.

External clients can access the Service using:

```text
<NodeIP>:<NodePort>
```

The traffic is then routed to one of the backend Pods associated with the Service.

By default, Kubernetes allocates NodePorts from the range:

```text
30000-32767
```

### Use case

Imagine that there is a computer outside your Kubernetes cluster and you want it to access an application running inside the cluster.

A NodePort Service can expose a port on the Nodes so that the external computer can access the application using a Node IP and NodePort.

For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service

spec:
  type: NodePort

  selector:
    app: nginx

  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30080
```

In this example, the Service can be accessed through port `30080` on the Nodes.

For example:

```text
192.168.1.10:30080
192.168.1.11:30080
192.168.1.12:30080
```

assuming those Node IPs are reachable from the client.

### port vs targetPort vs nodePort

This was the part that confused me the most.

| Field              | Meaning                                                   |
| ------------------ | --------------------------------------------------------- |
| `nodePort: 30080`  | The port exposed on the Node                              |
| `port: 80`         | The port exposed by the Service                           |
| `targetPort: 8080` | The port on which the application in the Pod is listening |

Therefore, the traffic path can be understood as:

```text
External Client
      ↓
NodeIP:30080
      ↓
NodePort Service
      ↓
Service port:80
      ↓
PodIP:8080
```

For example:

```text
192.168.1.11:30080
        ↓
nginx-service:80
        ↓
10.10.1.10:8080
```

The most important thing to remember is:

```text
nodePort   → Node
port       → Service
targetPort → Pod / application
```

### What exactly does the client access?

With a ClusterIP Service, a client inside the cluster can access:

```text
Client Pod
    ↓
10.96.0.10:80
    ↓
Service
    ↓
Backend Pod
```

Usually, the client would use the Service DNS name instead of directly using the ClusterIP.

With a NodePort Service, an external client can access:

```text
External Client
      ↓
192.168.1.11:30080
      ↓
Node 2
      ↓
Service networking rules
      ↓
Backend Pod
```

This is one of the major differences between ClusterIP and NodePort.

### What if the Pod is not running on the Node that receives the traffic?

For example:

```text
Node 1
192.168.1.10

Pod A
10.10.1.10


Node 2
192.168.1.11

No nginx Pod
```

The client accesses:

```text
192.168.1.11:30080
```

Even though there is no nginx Pod on Node 2, the request can still be routed to a backend Pod on another Node.

The Service networking information allows the traffic to be directed to an available backend Pod.

For example:

```text
External Client
      ↓
Node 2:30080
      ↓
Service networking rules
      ↓
Backend selected:
10.10.1.10
      ↓
Cluster networking / CNI
      ↓
Node 1
      ↓
Pod A
```

Therefore:

> The Node that receives NodePort traffic does not necessarily have to be the Node running the destination Pod.

### Why does NodePort also have a ClusterIP?

This was another thing that initially confused me.

When we create a NodePort Service:

```bash
kubectl get svc
```

we may see:

```text
NAME            TYPE       CLUSTER-IP     PORT(S)
nginx-service   NodePort   10.96.0.10     80:30080/TCP
```

The Service has both:

```text
ClusterIP: 10.96.0.10
NodePort:  30080
```

This is because a NodePort Service normally also provides the ClusterIP functionality.

Therefore, the same Service can be accessed internally through:

```text
10.96.0.10:80
```

and externally through a reachable Node:

```text
192.168.1.11:30080
```

A simple way to remember this is:

```text
ClusterIP
   ↑
NodePort adds external access through NodeIP:NodePort
```

## LoadBalancer

### Definition

A LoadBalancer Service exposes an application outside the Kubernetes cluster through an external load balancer.

It is commonly used when Kubernetes is running on a cloud platform such as Azure, AWS, or Google Cloud.

For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service

spec:
  type: LoadBalancer

  selector:
    app: nginx

  ports:
    - port: 80
      targetPort: 8080
```

In a supported cloud environment, the cloud integration can provision or configure an external load balancer for the Service.

The traffic flow can be understood as:

```text
Internet
   ↓
External Load Balancer
   ↓
Kubernetes Service
   ↓
Backend Pod
```

For example:

```text
Client
   ↓
20.30.40.50:80
   ↓
Cloud Load Balancer
   ↓
Kubernetes Service
   ↓
Pod:8080
```

### Why use LoadBalancer instead of NodePort?

With NodePort, the client needs to know a reachable Node IP:

```text
192.168.1.10:30080
```

But what happens if that Node becomes unavailable?

A LoadBalancer provides a more suitable external entry point and distributes incoming traffic toward the Kubernetes Service.

So instead of exposing Node addresses directly to users:

```text
Client
  ↓
Which Node?
```

we can have:

```text
Client
  ↓
External Load Balancer
  ↓
Kubernetes
```

### Use case

LoadBalancer is commonly used when an application needs to be directly accessible from outside the Kubernetes cluster, especially in cloud environments.

## ExternalName

### Definition

ExternalName is different from ClusterIP, NodePort, and LoadBalancer.

Instead of routing traffic to Pods, it maps a Kubernetes Service name to an external DNS name.

For example, imagine that an application inside Kubernetes needs to access an external database:

```text
database.example.com
```

We can create:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: external-database

spec:
  type: ExternalName
  externalName: database.example.com
```

Applications inside Kubernetes can then use:

```text
external-database
```

instead of directly using:

```text
database.example.com
```

The DNS resolution can be understood as:

```text
Application Pod
      ↓
external-database
      ↓
Kubernetes DNS
      ↓
database.example.com
      ↓
External Database
```

Unlike the other Service types, an ExternalName Service does not proxy traffic to a set of Pods. It works through DNS, typically by returning a CNAME record for the configured external name.

### Use case

ExternalName is useful when applications inside Kubernetes need to access an external service while using a Kubernetes-style Service name.

## Summary

The easiest way for me to remember the four Service types is:

```text
ClusterIP
   ↓
Internal access to applications

NodePort
   ↓
External access through NodeIP:NodePort

LoadBalancer
   ↓
External access through a load balancer

ExternalName
   ↓
DNS mapping to an external service
```

For the three ports used by NodePort, I can remember:

```text
nodePort   → Node
port       → Service
targetPort → Pod / application
```

And the NodePort traffic path is:

```text
External Client
      ↓
NodeIP:nodePort
      ↓
Service:port
      ↓
PodIP:targetPort
```

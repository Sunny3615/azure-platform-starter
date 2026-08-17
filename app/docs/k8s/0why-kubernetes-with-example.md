# What confused me

I wanted to use a real-world example to help me understand why we need Kubernetes, what problems Kubernetes solves, and how some of its basic concepts work together.

Instead of learning concepts such as Pods, Deployments, Services, and Ingress separately, I wanted to understand what problem each of them solves in a real application.

# What did I learn?

## A Real-World Example

Suppose I want to build an online jewellery shop where customers can browse products and place orders, while the shop owner can receive and manage order information.

From an application architecture perspective, I would need at least three components:

```text
Customer
   ↓
Frontend -- React
   ↓
Backend API -- Java Spring Boot
   ↓
Database -- PostgreSQL
```

When a customer places an order, the request might look like this:

```text
Customer
   ↓
Frontend
   │
   │ POST /orders
   ↓
Backend
   │
   │ INSERT order
   ↓
PostgreSQL
```

At this point, Kubernetes has not appeared yet. This is simply the architecture of our application.

# Containerizing the Application

In a real project, the frontend and backend are usually developed separately. They have different source code, dependencies, and runtime environments.

For example:

```text
frontend/
├── src/
├── package.json
└── Dockerfile

backend/
├── src/
├── pom.xml
└── Dockerfile
```

For PostgreSQL, we can use an official PostgreSQL container image instead of building our own.

The Dockerfiles define how to build our applications into container images:

```text
Frontend code
     ↓
Dockerfile
     ↓
Frontend Image

Backend code
     ↓
Dockerfile
     ↓
Backend Image
```

> **What does Docker do?**

Docker allows us to package an application together with its runtime and dependencies into a container image so that it can run consistently across different environments.

But another question now appears:

> If I have multiple containers running in production, how can I manage them reliably?

This is where Kubernetes comes in.

# Pod

Kubernetes does not directly schedule individual containers. Instead, containers run inside **Pods**, which are the smallest deployable and schedulable units in Kubernetes.

In our simple example:

```text
Kubernetes Cluster

┌───────────────────────────────────────┐
│                                       │
│   Frontend Pod                        │
│   └── Frontend Container              │
│                                       │
│   Backend Pod                         │
│   └── Backend Container               │
│                                       │
│   Database Pod                        │
│   └── PostgreSQL Container            │
│                                       │
└───────────────────────────────────────┘
```

If every Pod stayed healthy forever and the amount of traffic never changed, running one Pod for each application might be enough.

However, in a real production environment, we cannot always expect the best-case scenario.

There are several problems we need to consider.

### Problem 1: What happens when traffic increases?

For example, during Black Friday, the number of customers might increase significantly.

Instead of:

```text
100,000 customers
        ↓
   Backend Pod
```

we can run multiple replicas:

```text
100,000 customers
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Pod 1  Pod 2  Pod 3
```

This allows the workload to be distributed across multiple application instances.

### Problem 2: Pod IP addresses are not stable

Every Pod receives its own IP address.

For example:

```text
Backend Pod
10.10.1.10
```

If that Pod is deleted and recreated, the new Pod might receive:

```text
10.10.2.15
```

If the frontend keeps trying to access:

```text
10.10.1.10
```

the request will fail.

We therefore need another mechanism to provide stable access to our backend.

This is where **Services** will become important.

But first, we need to decide how Kubernetes should manage these Pods.

# Deployment and StatefulSet

Normally, we do not manually create and manage multiple identical Pods.

For stateless applications, we can use a **Deployment**.

A Deployment manages ReplicaSets, and the ReplicaSet ensures that the desired number of Pods is running:

```text
Deployment
     ↓
ReplicaSet
     ↓
┌────┼────┐
↓    ↓    ↓
Pod1 Pod2 Pod3
```

However, not all applications have the same requirements.

In our example, the backend and database have very different characteristics.

## Deployment

Our Backend API is mostly stateless.

For example:

```text
backend-7df8c
backend-a92fd
backend-c71ab
```

It normally does not matter which backend Pod handles a particular HTTP request.

If one Backend Pod disappears:

```text
backend-a92fd ❌
```

Kubernetes can create another one:

```text
backend-x82cd ✅
```

The new Pod does not need to keep the identity of the old Pod.

This makes **Deployment** suitable for our frontend and backend applications.

```text
Frontend Deployment
       ↓
Frontend Pods

Backend Deployment
       ↓
Backend Pods
```

## StatefulSet

The database is different because it is stateful.

The PostgreSQL database contains information such as:

```text
Order #001
Order #002
Order #003
```

We do not want this data to disappear simply because a Pod is recreated.

Stateful workloads may also require stable Pod identities and persistent storage.

This is where **StatefulSet** can be useful.

For example:

```text
StatefulSet
     ↓
postgres-0
     ↓
PVC
     ↓
Persistent Volume
```

If the PostgreSQL Pod is recreated, it can reconnect to its persistent storage instead of starting with an empty filesystem.

Therefore, the important distinction is:

```text
Deployment
→ suitable for stateless workloads

StatefulSet
→ suitable for workloads that require stable identity
  and persistent storage
```

# Service

Now suppose our Backend Deployment has three Pods:

```text
Backend Deployment
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Pod 1 Pod 2 Pod 3
```

Each Pod has its own IP address.

The frontend now has a problem:

> Which Backend Pod should I send the request to?

It should not need to know whether there are three Backend Pods, five Backend Pods, or whether one of them has recently been recreated.

This is the problem that a **Service** solves.

We can create:

```text
backend-service
```

The Service uses labels and selectors to identify the Backend Pods that belong to it.

Conceptually:

```text
Frontend Pod
      ↓
backend-service
      ↓
 ┌────┼────┐
 ↓    ↓    ↓
Pod1 Pod2 Pod3
```

The Service provides a stable network endpoint.

Therefore, instead of the frontend calling a specific Pod IP:

```text
http://10.10.1.10
```

it can call the Service by DNS name:

```text
http://backend-service
```

If a Backend Pod is recreated and receives a new IP address, Kubernetes updates the backend endpoint information through EndpointSlices.

The frontend does not need to know about this change.

It continues to access:

```text
backend-service
```

We can use the same idea for the frontend:

```text
frontend-service
      ↓
Frontend Pods
```

## Service Types

There are different Service types depending on how the application needs to be accessed.

| Service Type     | Main Purpose                                          |
| ---------------- | ----------------------------------------------------- |
| **ClusterIP**    | Expose an application inside the cluster              |
| **NodePort**     | Expose a Service through a port on each Node          |
| **LoadBalancer** | Expose a Service through an external load balancer    |
| **ExternalName** | Map a Kubernetes Service name to an external DNS name |

For example, our Backend Service could use ClusterIP because it mainly needs to be accessed internally:

```text
Frontend
   ↓
backend-service (ClusterIP)
   ↓
Backend Pods
```

An important point is that the Frontend Service can **also be a ClusterIP Service when we use Ingress**.

We do not necessarily need to expose every application directly through NodePort or LoadBalancer.


# Ingress

Now we have most of our internal architecture:

```text
Frontend Service
      ↓
Frontend Pods
      ↓
Backend Service
      ↓
Backend Pods
      ↓
Database
```

Suppose we register a domain:

```text
www.example-selling.com
```

Customers are outside our Kubernetes cluster.

The next question is:

> When a customer opens `www.example-selling.com`, how does the HTTP request reach the correct application inside Kubernetes?

This is where **Ingress** comes in.

Ingress defines Layer 7 HTTP/HTTPS routing rules.

For example:

```text
www.example-selling.com
          ↓
    Ingress Controller
          ↓
      Ingress Rule
          ↓
   frontend-service
          ↓
    Frontend Pods
```

We could also define different paths:

```text
www.example-selling.com/
          ↓
   frontend-service

www.example-selling.com/api
          ↓
    backend-service
```

Therefore, Ingress can route incoming HTTP/HTTPS traffic to different Services based on information such as the hostname and URL path.

One important distinction is that **Ingress does not perform DNS resolution**.

DNS and Ingress have different responsibilities:

```text
Customer
   ↓
www.example-selling.com
   ↓
DNS
   ↓
Resolve domain to the external entry point
   ↓
Ingress Controller
   ↓
Ingress routing rules
   ↓
Service
   ↓
Pod
```

DNS answers:

> **Where is `www.example-selling.com`?**

Ingress answers:

> **Now that the HTTP request has reached the cluster, which Service should handle it?**


# Putting Everything Together

Now the complete application can be understood like this:

```text
                         Customer
                            │
                            ↓
             www.example-selling.com
                            │
                           DNS
                            │
                            ↓
                    External Entry Point
                            │
                            ↓
                    Ingress Controller
                            │
                    ┌───────┴────────┐
                    │                │
                    ↓                ↓
                   /               /api
                    │                │
                    ↓                ↓
            Frontend Service   Backend Service
                    │                │
              ┌─────┴─────┐    ┌────┼────┐
              ↓           ↓    ↓    ↓    ↓
          Frontend      Frontend   Backend Pods
            Pods          Pods          │
                                        │
                                        ↓
                                Database Service
                                        │
                                        ↓
                                   PostgreSQL
                                        │
                                        ↓
                                      PVC
                                        │
                                        ↓
                               Persistent Volume
```

When a customer places an order:

```text
Customer
   ↓
POST /api/orders
   ↓
Ingress
   ↓
backend-service
   ↓
one healthy Backend Pod
   ↓
Database Service
   ↓
PostgreSQL
   ↓
Persistent Storage
```

# What problem does each technology solve?

After going through this example, I can understand the responsibilities more clearly:

| Component         | Main Responsibility                                                 |
| ----------------- | ------------------------------------------------------------------- |
| **Dockerfile**    | Defines how to build the application into a container image         |
| **Container**     | Runs the actual application                                         |
| **Pod**           | Smallest Kubernetes unit used to run containers                     |
| **Deployment**    | Manages stateless application Pods and their replicas               |
| **ReplicaSet**    | Ensures the desired number of Pods exists                           |
| **StatefulSet**   | Manages stateful Pods with stable identities and persistent storage |
| **Service**       | Provides stable network access to a group of Pods                   |
| **EndpointSlice** | Records the backend endpoints associated with a Service             |
| **Ingress**       | Defines HTTP/HTTPS routing rules to Services                        |
| **PVC / PV**      | Provides persistent storage                                         |

The overall relationship can be simplified as:

```text
Application Code
      ↓
Dockerfile
      ↓
Container Image
      ↓
Kubernetes
      ↓
Pod
      ↓
Deployment / StatefulSet
      ↓
Service
      ↑
Ingress
```

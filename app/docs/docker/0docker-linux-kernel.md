# Docker Linux kernel

## What confused me

I saw a description of Docker:
> "Docker enables developers to package applications and their dependencies into lightweight, portable containers, which can be deployed consistently across different Linux environments."

### My confusion / thinking

From what I had learned before, Docker wraps the application and its dependencies into a container, and developers can then pull it down and run it anywhere.

For Windows users, as far as I understand, Docker Desktop actually runs a Linux environment underneath.

This made me wonder:

- Why does Docker need a Linux environment?
- How does Docker Desktop work on Windows?

## What I learned

### Review

#### kernel space and user space

##### what is kernel space?

The highly privileged memory area reserved for the operating system's core (the kernel) and core device drivers. It has unrestricted, direct access to all hardware and memory.

##### what is user space?

The unprivileged environment where your everyday applications (browsers, games, text editors), user space can't access hardware directly, it has to go through the kernel.

### Most of the docker containers are Linux containers

Most Docker containers are Linux containers because container technology was originally built on Linux kernel features such as namespaces for isolation and cgroups(control groups) for resource control.

Containers are essentially isolated Linux processes running with their own userspace filesystem while sharing the host Linux kernel.

### Docker containers do not package the kernel

Docker containers package the application and its userspace dependencies, but not the kernel.

Containers share the host Linux kernel, which is why Linux compatibility is important. The `FROM` instruction usually specifies a Linux userspace filesystem rather than a complete operating system.

A Docker image is basically a userspace filesystem. For example, `FROM ubuntu` includes components such as `bash`, `apt`, `/bin`, `/lib`, and `libc`, but it does not include a Linux kernel.

#### A misunderstanding I had
>
> At first, I thought `FROM ubuntu` meant downloading a complete Ubuntu operating system.

### How does Docker Desktop work on Windows?

Docker containers rely on the Linux kernel because container technologies such as namespaces and cgroups are Linux kernel features.

Windows does not natively provide a Linux kernel, so Docker Desktop cannot run Linux containers directly on Windows in the same way it does on a Linux host.

To solve this problem, Docker Desktop creates a lightweight Linux virtual machine in the background, typically using:

- WSL2 (Windows Subsystem for Linux 2)
- or Hyper-V

Docker Engine actually runs inside this Linux environment.

When a developer runs commands such as:

```bash
docker run nginx
```

## Security Implications

### Creating a user instead of using root in a Dockerfile

Containers are isolated using Linux kernel features like namespaces and cgroups, but they are not fully isolated like virtual machines because they share the same host kernel.

Running containers as root increases the risk that a compromised container could exploit kernel vulnerabilities or affect the host system.

Using non-root users helps reduce the attack surface and limits the impact of a compromise.

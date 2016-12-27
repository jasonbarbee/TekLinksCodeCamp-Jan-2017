![](images/teklinks.png)
Code Camp
==

<!-- footer: TekLinks Code Camp - Jan 2017 -->

<!-- *page_number: true -->

## Ansible Introduction
 Jason Barbee
Solutions Architect
CCIE #18039

---
Goals
==

1. APIs and CLIs
1. Orchestration
1. Ansible Intro
1. Demo time

---
# Device Provision Time
Servers - Instant, full automation possible.
Network - Create vlans, interfaces, routing, manual. _SLOW._

Traditional Networking **CANNOT** keep up with the pace of today's technology.
* But we can't replace it all overnight.

---
# Hello Network Device Programmability

Wait - did you mean SDN? 
Is that Cisco ACI? ... NSX maybe? 
_Sort of._


![50%](images/pacman-cisco.png)

---
# A tale of two worlds

## IOS CLI telnet / SSH
Huge install base. 
Will be around for for many years to come.

## Cisco Next Generation Networking API Interfaces
APIC-EM - REST controller for new generation routers
ACI - API controller for true SDN networking
DNA/Panda/Yang - Cisco's built in agent for provisioning in ISR4ks, and 3850 Switches
NX-OS - REST API built into Nexus OS.
Meraki - Cloud Controlled API controller

---
# SDN and APIs are the future
### Network Automation and APIs are here. 
### But it's OK to use telnet/ssh while we cross that bridge.
![60%](images/bridge.jpg)

---
# Ansible



---
# What can Ansible do for Network Engineers?

1. Template Configurations
2. Standardize commands accross wide inventory
2. Reset security or passwords 
2. Audit configurations
3. Backup Configurations on schedule or before/after.
4. Per-host Ping tests
4. Trigger API calls  
5. Network Assessments/Inventory
---
# What can Ansible do for Storage and Virtualization Guys?

1. Build servers automatically in Vmware or Cloud
2. Automate installation packages
3. Per host status checks or ping testing
4. Inventory of hosts
---
# Real World Examples

---
# Security Audit Remediation
# 
---
# 
![170%](images/kermit.gif)

---

# Install Ansible
Ubuntu 
```
sudo apt-get install ansible
```
Fedora
```
yum install ansible
```
Mac
``` 
xcode-select --install
easy_install --user pip
```
---
# Inventory


---
# Playbooks 
Sequence of Tasks to run on what
```
vars:
  cli:
    host: "{{ inventory_hostname }}"
    username: cisco
    password: cisco
    transport: cli

tasks:
  - name: run show version on remote devices
    ios_command:
      commands: show version
      provider: "{{ cli }}"



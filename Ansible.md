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
DNA/Panda/Yang - Cisco's built in agent for provisioning in ISR4ks, and 3850 Switches (Denali OS)
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

# Install Ansible - Windows
download "Babun" - http://babun.github.io/
``` 
Loads Everything you need - copy/paste

curl -s https://raw.githubusercontent.com/tiangolo/ansible-babun-bootstrap/master/install.sh | source /dev/stdin

pact install python-yaml
pact install python-setuptools python-ming
pact install libxml2-devel libxslt-devel libyaml-devel
curl -skS https://bootstrap.pypa.io/get-pip.py | python
pip install virtualenv
curl -skS https://raw.githubusercontent.com/mitsuhiko/pipsi/master/get-pipsi.py | python
pip install napalm

If you get errors running Ansible later-
you might have to exit and "rebaseall" - run this if you get errors about child processes
cmd /c %SYSTEMDRIVE%\Users\%USERNAME%\.babun\cygwin\bin\dash.exe -c '/usr/bin/rebaseall -v'
then Babun again
```
---
# Install Continued
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
Group Name
Hostname (variable=value)
```
[routers]
192.168.1.1 username=admin password=admin
```
---
# Inventory - Group Variables
```
[all:vars]
domain=mydomain.org
admin_user=admin
admin_password=secretsauce
enable_password=secretsauce
netmask=255.255.255.0
gateway=192.168.1.1
name_server1=8.8.8.8

[ROUTERS:vars]
interface=gi0/0

[ROUTERS]
Router1 ipaddress=192.168.1.2

[SWITCHES:vars]
interface=vlan1

[SWITCHES]
Switch1 ipaddress=192.168.1.4
```
---
# Playbooks 
Show version on devices
```
---
  - name: Task Name - Show Version
    hosts: routers
    gather_facts: yes
    connection: local
    
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

```
---
# Playbooks - Templating playbook
```
  - name: Build Router Templates
    hosts: all
    connection: local
    gather_facts: no

    tasks:
      - name: Build Router configs
        template:
          src=templates/routers.j2
          dest=configs/{{inventory_hostname}}.conf
```
--- 
# Template Files
Jinja2 Format {{ }}
```
! Comments with a bang
enable secret {{enable_password}}
hostname {{inventory_hostname}}
ip domain name {{domain}}
aaa new-model
username {{admin_user}} secret {{admin_password}}
line vty 0 15
logging synchronous
transport input telnet ssh
privilege level 15
ntp server {{ntp_server}}
```
---
# IOS Updates 
```
  - name: Upgrade IOS
    hosts: routers
    gather_facts: yes
    connection: local

    tasks:

      - cisco_file_transfer:
          source_file=c2900-universalk9-mz.SPA.155-3.M4a.bin
          dest_file=c2900-universalk9-mz.SPA.155-3.M4a.bin
          enable_scp=true
          host={{ inventory_hostname }}
          username={{ username }}
          password={{ password }}
          overwrite=true
```

https://pynet.twb-tech.com/blog/automation/cisco-ios.html

---
# IOS Updates
## Words of Caution
![150%](images/roughroad.jpeg)

---
# Our Install - Vagrant

Instant Cof... I mean Ansible
![100%](images/coffee.jpg)

Instant Ansible/Python Dev Box anytime, with virtualbox and Ansible. 
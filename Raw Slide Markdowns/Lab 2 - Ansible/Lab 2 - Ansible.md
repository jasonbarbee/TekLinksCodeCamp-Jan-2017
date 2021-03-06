footer: TekLinks Code Camp
slidenumbers: true
autoscale: true

![left inline](images/teklinks.png)
Code Camp
==

## Lab 2: Ansible

---
# Prep 
* Download Vagrant and install - https://www.vagrantup.com/downloads.html
* Download Virtualbox and install https://www.virtualbox.org/wiki/Downloads

---
# Prep 2
* Downoad the repo by GIT or Zip file - top right button of the repo
https://github.com/jasonbarbee/TekLinksCodeCamp-Jan-2017 
* Unzip and cd to the vagrant-code-camp folder
* issue command ```vagrant up``` -  give it 10 minutes. 
* Then run ```vagrant ssh``` to open a SSH to the machine
* Change to the lab directory - ```cd /vagrant/Ansible``` 

---
# Cloud Routers
Using VyOS - Vyatta - open source free router similar to Cisco.

Running a single instance in AWS EC2 instance for this lab.

---
# Playbooks pre-built
### All the playbooks you need are pre-built

* aws-facts.yml - Collects Data from AWS.
* security-alert.yml - Security Alert Code to push to hook.io
* vyos-scan.yml - Show version, if VyOS Then Security Alert
* vyos-config.yml - Changes Hostname and backups config file.
* vyos-spark.yml - Show version and pops a Spark Message

---
# Learning Ansible Syntax

---
# Ansible Playbook Header
```yaml
---
- name: VyOS Gather Facts
  hosts: all
  connection: local

  vars:
    version: ""
    ansible_net_version: ""
    cli:
      host: "{{ inventory_hostname }}"
      username: "{{ username }}"
      password: "{{ password }}"
      transport: cli
```

---
# Add a Task to gather all router facts

```yaml
  tasks:
    - name: collect all facts from the device
      vyos_facts:
        gather_subset: all
        provider: "{{ cli }}"
      register: result

    - name: debug stuff
      debug:
        var: result.ansible_facts
```
The first task collects the data, the second task dumps the data variable.
The second debug prints the array of data that the first task gathered.

---
# Basic Ansible Fact Gathering

```bash
ansible-playbook -i inventory vyos-facts.yml
```
### You should get ansible output from a test Vyatta router running in AWS EC2 Instance.

### The data is broken out inso JSON format, which you can parse out using other tools.

---
# Next - simple show version
Add a task to the bottom to show version. 

```yaml
    - name: Show version
      vyos_command:
        commands:
          - show version
        provider: "{{ cli }}"
```

---
# Running Show Version
Run it and see what the data looks like

 ```yaml
 ansible-playbook -i inventory vyos-facts.yml
 ```

--- 
# Send a message to Cisco Spark!
Update your inventory file with your Spark Auth Token and your Customer Name. 
And Your Spark Room ID. You can find that by going to 
https://web.ciscospark.com and signing in. Click on the Room you want to use.
The RoomID will be the string at the end of the URL - like this
https://web.ciscospark.com/rooms/9f464a80-de51-11e6-a2af-2134341234/
Only grab the numbers - not the entire URL.

---
# Ansible Spark module

```yaml
    - name: Cisco Spark - Text Message to a Room
      cisco_spark:
        recipient_type: roomId
        recipient_id: "{{ roomid }}"
        message_type: text
        personal_token: "{{ bottoken }}"
        message: "Your Name : Found Device - {{ result.ansible_facts.ansible_net_hostname  }}"
```
* Notice that we are using variables 
* This module is pending final commit to the next version, but I have loaded it on the Code Camp box.

--- 
# Try the Spark module

```yaml
 ansible-playbook -i inventory vyos-spark.yml
 ```

---
# Backup configs and make a change
Example Task

```yaml
    - name: backup and load config commands from vyos.cfg
      vyos_config:
        src: vyos.cfg
        backup: yes
        provider: "{{ cli }}"

    - name: configure the remote device with example CLI
      vyos_config:
        backup: yes
        lines:
          - set system host-name AWS-CodeCamp-{yourname}
        provider: "{{ cli }}"

```

---
# Run the Configure/backup Script 

```yaml
 ansible-playbook -i inventory vyos-config.yml
 ```

---
# Ansible can play with AWS too...

---
# AWS - Basic EC2 Inventory List
Here's example model for EC2

```yaml
- name: Gather EC2 facts
      ec2_remote_facts:
        aws_access_key: "{{ AWS_ACCESS_KEY_ID }}"
        aws_secret_key: "{{ AWS_SECRET_ACCESS_KEY }}"
        region: "{{ EC2_REGION }}"
      register: ec2_facts

    - name: Debug
      debug:
        msg: "{{ ec2_facts }}"
```
---
# Ansible EC2 Inventory List
* I have included credentials for this excersize in my aws-facts.yml file.
* To try this out run
<br>
```ansible-playbook -i inventory aws-facts.yml``` 
<br>
to see my AWS inventory running for this Lab.

---
# Followup Resources
Great resources to read up on
Network To Code Ansible Plugin
https://github.com/networktocode/ntc-ansible

Python for Network Engineers
https://pynet.twb-tech.com/

NAPALM for Ansible
https://pynet.twb-tech.com/blog/automation/napalm-ios.html



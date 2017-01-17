footer: TekLinks Code Camp
slidenumbers: true
autoscale: true

![inline](images/teklinks.png)
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
# Start building a playbook
* Verital and Spacing is VERY important.

* Open a text editor, and build a new file - called get-facts.yml
* This file does not have any tasks, but it is a start.

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
ansible-playbook -i inventory get-facts.yml
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
Run it and see what the data looks like

 ```yaml
 ansible-playbook -i inventory get-facts.yml
 ```

--- 
# Send a message to Cisco Spark!
Update your inventory file with your Spark Auth Token and your Customer Name. [^1]

```yaml
    - name: Cisco Spark - Text Message to a Room
      cisco_spark:
        recipient_type: roomId
        recipient_id: "{{ roomid }}"
        message_type: text
        personal_token: "{{ bottoken }}"
        message: "Your Name : Found Device - {{ result.ansible_facts.ansible_net_hostname  }}"
```

[^1]:This module is pending final committment to the next version, but I have loaded it on the Code Camp box.

---
# Backup configs and make a change
This is a good time to make a new file, copy the header and provider variables, then use this as your task.
Name it backup-change.yml and try to run it.

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
Ansible can play with AWS too...

---
# AWS - Basic EC2 Inventory List

A user linked to my account credentials are included in the repo. 
Run
<br>
```ansible-playbook -i inventory aws-facts.yml``` 
<br>
to see my AWS inventory running for this Lab.

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
# Followup Resources
Great resources to read up on
Network To Code Ansible Plugin
https://github.com/networktocode/ntc-ansible

Python for Network Engineers
https://pynet.twb-tech.com/

NAPALM for Ansible
https://pynet.twb-tech.com/blog/automation/napalm-ios.html



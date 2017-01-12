![](images/teklinks.png)
Code Camp
==

<!-- footer: TekLinks Code Camp - Jan 2017 -->

<!-- *page_number: true -->

## Lab Setup Guide
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

Running a single instance in the cloud for this lab.

---
# Start building a playbook
Open a text editor, and build a new file - called get-facts.yml
```
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
# Add a Task to gather all facts
```
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

---
# Basic Ansible Fact Gathering

* ```ansible-playbook -i inventory get-facts.yml``` and you should get ansible output from a test Vyatta router running in AWS EC2 Instance.

#### The data is broken out inso JSON format, which you can parse out using other tools.

---
# Next - simple show version
Add a task to the bottom to show version. 

```
    - name: Show version
      vyos_command:
        commands:
          - show version
        provider: "{{ cli }}"
 ```
 ### Run it and see what the data looks like
 ```ansible-playbook -i inventory get-facts.yml```

---
# Backup then make a change
This is a good time to make a new file, copy the header and provider variables, then use this as your task.
Name it backup-change.yml and try to run it.

```
    - name: configure the remote device
      vyos_config:
        backup: yes
        lines:
          - set system host-name AWS-CodeCamp-{yourname}
        provider: "{{ cli }}"

    - name: backup and load from file
      vyos_config:
        src: vyos.cfg
        backup: yes
        provider: "{{ cli }}"
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



![](images/teklinks.png)
Code Camp
==

<!-- footer: TekLinks Code Camp - Jan 2017 -->

<!-- *page_number: true -->

## Lab 5 - All Together Now 
---
# Goal
Trigger a condition task in Playbook
If the device detected is a VyOS / Vyatta - then trigger a web task at hook.io
The web task will alert user via Spark, and call the user via Tropo and announce the finding.

---

---
# Add a new service at Hook.io
Click Create MicroService at the top navigation bar.
![100%](images/hook-new.png)
# Make sure to call it ```securityalert```

---
# Copy Tropo and Spark Logging Code
Copy the code from the repo - 
```securityalert.js``` (in the Lab 5 All Together Now Folder)
Paste it into the hook.io code editor and save.
Make sure you named it "securityalert" in hook.io
Your Hook.io URL for should looke like this

https://hook.io/jasonbarbee/securityalert

## We now have a webhook that accepts parameters to call to Spark and Tropo!

---
# Update your inventory keys
Update your Ansible inventory file with your tokens
```
[AWS-Routers]
35.166.172.203

[AWS-Routers:vars]
username="codecamp"
password="bettertogether"

[all:vars]
hookname="yourusername"
bottoken="yourSparkUserAuthenticationToken"
roomid="Y2lzY29zcGFyazovL3VzL1JPT00vYWI4NTk1YjAtY2M3NC0xMWU2LWJkMjUtZDU5Y2U3ZjUxOTE5"
numbertocall="yourcell"
customername="Example Customer"
```
The room key points to the Spark Code Camp Room

---
# Ansible - Call a conditional Task
### We will use include/when to match conditions in Ansible.

    - name: collect all facts from the device
      vyos_facts:
        gather_subset: all
        provider: "{{ cli }}"
      register: result

    - name: debug stuff
      debug:
        var: result.ansible_facts

    - include: security-alert.yml
      when: result.ansible_facts.ansible_net_version == "VyOS"
security-alert.yml contents will be included ONLY when the facts show that the device is a VyOS model

---
# Security Alert Task
### This task calls our Hook.io URL with some parameters. It makes a POST request to the URL.
This posts all the authentication needed to post to Spark and Tropo.
```
---
    - name: Security Alert
      shell: echo "SECURITY ALERT!"

    - name: Alert the NOC Team
      uri:
        url: "https://hook.io/{{ hookname }}/securityalert"
        method: POST
        HEADER_Content-Type: application/json
        body: '{ "bottoken" : "{{ bottoken }}", "hookname" : "{{ hookname }}", "ip" : "{{ inventory_hostname }}", "version" : "{{ result.ansible_facts.ansible_net_version }}", "hostname" : "{{ result.ansible_facts.ansible_net_hostname  }}", "roomid" : "{{ roomid }}", "numbertocall" : "{{ numbertocall }}", "customername" : "{{ customername }}"}'
        body_format: json
        validate_certs: no
```

---
# Run Ansible and see if it works!

```ansible-playbook -i inventory security-test.yml```
You should get a Spark message in the Code Camp Room 
# TekLinks Code Camp Q1 2017 Notes
Presenters Jason Barbee and Jeremy Sanders

# Prep 
* Download Vagrant and install - https://www.vagrantup.com/downloads.html
* Download Virtualbox and install https://www.virtualbox.org/wiki/Downloads
* Downoad the Code Camp repo by GIT or Zip file - top right button of this repo.
* git clone https://github.com/jasonbarbee/TekLinksCodeCamp-Jan-2017 
* Unzip and cd to the vagrant-code-camp folder
* issue command ```vagrant up```. give it 10 minutes. when done ```vagrant ssh``` to get inside the VM. 
* Change to the lab directory - ```cd /vagrant/Ansible`  
* ```ansible-playbook -i inventory vyos_commands.xml``` and you should get ansible output from my test AWS router.

Quick Reference Links
* Intro
* Ansible
* ChatBots
* Node/Platforms


## Intro

* [DevNet DNA Labs](https://learninglabs.cisco.com/tracks/devnet-express-dna?utm_source=brtiller_dna_lrntrkt1&utm_medium=blog&utm_campaign=dnamarketing)
Learn about the building blocks of the Cisco Digital Network Architecture (DNA), including an introduction to REST APIs, how to code in Python, and how to use programmability in the context of controllers and device-level interfaces.

* [Network Programmability for Engineers](https://learninglabs.cisco.com/tracks/netprog-eng)

## Ansible 

*[Python/Ansible for Network Engineers](https://pynet.twb-tech.com)

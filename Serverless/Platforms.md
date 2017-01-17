footer: TekLinks Code Camp
slidenumbers: true
autoscale: true

![inline](images/teklinks.png)
Code Camp
==

## Serverless Platforms
 Jason Barbee
Solutions Architect
CCIE #18039

---
Goals
==

1. Evolution of a Platform
1. Consumable Platforms today
1. Function as a Service
1. Lab Outline

---
# Compute in 2000's - Physical
Physical Server Farm

Provision Time - days
![100%](images/serverfarm.jpg)

---
# Compute in 2010 - Virtualization 
![60%](images/vmware.png)

VMWare Servers on physical hardware, SANs, Networking
Provision Time - ~ 1-2 hours

---
# Compute in 2017 - Microservices and APIs
* FAAS / Function as a Service Providers.
* AWS, Google, Azure, Webtasks

---
Goals
==

1. Evolution of a Platform
1. **Consumable Platforms today**
1. Bot Revolution
1. Function as a Service
1. Lab Outline


---
# API Connector Services
* IFTT
* Zapier

---
# IFTT.com - Consumer Facing Automation

Simple Action "Recipes"
![inline fit 100%](images/recipe.jpeg) 

^ Free. 

---
### IFTT - Custom Actions to anything
Add custom actions with Maker Channel to any URL.
![inline 50%](images/maker.png)

- Send a REST call to any endpoint on the internet.
- Make a Spark call, Tropo Call, Turn on/Off lights.

---
# Zapier.com - Business Logic Automattion
* More logic and customization of actions.
* Still End User Friendly. Free plan and up.
* 750+ API integrations
![inline 160%](images/zapier.png)    ![inline 40%](images/zapierdetails.png)

---
Goals
==

1. Evolution of a Platform
1. Consumable Platforms today
1. **Bot Revolution**
1. Function as a Service
1. Lab Outline


---
# Why would I want a bot?
We all hate calling and navigating IVRs.
Bots are a new User Interface.

* /reboot serverfarm
* /forward 5555555555
* any interaction

---
# Bot Platforms

* Gupshup.com
* Recast.ai
* wit.ai
* Flint Framework for Node
* Microsoft Bot Framework
* Serverless Bots with URL Web Hooks and Actions

![40%](images/gupshup.jpg)

---
Goals
==

1. Evolution of a Platform
1. Consumable Platforms today
1. Bot Revolution
1. **Function as a Service**
1. Lab Outline


---
# Function-As-A-Service
![inline 50%](images/googlecloud.jpeg) ![inline 20%](images/hookio.png)![inline 50%](images/webtask.png)
![inline 50%](images/AWSlambda.jpg) ![inline 50%](images/azure.png)

* Function as a Service to run small units of code on on requests or evenets
* Read or Write to a database.
* Call a Spark Log
* Call a payment processing and return a value.

---
# AWS Microservice Example
![inline fit 100%](images/NetOps-chat.png)

---
# AWS API Gateway 
* Accepts GET, POST, PUT all the REST APIs.
http://mynetopsbot.exampleamazon.com
{
    "Email": "jason.barbee@gmail.com",
    "Message": "do I have any routers running 12.2"
}


---
# AWS Components
Lambda

Our example : Lambda parses the language and intention, queries a database for security issues for 12.2.
Returns results to Lambda for processing.

---
# AWS Microservice Example
Lambda - adds language back to the message and sends to a Spark Web Hook.
http://spark.cisco.com
{
  "message" : "You have 2 routers running 12.2 vulnerable to 100+ PSIRT advisories"
  "roomID" : "1234123213125125234234"
}


---
# DynamoDB -  NoSQL Database 

### Let's start with SQL and compare to NoSQL
```sql
INSERT INTO book (
  `ISBN`, `title`, `author`
)
VALUES (
  '9780992461256', 
  'Mastering Windows NT 4.0', 
  'John Smith'
);
```
---
# DynamoDB - NoSQL Example
```javascript
db.book.insert({
  ISBN: "9780992461256",
  title: "Full Stack JavaScript",
  author: "Colin Ihrig & Adam Bretz"
});
```

---
# AWS Microservice Example Review
![inline fit 100%](images/NetOps-chat.png)

--- 
# What does a real function look like?

---
# Hello World at hook.io
Hello World

```javascript
module['exports'] = function helloWorld (hook) {
  hook.res.end("Hello world!"');
};
```

---
# Hello world at Webtask.io
```javascript
module.exports = 
	function (cb) {
    	cb(null, 'Hello World');
    }
```

---
# Make a API Gateway example
Login to AWS Console
Go to API Gateway. Click Getting Started. You'll get the PetStore API.

---
# Example API Gateway
AWS API Gateway
Click Getting Started to import the example PetStore API.

---
# My PetStore API - GET 
![inline fit](images/petstore1.png)

---
# PetStore GET - Response/Test
![inline %120](images/petstore3.png)

---
# Lab  4 - Simple Microservices @ Hook.io

Create a Hook.io Account
Make a function as a service process to call our Spark Logger.

---


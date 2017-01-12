![](images/teklinks.png)
Code Camp
==

<!-- footer: TekLinks Code Camp - Jan 2017 -->

<!-- *page_number: true -->

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
## FAAS / Function as a Service Providers.
AWS, Google, Azure, Webtasks
## API Integration Providers
IFTT, Zapier

---
# IFTT.com - Consumer Facing Automation

## Simple Action "Recipes"
![100%](images/recipe.jpeg) 
### Free. 
### Add custom actions with Maker Channel to any URL.

---
# Zapier.com - Business Logic Automattion
## More logic and customization of actions.
## Still End User Friendly. Free plan and up.
# 750+ API integrations
![160%](images/zapier.png)    ![40%](images/zapierdetails.png)

---
# Bot Builders

* Gupshup.com
* Recast.ai
* wit.ai
* Flint Framework for Node
* Microsoft Bot Framework
## Serverless Bots with URL Web Hooks and Actions

![40%](images/gupshup.jpg)

---
# Microservices / Function-As-A-Service
![80%](images/googlecloud.jpeg) ![40%](images/hookio.png)![80%](images/webtask.png)
![80%](images/AWSlambda.jpg) ![80%](images/azure.png)

Example Pricing
AWS Lambda -1 million executions free.
$0.000000208 per 100ms of compute time.

Webtasks.io - Free/1 per second...
hook.io - Free / 1000 requests per month

---
# AWS Components
API Gateway
* RESTFul API interface to run Lambda Code

---
# AWS Components
Llambda
Function as a Service to run small units of code on on requests or evenets
* Read or Write to a database.
* Call a Spark Log
* call a payment processing and return a value.


---
# AWS Components
### DynamoDB - managed NoSQL Database 
### SQL
```
INSERT INTO book (
  `ISBN`, `title`, `author`
)
VALUES (
  '9780992461256', 
  'Mastering Windows NT 4.0', 
  'John Smith'
);
```
### NoSQL
```
db.book.insert({
  ISBN: "9780992461256",
  title: "Full Stack JavaScript",
  author: "Colin Ihrig & Adam Bretz"
});
```
---
# AWS Microservice Example
![100%](images/NetOps-chat.png)

--- 
# Anatomy of a web hook at hook.io
Hello World
```
module['exports'] = function helloWorld (hook) {
  hook.res.end(host + ' says, "Hello world!"');
};
```

---
# Hello world at Webtask.io
```
module.exports = 
	function (cb) {
    	cb(null, 'Hello');
    }
```

---
# Lab  4 - Simple Microservices @ Hook.io

Create a Hook.io Account
Make a function as a service process to call our Spark Logger.

---


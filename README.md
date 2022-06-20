# Simple ERP

Enterprise resource planning (ERP) refers to a type of software that organizations use to manage day-to-day business activities such as accounting, procurement, project management, risk management and compliance, and supply chain operations. 

ERP systems tie together a multitude of business processes and enable the flow of data between them. By collecting an organization’s shared transactional data from multiple sources, ERP systems eliminate data duplication and provide data integrity with a single source of truth.

&emsp;
## Simple ERP?

"Simple ERP" is a website that references ERP architecture. 

To help companies record business processes and stage authorization.

Data visualization can help the business owner to easily monitor the company's performance.

* create document
* stage authorization
* pending file notification
* upload Signature picture
* User Interface management by department
* data visualization


## Demo

Demo Link： [https://simple-erp.website](https://simple-erp.website)
* test account：(recommend Use)

    * experience document signning
    * searching history document

| job grade |   department    | account   | password   |
|:-------- |:---------:| ------ | ------ |
| Boss     |   admin   | cccc   | 123456 |





* other test account


|  job grade |   department    | account   | password   |
|:-------- |:---------:| ------ | ------ |
| staff    |   sale    | aaaa   | 123456 |
| manager  |   sale    | pppp   | 123456 |
| staff    | purchase  | eeee   | 123456 |
| manager  | purchase  | iiii   | 123456 |
| staff    | logistics | nnnn   | 123456 |
| manager  | logistics | callme | 123456 |
| driver   | logistics | rrrr   | 123456 |



## Based on
### Back-End
* Python flask 
* RESTful
* Nginx
* Docker
* MySQL
* AWS EC2
* AWS S3
* AWS cloudfront


### Front-End
* HTML5
* CSS3
* JavaScript
* chart.js

## Backend Architecture

![](https://i.imgur.com/BmONUWh.png)

## Database Architecture

![](https://i.imgur.com/ihdxx8M.png)


## Features

### Register

* Register : When user register successful, he/she needs to remind system administrator to change job grade and department and then he/she can use the corresponding rank and department functions.

![](https://i.imgur.com/RsHcXn9.png)


### Set department and job grad

* Only system administrator can modify this page.
* Change user department and job grade.
* Change department manager.

![](https://i.imgur.com/oh5RTsG.png)

![](https://i.imgur.com/21zFiVe.gif)


### User Page

* upload head picture and Signature picture

![](https://i.imgur.com/wMHrP7D.png)

### My application

* Display uncomplete application document list applicated by user

![](https://i.imgur.com/eifLmH7.png)


### Create document
### Ex: Create a new client information document

* When document create successful will produce application ID

![](https://i.imgur.com/MMlPzbo.png)

![](https://i.imgur.com/hdQluKm.gif)


### Stage authorization

* When user sign into "Simple ERP", will see pending file notification show on upper right corner.

![](https://i.imgur.com/CgnJrvF.png)

* Insert comment

![](https://i.imgur.com/Kf84br8.png)

* Reject Buttom go back last stage.
* Approve Buttom go to next stage.

![](https://i.imgur.com/stFHIee.png)

![](https://i.imgur.com/8lLyq1W.gif)


### Create producet information document

* Upload product picture

![](https://i.imgur.com/m9ZXXi7.png)

* System will automatic culculate the suggestion price.
* When document create successful will produce application ID.

![](https://i.imgur.com/y94c5ZB.png)


### Special price set 

* Provid special price to client 

![](https://i.imgur.com/3YCt2if.png)



* If the client needs a special price, here could set special price.

![](https://i.imgur.com/quNr5Df.png)


### Sale order document create

![](https://i.imgur.com/uQD05L7.png)

![](https://i.imgur.com/i3b0YxN.gif)


### When sale order document authorization stage complete, application can use the buttom at right under corner to create a delivery bill. 

![](https://i.imgur.com/yHhjysE.png)

![](https://i.imgur.com/gfUCMkx.gif)



### Delivery bill stage authorization

* If quantity need to revise, picker could enter quantity adjustment and reason.

![](https://i.imgur.com/k1YO49z.png)

### If product arrive, delivery bill will update the arrival date 

![](https://i.imgur.com/uUK9CC3.png)


### search stock balance

![](https://i.imgur.com/b8mOKpI.png)

![](https://i.imgur.com/IC4bjSr.png)


### data visualization for sale order

![](https://i.imgur.com/G3nLCn8.png)



###### tags: `README`

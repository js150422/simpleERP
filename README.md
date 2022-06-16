# simpleERP

Enterprise resource planning (ERP) refers to a type of software that organizations use to manage day-to-day business activities such as accounting, procurement, project management, risk management and compliance, and supply chain operations. 

ERP systems tie together a multitude of business processes and enable the flow of data between them. By collecting an organization’s shared transactional data from multiple sources, ERP systems eliminate data duplication and provide data integrity with a single source of truth.

&emsp;
## simpleERP?

simpleERP is project refer to ERP and merchandising-sector companies.

* create document
* stages of document review
* review attention
* upload sign picture
* User Interface management by work department
* sign flow made by user grade
* simplify sign flow when payment Term meet the conditions
* data visualization


## Demo

Demo Link： [https://simple-erp.website](https://simple-erp.website)
* test account：(recommend Use)

    * can try sign document
    * search history document

| grade |   department    | account   | password   |
|:-------- |:---------:| ------ | ------ |
| Boss     |   admin   | cccc   | 123456 |





* other test account


| grade |   department    | account   | password   |
|:-------- |:---------:| ------ | ------ |
| staff    |   sale    | aaaa   | 123456 |
| manager  |   sale    | pppp   | 123456 |
| staff    | purchase  | eeee   | 123456 |
| manager  | purchase  | iiii   | 123456 |
| staff    | logistics | nnnn   | 123456 |
| manager  | logistics | callme | 123456 |
| driver   | logistics | rrrr   | 123456 |
| Boss     |   admin   | cccc   | 123456 |


## Based on
### Backend
* Python flask 
* RESTful
* Nginx
* Docker
* MySQL
* AWS EC2
* AWS S3
* AWS cloudfront


### Frontend
* HTML5
* CSS3
* javascript
* chart.js

## Backend Architecture

![](https://i.imgur.com/BmONUWh.png)

## Database Architecture

![](https://i.imgur.com/ihdxx8M.png)


## Features

### sign up

* sign up : success sign up and .
* user need made remind system administrator to change grade and department.

![](https://i.imgur.com/RsHcXn9.png)


### set department and grad 

* only system administrator can use this page.
* change user department adn grad.

![](https://i.imgur.com/oh5RTsG.png)

![](https://i.imgur.com/21zFiVe.gif)


### userPage

* upload head picture and sign picture

![](https://i.imgur.com/wMHrP7D.png)


* show uncomplete application document made by user list when user into this page

![](https://i.imgur.com/eifLmH7.png)


### create document(ex:create a new client information document)

* get application id after success create document

![](https://i.imgur.com/MMlPzbo.png)

![](https://i.imgur.com/hdQluKm.gif)


### review document

* When user inter simpleERP ,he will see review document quantity show on upper right corner.

![](https://i.imgur.com/CgnJrvF.png)

* create sign comment

![](https://i.imgur.com/Kf84br8.png)

* reject buttom go back last step.
* approve buttom go to next step.

![](https://i.imgur.com/stFHIee.png)

![](https://i.imgur.com/8lLyq1W.gif)


### create producet data

* onload product picture

![](https://i.imgur.com/m9ZXXi7.png)


* When product data success, user will get application Id.

![](https://i.imgur.com/y94c5ZB.png)


### special price set 

* provid special price to client 

![](https://i.imgur.com/3YCt2if.png)



* When create a sale order, if the client has a special price, it will be displayed in the sales price column, if not, it will be the suggested price.

![](https://i.imgur.com/quNr5Df.png)


### sale order create

![](https://i.imgur.com/uQD05L7.png)

![](https://i.imgur.com/i3b0YxN.gif)


### when sale order sign flow complete, application person can create a delivery bill by use turn buttom. 

![](https://i.imgur.com/yHhjysE.png)

![](https://i.imgur.com/gfUCMkx.gif)



### delivery bill sign

* picker can enter quantity adjustment and adjentment reason.

![](https://i.imgur.com/k1YO49z.png)

### product arrival update arrival date on delivery bill

![](https://i.imgur.com/uUK9CC3.png)


### search stock balance

![](https://i.imgur.com/b8mOKpI.png)

![](https://i.imgur.com/IC4bjSr.png)


### data visualization for sale order

![](https://i.imgur.com/G3nLCn8.png)

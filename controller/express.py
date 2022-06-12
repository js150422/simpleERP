import re

userRegExp = '^[a-z0-9_-]{3,15}$'
passwordRegExp = '[a-zA-Z0-9]{4,14}$'
emailRegExp = '^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$'
taxIdRegExp = '^[0-9]{8}$'
capitalRegExp = '^[0-9\s,.]{4,15}$'
phoneRegExp = '^[0-9-()]{6,15}$'
shortDescriptionRegExp = '^[a-zA-Z0-9\u4e00-\u9fa5\s，,.]{1,20}$'
longDescriptionRegExp = '^[a-zA-Z0-9\u4e00-\u9fa5\s，,.!]{1,50}$'
paymentTermRegExp = '^[a-zA-Z0-9\u4e00-\u9fa5\s，,.%]{1,30}$'
applicationTypeRegExp = '^[a-zA-Z]{1,30}$'
applicationIdRegExp = '^[A-Z]{2}[0-9]{10}'
departmentIdRegExp = '^[0-9]{1,4}$'
numberRegExp = '^[0-9-]{1,10}$'



class RegExpModel:

    def checkSign(self,data):
        if not re.search(userRegExp, data['user']):
            return {'error':True,'message':'帳號格式有問題'}

        if not re.search(passwordRegExp,data['password']):
            return {'error':True,'message':'密碼格式有問題'}

        if 'name' in data:
            if not re.search(shortDescriptionRegExp,data['name']):
                return {'error':True,'message':'姓名格式有問題'}

        if 'email' in data:
            if not re.search(emailRegExp, data['email']):
                return {'error':True,'message':'email格式有問題'}


    def checkClientCreateInfo(self,data):
        if not re.search(longDescriptionRegExp, data['clientName']):
            return {'error':True,'message':'廠商名稱格式有問題'}

        if not re.search(taxIdRegExp, data['taxId']):
            return {'error':True,'message':'統一編號格式有問題'}

        if not re.search(longDescriptionRegExp, data['clientAddress']):
            return {'error':True,'message':'地址格式有問題'}

        if not re.search(capitalRegExp, data['clientCapital']):
            return {'error':True,'message':'資本額格式有問題'}

        if not re.search(longDescriptionRegExp, data['contactName']):
            return {'error':True,'message':'聯絡人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp, data['contactPersonTile']):
            return {'error':True,'message':'聯絡人抬頭格式有問題'}

        if not re.search(phoneRegExp, data['contactPhone']):
            return {'error':True,'message':'電話格式有問題'}

        if not re.search(emailRegExp, data['contactEmail']):
            return {'error':True,'message':'email格式有問題'}

        if not re.search(paymentTermRegExp, data['paymentTerm']):
            return {'error':True,'message':'交易條件格式有問題'}

        if not re.search(shortDescriptionRegExp, data['clientCredit']):
            return {'error':True,'message':'信用額度格式有問題'}

        if not re.search(shortDescriptionRegExp,data['repEmployee']):
            return {'error':True,'message':'負責業務格式有問題'}


    def checkCommentInsert(self,data):
        if not re.search(applicationIdRegExp, data['applicationId']):
            return {'error':True,'message':'申請單號碼格式有問題'}

        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人格式有問題'}


        if not re.search(longDescriptionRegExp,data['commentText']):
            return {'error':True,'message':'簽核意見碼格式有問題'}


    def checkManagerInsert(self,data):
        if not re.search(departmentIdRegExp, str(data['departmentId'])):
            return {'error':True,'message':'部門編號格式有問題'}

        if not re.search(shortDescriptionRegExp, data['managerName']):
            return {'error':True,'message':'經理姓名格式有問題'}


    def checkProductInsert(self,data):
        if not re.search(shortDescriptionRegExp, data['productName']):
            return {'error':True,'message':'產品名稱格式有問題'}

        if not re.search(longDescriptionRegExp, data['supplierName']):
            return {'error':True,'message':'供應商名稱格式有問題'}

        if not re.search(numberRegExp, data['costPrice']):
            return {'error':True,'message':'進貨單價格式有問題'}

        if not re.search(shortDescriptionRegExp, data['productUnit']):
            return {'error':True,'message':'產品單位格式有問題'}

        if not re.search(longDescriptionRegExp, data['productDescription']):
            return {'error':True,'message':'產品敘述格式有問題'}

        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人格式有問題'}

        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}


    def checkSupplierCreateInfo(self,data):
        if not re.search(longDescriptionRegExp, data['supplierName']):
            return {'error':True,'message':'供應商名稱格式有問題'}

        if not re.search(taxIdRegExp, data['taxId']):
            return {'error':True,'message':'統一編號格式有問題'}

        if not re.search(longDescriptionRegExp, data['supplierAddress']):
            return {'error':True,'message':'供應商地址格式有問題'}

        if not re.search(capitalRegExp, data['supplierCapital']):
            return {'error':True,'message':'供應商資本額格式有問題'}

        if not re.search(longDescriptionRegExp, data['contactName']):
            return {'error':True,'message':'聯絡人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp, data['contactPersonTile']):
            return {'error':True,'message':'聯絡人抬頭格式有問題'}

        if not re.search(phoneRegExp, data['contactPhone']):
            return {'error':True,'message':'聯絡人電話格式有問題'}

        if not re.search(emailRegExp, data['contactEmail']):
            return {'error':True,'message':'聯絡人信箱格式有問題'}

        if not re.search(paymentTermRegExp, data['paymentTerm']):
            return {'error':True,'message':'交易條件格式有問題'}

        if not re.search(shortDescriptionRegExp,data['repEmployee']):
            return {'error':True,'message':'負責業務格式有問題'}


    def checkSpecialPriceInfo(self,data):
        if not re.search(applicationIdRegExp, data['clientId']):
            return {'error':True,'message':'廠商編號格式有問題'}

        if not re.search(applicationIdRegExp, data['productId']):
            return {'error':True,'message':'產品編號格式有問題'}

        if not re.search(numberRegExp, data['specialPrice']):
            return {'error':True,'message':'優惠價格格式有問題'}

        if not re.search(longDescriptionRegExp, data['specialDescription']):
            return {'error':True,'message':'優惠價格原因格式有問題'}

        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}



    def checkApplicationInfo(self,data):
        if 'name' in data:
            if not re.search(shortDescriptionRegExp,data['name']):
                return {'error':True,'message':'申請人格式有問題'}

        if not re.search(shortDescriptionRegExp,data['station']):
            return {'error':True,'message':'站別格式有問題'}

        if not re.search(applicationIdRegExp, data['applicationId']):
            return {'error':True,'message':'申請單編號格式有問題'}



    def checkSaleOrderCreateInfo(self,data):
        if not re.search(longDescriptionRegExp, data['clientName']):
            return {'error':True,'message':'廠商名稱格式有問題'}

        if not re.search(taxIdRegExp, data['taxId']):
            return {'error':True,'message':'統一編號格式有問題'}

        if not re.search(longDescriptionRegExp, data['clientAddress']):
            return {'error':True,'message':'廠商地址格式有問題'}

        if not re.search(longDescriptionRegExp, data['contactName']):
            return {'error':True,'message':'聯絡人格式有問題'}

        if not re.search(shortDescriptionRegExp, data['contactPersonTile']):
            return {'error':True,'message':'聯絡人抬頭格式有問題'}

        if not re.search(phoneRegExp, data['contactPhone']):
            return {'error':True,'message':'聯絡人電話格式有問題'}

        if not re.search(emailRegExp, data['contactEmail']):
            return {'error':True,'message':'聯絡人信箱格式有問題'}

        if not re.search(paymentTermRegExp, data['paymentTerm']):
            return {'error':True,'message':'交易條件格式有問題'}

        if not re.search(shortDescriptionRegExp, data['clientCredit']):
            return {'error':True,'message':'信用額度格式有問題'}

        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}

        if not re.search(shortDescriptionRegExp,data['repEmployee']):
            return {'error':True,'message':'負責業務姓名格式有問題'}

        for i in range(len(data['orderList'])):
            if not re.search(shortDescriptionRegExp, data['orderList'][i]['productName']):
                return {'error':True,'message':'產品名稱格式有問題'}

            if not re.search(numberRegExp, data['orderList'][i]['salePrice']):
                return {'error':True,'message':'售價格式有問題'}

            if not re.search(numberRegExp, data['orderList'][i]['OrderQuantity']):
                return {'error':True,'message':'訂單數量格式有問題'}


    def checkPurchaseOrderCreateInfo(self,data):
        if not re.search(longDescriptionRegExp, data['supplierName']):
            return {'error':True,'message':'供應商格式有問題'}

        if not re.search(taxIdRegExp, data['taxId']):
            return {'error':True,'message':'統一編號格式有問題'}

        if not re.search(longDescriptionRegExp, data['supplierAddress']):
            return {'error':True,'message':'地址格式有問題'}

        if not re.search(longDescriptionRegExp, data['contactName']):
            return {'error':True,'message':'聯絡人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp, data['contactPersonTile']):
            return {'error':True,'message':'聯絡人抬頭格式有問題'}

        if not re.search(phoneRegExp, data['contactPhone']):
            return {'error':True,'message':'聯絡人電話格式有問題'}

        if not re.search(emailRegExp, data['contactEmail']):
            return {'error':True,'message':'申請人信箱格式有問題'}

        if not re.search(paymentTermRegExp, data['paymentTerm']):
            return {'error':True,'message':'交易條件格式有問題'}

        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人姓名格式有問題'}

        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}

        if not re.search(shortDescriptionRegExp,data['repEmployee']):
            return {'error':True,'message':'負責業務格式有問題'}

        for i in range(len(data['orderList'])):
            if not re.search(shortDescriptionRegExp, data['orderList'][i]['productName']):
                return {'error':True,'message':'產品名稱格式有問題'}

            if not re.search(numberRegExp, data['orderList'][i]['costPrice']):
                return {'error':True,'message':'進貨價格格式有問題'}

            if not re.search(numberRegExp, data['orderList'][i]['OrderQuantity']):
                return {'error':True,'message':'訂單數量格式有問題'}


    def checkStockInsertInfo(self,data):
        if not re.search(applicationIdRegExp, data['applicationId']):
            return {'error':True,'message':'申請單號碼格式有問題'}

        for i in range(len(data['QchangeData'])):
            if not re.search(applicationIdRegExp, data['QchangeData'][i]['applicationId']):
                return {'error':True,'message':'產品編號格式有問題'}

            if not re.search(numberRegExp, str(data['QchangeData'][i]['Quantity'])):
                return {'error':True,'message':'產品數量格式有問題'}

            if not re.search(longDescriptionRegExp, data['QchangeData'][i]['reason']):
                return {'error':True,'message':'數量變動原因格式有問題'}


    def checkSignApplicationInfo(self,data):
        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人格式有問題'}

        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}

        if not re.search(applicationIdRegExp, data['applicationId']):
            return {'error':True,'message':'申請單編號格式有問題'}

        if 'auditAction' in data:
            if not re.search(longDescriptionRegExp,data['auditAction']):
                return {'error':True,'message':'簽核意見碼格式有問題'}

        if 'applicationType' in data:
            if not re.search(applicationTypeRegExp, data['applicationType']):
                return {'error':True,'message':'申請單類型格式有問題'}
        if 'departmentId' in data:
            if not re.search(departmentIdRegExp, str(data['departmentId'])):
                return {'error':True,'message':'部門編號格式有問題'}

        if 'station' in data:
            if not re.search(shortDescriptionRegExp,data['station']):
                return {'error':True,'message':'站別格式有問題'}
        if 'receiptNumber' in data:
            if not re.search(applicationIdRegExp, data['receiptNumber']):
                return {'error':True,'message':'入庫單編號格式有問題'}
        if 'deliverlyNumber' in data:
            if not re.search(applicationIdRegExp, data['deliverlyNumber']):
                return {'error':True,'message':'出庫單編號格式有問題'}




    def checkApplicationTurnInfo(self,data):
        if not re.search(shortDescriptionRegExp,data['name']):
            return {'error':True,'message':'申請人格式有問題'}

        if not re.search(applicationIdRegExp, data['applicationId']):
            return {'error':True,'message':'申請單編號格式有問題'}


    def checkSetEmployeeDepartmentInfo(self,data):
        if not re.search(departmentIdRegExp, str(data['departmentId'])):
            return {'error':True,'message':'部門編號格式有問題'}

        if not re.search(departmentIdRegExp, str(data['employeeId'])):
            return {'error':True,'message':'員工編號格式有問題'}


    def checkUpdateGradInfo(self,data):
        if not re.search(departmentIdRegExp, str(data['employeeId'])):
            return {'error':True,'message':'員工編號格式有問題'}
        if not re.search(shortDescriptionRegExp,data['grad']):
            return {'error':True,'message':'申請人職等格式有問題'}


regExp_Model=RegExpModel()
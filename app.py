
from datetime import timedelta
from controller.user import user
from controller.client import client
from controller.supplier import supplier
from controller.department import department
from controller.application import applicaton
from controller.comment import comment
from controller.product import product
from controller.saleOrder import saleOrder
from controller.purchaseOrder import purchaseOrder
from controller.specialPrice import specialPrice
from controller.deliveryBill import deliveryBill
from controller.receipt import receipt
from controller.stock import stock
from flask_jwt_extended import *
from flask import *
import os





app=Flask(__name__,static_url_path="/",static_folder="static")


app.config["JSON_AS_ASCII"]=False
app.config['JSON_SORT_KEYS'] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=4)
app.config["JWT_SECRET_KEY"] =  os.getenv('SECRET KEY')
app.secret_key = os.urandom(24)




app.register_blueprint(user)
app.register_blueprint(client)
app.register_blueprint(supplier)
app.register_blueprint(department)
app.register_blueprint(applicaton)
app.register_blueprint(comment)
app.register_blueprint(product)
app.register_blueprint(saleOrder)
app.register_blueprint(purchaseOrder)
app.register_blueprint(specialPrice)
app.register_blueprint(deliveryBill)
app.register_blueprint(receipt)
app.register_blueprint(stock)


jwt = JWTManager(app)


@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error":True,"message":"token過期"})


@jwt.invalid_token_loader
def my_invalid_token_callback(invalid_token):
	return jsonify({"error":True,"message":"非有效token"})

# -----------------------全部使用者都能用的功能-------------------------------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/main")
def main():
    return render_template("main.html")

@app.route("/user")
def userPage():
    return render_template("user.html")

@app.route("/myApplication")
def myApplication():
    return render_template("myApplication.html")


@app.route("/applicationList")
def applicationList():
    return render_template("applicationList.html")
# -----------------------管理功能-------------------------------


@app.route("/newStaff")
def newstaff():
    return render_template("./admin/newStaff.html")


@app.route("/announcement")
def announcement():
    return render_template("./admin/announcement.html")

@app.route("/systemRecord")
def systemRecord():
    return render_template("./admin/systemRecord.html")

# -----------------------銷售-------------------------------
# 廠商
@app.route("/createClient")
def createClient():
    return render_template("./sale/createClient.html")

@app.route("/searchClient")
def searchClient():
    return render_template("./sale/searchClient.html")

@app.route("/clientSingle")
def clientSingle():
    return render_template("./sale/clientSingle.html")

# 銷貨訂單
@app.route("/createSaleOrder")
def createSaleOrder():
    return render_template("./sale/createSaleOrder.html")

@app.route("/searchSaleOrder")
def searchSaleOrder():
    return render_template("./sale/searchSaleOrder.html")

@app.route("/saleOrderSingle")
def saleOrderSingle():
    return render_template("./sale/saleOrderSingle.html")

@app.route("/saleOrderReport")
def saleOrderReport():
    return render_template("./sale/saleOrderReport.html")

@app.route("/createSpecialPrice")
def createSpecialPrice():
    return render_template("./sale/createSpecialPrice.html")

@app.route("/specialPriceSingle")
def specialPriceSingle():
    return render_template("./sale/specialPriceSingle.html")

@app.route("/searchSpecialPrice")
def searchSpecialPrice():
    return render_template("./sale/searchSpecialPrice.html")


# -----------------------進貨-------------------------------

@app.route("/createSupplier")
def createSupplier():
    return render_template("./purchase/createSupplier.html")

@app.route("/searchSupplier")
def searchSupplier():
    return render_template("./purchase/searchSupplier.html")

@app.route("/supplierSingle")
def supplierSingle():
    return render_template("./purchase/supplierSingle.html")



@app.route("/createProduct")
def createProduct():
    return render_template("./purchase/createProduct.html")


@app.route("/createPurchaseOrder")
def createPurchaseOrder():
    return render_template("./purchase/createPurchaseOrder.html")



@app.route("/purchaseOrderSingle")
def purchaseOrderSingle():
    return render_template("./purchase/purchaseOrderSingle.html")



@app.route("/searchPurchaseOrder")
def searchPurchaseOrder():
    return render_template("./purchase/searchPurchaseOrder.html")



# -----------------------產品-------------------------------
@app.route("/productSingle")
def productSingle():
    return render_template("./product/productSingle.html")

@app.route("/searchProduct")
def searchProduct():
    return render_template("./product/searchProduct.html")

@app.route("/searchStockBalance")
def searchStockBalance():
    return render_template("./product/searchStockBalance.html")

@app.route("/searchStockChange")
def searchStockChange():
    return render_template("./product/searchStockChange.html")



# -----------------------物流-------------------------------

@app.route("/deliveryBill")
def deliveryBillPage():
    return render_template("./logistics/deliveryBill.html")

@app.route("/searchDeliveryBill")
def searchDeliveryBill():
    return render_template("./logistics/searchDeliveryBill.html")

@app.route("/stockReceipt")
def stockReceiptPage():
    return render_template("./logistics/stockReceipt.html")

@app.route("/searchStockReceipt")
def searchStockReceipt():
    return render_template("./logistics/searchStockReceipt.html")

@app.route("/test")
def test():
    return render_template("test.html")



app.run(host="0.0.0.0")



# app.secret_key = os.urandom(24) 隨機生成24位隨機字符
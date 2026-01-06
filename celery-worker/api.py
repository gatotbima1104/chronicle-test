from flask import Flask, request, jsonify
from tasks import order_process

app = Flask(__name__)

@app.route("/order", methods=["POST"])
def proess_queue():
    order_id = request.json["orderId"]
    order_process.delay(order_id)
    return jsonify({
        "status": "COMPLETED"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
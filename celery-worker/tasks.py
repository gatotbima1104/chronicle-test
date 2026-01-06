from celery_app import celery_app
import psycopg2
import os
import time

@celery_app.task(bind=True, autoretry_for=(Exception,), retry_backoff=5)
def order_process(self, order_id):
    print(f"[Celery] Processing order id {order_id}")

    connection = psycopg2.connect(os.environ["DATABASE_URL"])
    cursor = connection.cursor()

    time.sleep(5)

    cursor.execute(
        """
        SELECT "productId", quantity
        FROM "order_items"
        WHERE "orderId" = %s
        """,
        (order_id,)
    )

    items = cursor.fetchall()
    for product_id, qty in items:
        cursor.execute(
            """
            UPDATE "products"
            SET stock = stock - %s
            WHERE id = %s AND stock >= %s
            """,
            (qty, product_id, qty)
        )

        if cursor.rowcount == 0:
            raise Exception("INSUFFICIENT_STOCK")
        
    cursor.execute(
        """
        UPDATE "orders"
        SET status = %s
        WHERE id = %s
        """,
        ("COMPLETED", order_id)
    )

    connection.commit()
    cursor.close()
    connection.close()

    print(f"[Celery] order {order_id} done")
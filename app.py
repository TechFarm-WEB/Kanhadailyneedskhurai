from flask import Flask, render_template , jsonify, request
from decimal import Decimal, InvalidOperation
from datetime import datetime
import psycopg2

app = Flask(__name__)

def get_db_connection():
    return psycopg2.connect(
        host="dpg-dbvc53ks728c73dp5stg-a.virginia-postgres.render.com",
        database="techfarm_db_t6nn",
        user="techfarm_db_t6nn_user",
        password="WON9gBUsRXSlLRbIhTb4vMWSxi1c3P5Y",
        port="5432"
    )


def insert_default_products():

    conn = get_db_connection()
    cur = conn.cursor()

    products = [

        ("P1","Mother Dairy Gold Milk","6 Liter",0,396),
        ("P2","Mother Dairy Gold Milk","1 Liter",0,68),
        ("P3","Mother Dairy Gold Milk","500ml",0,34),

        ("P4","Mother Dairy Super T+ Milk","1 Liter",0,59),
        ("P5","Mother Dairy Super T Milk","1 Liter",0,56),

        ("P6","Mother Dairy TM Milk","500ml",0,27.50),

        ("P7","Mother Dairy Milk","320ml",0,18),

        ("P8","Mother Dairy बच्चा Milk","170ml",0,7.50),

        ("P9","Mother Dairy सादा मट्ठा","500ml",0,13.50),

        ("P10","Mother Dairy मसाला मट्ठा","270ml",0,9),

        ("P11","Mother Dairy Dahi Cup","80g",0,8.50),

        ("P12","Mother Dairy Dahi Cup","200g",0,22),

        ("P13","Mother Dairy Dahi Matki","5kg",0,370)

    ]

    for item in products:

        cur.execute("""

            INSERT INTO inventory_stock
            (
                product_id,
                product_name,
                pack_size,
                quantity,
                rate
            )

            VALUES(%s,%s,%s,%s,%s)

            ON CONFLICT(product_id)
            DO NOTHING

        """, item)

    conn.commit()

    cur.close()
    conn.close()

    print("Products Loaded")

# def create_inventory_table():

#     conn = get_db_connection()
#     cur = conn.cursor()

#     cur.execute("""

#         CREATE TABLE IF NOT EXISTS inventory_stock (

#             product_id VARCHAR(20) PRIMARY KEY,

#             product_name VARCHAR(200),

#             pack_size VARCHAR(50),

#             quantity INTEGER DEFAULT 0,

#             rate NUMERIC(10,2),

#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#         )

#     """)

#     conn.commit()

#     cur.close()
#     conn.close()

#     print("Inventory Table Ready")
# create_inventory_table()


# =====================================================================
# Developer       : Kanha Daily Needs
# Task            : Last Stock Entry History
# Description     : Stores product-wise details of every stock entry
# =====================================================================

def create_stock_additions_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE SEQUENCE IF NOT EXISTS stock_entry_id_seq
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS stock_additions (

            id BIGSERIAL PRIMARY KEY,

            entry_id BIGINT NOT NULL,

            product_id VARCHAR(20) NOT NULL,

            total_quantity INTEGER NOT NULL,

            total_amount NUMERIC(12,2) DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)
         # Ensure entry_id column exists in an already-created table
    cur.execute("""
            ALTER TABLE stock_additions
            ADD COLUMN IF NOT EXISTS entry_id BIGINT
        """)



    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_stock_additions_entry_id
        ON stock_additions(entry_id)
    """)

    conn.commit()

    cur.close()
    conn.close()

    print("Stock Additions History Table Ready")


create_stock_additions_table()


# =====================================================================
# Developer       : Gaurav Choudhary
# Date            : 23-11-2026
# Task            : Add Stock Enhancement
# Description     : Create Stock Additions Table to maintain
#                   product-wise stock addition history, including
#                   Total Quantity and Total Amount.
# =====================================================================

def create_stock_additions_table():

    conn = get_db_connection()
    cur = conn.cursor()

    # Create table to store individual stock addition records
    cur.execute("""
        CREATE TABLE IF NOT EXISTS stock_additions (

            id SERIAL PRIMARY KEY,

            product_id VARCHAR(20) NOT NULL,

            total_quantity NUMERIC(12,2) NOT NULL DEFAULT 0,

            total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    # Commit database changes
    conn.commit()

    # Close database resources
    cur.close()
    conn.close()

    print("Stock Additions Table Ready")


# Initialize Stock Additions Table
create_stock_additions_table()



insert_default_products()

def create_partner_table():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        CREATE TABLE IF NOT EXISTS delivery_partners (

            partner_id SERIAL PRIMARY KEY,

            partner_name VARCHAR(150) NOT NULL,

            mobile_no VARCHAR(20),

            address TEXT,

            status VARCHAR(20) DEFAULT 'Active',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    """)
   

    conn.commit()

    cur.close()

    conn.close()

    print("Partner Table Ready")

create_partner_table()



def create_partner_stock_table():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        CREATE TABLE IF NOT EXISTS partner_stock (

            id SERIAL PRIMARY KEY,

            partner_id INTEGER,

            product_id VARCHAR(20),

            quantity INTEGER,

            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    """)

    conn.commit()

    cur.close()

    conn.close()

    print("Partner Stock Table Ready")

def create_partner_transaction_table():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        CREATE TABLE IF NOT EXISTS partner_transactions (

            transaction_id SERIAL PRIMARY KEY,

            partner_id INTEGER,

            product_id VARCHAR(20),

            quantity INTEGER,

            rate NUMERIC(10,2),

            total_amount NUMERIC(12,2),

            cash_amount NUMERIC(12,2) DEFAULT 0,

            online_amount NUMERIC(12,2) DEFAULT 0,

            credit_amount NUMERIC(12,2) DEFAULT 0,

            status VARCHAR(20),

            remarks TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    """)

    conn.commit()

    cur.close()

    conn.close()

    print("Partner Transaction Table Ready")

insert_default_products()
create_partner_stock_table()
create_partner_transaction_table()




def create_partner_credit_payment_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS partner_credit_payments (

            payment_id SERIAL PRIMARY KEY,

            partner_id INTEGER NOT NULL,

            partner_name VARCHAR(150),

            amount NUMERIC(12,2) NOT NULL,

            payment_mode VARCHAR(20) DEFAULT 'Cash',

            remarks TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    conn.commit()

    cur.close()
    conn.close()

    print("Partner Credit Payment Table Ready")

create_partner_credit_payment_table()



@app.route("/record-partner-credit-payment", methods=["POST"])
def record_partner_credit_payment():

    data = request.get_json(silent=True) or {}

    # Validate partner ID
    try:
        partner_id = int(data.get("partner_id"))
        if partner_id <= 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid partner ID."
        }), 400

    # Validate payment amount
    try:
        amount = Decimal(str(data.get("amount", "")))

        if not amount.is_finite() or amount <= 0:
            raise ValueError

    except (InvalidOperation, ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Enter a valid payment amount."
        }), 400

    payment_mode = str(data.get("payment_mode", "Cash")).strip()

    if payment_mode not in ("Cash", "Online", "UPI"):
        return jsonify({
            "success": False,
            "message": "Invalid payment mode."
        }), 400

    remarks = str(data.get("remarks", "")).strip()

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        # Lock partner record while processing payment
        cur.execute("""
            SELECT partner_name
            FROM delivery_partners
            WHERE partner_id = %s
            FOR UPDATE
        """, (partner_id,))

        partner = cur.fetchone()

        if not partner:
            conn.rollback()
            return jsonify({
                "success": False,
                "message": "Delivery partner not found."
            }), 404

        partner_name = partner[0]

        # Calculate actual outstanding credit
        cur.execute("""
            SELECT
                COALESCE(
                    (SELECT SUM(credit_amount)
                     FROM partner_transactions
                     WHERE partner_id = %s), 0
                )
                -
                COALESCE(
                    (SELECT SUM(amount)
                     FROM partner_credit_payments
                     WHERE partner_id = %s), 0
                )
        """, (partner_id, partner_id))

        outstanding = cur.fetchone()[0] or Decimal("0")

        if amount > outstanding:
            conn.rollback()
            return jsonify({
                "success": False,
                "message": "Payment cannot exceed outstanding credit.",
                "outstanding_amount": float(outstanding)
            }), 400

        # Save received payment
        cur.execute("""
            INSERT INTO partner_credit_payments
            (
                partner_id,
                partner_name,
                amount,
                payment_mode,
                remarks
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING payment_id
        """, (
            partner_id,
            partner_name,
            amount,
            payment_mode,
            remarks
        ))

        payment_id = cur.fetchone()[0]

        conn.commit()

        return jsonify({
            "success": True,
            "payment_id": payment_id,
            "partner_name": partner_name,
            "payment_amount": float(amount),
            "outstanding_before": float(outstanding),
            "outstanding_after": float(outstanding - amount),
            "message": "Partner payment recorded successfully."
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        cur.close()
        conn.close()


@app.route("/get-pending-amount-summary", methods=["GET"])
def get_pending_amount_summary():

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            WITH credit AS (
                SELECT
                    partner_id,
                    SUM(COALESCE(credit_amount, 0)) AS total_credit
                FROM partner_transactions
                GROUP BY partner_id
            ),
            payments AS (
                SELECT
                    partner_id,
                    SUM(COALESCE(amount, 0)) AS total_paid
                FROM partner_credit_payments
                GROUP BY partner_id
            )
            SELECT
                dp.partner_id,
                dp.partner_name,
                COALESCE(c.total_credit, 0) AS total_credit,
                COALESCE(p.total_paid, 0) AS total_paid,
                COALESCE(c.total_credit, 0)
                    - COALESCE(p.total_paid, 0) AS outstanding
            FROM delivery_partners dp
            LEFT JOIN credit c
                ON dp.partner_id = c.partner_id
            LEFT JOIN payments p
                ON dp.partner_id = p.partner_id
            WHERE
                COALESCE(c.total_credit, 0)
                - COALESCE(p.total_paid, 0) > 0
            ORDER BY outstanding DESC
        """)

        partner_rows = cur.fetchall()

        partner_details = []
        partner_outstanding = Decimal("0")

        for row in partner_rows:

            outstanding = Decimal(str(row[4]))
            partner_outstanding += outstanding

            partner_details.append({
                "partner_id": row[0],
                "partner_name": row[1],
                "total_credit": float(row[2]),
                "total_paid": float(row[3]),
                "outstanding": float(outstanding)
            })

        # Customer module will be integrated later
        customer_outstanding = Decimal("0")

        total_pending = partner_outstanding + customer_outstanding

        return jsonify({
            "success": True,
            "summary": {
                "partner_outstanding": float(partner_outstanding),
                "customer_outstanding": float(customer_outstanding),
                "total_pending": float(total_pending)
            },
            "partners": partner_details,
            "customers": [],
            "customer_integration": "Pending - Customer module not developed yet"
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        cur.close()
        conn.close()
# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Counter Sales - Total Sales Integration
# Description: Create database table for recording counter sales.

def create_counter_sales_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS counter_sales (

            transaction_id SERIAL PRIMARY KEY,

            total_amount NUMERIC(12,2) NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    conn.commit()

    cur.close()
    conn.close()

    print("Counter Sales Table Ready")


create_counter_sales_table()


# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Counter Sales - Total Sales Integration
# Description: Save daily counter collection and provide dashboard sales total.

# def prepare_counter_sales_daily_record():

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:
#         # Add a separate business date for daily reconciliation
#         cur.execute("""
#             ALTER TABLE counter_sales
#             ADD COLUMN IF NOT EXISTS sale_date DATE
#         """)

#         cur.execute("""
#             UPDATE counter_sales
#             SET sale_date = created_at::date
#             WHERE sale_date IS NULL
#         """)

#         cur.execute("""
#             ALTER TABLE counter_sales
#             ALTER COLUMN sale_date SET DEFAULT CURRENT_DATE
#         """)

#         # One reconciliation record per day prevents duplicate totals
#         cur.execute("""
#             CREATE UNIQUE INDEX IF NOT EXISTS
#             idx_counter_sales_sale_date
#             ON counter_sales(sale_date)
#         """)

#         conn.commit()

#     except Exception:
#         conn.rollback()
#         raise

#     finally:
#         cur.close()
#         conn.close()


# prepare_counter_sales_daily_record()


# @app.route("/save-counter-sale", methods=["POST"])
# def save_counter_sale():

#     data = request.get_json(silent=True) or {}

#     try:
#         total_amount = Decimal(str(data.get("total_amount", "")))

#         if not total_amount.is_finite() or total_amount <= 0:
#             return jsonify({
#                 "success": False,
#                 "message": "Please enter a valid amount greater than zero."
#             }), 400

#     except (InvalidOperation, ValueError, TypeError):
#         return jsonify({
#             "success": False,
#             "message": "Invalid sales amount."
#         }), 400

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:
#         cur.execute("""
#             INSERT INTO counter_sales
#             (
#                 total_amount,
#                 sale_date
#             )
#             VALUES (%s, CURRENT_DATE)

#             ON CONFLICT (sale_date)
#             DO UPDATE SET
#                 total_amount = EXCLUDED.total_amount,
#                 created_at = CURRENT_TIMESTAMP

#             RETURNING transaction_id
#         """, (total_amount,))

#         transaction = cur.fetchone()

#         conn.commit()

#         return jsonify({
#             "success": True,
#             "transaction_id": transaction[0],
#             "total_amount": float(total_amount),
#             "message": "Counter sales saved successfully."
#         })

#     except Exception as e:
#         conn.rollback()

#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

#     finally:
#         cur.close()
#         conn.close()



# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Counter Sales and Partner Collection Integration
# Description: Store every counter collection separately and calculate total sales using counter collections and partner cash/online payments.

def prepare_counter_sales_daily_record():

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            ALTER TABLE counter_sales
            ADD COLUMN IF NOT EXISTS sale_date DATE
        """)

        cur.execute("""
            UPDATE counter_sales
            SET sale_date = created_at::date
            WHERE sale_date IS NULL
        """)

        cur.execute("""
            ALTER TABLE counter_sales
            ALTER COLUMN sale_date SET DEFAULT CURRENT_DATE
        """)

        # Multiple counter entries per day are now allowed
        cur.execute("""
            DROP INDEX IF EXISTS idx_counter_sales_sale_date
        """)

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close()
        conn.close()


prepare_counter_sales_daily_record()


@app.route("/save-counter-sale", methods=["POST"])
def save_counter_sale():

    data = request.get_json(silent=True) or {}

    try:

        total_amount = Decimal(str(data.get("total_amount", "")))

        if not total_amount.is_finite() or total_amount <= 0:
            return jsonify({
                "success": False,
                "message": "Please enter a valid amount greater than zero."
            }), 400

    except (InvalidOperation, ValueError, TypeError):

        return jsonify({
            "success": False,
            "message": "Invalid sales amount."
        }), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        # Insert a new record for every counter collection
        cur.execute("""
            INSERT INTO counter_sales
            (
                total_amount,
                sale_date
            )
            VALUES (%s, CURRENT_DATE)
            RETURNING transaction_id
        """, (total_amount,))

        transaction = cur.fetchone()

        conn.commit()

        return jsonify({
            "success": True,
            "transaction_id": transaction[0],
            "total_amount": float(total_amount),
            "message": "Counter sale saved successfully."
        })

    except Exception as e:

        conn.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        cur.close()
        conn.close()


@app.route("/get-total-sales")
def get_total_sales():

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        cur.execute("""
            SELECT
                (
                    SELECT COALESCE(SUM(total_amount), 0)
                    FROM counter_sales
                    WHERE sale_date = CURRENT_DATE
                )
                +
                (
                    SELECT COALESCE(
                        SUM(
                            COALESCE(cash_amount, 0)
                            +
                            COALESCE(online_amount, 0)
                        ),
                        0
                    )
                    FROM partner_transactions
                    WHERE created_at::date = CURRENT_DATE
                )
        """)

        total = cur.fetchone()[0]

        return jsonify({
            "success": True,
            "total_sales": float(total)
        })

    finally:

        cur.close()
        conn.close()



@app.route("/get-total-sales-details")
def get_total_sales_details():

    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Today's Counter Sales
        cur.execute("""
            SELECT
                transaction_id,
                total_amount,
                sale_date,
                created_at
            FROM counter_sales
            WHERE sale_date = CURRENT_DATE
            ORDER BY created_at DESC
        """)

        counter_rows = cur.fetchall()

        counter_sales = [
            {
                "transaction_id": row[0],
                "total_amount": float(row[1] or 0),
                "sale_date": row[2].strftime("%d-%m-%Y") if row[2] else "",
                "created_at": row[3].strftime("%H:%M:%S") if row[3] else ""
            }
            for row in counter_rows
        ]

        # 2. Today's Driver/Partner Transactions
        cur.execute("""
            SELECT
                transaction_id,
                partner_id,
                partner_name,
                product_id,
                product_name,
                quantity,
                rate,
                total_amount,
                cash_amount,
                online_amount,
                credit_amount,
                status,
                created_at
            FROM partner_transactions
            WHERE created_at::date = CURRENT_DATE
            ORDER BY created_at DESC
        """)

        transaction_rows = cur.fetchall()

        partner_transactions = [
            {
                "transaction_id": row[0],
                "partner_id": row[1],
                "partner_name": row[2],
                "product_id": row[3],
                "product_name": row[4],
                "quantity": int(row[5] or 0),
                "rate": float(row[6] or 0),
                "total_amount": float(row[7] or 0),
                "cash_amount": float(row[8] or 0),
                "online_amount": float(row[9] or 0),
                "credit_amount": float(row[10] or 0),
                "payment_mode": row[11],
                "created_at": row[12].strftime("%H:%M:%S") if row[12] else ""
            }
            for row in transaction_rows
        ]

        # 3. Calculate Sales Summary
        counter_total = sum(
            item["total_amount"] for item in counter_sales
        )

        driver_cash = sum(
            item["cash_amount"] for item in partner_transactions
        )

        driver_online = sum(
            item["online_amount"] for item in partner_transactions
        )

        driver_credit = sum(
            item["credit_amount"] for item in partner_transactions
        )

        total_sales = counter_total + driver_cash + driver_online

        return jsonify({
            "success": True,
            "date": datetime.now().strftime("%d-%m-%Y"),

            "summary": {
                "counter_sales": round(counter_total, 2),
                "driver_cash": round(driver_cash, 2),
                "driver_online": round(driver_online, 2),
                "driver_credit": round(driver_credit, 2),
                "total_sales": round(total_sales, 2)
            },

            "counter_transactions": counter_sales,
            "partner_transactions": partner_transactions
        })

    except Exception as e:

        print("TOTAL SALES DETAILS ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:
        if cur:
            cur.close()

        if conn:
            conn.close()


# @app.route("/get-total-sales")
# def get_total_sales():

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:
#         cur.execute("""
#             SELECT
#                 COALESCE(SUM(total_amount), 0)
#             FROM counter_sales
#             WHERE sale_date = CURRENT_DATE
#         """)

#         row = cur.fetchone()

#         return jsonify({
#             "success": True,
#             "total_sales": float(row[0])
#         })

#     finally:
#         cur.close()
#         conn.close()


# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Assign Stock Enhancement
# Description: Create assignment-wise summary table to store
# total assigned quantity and total assigned amount.

def create_partner_assignment_summary_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS partner_assignment_summary (

            assignment_id SERIAL PRIMARY KEY,

            partner_id INTEGER,

            partner_name VARCHAR(150),

            total_quantity INTEGER NOT NULL DEFAULT 0,

            total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,

            payment_mode VARCHAR(20),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
    """)

    conn.commit()

    cur.close()
    conn.close()

    print("Partner Assignment Summary Table Ready")


create_partner_assignment_summary_table()


@app.route("/check-partner-transactions")
def check_partner_transactions():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT table_name

        FROM information_schema.tables

        WHERE table_name='partner_transactions'

    """)

    result = cur.fetchone()

    cur.close()

    conn.close()

    return str(result)

@app.route("/test-partner-transaction")
def test_partner_transaction():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        INSERT INTO partner_transactions

        (
            partner_id,
            product_id,
            quantity,
            rate,
            total_amount,
            cash_amount,
            online_amount,
            credit_amount,
            status,
            remarks
        )

        VALUES

        (
            1,
            'P2',
            10,
            68,
            680,
            300,
            200,
            180,
            'Partial',
            'Testing Entry'
        )

    """)

    conn.commit()

    cur.close()

    conn.close()

    return "Transaction Inserted Successfully"

@app.route("/view-partner-transactions")
def view_partner_transactions():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT *

        FROM partner_transactions

        ORDER BY transaction_id DESC

    """)

    rows = cur.fetchall()

    cur.close()

    conn.close()

    return str(rows)

def add_partner_name_column():

    conn = get_db_connection()

    cur = conn.cursor()

    try:

        cur.execute("""

            ALTER TABLE partner_transactions

            ADD COLUMN partner_name VARCHAR(150)

        """)

        conn.commit()

        print("partner_name column added")

    except Exception:

        conn.rollback()

        print("partner_name already exists")

    cur.close()

    conn.close()

add_partner_name_column()

@app.route("/test-partner-name")
def test_partner_name():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        INSERT INTO partner_transactions

        (
            partner_id,
            partner_name,
            product_id,
            quantity,
            rate,
            total_amount,
            cash_amount,
            online_amount,
            credit_amount,
            status,
            remarks
        )

        VALUES

        (
            1,
            'Gaurav Choudhary',
            'P2',
            5,
            68,
            340,
            100,
            100,
            140,
            'Partial',
            'Partner Name Test'
        )

    """)

    conn.commit()

    cur.close()

    conn.close()

    return "Partner Name Saved"

def add_product_name_column():

    conn = get_db_connection()

    cur = conn.cursor()

    try:

        cur.execute("""

            ALTER TABLE partner_transactions

            ADD COLUMN product_name VARCHAR(200)

        """)

        conn.commit()

        print("product_name column added")

    except Exception:

        conn.rollback()

        print("product_name already exists")

    cur.close()

    conn.close()
add_product_name_column()

@app.route("/test-product-name")
def test_product_name():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        INSERT INTO partner_transactions

        (
            partner_id,
            partner_name,
            product_id,
            product_name,
            quantity,
            rate,
            total_amount,
            cash_amount,
            online_amount,
            credit_amount,
            status,
            remarks
        )

        VALUES

        (
            1,
            'Gaurav Choudhary',
            'P2',
            'Mother Dairy Gold Milk 1 Liter',
            2,
            68,
            136,
            136,
            0,
            0,
            'Paid',
            'Product Name Test'
        )

    """)

    conn.commit()

    cur.close()

    conn.close()

    return "Product Name Saved"

@app.route("/get-partner-stock-summary")
def get_partner_stock_summary():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT

        COALESCE(
            SUM(ps.quantity),
            0
        ) AS total_stock,

        COALESCE(
            SUM(
                ps.quantity * i.rate
            ),
            0
        ) AS total_amount

        FROM partner_stock ps

        JOIN inventory_stock i

        ON ps.product_id = i.product_id

    """)

    row = cur.fetchone()

    cur.close()

    conn.close()

    return jsonify({

        "total_stock": int(row[0]),

        "total_amount": float(row[1])

    })


@app.route("/get-partner-stock-details")
def get_partner_stock_details():

    conn = None
    cur = None

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch partner-wise and product-wise assigned stock
        cur.execute("""
            SELECT
                dp.partner_id,
                dp.partner_name,

                ps.product_id,
                i.product_name,
                i.pack_size,
                i.rate,

                SUM(ps.quantity) AS total_quantity,

                SUM(ps.quantity * i.rate) AS total_amount

            FROM partner_stock ps

            INNER JOIN delivery_partners dp
                ON ps.partner_id = dp.partner_id

            INNER JOIN inventory_stock i
                ON ps.product_id = i.product_id

            GROUP BY
                dp.partner_id,
                dp.partner_name,
                ps.product_id,
                i.product_name,
                i.pack_size,
                i.rate

            ORDER BY
                dp.partner_name,
                i.product_name,
                i.pack_size
        """)

        rows = cur.fetchall()

        partners = {}

        grand_total_quantity = 0
        grand_total_amount = 0

        for row in rows:

            partner_id = row[0]
            partner_name = row[1]

            quantity = int(row[6] or 0)
            amount = float(row[7] or 0)

            if partner_id not in partners:

                partners[partner_id] = {
                    "partner_id": partner_id,
                    "partner_name": partner_name,
                    "total_quantity": 0,
                    "total_amount": 0,
                    "products": []
                }

            partners[partner_id]["products"].append({

                "product_id": row[2],
                "product_name": row[3],
                "pack_size": row[4],
                "rate": float(row[5] or 0),
                "quantity": quantity,
                "total_amount": amount

            })

            partners[partner_id]["total_quantity"] += quantity
            partners[partner_id]["total_amount"] += amount

            grand_total_quantity += quantity
            grand_total_amount += amount

        return jsonify({

            "success": True,

            "grand_total_quantity": grand_total_quantity,

            "grand_total_amount": round(
                grand_total_amount, 2
            ),

            "total_partners": len(partners),

            "partners": list(partners.values())

        })

    except Exception as e:

        print("PARTNER STOCK DETAILS ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()

# # def create_partner_transaction_table():

#     conn = get_db_connection()

#     cur = conn.cursor()

#     cur.execute("""

#         CREATE TABLE IF NOT EXISTS partner_transactions (

#             transaction_id SERIAL PRIMARY KEY,

#             partner_id INTEGER,

#             product_id VARCHAR(20),

#             quantity INTEGER,

#             rate NUMERIC(10,2),

#             total_amount NUMERIC(12,2),

#             cash_amount NUMERIC(12,2) DEFAULT 0,

#             online_amount NUMERIC(12,2) DEFAULT 0,

#             credit_amount NUMERIC(12,2) DEFAULT 0,

#             status VARCHAR(20),

#             remarks TEXT,

#             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

#         )

#     """)

#     conn.commit()

#     cur.close()

#     conn.close()

#     print("Partner Transaction Table Ready")


@app.route("/get-partners")
def get_partners():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT
        partner_id,
        partner_name

        FROM delivery_partners

        ORDER BY partner_name

    """)

    rows = cur.fetchall()

    cur.close()

    conn.close()

    return jsonify(rows)    

# @app.route("/assign-stock", methods=["POST"])
# def assign_stock():

#     data = request.get_json()

#     partner_id = data["partner_id"]

#     payment_mode = data["payment_mode"]

#     items = data["items"]

#     conn = get_db_connection()

#     cur = conn.cursor()

#     cur.execute("""

#         SELECT partner_name

#         FROM delivery_partners

#         WHERE partner_id = %s

#     """, (partner_id,))

#     partner_row = cur.fetchone()

#     partner_name = partner_row[0]

#     for item in items:

#         product_id = item["product_id"]

#         quantity = item["quantity"]

#         # Inventory Reduce

#         cur.execute("""

#             UPDATE inventory_stock

#             SET quantity = quantity - %s

#             WHERE product_id = %s

#         """,

#         (
#             quantity,
#             product_id
#         ))

#         # Partner Stock Add

#         cur.execute("""

#             INSERT INTO partner_stock
#             (
#                 partner_id,
#                 product_id,
#                 quantity
#             )

#             VALUES
#             (
#                 %s,
#                 %s,
#                 %s
#             )

#         """,

#         (
#             partner_id,
#             product_id,
#             quantity
#         ))

#         # Product Detail Fetch

#         cur.execute("""

#             SELECT
#             product_name,
#             rate

#             FROM inventory_stock

#             WHERE product_id = %s

#         """, (product_id,))

#         product = cur.fetchone()

#         product_name = product[0]

#         rate = float(product[1])

#         total_amount = quantity * rate

#         cash_amount = 0
#         online_amount = 0
#         credit_amount = 0

#         if payment_mode == "Cash":

#             cash_amount = total_amount

#         elif payment_mode == "Online":

#             online_amount = total_amount

#         else:

#             credit_amount = total_amount

#         cur.execute("""

#             INSERT INTO partner_transactions

#             (
#                 partner_id,
#                 partner_name,
#                 product_id,
#                 product_name,
#                 quantity,
#                 rate,
#                 total_amount,
#                 cash_amount,
#                 online_amount,
#                 credit_amount,
#                 status
#             )

#             VALUES

#             (
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s,
#                 %s
#             )

#         """,

#         (
#             partner_id,
#             partner_name,
#             product_id,
#             product_name,
#             quantity,
#             rate,
#             total_amount,
#             cash_amount,
#             online_amount,
#             credit_amount,
#             payment_mode
#         ))

#     conn.commit()

#     cur.close()

#     conn.close()

#     return jsonify({

#         "success": True

#     })


# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Assign Stock Enhancement
# Description: Save assignment-wise Total Quantity and Total Amount
#              along with existing product-wise stock transactions.


# Developer: Gaurav Choudhary
# Date: 23-11-2026
# Task: Assign Stock - Stock Availability Validation
# Description: Prevent assignment beyond available inventory and maintain
#              partner stock, payment transactions and assignment summary.

@app.route("/assign-stock", methods=["POST"])
def assign_stock():

    data = request.get_json()

    partner_id = data["partner_id"]
    payment_mode = data["payment_mode"]
    items = data["items"]

    conn = get_db_connection()
    cur = conn.cursor()

    try:

        # Fetch Partner Details
        cur.execute("""
            SELECT partner_name
            FROM delivery_partners
            WHERE partner_id = %s
        """, (partner_id,))

        partner_row = cur.fetchone()

        if not partner_row:
            raise Exception("Partner not found")

        partner_name = partner_row[0]

        # Validate Items
        if not items:
            raise Exception("No products selected for assignment.")

        # Assignment Summary Variables
        total_quantity = 0
        total_amount = 0

        # Process Product-wise Assignment
        for item in items:

            product_id = item["product_id"]

            # Validate Quantity
            try:
                quantity = int(item["quantity"])
            except (ValueError, TypeError):
                raise Exception(
                    f"Invalid quantity for product: {product_id}"
                )

            if quantity <= 0:
                raise Exception(
                    f"Quantity must be greater than zero for product: {product_id}"
                )

            # Fetch Product Details Before Stock Update
            cur.execute("""
                SELECT product_name, rate
                FROM inventory_stock
                WHERE product_id = %s
            """, (product_id,))

            product = cur.fetchone()

            if not product:
                raise Exception(f"Product not found: {product_id}")

            product_name = product[0]
            rate = float(product[1])

            item_total_amount = quantity * rate

            # Reduce Inventory Only If Sufficient Stock Is Available
            cur.execute("""
                UPDATE inventory_stock
                SET quantity = quantity - %s
                WHERE product_id = %s
                AND quantity >= %s
            """, (
                quantity,
                product_id,
                quantity
            ))

            # Check Whether Inventory Was Successfully Reduced
            if cur.rowcount == 0:

                # Fetch Latest Available Stock
                cur.execute("""
                    SELECT product_name, quantity
                    FROM inventory_stock
                    WHERE product_id = %s
                """, (product_id,))

                stock_row = cur.fetchone()

                if stock_row:
                    raise Exception(
                        f"Insufficient stock for {stock_row[0]}. "
                        f"Available: {stock_row[1]}, "
                        f"Requested: {quantity}."
                    )

                raise Exception(
                    f"Product not found in inventory: {product_id}"
                )

            # Calculate Assignment Totals
            total_quantity += quantity
            total_amount += item_total_amount

            # Add Stock to Partner
            cur.execute("""
                INSERT INTO partner_stock
                (partner_id, product_id, quantity)
                VALUES (%s, %s, %s)
            """, (
                partner_id,
                product_id,
                quantity
            ))

            # Payment Mode Amount Distribution
            cash_amount = 0
            online_amount = 0
            credit_amount = 0

            if payment_mode == "Cash":
                cash_amount = item_total_amount

            elif payment_mode == "Online":
                online_amount = item_total_amount

            else:
                credit_amount = item_total_amount

            # Save Product-wise Transaction
            cur.execute("""
                INSERT INTO partner_transactions
                (
                    partner_id,
                    partner_name,
                    product_id,
                    product_name,
                    quantity,
                    rate,
                    total_amount,
                    cash_amount,
                    online_amount,
                    credit_amount,
                    status
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """, (
                partner_id,
                partner_name,
                product_id,
                product_name,
                quantity,
                rate,
                item_total_amount,
                cash_amount,
                online_amount,
                credit_amount,
                payment_mode
            ))

        # Save One Assignment-wise Summary Record
        cur.execute("""
            INSERT INTO partner_assignment_summary
            (
                partner_id,
                partner_name,
                total_quantity,
                total_amount,
                payment_mode
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            partner_id,
            partner_name,
            total_quantity,
            total_amount,
            payment_mode
        ))

        # Commit Only After All Products Are Successfully Assigned
        conn.commit()

        return jsonify({
            "success": True,
            "message": "Stock assigned successfully.",
            "total_quantity": total_quantity,
            "total_amount": round(total_amount, 2)
        })

    except Exception as e:

        # Rollback Entire Assignment If Any Product Fails
        conn.rollback()

        return jsonify({
            "success": False,
            "message": str(e)
        }), 409

    finally:

        cur.close()
        conn.close()



# =====================================================================
# Developer       : Gaurav Choudhary
# Task            : Assign Stock - Current Inventory Availability
# Description     : Returns product-wise available stock for assignment.
# API             : GET /get-available-stock
# =====================================================================

@app.route("/get-available-stock", methods=["GET"])
def get_available_stock():

    conn = None
    cur = None

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                product_id,
                product_name,
                pack_size,
                quantity,
                rate
            FROM inventory_stock
            ORDER BY product_id
        """)

        rows = cur.fetchall()

        products = []

        for row in rows:

            products.append({

                "product_id": row[0],
                "product_name": row[1],
                "pack_size": row[2],
                "available_quantity": int(row[3] or 0),
                "rate": float(row[4] or 0)

            })

        return jsonify({

            "success": True,
            "products": products

        })

    except Exception as e:

        print("GET AVAILABLE STOCK ERROR:", str(e))

        return jsonify({

            "success": False,
            "message": str(e)

        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()


# =====================================================================
# Developer       : Gaurav Choudhary
# Task            : Last Stock Assignment Details
# Description     : Fetch latest vendor assignment and product-wise
#                   assigned stock details from PostgreSQL.
# API             : GET /get-last-stock-assignment
# =====================================================================

@app.route("/get-last-stock-assignment", methods=["GET"])
def get_last_stock_assignment():

    conn = None
    cur = None

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch the latest assignment summary and its product details
        cur.execute("""
            SELECT
                s.assignment_id,
                s.partner_id,
                s.partner_name,
                s.total_quantity,
                s.total_amount,
                s.payment_mode,
                s.created_at,

                pt.product_id,
                COALESCE(pt.product_name, i.product_name),
                i.pack_size,
                pt.quantity,
                pt.rate,
                pt.total_amount

            FROM (
                SELECT *
                FROM partner_assignment_summary
                ORDER BY assignment_id DESC
                LIMIT 1
            ) s

            LEFT JOIN partner_transactions pt
                ON pt.partner_id = s.partner_id
                AND pt.created_at = s.created_at

            LEFT JOIN inventory_stock i
                ON i.product_id = pt.product_id

            ORDER BY pt.transaction_id
        """)

        rows = cur.fetchall()

        if not rows:

            return jsonify({
                "success": True,
                "message": "No stock assignment found",
                "assignment_id": None,
                "items": []
            })

        first_row = rows[0]

        items = []

        for row in rows:

            # Skip empty product row if no transaction exists
            if row[7] is None:
                continue

            items.append({

                "product_id": row[7],
                "product_name": row[8],
                "pack_size": row[9],
                "quantity": int(row[10] or 0),
                "rate": float(row[11] or 0),
                "total_amount": float(row[12] or 0)

            })

        return jsonify({

            "success": True,

            "assignment_id": first_row[0],
            "partner_id": first_row[1],
            "partner_name": first_row[2],

            "total_quantity": int(first_row[3] or 0),
            "total_amount": float(first_row[4] or 0),

            "payment_mode": first_row[5],

            "created_at": (
                first_row[6].isoformat()
                if first_row[6] else None
            ),

            "items": items

        })

    except Exception as e:

        print("GET LAST STOCK ASSIGNMENT ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()

# @app.route("/assign-stock", methods=["POST"])
# def assign_stock():

#     data = request.get_json()

#     partner_id = data["partner_id"]
#     payment_mode = data["payment_mode"]
#     items = data["items"]

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:

#         # Fetch Partner Details
#         cur.execute("""
#             SELECT partner_name
#             FROM delivery_partners
#             WHERE partner_id = %s
#         """, (partner_id,))

#         partner_row = cur.fetchone()

#         if not partner_row:
#             raise Exception("Partner not found")

#         partner_name = partner_row[0]

#         # Assignment Summary Variables
#         total_quantity = 0
#         total_amount = 0

#         # Process Product-wise Assignment
#         for item in items:

#             product_id = item["product_id"]
#             quantity = int(item["quantity"])

#             # Fetch Product Details Before Stock Update
#             cur.execute("""
#                 SELECT product_name, rate
#                 FROM inventory_stock
#                 WHERE product_id = %s
#             """, (product_id,))

#             product = cur.fetchone()

#             if not product:
#                 raise Exception(f"Product not found: {product_id}")

#             product_name = product[0]
#             rate = float(product[1])

#             item_total_amount = quantity * rate

#             # Calculate Assignment Totals
#             total_quantity += quantity
#             total_amount += item_total_amount

#             # Reduce Inventory Stock
#             cur.execute("""
#                 UPDATE inventory_stock
#                 SET quantity = quantity - %s
#                 WHERE product_id = %s
#             """, (quantity, product_id))

#             # Add Stock to Partner
#             cur.execute("""
#                 INSERT INTO partner_stock
#                 (partner_id, product_id, quantity)
#                 VALUES (%s, %s, %s)
#             """, (partner_id, product_id, quantity))

#             # Payment Mode Amount Distribution
#             cash_amount = 0
#             online_amount = 0
#             credit_amount = 0

#             if payment_mode == "Cash":
#                 cash_amount = item_total_amount

#             elif payment_mode == "Online":
#                 online_amount = item_total_amount

#             else:
#                 credit_amount = item_total_amount

#             # Save Existing Product-wise Transaction
#             cur.execute("""
#                 INSERT INTO partner_transactions
#                 (
#                     partner_id,
#                     partner_name,
#                     product_id,
#                     product_name,
#                     quantity,
#                     rate,
#                     total_amount,
#                     cash_amount,
#                     online_amount,
#                     credit_amount,
#                     status
#                 )
#                 VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
#             """, (
#                 partner_id,
#                 partner_name,
#                 product_id,
#                 product_name,
#                 quantity,
#                 rate,
#                 item_total_amount,
#                 cash_amount,
#                 online_amount,
#                 credit_amount,
#                 payment_mode
#             ))

#         # Save One Assignment-wise Summary Record
#         cur.execute("""
#             INSERT INTO partner_assignment_summary
#             (
#                 partner_id,
#                 partner_name,
#                 total_quantity,
#                 total_amount,
#                 payment_mode
#             )
#             VALUES (%s, %s, %s, %s, %s)
#         """, (
#             partner_id,
#             partner_name,
#             total_quantity,
#             total_amount,
#             payment_mode
#         ))

#         conn.commit()

#         return jsonify({
#             "success": True,
#             "total_quantity": total_quantity,
#             "total_amount": round(total_amount, 2)
#         })

#     except Exception as e:

#         conn.rollback()

#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

#     finally:

#         cur.close()
#         conn.close()



@app.route("/add-partner", methods=["POST"])
def add_partner():

    data = request.get_json()

    partner_name = data["partner_name"]

    mobile_no = data["mobile_no"]

    address = data["address"]

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        INSERT INTO delivery_partners

        (
            partner_name,
            mobile_no,
            address
        )

        VALUES

        (%s, %s, %s)

    """,

    (

        partner_name,
        mobile_no,
        address

    ))

    conn.commit()

    cur.close()

    conn.close()

    return jsonify({

        "success": True

    })

@app.route("/partners")
def partners():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT

        partner_id,
        partner_name,
        mobile_no,
        address,
        status

        FROM delivery_partners

        ORDER BY partner_id

    """)

    rows = cur.fetchall()

    cur.close()

    conn.close()

    return str(rows)

@app.route("/check-partner-table")
def check_partner_table():

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT table_name

        FROM information_schema.tables

        WHERE table_name='delivery_partners'

    """)

    result = cur.fetchone()

    cur.close()

    conn.close()

    return str(result)

@app.route("/")
def home():
    return render_template("KanhaDairy.html")

@app.route("/check-table")
def check_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        SELECT table_name

        FROM information_schema.tables

        WHERE table_name='inventory_stock'

    """)

    table = cur.fetchone()

    cur.close()
    conn.close()

    return str(table)


@app.route("/products")
def products():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        SELECT
        product_id,
        product_name,
        pack_size,
        quantity,
        rate

        FROM inventory_stock

        ORDER BY product_id

    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return str(rows)    

# @app.route("/add-stock", methods=["POST"])
# def add_stock():

#     data = request.get_json()

#     items = data["items"]

#     conn = get_db_connection()

#     cur = conn.cursor()

#     for item in items:

#         cur.execute("""

#             UPDATE inventory_stock

#             SET quantity = quantity + %s

#             WHERE product_id = %s

#         """,

#         (

#             item["quantity"],
#             item["product_id"]

#         ))

#     conn.commit()

#     cur.close()

#     conn.close()

#     return jsonify({

#         "success": True

#     })

# =====================================================================
# Developer       : Gaurav Choudhary
# Date            : 23-11-2026
# Task            : Add Stock Enhancement
# Description     : Enhance Add Stock API to capture and save both
#                   Total Quantity and Total Amount.
#                   Update existing inventory quantity and maintain
#                   individual stock addition history.
# API Endpoint    : POST /add-stock
# =====================================================================

# @app.route("/add-stock", methods=["POST"])
# def add_stock():

#     data = request.get_json()

#     # Fetch stock addition items from request
#     items = data.get("items", [])

#     if not items:
#         return jsonify({
#             "success": False,
#             "message": "No stock items provided"
#         }), 400

#     conn = get_db_connection()
#     cur = conn.cursor()

#     try:

#         for item in items:

#             # Fetch product details from request
#             product_id = item["product_id"]
#             quantity = item["quantity"]

#             # Capture Total Amount
#             # Default 0 maintains compatibility with old requests
#             total_amount = item.get("total_amount", 0)

#             # -----------------------------------------------------
#             # 1. Update Existing Inventory Stock
#             # -----------------------------------------------------

#             cur.execute("""
#                 UPDATE inventory_stock
#                 SET quantity = quantity + %s
#                 WHERE product_id = %s
#             """, (
#                 quantity,
#                 product_id
#             ))

#             # Verify product exists
#             if cur.rowcount == 0:
#                 raise ValueError(
#                     f"Product not found: {product_id}"
#                 )

#             # -----------------------------------------------------
#             # 2. Save Stock Addition History
#             # -----------------------------------------------------

#             cur.execute("""
#                 INSERT INTO stock_additions
#                 (
#                     product_id,
#                     total_quantity,
#                     total_amount
#                 )
#                 VALUES (%s, %s, %s)
#             """, (
#                 product_id,
#                 quantity,
#                 total_amount
#             ))

#         # Commit inventory and stock history together
#         conn.commit()

#         return jsonify({
#             "success": True,
#             "message": "Stock added successfully"
#         })

#     except Exception as e:

#         # Rollback all changes if any operation fails
#         conn.rollback()

#         return jsonify({
#             "success": False,
#             "message": str(e)
#         }), 500

#     finally:

#         # Close database resources
#         cur.close()
#         conn.close()



@app.route("/add-stock", methods=["POST"])
def add_stock():

    conn = None
    cur = None

    try:
        data = request.get_json()
        items = data.get("items", [])

        if not items:
            return jsonify({
                "success": False,
                "message": "No stock items received"
            }), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # Generate one unique ID for this complete stock entry
        cur.execute("""
            SELECT nextval('stock_entry_id_seq')
        """)

        entry_id = cur.fetchone()[0]

        for item in items:

            product_id = item["product_id"]
            quantity = item["quantity"]
            total_amount = item.get("total_amount", 0)

            # Update current inventory quantity
            cur.execute("""
                UPDATE inventory_stock
                SET quantity = quantity + %s
                WHERE product_id = %s
            """, (
                quantity,
                product_id
            ))

            # Save product-wise stock entry history
            cur.execute("""
                INSERT INTO stock_additions (
                    entry_id,
                    product_id,
                    total_quantity,
                    total_amount
                )
                VALUES (%s, %s, %s, %s)
            """, (
                entry_id,
                product_id,
                quantity,
                total_amount
            ))

        conn.commit()

        return jsonify({
            "success": True,
            "entry_id": entry_id
        })

    except Exception as e:

        if conn:
            conn.rollback()

        print("ADD STOCK ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()


# =====================================================================
# End of Add Stock Enhancement
# =====================================================================

# =====================================================================
# Developer       : Kanha Daily Needs
# Task            : Fetch Last Stock Entry Details
# Description     : Fetches product-wise quantities from the latest
#                   stock entry saved in PostgreSQL.
# =====================================================================

@app.route("/get-last-stock-entry", methods=["GET"])
def get_last_stock_entry():

    conn = None
    cur = None

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT
                sa.entry_id,
                sa.product_id,
                i.product_name,
                i.pack_size,
                sa.total_quantity,
                sa.total_amount,
                sa.created_at

            FROM stock_additions sa

            LEFT JOIN inventory_stock i
                ON i.product_id = sa.product_id

            WHERE sa.entry_id = (
                SELECT MAX(entry_id)
                FROM stock_additions
            )

            ORDER BY sa.id
        """)

        rows = cur.fetchall()

        if not rows:

            return jsonify({
                "success": True,
                "entry_id": None,
                "total_quantity": 0,
                "items": []
            })

        items = []
        total_quantity = 0

        entry_id = rows[0][0]

        for row in rows:

            quantity = row[4] or 0

            total_quantity += quantity

            items.append({

                "product_id": row[1],
                "product_name": row[2],
                "pack_size": row[3],
                "quantity": quantity,
                "total_amount": float(row[5] or 0),
                "created_at": (
                    row[6].isoformat() if row[6] else None
                )

            })

        return jsonify({

            "success": True,
            "entry_id": entry_id,
            "total_quantity": total_quantity,
            "items": items

        })

    except Exception as e:

        print("GET LAST STOCK ENTRY ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

    finally:

        if cur:
            cur.close()

        if conn:
            conn.close()


@app.route("/stock")
def stock():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        SELECT
            product_id,
            product_name,
            quantity

        FROM inventory_stock

        ORDER BY product_id

    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    return str(rows)

@app.route("/test-add")
def test_add():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        UPDATE inventory_stock

        SET quantity = quantity + 100

        WHERE product_id = 'P2'

    """)

    conn.commit()

    cur.close()
    conn.close()

    return "Stock Added"


@app.route("/routes")
def routes():

    output = []

    for rule in app.url_map.iter_rules():

        output.append(str(rule))

    return "<br>".join(output)

@app.route("/get-total-stock")
def get_total_stock():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        SELECT
        COALESCE(SUM(quantity),0)

        FROM inventory_stock

    """)

    total = cur.fetchone()[0]

    cur.close()
    conn.close()

    return jsonify({

        "total_stock": total

    })

@app.route("/test-db")
def test_db():

    try:

        conn = get_db_connection()

        cur = conn.cursor()

        cur.execute("SELECT NOW();")

        current_time = cur.fetchone()[0]

        cur.close()
        conn.close()

        return f"Database Connected ✅ {current_time}"

    except Exception as e:

        return f"Database Error ❌ {str(e)}"


if __name__ == "__main__":
    app.run(debug=True)


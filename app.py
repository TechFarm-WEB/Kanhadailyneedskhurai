from flask import Flask, render_template , jsonify, request
import psycopg2

app = Flask(__name__)


def get_db_connection():

    return psycopg2.connect(
        host="dpg-d9iiniflk1mc73d52dp0-a.virginia-postgres.render.com",
        database="techfarm_db",
        user="techfarm_db_user",
        password="qbZt6HzYeWp0ZQ2vkGWajfkQwTOfd146",
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

def create_inventory_table():

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""

        CREATE TABLE IF NOT EXISTS inventory_stock (

            product_id VARCHAR(20) PRIMARY KEY,

            product_name VARCHAR(200),

            pack_size VARCHAR(50),

            quantity INTEGER DEFAULT 0,

            rate NUMERIC(10,2),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    """)

    conn.commit()

    cur.close()
    conn.close()

    print("Inventory Table Ready")
create_inventory_table()




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

@app.route("/assign-stock", methods=["POST"])
def assign_stock():

    data = request.get_json()

    partner_id = data["partner_id"]

    payment_mode = data["payment_mode"]

    items = data["items"]

    conn = get_db_connection()

    cur = conn.cursor()

    cur.execute("""

        SELECT partner_name

        FROM delivery_partners

        WHERE partner_id = %s

    """, (partner_id,))

    partner_row = cur.fetchone()

    partner_name = partner_row[0]

    for item in items:

        product_id = item["product_id"]

        quantity = item["quantity"]

        # Inventory Reduce

        cur.execute("""

            UPDATE inventory_stock

            SET quantity = quantity - %s

            WHERE product_id = %s

        """,

        (
            quantity,
            product_id
        ))

        # Partner Stock Add

        cur.execute("""

            INSERT INTO partner_stock
            (
                partner_id,
                product_id,
                quantity
            )

            VALUES
            (
                %s,
                %s,
                %s
            )

        """,

        (
            partner_id,
            product_id,
            quantity
        ))

        # Product Detail Fetch

        cur.execute("""

            SELECT
            product_name,
            rate

            FROM inventory_stock

            WHERE product_id = %s

        """, (product_id,))

        product = cur.fetchone()

        product_name = product[0]

        rate = float(product[1])

        total_amount = quantity * rate

        cash_amount = 0
        online_amount = 0
        credit_amount = 0

        if payment_mode == "Cash":

            cash_amount = total_amount

        elif payment_mode == "Online":

            online_amount = total_amount

        else:

            credit_amount = total_amount

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

            VALUES

            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )

        """,

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
            payment_mode
        ))

    conn.commit()

    cur.close()

    conn.close()

    return jsonify({

        "success": True

    })


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

@app.route("/add-stock", methods=["POST"])
def add_stock():

    data = request.get_json()

    items = data["items"]

    conn = get_db_connection()

    cur = conn.cursor()

    for item in items:

        cur.execute("""

            UPDATE inventory_stock

            SET quantity = quantity + %s

            WHERE product_id = %s

        """,

        (

            item["quantity"],
            item["product_id"]

        ))

    conn.commit()

    cur.close()

    conn.close()

    return jsonify({

        "success": True

    })


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


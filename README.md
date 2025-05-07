➡️ WebShop – Full Stack Item Marketplace

A full-stack e-commerce platform where users can register, list items, add to cart, validate stock/price at checkout, and track their sales and purchases.



Name: Amit Hassan Ibn Saif 
Email: amit.saif@abo.fi

---

✅ Features Implemented

# Mandatory (24/24)

✅ Full Django + React stack
✅ SQLite backend, token-based auth
✅ Browse, add, and buy items
✅ Register / Login / Logout
✅ Add to Cart + Payment system
✅ DB Populate & Delete feature
✅ My Items page with 3 sections

# Optional (18/18)

✅ 🔍 Search with 200/404 API
✅ 🛒 Remove from cart
✅ 💳 Checkout price + stock validation
✅ 🧑‍💼 Edit item (seller only)
✅ 👤 Change password
✅ 🔄 SPA routing
✅ 📦 Grouped inventory display


---

🔧 How to Run the Project

1. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


2. Frontend (React)

cd frontend
npm install
npm start


Folders Structure

/webshop/
    /backend/

        /shop/         # Django project
        /items/        # Item & cart app
        /users/        # User auth and profile
        /db.sqlite3
        /requirements.txt
    /frontend/
        /src/pages/
            /Account.js
            /AddItem.js
            /ItemDetail.js
            /Login.js
            /MyItems.js
            /PopulateDB.js
            /Shop.js
            /Signup.js
        /src/components/
        App.js
    README.md
    
👥 Test Users (after populating DB)
    ▶️ Login format: testuser1, testuser2, ..., testuser6

    ▶️ Password format: pass1, pass2, ..., pass6

ℹ️ Use the "Populate DB" button on homepage to auto-create test users/items.

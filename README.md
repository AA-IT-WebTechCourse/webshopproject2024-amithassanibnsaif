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

1. Setup Backend
    Follow these steps to set up the backend:

Navigate to the project directory:

    cd webshop
    
Create a virtual environment .venv

    python3 -m venv .venv
    
Activate virtual environment

    venv\Scripts\activate
    
Install the required dependencies:

    pip install -r requirements.txt

    
2. Setup Frontend

Follow these steps to set up the frontend:

Navigate to the frontend directory:

    cd frontend

Install dependencies using the following command

    npm install

Generate a frontend build

    npm run build


3. Running the Project

To run the Django server locally, follow these steps:

Make sure you are in the root webshop directory where manage.py file exists.

Run the database migrations using the following command in /webshop/backend folder

    python manage.py makemigrations
    python manage.py migrate
    
Start the server with the following command:

    python manage.py runserver

Open another terminal and use the following command in webshop/frontend folder:

    npm start

To go to the home page navigate to the following link using a browser:

    localhost:3000/


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

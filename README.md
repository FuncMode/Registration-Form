# 📦 Registration & Admin System (Node.js + MySQL)

A secure, full-featured user authentication system with admin access, built using Node.js, Express, MySQL, and Bootstrap. Easily deployable to Render or other Node.js platforms.

---

## ✅ Features

### 🔐 User Authentication

* User registration with validation
* Password hashing using **bcrypt**
* Login system with email/password
* Forgot password via email reset link
* Password reset using secure tokens

### 🧠 MySQL Database Integration

* MySQL (using `mysql2` connection pool)
* `users` table with roles (`user` / `admin`)
* `.env` configuration for database credentials

### 🔧 Admin System

* Admin access protected by password (stored in `.env`)
* Admin dashboard to:

  * View all users
  * Edit user role
  * Delete users
* Admin routes with role-based access

### 🌐 Express Backend

* RESTful API routes
* `authRoutes.js` and `adminRoutes.js` for clean structure
* Error handling and response status codes

### 💌 Email Integration

* Password reset via email using **nodemailer (Gmail)**
* Customizable HTML email template

### 💻 Frontend UI (Bootstrap 5)

* Responsive layout
* Clean forms and modals
* Toast messages for real-time feedback
* Toggle view password with Bootstrap icons

### 🌙 Dark Mode + LocalStorage

* Toggle dark/light mode
* Saves theme preference in browser localStorage

### 🚪 Logout Feature

* Simple logout button (can redirect or clear session)

### 🚀 Deployment Ready

* Deployable to **Render** (Free hosting)
* Supports external MySQL (e.g., `db4free.net`, `freesqldatabase.com`)

---

## 📁 Folder Structure
![image](https://github.com/user-attachments/assets/bf1a146c-14d5-46b7-b045-6ebcfdda7a81)

---

## 🔑 Environment Variables (`.env`)

```
DB_HOST=sql12.freesqldatabase.com
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=your_db_name
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
BASE_URL=https://your-app-name.onrender.com
ADMIN_PASSWORD=admin123
```

> 💡 Use a Gmail **App Password** for `EMAIL_PASS`, not your real Gmail password.

---

## 🛠 Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

Create your `.env` file and fill in the values. Then run:

```bash
node server.js
```

App will be running at `http://localhost:3000`

---

## 🙌 Credits

Made with ❤️ using Node.js, Express, Bootstrap, and MySQL.

---

## 📜 License

MIT

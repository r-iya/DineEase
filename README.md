# 🍽️ DineEase

![DineEase Banner](https://placehold.co/1200x400/1E3A8A/FFFFFF?text=DineEase+-+Premium+Restaurant+Booking+%26+Management)

**DineEase** is a comprehensive, full-stack restaurant discovery and table booking platform. It provides a seamless experience for food enthusiasts to find restaurants, book tables, and leave genuine reviews. For restaurateurs, it offers a powerful dashboard to manage menus, handle bookings, and showcase their establishments. Administrators have bird's-eye control over the entire platform.

---

## ✨ Key Features

### 👤 For Customers
- **Location-Based Discovery**: Automatically fetches nearby restaurants using Geolocation API.
- **Interactive Map Search**: Explore top-rated restaurants visually on an interactive map powered by Leaflet.
- **Real-Time Booking**: Check table availability and make instant reservations.
- **Verified Reviews**: Leave reviews and ratings—restricted only to users who have actually booked and dined at the restaurant to ensure authenticity.
- **User Profiles**: Manage personal details, update avatars, and track booking history.

### 🏢 For Restaurateurs (Owners)
- **Advanced Dashboard**: Manage your restaurant's profile, including descriptions, cuisine type, and price range.
- **Media Management**: Upload and manage high-quality images of your restaurant and dishes using ImageKit.
- **Smart Menu OCR**: Easily upload pictures of your physical menu—DineEase uses optical character recognition (Tesseract.js) to scan and digitize it automatically.
- **Booking Management**: Accept, track, and manage incoming table reservations in real-time.

### 🛡️ For Administrators
- **Global Data Overview**: View comprehensive statistics about total users, restaurants, and bookings.
- **Approval Workflow**: Review and approve new restaurant partnership applications.
- **User & Restaurant Directories**: Search, filter, and drill down into detailed metrics for every user and registered restaurant on the platform.

---

## 🛠️ Technology Stack

**Frontend**
- **React.js (Vite)**: Fast, modern UI development.
- **Tailwind CSS**: Utility-first styling with a custom "Premium Royal Blue" aesthetic.
- **React Router**: Client-side routing.
- **Lucide React**: Beautiful, consistent iconography.
- **React-Leaflet**: Interactive map rendering.
- **Framer Motion**: Smooth page transitions and micro-animations.

**Backend**
- **Node.js & Express.js**: Scalable REST API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database modeling.
- **JSON Web Tokens (JWT)**: Secure, stateless authentication.
- **Tesseract.js**: Server-side OCR for smart menu digitization.

**Third-Party Integrations**
- **ImageKit**: Optimized media upload, storage, and delivery.
- **Razorpay**: (Prepared for payment gateway integration).
- **Google Maps APIs**: Location linking and directions.

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/r-iya/DineEase.git
cd DineEase
```

### 2. Install Dependencies

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd ../client
npm install
```

### 3. Environment Variables
You will need to set up `.env` files in both the `server` and `client` directories.

**`server/.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/DineEaseDB
JWT_SECRET=your_super_secret_jwt_key
ADMIN_EMAIL=admin@dineease.com
ADMIN_PASSWORD=your_admin_password
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend Vite application:
```bash
cd client
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 📂 Project Structure

```text
DineEase/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/        # React Context (AuthStore, Global State)
│   │   ├── pages/          # Main route components (Home, Dashboard, Map Search)
│   │   ├── services/       # API abstraction (Axios configuration)
│   │   ├── App.jsx         # Root component & Route definitions
│   │   └── index.css       # Global styles & Tailwind directives
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # DB connection, Cloud provider configs
│   ├── controllers/        # Route logic (Auth, Restaurants, Bookings, Reviews)
│   ├── middlewares/        # JWT Authentication, File Uploads, Error handlers
│   ├── models/             # Mongoose Schemas (User, Restaurant, Booking, Review)
│   ├── routes/             # API Route definitions
│   ├── services/           # Business logic (Mailer, ImageKit, OCR)
│   ├── server.js           # Entry point for backend
│   └── package.json
└── README.md
```

---

## 👨‍💻 Developed By

**Riya**  
- **LinkedIn**: [linkedin.com/in/riya9454](https://www.linkedin.com/in/riya9454/)  
- **GitHub**: [github.com/r-iya](https://github.com/r-iya)  
- **Email**: riyaaa9454@gmail.com

---
*Crafted for a seamless dining experience.* 🍷

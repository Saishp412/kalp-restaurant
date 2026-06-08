<div align="center">
  <h1>🍽️ Kalp Restaurant - Next-Gen Reservation System</h1>
  <p><strong>A modern, full-stack dining management platform built with Next.js and MongoDB.</strong></p>
  
  <p>
    <a href="#about-the-project">About</a> • 
    <a href="#business-value">Business Value</a> • 
    <a href="#technical-architecture">Architecture</a> • 
    <a href="#key-features">Key Features</a> • 
    <a href="#installation">Installation</a> • 
    <a href="#application-screenshots">Screenshots</a>
  </p>
</div>

<br/>

## 🎯 About The Project

**Kalp Restaurant** is a sophisticated, full-stack web application designed to revolutionize the way restaurants handle reservations, customer waitlists, and private event inquiries. 

Moving away from archaic phone-booking systems, this platform introduces an **interactive table blueprint**, allowing customers to visualize the dining area and book specific tables in real-time. Paired with a comprehensive **Admin Dashboard**, the system provides restaurant managers with powerful tools to monitor live floor plans, analyze revenue metrics, and seamlessly orchestrate waitlists and walk-in customers.

---

## 💼 Business Value

In the competitive hospitality industry, operational efficiency and customer experience are paramount. This project directly addresses core business challenges:
- **Maximized Seat Utilization:** Real-time dynamic availability algorithms prevent double-booking while ensuring tables don't sit empty.
- **Enhanced Customer Experience:** Visual table selection, automated OTP verification, and instant email receipts build trust and luxury into the booking journey.
- **Data-Driven Operations:** The analytics dashboard translates raw reservation data into actionable insights (Peak Hours, Estimated Revenue, Guest Traffic), enabling optimized staff scheduling and inventory forecasting.
- **Streamlined Workflow:** Consolidating standard reservations, walk-ins, waitlists, and large event inquiries into a single digital ecosystem eliminates manual errors and saves hours of administrative overhead.

---

## 🏗️ Technical Architecture

The application is architected as a monolithic full-stack Next.js application, utilizing Serverless API routes for the backend and MongoDB for persistent data storage.

```text
+-------------------+       +-----------------------+       +-------------------+
|                   |       |                       |       |                   |
|   CLIENT (Browser)| <---> |   NEXT.JS (Vercel)    | <---> |  MONGODB ATLAS    |
|   - React 19      |  HTTP |   - App Router        | Mongoose- Waitlist        |
|   - Framer Motion |       |   - API Routes        |       | - Reservations    |
|   - Lucide Icons  |       |   - Nodemailer        |       | - Tables          |
|                   |       |                       |       | - Event Inquiries |
+-------------------+       +-----------------------+       +-------------------+
```

### Tech Stack
* **Frontend:** React.js, Next.js (App Router), Vanilla CSS, Framer Motion (for micro-interactions & animated charts)
* **Backend:** Node.js, Next.js Serverless API Routes
* **Database:** MongoDB, Mongoose ODM
* **Authentication:** Custom OTP Verification via Email (Nodemailer) & Admin Credentials
* **Deployment:** Vercel

---

## ✨ Key Features

### 1. Interactive Table Blueprint Booking
Customers can visually explore the restaurant's floor plan, selecting their preferred seating (e.g., near the window, private booths) with real-time updates on what is currently free, reserved, or occupied.

### 2. Time-Aware Dynamic Availability
The booking engine strictly validates date and time selections against the database, filtering out past times, restricting bookings to operating hours, and ensuring tables are blocked off for 90-minute intervals.

### 3. Automated Virtual Waitlist & Event Inquiries
If no tables match a customer's party size or preferred time, the system intuitively offers a "Join Waitlist" option. Additionally, parties of 11+ are automatically routed to a customized Private Event Inquiry form.

### 4. Comprehensive Admin Control Panel
A secure, multi-tabbed interface for management:
* **Live Floor Plan:** Monitor live statuses, mark tables as occupied, and register walk-in customers instantly.
* **Inquiries Hub:** Approve/decline private events and transition waitlisted customers to "Notified" or "Seated" with a single click.
* **Analytics Dashboard:** Animated, real-time CSS charts displaying KPI metrics such as Total Bookings, Guests Served, and Estimated Revenue.

---

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saishp412/kalp-restaurant.git
   cd kalp-restaurant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Seed the Database (Optional but Recommended)**
   To populate the interactive table layout, navigate to `http://localhost:3000/api/seed` in your browser once the server is running.

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📸 Application Screenshots

| Feature | Screenshot |
| :---: | :---: |
| **Landing Page** | `<img src="[PLACEHOLDER_URL]" width="400" alt="Landing Page"/>` |
| **Interactive Blueprint** | `<img src="[PLACEHOLDER_URL]" width="400" alt="Table Blueprint"/>` |
| **Admin Dashboard** | `<img src="[PLACEHOLDER_URL]" width="400" alt="Admin Dashboard"/>` |
| **Analytics Charts** | `<img src="[PLACEHOLDER_URL]" width="400" alt="Analytics"/>` |

---

<div align="center">
  <i>Developed with ❤️ using Next.js</i>
</div>

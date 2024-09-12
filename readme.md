# Restaurant Takeaway Ordering System

A web application for quick and easy restaurant order management. Users can browse restaurants, view menus, and place orders for takeaway, while restaurant owners can efficiently manage incoming orders through a dedicated admin panel.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Admin Panel](#admin-panel)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Quick Orders:** Users can easily browse restaurant menus and place orders for takeaway.
- **Quick Checkout:** Streamlined checkout process for users to finalize their orders.
- **Order Summary:** Users can review their entire order before confirming the purchase.
- **Restaurant List and Menus:** Browse through a list of participating restaurants and explore their available menu items.
- **Order Status:** Keep track of the current status of your order in real-time (e.g., preparing, ready for pickup).
- **Admin Panel for Managers:** A dedicated admin panel for restaurant managers to view and manage incoming orders.

## Technologies Used

- **Frontend:**

  - [React](https://reactjs.org/) - For building a dynamic user interface.
  - [TailwindCSS](https://tailwindcss.com/) - For efficient styling and responsive design.

- **Backend:**
  - [Express.js](https://expressjs.com/) - A Node.js framework for building APIs and managing server-side logic.
  - [Node.js](https://nodejs.org/) - The runtime environment for building the backend.
  - [PostgreSQL](https://www.postgresql.org/) - For handling relational data in the application.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/restaurant-takeaway-system.git
   cd restaurant-takeaway-system
   ```

2. Install dependencies for both backend and frontend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the `backend` directory with your PostgreSQL credentials:

   ```bash
   AUTH_SECRET=<jsonwebtoken_secert>
   databaseURL=<database_uri>
   ```

4. Set up and run the PostgreSQL database (make sure it's running).

5. Run the development servers:

   ```bash
   # Start the backend
   cd backend
   npm dev

   # Start the frontend
   cd ../frontend
   npm dev
   ```

6. Open your browser at `http://localhost:3000` to view the frontend.

## Usage

1. **Browse Restaurants:** Users can explore the available restaurants and their menus.
2. **Place Orders:** Select items, add them to your cart, and place an order for takeaway.
3. **Order Status:** Restaurant owners update the order status in real-time, and users are notified when the order is ready for pickup.

## Admin Panel

- **Order Management:** Restaurant managers have access to an admin panel where they can view incoming orders and take actions such as updating order statuses (e.g., preparing, ready for pickup).
- **Order History:** Managers can review previous orders and maintain a log of all completed transactions.
- **Real-Time Notifications:** Managers receive real-time notifications for new orders, helping them prepare for upcoming pickups efficiently.

## Database Schema

### Tables:

- **Users:** Information about users (customers and restaurant owners).
- **Restaurants:** Stores restaurant details such as name, address, etc.
- **Menus:** Stores details about menu items for each restaurant.
- **Orders:** Stores user orders, including status updates and total amounts.

### Relationships:

- A restaurant can have many menu items.
- A user can place many orders.
- An order can contain multiple menu items.

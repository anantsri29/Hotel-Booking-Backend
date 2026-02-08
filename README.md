# Hotel Booking Backend API

A complete RESTful API backend for a Hotel Booking Website built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 JWT Authentication with role-based access control (User/Admin)
- 🏨 Hotel Management (CRUD operations)
- 🛏️ Room Management with availability checking
- 📅 Booking System with date conflict prevention
- 🔍 Advanced filtering and search capabilities
- 📄 Pagination support
- ✅ Input validation using express-validator
- 🛡️ Error handling middleware

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **dotenv** - Environment variables

## Project Structure

```
project/
│── config/
│   └── db.js                 # Database connection
│── controllers/
│   ├── authController.js     # Authentication logic
│   ├── hotelController.js    # Hotel operations
│   ├── roomController.js     # Room operations
│   └── bookingController.js  # Booking operations
│── models/
│   ├── User.js               # User model
│   ├── Hotel.js              # Hotel model
│   ├── Room.js               # Room model
│   └── Booking.js            # Booking model
│── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── hotelRoutes.js        # Hotel endpoints
│   ├── roomRoutes.js         # Room endpoints
│   └── bookingRoutes.js     # Booking endpoints
│── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   └── errorMiddleware.js    # Error handling
│── .env                      # Environment variables
│── server.js                 # Entry point
│── package.json              # Dependencies
│── seedData.js              # Seed script
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Back_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the sample environment file and update the values:
   ```bash
   cp env.sample .env
   ```
   
   Or create a `.env` file manually in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hotel-booking
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=30d
   ```
   
   **Note:** For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string. Change `JWT_SECRET` to a strong random string in production.

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in `.env`.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```
   
   This will create:
   - Admin user: `admin@hotel.com` / `admin123`
   - Regular user: `user@example.com` / `user123`
   - 3 sample hotels with rooms

6. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Hotels

#### Get All Hotels (with filters)
```http
GET /api/hotels?city=New York&minPrice=100&maxPrice=300&minRating=4&page=1&limit=10
```

**Query Parameters:**
- `city` - Filter by city
- `minPrice` - Minimum price per night
- `maxPrice` - Maximum price per night
- `minRating` - Minimum rating
- `checkInDate` - Check-in date (ISO format)
- `checkOutDate` - Check-out date (ISO format)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

#### Get Single Hotel
```http
GET /api/hotels/:id
```

#### Create Hotel (Admin only)
```http
POST /api/hotels
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Luxury Hotel",
  "city": "Los Angeles",
  "address": "123 Main St",
  "description": "A beautiful hotel",
  "pricePerNight": 300,
  "rating": 4.5,
  "images": ["url1", "url2"],
  "amenities": ["WiFi", "Pool", "Gym"],
  "totalRooms": 100,
  "availableRooms": 95
}
```

#### Update Hotel (Admin only)
```http
PUT /api/hotels/:id
Authorization: Bearer <admin_token>
```

#### Delete Hotel (Admin only)
```http
DELETE /api/hotels/:id
Authorization: Bearer <admin_token>
```

### Rooms

#### Get Rooms by Hotel
```http
GET /api/rooms/:hotelId?checkInDate=2024-01-15&checkOutDate=2024-01-20
```

#### Create Room (Admin only)
```http
POST /api/rooms/:hotelId
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "roomNumber": "101",
  "roomType": "double",
  "pricePerNight": 200,
  "maxGuests": 2,
  "amenities": ["WiFi", "TV", "AC"]
}
```

#### Update Room (Admin only)
```http
PUT /api/rooms/:id
Authorization: Bearer <admin_token>
```

### Bookings

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "hotelId": "...",
  "roomId": "...",
  "checkInDate": "2024-01-15",
  "checkOutDate": "2024-01-20"
}
```

#### Get User Bookings
```http
GET /api/bookings/user
Authorization: Bearer <user_token>
```

#### Get All Bookings (Admin only)
```http
GET /api/bookings/admin
Authorization: Bearer <admin_token>
```

#### Cancel Booking
```http
PUT /api/bookings/cancel/:id
Authorization: Bearer <user_token>
```

#### Check Room Availability
```http
GET /api/bookings/availability?roomId=...&checkInDate=2024-01-15&checkOutDate=2024-01-20
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing with Postman

1. Import the provided Postman collection
2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:5000`
   - `token`: (will be set after login)
3. Start with registration/login to get a token
4. Use the token for protected routes

## Sample Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Hotels
```bash
curl http://localhost:5000/api/hotels?city=New%20York&minPrice=100&maxPrice=300
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "hotelId": "...",
    "roomId": "...",
    "checkInDate": "2024-01-15",
    "checkOutDate": "2024-01-20"
  }'
```

## License

ISC

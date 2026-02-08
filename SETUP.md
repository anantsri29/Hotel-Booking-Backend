# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create .env File

**Option 1: Copy from sample file (Recommended)**
```bash
# On Windows (PowerShell)
Copy-Item env.sample .env

# On Windows (CMD)
copy env.sample .env

# On Linux/Mac
cp env.sample .env
```

**Option 2: Create manually**
Create a `.env` file in the root directory with the following content:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

**Note:** 
- For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a strong random string in production
- See `env.sample` file for detailed comments and examples

### 3. Start MongoDB
Make sure MongoDB is running on your system:
- **Local MongoDB:** Start MongoDB service
- **MongoDB Atlas:** Your connection string is already configured

### 4. Seed Database (Optional)
This will create sample data including:
- Admin user: `admin@hotel.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- 3 sample hotels with rooms

```bash
npm run seed
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### 6. Test the API

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Using Postman

1. Import `Postman_Collection.json` into Postman
2. The collection includes environment variables that auto-update:
   - `base_url`: API base URL
   - `token`: User JWT token (auto-set after login)
   - `admin_token`: Admin JWT token (auto-set after admin login)
   - `hotel_id`, `room_id`, `booking_id`: Auto-set after creation

3. Start with "Login" or "Login Admin" to get tokens
4. Tokens are automatically saved and used in subsequent requests

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env`
- Tokens expire after 30 days (configurable via `JWT_EXPIRE`)

## Next Steps

- Review the `README.md` for complete API documentation
- Explore all endpoints using the Postman collection
- Customize models and controllers as needed
- Add additional features like email notifications, payment integration, etc.

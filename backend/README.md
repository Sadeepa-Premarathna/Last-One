# Daily-Licious-Merge

## MERN Backend API

Backend API for the Daily Licious food delivery application built with Node.js, Express.js, and MongoDB.

## Features

- RESTful API architecture
- JWT authentication and authorization
- Password hashing with bcrypt
- Input validation and error handling
- CORS enabled for cross-origin requests
- MongoDB integration with Mongoose
- Modular folder structure
- Environment-based configuration

## Folder Structure

```
mern-backend/
├── src/
│   ├── config/          # Database and other configurations
│   ├── controllers/     # Route controllers (business logic)
│   ├── middleware/      # Custom middleware functions
│   ├── models/          # Mongoose models/schemas
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions and helpers
│   └── index.js         # Main application entry point
├── tests/               # Test files
├── uploads/             # File uploads directory
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sadeepa-Premarathna/Daily-Licious-Merge.git
   cd mern-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   copy .env.example .env
   ```

4. Update the `.env` file with your configurations:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   BCRYPT_ROUNDS=12
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - User logout

### User Management Routes
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 30d |
| BCRYPT_ROUNDS | Password hashing rounds | 12 |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Project Link: [https://github.com/Sadeepa-Premarathna/Daily-Licious-Merge](https://github.com/Sadeepa-Premarathna/Daily-Licious-Merge)

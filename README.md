+ # Contact Management System - Backend
+ 
+ A Node.js/Express backend service that provides RESTful APIs for managing contacts with MongoDB integration.
+ 
+ ## Features
+ 
+ - 🔐 RESTful API endpoints
+ - 📊 MongoDB integration
+ - 🔍 Advanced filtering and search capabilities
+ - 📝 Contact CRUD operations
+ - 🚀 Express.js framework
+ - ✨ TypeScript support
+ 
+ ## Tech Stack
+ 
+ - Node.js
+ - Express.js
+ - MongoDB
+ - TypeScript
+ - Jest for testing
+ 
+ ## API Endpoints
+ 
+ ### Contacts
+ 
+ - `GET /api/contacts` - Get all contacts (with filtering, sorting, and pagination)
+ - `POST /api/contacts` - Create a new contact
+ - `GET /api/contacts/:id` - Get a specific contact
+ - `PUT /api/contacts/:id` - Update a contact
+ - `DELETE /api/contacts/:id` - Delete a contact
+ 
+ ## Getting Started
+ 
+ ### Prerequisites
+ 
+ - Node.js (v14 or higher)
+ - MongoDB
+ - npm
+ 
+ ### Installation
+ 
+ 1. Clone the repository
+ 2. Install dependencies:
+ 
+ ```
+ npm install
+ ```
+ 
+ 3. Start the server:
+ 
+ ```
+ npm start
+ ```
+ 
+ The server will be running on `http://localhost:5001`
+ 
+ ### Running Tests
+ 
+ ```
+ npm test
+ ```
+ 
+ ## Project Structure
+ 
+ ```
+ src/
+ ├── controllers/    # Request handlers
+ ├── models/        # Database models
+ ├── routes/        # API routes
+ ├── middleware/    # Custom middleware
+ ├── types/         # TypeScript types
+ └── server.ts      # Server entry point
+ ```
+ 
+ ## Available Scripts
+ 
+ - `npm start` - Starts the server
+ - `npm test` - Runs the test suite
+ - `npm run dev` - Runs the server in development mode with nodemon
+ - `npm run build` - Compiles TypeScript to JavaScript
+ 
+ ## License
+ 
+ This project is licensed under the MIT License

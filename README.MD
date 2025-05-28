# OffersPark Server

A Node.js + TypeScript REST API server for admin and user management, built with Express and Mongoose.

## Features

- User, role, and permission management
- JWT authentication
- Password hashing with bcrypt
- Modular code structure with TypeScript
- Request validation and error handling

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance

### Installation

```bash
git clone https://github.com/yourusername/offerspark_server.git
cd offerspark_server
yarn install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=8000
ALLOWED_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb://localhost:27017/offerspark

#Session
JWT_SECRET =offerspark
JWT_EXPIRY=30d
COOKIE_NAME=accessToken
```

### Running the Server

#### Development

```bash
yarn dev
```

#### Production

```bash
yarn build
yarn start
```

## API Endpoints

### User Management

| Method | Endpoint           | Description    | Auth/Permissions     |
| ------ | ------------------ | -------------- | -------------------- |
| POST   | `/admin/users`     | Add a new user | Auth + `USER.CREATE` |
| GET    | `/admin/users`     | List all users | Auth + `USER.READ`   |
| PATCH  | `/admin/users/:id` | Update a user  | Auth                 |
| DELETE | `/admin/users/:id` | Delete a user  | Auth                 |

- Passwords are securely hashed before storage.
- User data in responses never includes the password field.

### Example User Object

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "role": "ObjectId",
  "is_super_admin": false,
  "dob": "1990-01-01T00:00:00.000Z",
  "profile_avatar": null,
  "status": "not_verified"
}
```

## Scripts

- `yarn dev` - Start in development mode with hot reload
- `yarn build` - Compile TypeScript to JavaScript
- `yarn start` - Start the compiled app
- `yarn lint` - Lint the codebase
- `yarn format` - Auto-fix lint issues
- `yarn pretty` - Format code with Prettier

## License

MIT

---

Let me know if you want to add usage examples, contribution guidelines, or anything else!

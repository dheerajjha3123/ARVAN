# The Arvan

This is a fullstack web application project for ecommerce-related functionalities, consisting of two main parts:

- **Frontend** built with [Next.js](https://nextjs.org) and Tailwind CSS
- **Backend** built with Node.js, Express, and Prisma ORM to provide RESTful APIs for various ecommerce entities

---

## Project Structure

The repository is organized into two main directories:

- `arvan-main/` - Frontend Next.js application
- `arvan-backend-main/` - Backend Node.js/Express API server

---

## Frontend (arvan-main)

The frontend is a modern React application using Next.js framework with support for server-side rendering. Styling is managed using Tailwind CSS.

### Features

- Responsive UI for ecommerce operations like checkout, cart, product listings
- Integration with backend APIs hosted in `arvan-backend-main`
- Uses optimized fonts and assets for performance
- Located under the `arvan-main` directory

### Setup and Running

1. Navigate to frontend directory:
   ```bash
   cd arvan-main
   ```
2. Install dependencies using your preferred package manager:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### Build and Production

- Build the project with:
  ```bash
  npm run build
  ```
- Start the production server (after building):
  ```bash
  npm start
  ```

---

## Backend (arvan-backend-main)

The backend API server is built with Express.js and TypeScript, and provides RESTful APIs for managing products, customers, orders, inventory, analytics, and more.

### Features

- Uses [Prisma ORM](https://www.prisma.io/) for database access
- Authentication via JWT tokens for protected routes
- Middleware for logging, error handling, and security (Helmet, CORS, etc)
- Routes for:
  - Products
  - Categories
  - Customers
  - Orders
  - Product reviews and ratings
  - Testimonials
  - Inventory management
  - Analytics and sales metrics
  - ShipRocket integration
  - WhatsApp and webhook integrations
  - Email resend service

### Setup and Running

1. Navigate to backend directory:
   ```bash
   cd arvan-backend-main
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Configure environment variables:
   Create a `.env` file or set environment variables as needed, including:
   - `PORT` for server port
   - `FRONTENDURL` for allowed CORS origin
   - Database connection string
   - JWT secret keys, etc.

4. Run database migrations and generate Prisma client:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the development server with hot reload:
   ```bash
   npm run dev
   ```

6. Or build and run production server:
   ```bash
   npm run build
   npm start
   ```

---

## Technologies Used

- Frontend:
  - Next.js
  - React
  - Tailwind CSS

- Backend:
  - Node.js
  - Express.js
  - TypeScript
  - Prisma ORM
  - JWT Authentication
  - Helmet, CORS, Morgan middleware
  - Multer for file uploads
  - Resend for email services
  - Cloudinary for media management

---

## Environment Variables

Key environment variables to configure:

| Variable     | Description                        |
|--------------|----------------------------------|
| PORT         | Port for backend server to listen|
| FRONTENDURL  | Frontend URL for CORS whitelist  |
| DATABASE_URL | Connection string for the database|
| JWT_SECRET   | Secret key for JWT authentication|

---

## Contributions

Feel free to fork the repository and create pull requests. Contributions and feedback are welcome!

---

## License

This project is licensed under the ISC License.

---

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Contact

For queries or issues, contact the project maintainer.

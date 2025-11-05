# Edemy LMS

Edemy LMS is a full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). It provides a complete platform for educators to create, manage, and sell courses, and for students to browse, purchase, and learn.

The platform uses modern tools like Clerk for user authentication, Stripe for payments, and Cloudinary for media hosting.

## How It Works

Think of Edemy LMS as a digital school or marketplace:

  * **For Students:** You can visit the website, browse a list of courses, search for topics you're interested in, and watch free preview lessons. If you like a course, you can purchase it securely (using Stripe). Once enrolled, you get a "My Enrollments" page to track your progress and watch all the video lessons in a dedicated player. You can even rate courses you've completed.

  * **For Educators:** You can sign up and "Become an Educator." This gives you a special dashboard where you can:

      * **Add Courses:** Create new courses with titles, descriptions, prices, and upload thumbnails.
      * **Build Curriculum:** Add chapters and individual video lectures (with URLs and durations) to your courses.
      * **View Your Courses:** See a list of all the courses you've created.
      * **Track Students:** See a list of students who have enrolled in your courses.
      * **See Stats:** The dashboard shows your total earnings, total courses, and total student enrollments.

## Core Features

  * **Full User Authentication:** Secure sign-up, sign-in, and profile management handled by **Clerk**.
  * **Two User Roles:**
      * **Student:** Can browse, purchase, watch, and rate courses.
      * **Educator:** Can create courses, upload content, and track earnings/students.
  * **Course Management:** Educators can create, read, and manage courses and their content (chapters, lectures).
  * **Stripe Payment Integration:** Secure checkout and payment processing for course enrollments.
  * **Video Player:** A dedicated page for students to watch course lectures (using `react-youtube`).
  * **Course Progress Tracking:** Students can mark lectures as complete and see their progress.
  * **Cloud Media Uploads:** Course thumbnails are uploaded to **Cloudinary** (via `multer`).
  * **Educator Dashboard:** Shows key metrics like total earnings, total courses, and latest enrollments.
  * **Webhooks:** Uses **Svix** and **Stripe** webhooks to automatically sync user data from Clerk to the MongoDB database and confirm purchases.
  * **Responsive Design:** A clean, modern UI built with **Tailwind CSS** that works on desktop and mobile.

## Tech Stack

### Frontend (`client/`)
  * **Framework:** React (built with Vite)
  * **Routing:** React Router DOM
  * **Authentication:** @clerk/clerk-react
  * **Payments:** Stripe
  * **Styling:** Tailwind CSS
  * **Video Player:** React YouTube
  * **Rich Text Editor:** Quill
  * **API Calls:** Axios
  * **Animations:** Framer Motion
  * **Notifications:** React Toastify

### Backend (`server/`)
  * **Runtime:** Node.js
  * **Framework:** Express.js
  * **Database:** MongoDB (with Mongoose)
  * **Authentication:** @clerk/express
  * **Payments:** Stripe
  * **File Uploads:** Cloudinary & Multer
  * **Webhooks:** Svix (for Clerk)
  * **Middleware:** CORS, dotenv

## Installation & Setup

### 1️⃣ Clone the Repository

https://github.com/sureshnaik45/Edemy-LMS.git
cd Edemy-LMS

### 2️⃣ Install Dependencies

#### Frontend:
cd client
npm install
npm run dev

#### Backend:
cd server
npm install
npm start

### 3️⃣ Setup Environment Variables

You will need to create two `.env` files: one in the `client` folder and one in the `server` folder.

#### `client/.env`
env
# Clerk Publishable Key (from Clerk Dashboard)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# The URL of your local or deployed backend
# For local: http://localhost:3000
# For Vercel: https://your-server-app-name.vercel.app
VITE_BACKEND_URL=http://localhost:3000

# Default currency for display (e.g., "$", "₹")
VITE_CURRENCY=$

#### `server/.env`
env
# MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://...

# Clerk Secret Key (from Clerk Dashboard)
CLERK_SECRET_KEY=sk_test_...

# Clerk Webhook Secret (from Clerk Dashboard -> Webhooks)
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe Secret Key (from Stripe Dashboard -> API Keys)
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (from Stripe Dashboard -> Webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary Credentials (from Cloudinary Dashboard)
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...

# Default currency for payments (must match Stripe's currency)
CURRENCY=usd

# Port for local development
PORT=3000

## API Endpoints

Here is a breakdown of all the available API routes in the backend (`server/`).

### Course Routes (Public)

These endpoints are public and used to display course information to all users.

  * **Base Path:** `/api/course`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/all` | Fetches all published courses. |
| `GET` | `/:id` | Fetches a single course by its ID for the details page. |

### User Routes (Student)

These endpoints require a user to be authenticated via Clerk.

  * **Base Path:** `/api/user`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/data` | Gets the logged-in user's data from the MongoDB database. |
| `GET` | `/enrolled-courses` | Fetches all courses the logged-in user is enrolled in. |
| `POST` | `/purchase` | Creates a new Stripe checkout session for a course purchase. |
| `POST` | `/update-course-progress` | Marks a specific lecture as completed for the user. |
| `POST` | `/get-course-progress` | Fetches the user's progress for a specific course. |
| `POST` | `/add-rating` | Allows a user to add or update a rating for an enrolled course. |

### Educator Routes

These endpoints require the user to be authenticated *and* have an "educator" role.

  * **Base Path:** `/api/educator`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/update-role` | Updates the logged-in user's Clerk public metadata to `role: 'educator'`. (Note: This one doesn't require the educator role to run). |
| `POST` | `/add-course` | Adds a new course. Expects `multipart/form-data` with `courseData` (JSON string) and an `image` file. |
| `GET` | `/courses` | Fetches all courses created by the logged-in educator. |
| `GET` | `/dashboard` | Gathers statistics for the educator dashboard (earnings, student count, etc.). |
| `GET` | `/enrolled-students` | Gets a list of all students enrolled in the educator's courses. |

### Webhook Routes

These endpoints are not called by the frontend. They are called by external services (Clerk and Stripe) to send data to your server.

  * **Base Path:** `/`

| Method | Endpoint | Service | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/clerk` | Clerk | Listens for `user.created`, `user.updated`, and `user.deleted` events from Clerk to keep the MongoDB `User` collection in sync. |
| `POST` | `/stripe` | Stripe | Listens for `payment_intent.succeeded` and `payment_intent.payment_failed` events from Stripe to finalize purchases and grant course access. |
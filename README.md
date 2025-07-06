# PropTrack
# 🚀 PropTrack – Running the App From Scratch

## 📝 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js) or `pnpm`/`yarn`
- **MongoDB** (local or Atlas cluster)
- **Cloudinary account** (for image uploads)

---

## ⚡ 1. Clone the Repository

```bash
git clone https://github.com/ZaidAr98/PropTrack.git
cd PropTrack


## ⚡ 2. Install Backend Dependencies


cd server
npm install



3. Configure Backend Environment Variables
Create a .env file in the server folder.

Add the following:



MONGODB_URL=your_mongodb_url
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


4. (Optional) Seed the Database
Run seeder scripts to populate dummy data:


npm run seedProperty
npm run seedClient
npm run seedViewing
npm run seedInquiry


5. Start the Backend Server

npm run dev




6. Install Frontend Dependencies

cd ../web
npm install


7. Configure Frontend Environment Variables

Create a .env.local file in the web folder.

NEXT_PUBLIC_API_URL=http://localhost:8000/api


8. Start the Frontend

 npm run dev








 ## 📝 Technical Choices

### ⚡ Backend (`server`)

| **Technology / Library** | **Why It Was Chosen** |
| --- | --- |
| **Express.js** | A minimal and flexible Node.js web framework ideal for building RESTful APIs quickly and integrating middleware easily. |
| **TypeScript (with tsx)** | Adds static typing for better code quality and developer experience. `tsx` allows running TypeScript files directly without a separate build step, simplifying local development. |
| **Mongoose** | An ODM (Object Document Mapper) for MongoDB, enabling schema-based data models, validation, and easier database operations. |
| **MongoDB** | NoSQL database providing flexibility for storing property, client, viewing, and inquiry data without rigid schemas, supporting rapid development iterations. |
| **Cloudinary** | Cloud-based image and media management for uploading and serving property images efficiently. |
| **Multer** | Handles multipart form data for file uploads, such as images, before passing them to Cloudinary. |
| **Cors** | Enables cross-origin requests from the frontend hosted on a different port or domain. |
| **Body-parser** | Parses incoming request bodies in middleware before your handlers, simplifying access to form data and JSON payloads. |
| **Morgan** | HTTP request logger for Express, useful for debugging during development. |
| **Nodemon** | Watches for file changes and restarts the server automatically, improving development efficiency. |
| **Seeder scripts** | Populates the database with sample data for testing and frontend integration without manual data entry. |

---

### ⚡ Frontend (`web`)

| **Technology / Library** | **Why It Was Chosen** |
| --- | --- |
| **Next.js (v15 App Router)** | Full-stack React framework with server-side rendering (SSR), API routes, and built-in performance optimizations, ideal for production-ready apps. |
| **TypeScript** | Adds static typing to React components and APIs, preventing bugs and improving maintainability. |
| **Tailwind CSS** | Utility-first CSS framework for rapid, consistent, and responsive UI styling. |
| **Radix UI** | Provides accessible, unstyled React components (Dialog, Select, Label) that integrate seamlessly with Tailwind for custom design. |
| **Axios** | Simplifies HTTP requests to the backend API with better syntax compared to `fetch`. |
| **React Hook Form** | Efficient form state management with minimal re-renders, used for forms like property inquiries and client details. |
| **Zustand** | Lightweight state management library, simpler and more performant than Redux for managing global state such as user sessions or UI state. |
| **Next Intl** | Enables internationalization support for future multi-language scalability. |
| **clsx & class-variance-authority** | For conditional className management and consistent variant-based component styling. |
| **Lucide React & React Icons** | Provides clean, consistent SVG icon sets for UI. |
| **Tailwindcss Animate & Tailwind Merge** | For smooth animations and resolving conflicting Tailwind classes. |
| **ESLint + eslint-config-next** | Ensures code quality and adherence to Next.js best practices. |
| **Autoprefixer & PostCSS** | For CSS compatibility across browsers. |

---

### 📝 Overall Architectural Decisions

✅ **Monorepo structure:** Separate folders for backend (`server`) and frontend (`web`) for clear separation of concerns while maintaining one repository for easy deployment and version control.

✅ **API-first approach:** Backend exposes RESTful APIs consumed by the Next.js frontend, decoupling UI from data management.

✅ **Cloudinary for media:** Offloads storage and optimization of images from your server to a scalable cloud solution.

✅ **Type safety everywhere:** Both backend and frontend use TypeScript to catch errors early and improve developer confidence.

✅ **Seeder scripts:** Enables rapid local development with pre-populated data for realistic UI integration and testing.

---






## ⏱️ Total Time Spent

Approximately **12 hours** were spent on this assessment, including:

- Setting up the project structure
- Configuring environment variables and dependencies
- Implementing backend APIs and database models
- Integrating Cloudinary for media management
- Developing frontend pages and components
- Styling with Tailwind CSS and Radix UI
- Testing, debugging, and seeding data



## 🚀 Future Plans

If I had more time, I would:

- **Improve the UI/UX design:**  
  Enhance overall design consistency, interactivity, and responsiveness to ensure a seamless user experience across all devices.

- **Add a chat service:**  
  Implement real-time chat functionality between clients and property agents using technologies like **Socket.IO** for instant communication.


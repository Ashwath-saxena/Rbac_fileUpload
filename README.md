# RBAC File Upload System

A Role-Based Access Control (RBAC) system with file upload capabilities built with Next.js, Prisma, and PostgreSQL.

## Features

- Role-Based Access Control (RBAC)
- File Upload System
- User Authentication with Clerk
- PostgreSQL Database
- Prisma ORM
- Next.js 13+ App Router
- TypeScript
- Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Ashwath-saxena/Rbac_fileUpload.git
cd Rbac_fileUpload
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

5. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

6. Run the development server:
```bash
npm run dev
```

## Project Structure

```
.
├── app/                    # Next.js app directory
├── components/            # React components
├── lib/                   # Utility functions and configurations
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Role Definitions

- **Superadmin**: Full system access
- **Admin**: User management and file management
- **Manager**: File approval and user viewing
- **User**: Basic file operations
- **Guest**: Read-only access

## API Routes

- `/api/roles`: Role management
- `/api/files`: File operations
- `/api/users`: User management

## Technologies Used

- Next.js 13+
- TypeScript
- Prisma
- PostgreSQL
- Clerk Authentication
- Uploadthing
- Tailwind CSS
- React
- Node.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Last Updated

${new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '')} UTC
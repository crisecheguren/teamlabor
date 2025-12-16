# Team Labor

A labor-focused advocacy platform providing politician accountability grades, corporate donor transparency, and worker resources.

**Live Site:** https://teamlabor.org

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Git

### Local Development

1. **Clone the repository**

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the services**
   ```bash
   docker compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker compose exec app npx prisma migrate dev --name init
   ```

5. **Seed the database (optional)**
   ```bash
   docker compose exec app npx prisma db seed
   ```

6. **Access the app**
   - App: http://localhost:3000
   - Database GUI: `docker compose exec app npx prisma studio`

### Development Commands

```bash
# View logs
docker compose logs -f app

# Rebuild after Dockerfile/package.json changes
docker compose up -d --build

# Stop all services
docker compose down

# Access app container shell
docker compose exec app sh
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5.22.0
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Docker Compose

## Project Structure

```
teamlabor/
├── docker-compose.yml      # Service orchestration
├── .env                    # Environment variables (not committed)
├── app/                    # Next.js application
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Seed data script
│   └── src/
│       ├── app/            # App Router pages
│       │   ├── page.tsx    # Homepage
│       │   ├── politicians/
│       │   ├── blog/
│       │   ├── resources/
│       │   ├── about/
│       │   └── api/health/
│       ├── components/
│       │   ├── ui/         # shadcn/ui components
│       │   ├── layout/     # Navbar, Footer
│       │   └── home/       # Homepage sections
│       └── lib/            # Utilities (db, utils)
├── scripts/                # Data import scripts (future)
└── db/data/                # PostgreSQL data (not committed)
```

## Features

### Current
- Homepage with hero, mission statement, featured grades preview, and call-to-action
- Responsive navbar and footer
- Full database schema for politicians, grades, voting records, donations, blog posts, and resources
- Docker Compose setup with PostgreSQL and Next.js

### Planned
- Politician grading based on labor-friendly voting records
- Campaign finance tracking and corporate donor transparency
- Worker resources and unionizing guides
- Blog with political analysis

## License

TBD

---

Built with solidarity for workers everywhere.

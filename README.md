# Share app

Share app is a social media management platform for scheduling, automating and analyzing your content across many channels.

## Features

- Schedule posts to many social channels from one calendar.
- Measure your work with analytics.
- Invite team members to collaborate, comment and schedule posts.
- Approval workflow for posts (opt-in per organization).
- Public API for automation with tools like n8n, Make.com or Zapier.
- Media library and AI helpers.

## Tech stack

- pnpm workspaces (monorepo)
- Next.js (React) frontend in `apps/frontend`
- NestJS backend in `apps/backend`
- NestJS orchestrator for background jobs (Temporal) in `apps/orchestrator`
- Prisma with PostgreSQL
- Redis
- Resend for e-mail notifications

## Getting started

1. Copy `.env.example` to `.env` and fill in the required values (database, Redis, `JWT_SECRET`, URLs).
2. Install dependencies with `pnpm install`.
3. Start everything in development with `pnpm run dev`.

For a container-based setup see `docker-compose.dev.yaml` (development) and `docker-compose.yaml`.

## Credits and license

Share app is built on the open-source project [Postiz](https://github.com/gitroomhq/postiz-app) and is distributed under the same license, the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE). The original copyright and license notices are kept as the license requires.

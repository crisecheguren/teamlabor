# Quick Start: Populating Politicians Data

Follow these steps to populate your database with all current members of Congress.

## Step 1: Get Your Congress.gov API Key

1. Visit: https://api.data.gov/signup/
2. Fill out the form:
   - **First Name:** Your first name
   - **Last Name:** Your last name
   - **Email:** Your email
   - **Website (optional):** teamlabor.org
   - **How will you use the APIs?** "Labor advocacy platform tracking congressional voting records and politician accountability"
3. Submit → You should receive your API key instantly via email
4. Check your email for the API key (subject: "api.data.gov API Key")

## Step 2: Add API Key to Environment

1. Open your `.env` file in the project root (create it from `.env.example` if needed):
   ```bash
   cp .env.example .env
   ```

2. Add your Congress.gov API key:
   ```bash
   CONGRESS_API_KEY=your_actual_api_key_here
   ```

3. Save the file

## Step 3: Ensure Database is Seeded

The import script requires States and Chambers to exist. Run the seed script:

```bash
docker compose exec app npx prisma db seed
```

**Expected output:**
```
🌱 Seeding database...
✓ Created chambers
✓ Created states (all 50 states + DC + territories)
✓ Created grade categories
✓ Created industries
🎉 Seeding complete!
```

## Step 4: Run the Import Script

```bash
docker compose exec app npx tsx scripts/import-politicians.ts
```

**Expected output:**
```
🏛️  Importing politicians from Congress.gov API

📡 Fetching members from Congress.gov API (offset: 0)...
✓ Fetched 250 members

  + Added: Doe, John (D-Senate)
  + Added: Smith, Jane (R-TX-3)
  ... (continues)

📡 Fetching members from Congress.gov API (offset: 250)...
✓ Fetched 250 members

  + Added: Johnson, Bob (D-NY-12)
  ... (continues until all members imported)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Import Summary:
   New politicians added: 535
   Existing politicians updated: 0
   Errors: 0
   Total processed: 535
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Duration:** ~1-2 minutes (3-4 API calls with pagination + database operations)

## Step 5: Verify the Import

Check that politicians were imported successfully:

```bash
docker compose exec app npx prisma studio
```

This opens Prisma Studio in your browser. Navigate to the `Politician` model and you should see 535 records.

**Or use psql:**

```bash
docker compose exec db psql -U teamlabor -d teamlabor -c "SELECT COUNT(*) FROM politicians;"
```

Should return: `535` (100 senators + 435 representatives)

## Troubleshooting

### "CONGRESS_API_KEY environment variable is required"

**Cause:** API key not set in `.env`

**Fix:** Add the key to `.env` file (see Step 2)

### "Chambers not found in database"

**Cause:** Seed script hasn't been run

**Fix:** Run `docker compose exec app npx prisma db seed`

### "State XX not found in database"

**Cause:** Seed script didn't complete or was run with old version

**Fix:**
1. Check that seed.ts includes all 56 states/territories
2. Re-run seed: `docker compose exec app npx prisma db seed`

### Import hangs or times out

**Possible causes:**
- Network issues
- Congress.gov API temporarily down
- Docker container networking issues
- Invalid API key

**Fix:**
1. Check your internet connection
2. Verify your API key is correct in `.env`
3. Visit https://api.congress.gov in browser to verify API is up
4. Restart Docker: `docker compose restart app`
5. Try again

## Next Steps

After importing politicians:

1. **View politician data** in Prisma Studio
2. **Create politician list page** (`/app/src/app/politicians/page.tsx`)
3. **Create politician detail pages** (`/app/src/app/politicians/[bioguideId]/page.tsx`)
4. **Import voting records** (future: `scripts/import-votes.ts`)
5. **Import campaign finance data** (future: `scripts/import-donations.ts`)
6. **Calculate grades** based on voting records

## Sync Schedule

After initial import, set up periodic syncing:

### Recommended: Every 2 Weeks

```bash
# Add to crontab or GitHub Actions
0 6 1,15 * * cd ~/teamlabor && docker compose exec -T app npx tsx scripts/import-politicians.ts
```

This runs at 6am on the 1st and 15th of each month.

### Why not daily?

- Members of Congress rarely change mid-session
- Only special elections/resignations cause updates
- ProPublica's rate limit is 5,000/day, but no need to use them unnecessarily
- Every 2 weeks keeps data fresh without excessive API calls

### When to sync more frequently:

- **During election transitions** (November-January): Daily
- **During special elections:** When announced
- **After major events:** Manual sync as needed

## API Usage

Each import uses:
- **3-4 API calls** (pagination at 250 members per request)
- **~5 seconds** per call
- **Well within** reasonable rate limits

Even if you sync daily for a year, you'll only use ~1,200 calls total (very reasonable).

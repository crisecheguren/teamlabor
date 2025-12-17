# Data Import Scripts

This directory contains scripts for importing and syncing data from external APIs.

## Setup

### 1. Get API Keys

#### Congress.gov API (Required for Politicians & Votes)
- **URL:** https://api.data.gov/signup/
- **Free:** Yes
- **Official:** Library of Congress official API
- **Sign up:** Fill out form with your name, email, and organization
- **Approval:** Usually instant (API key sent via email)
- **Rate Limit:** Not publicly specified, but generous for reasonable use
- **Note:** ProPublica Congress API was discontinued in 2024

#### OpenSecrets API (Optional - for Campaign Finance)
- **URL:** https://www.opensecrets.org/open-data/api
- **Free:** Yes (limited to 200 calls/day)
- **Sign up:** Create account and request API key
- **Approval:** May take 1-2 business days

### 2. Add API Keys to Environment

Edit your `.env` file in the project root:

```bash
# Congress.gov API (Library of Congress)
CONGRESS_API_KEY=your_congress_api_key_here

# OpenSecrets API (for future use)
OPENSECRETS_API_KEY=your_opensecrets_api_key_here
```

**Important:** Never commit `.env` to git! It's already in `.gitignore`.

## Available Scripts

### Import Politicians (`import-politicians.ts`)

Imports all current members of the 119th Congress (2025-2027) from Congress.gov API.

**What it imports:**
- All 100 Senators
- All 435 House Representatives
- Non-voting delegates (DC, Puerto Rico, territories)

**Data populated:**
- Basic info (name, party, state, district)
- Contact info (website, Twitter, phone)
- Identifiers (bioguide ID, FEC ID)
- Photo URLs (from unitedstates.io)
- Election status (up for election, election year)
- Term information

**Usage:**

```bash
# From project root
docker compose exec app npx tsx scripts/import-politicians.ts
```

**First time setup:**

Before running the script, make sure you've seeded the database:

```bash
docker compose exec app npx prisma db seed
```

This creates the necessary States and Chambers records that politicians link to.

**Output:**

The script provides detailed logging:
- ✓ Shows successful imports/updates
- ⚠️ Warns about skipped records (e.g., missing states)
- ✗ Shows errors with details
- 📊 Summary at the end with counts

**Upsert behavior:**

The script uses `upsert` based on `bioguideId`:
- If a politician already exists → **updates** their information
- If they don't exist → **creates** a new record

This makes it safe to run multiple times without creating duplicates.

## Sync Frequency Recommendations

### Politicians
**Frequency:** Every 2 weeks (during session), monthly (during recess)

**Why:**
- Members rarely change mid-session
- Only special elections or resignations cause changes
- Contact info occasionally updates

**Cron example (every other Monday at 6am):**
```cron
0 6 1,15 * * cd /home/coogins/teamlabor && docker compose exec -T app npx tsx scripts/import-politicians.ts >> logs/import-politicians.log 2>&1
```

### Votes (Future)
**Frequency:** Daily during active session weeks

**Why:**
- Congress votes on bills when in session
- Sessions are typically Tuesday-Thursday

### Campaign Finance (Future)
**Frequency:** Quarterly (after FEC deadlines)

**Why:**
- FEC requires campaign finance disclosure 4 times per year
- Quarterly deadlines: Jan 31, Apr 15, Jul 15, Oct 15

**Run 1-2 weeks after each deadline** to allow time for data processing.

## How Congress.gov API Works

### API Structure

Congress.gov API (Library of Congress official API) uses this structure:

```
https://api.congress.gov/v3/member?currentMember=true&api_key={your_key}
```

Key endpoints:
- `/member?currentMember=true` - All current members
- `/member/{bioguideId}` - Detailed info for specific member
- `/bill` - Bills and legislation
- `/amendment` - Amendments
- `/vote` - Voting records

### Rate Limits

- **Not publicly specified** but generous for reasonable use
- Our import script uses 3-4 requests total (includes pagination)
- Includes 1-second delay between paginated requests to be respectful

### Data Updates

Congress.gov updates their data:
- **Daily** during congressional sessions
- **Real-time** for major events (votes, new legislation)
- **Official source** - Library of Congress maintains this data

Source: This is the official government API, maintained by the Library of Congress.

## Troubleshooting

### Error: "CONGRESS_API_KEY environment variable is required"

**Solution:** Add your API key to `.env` file (see Setup section above)

### Error: "Chambers not found in database"

**Solution:** Run the seed script first:
```bash
docker compose exec app npx prisma db seed
```

### Error: "State XX not found in database"

**Solution:** The seed script should include all 50 states + territories. If you see this error, check that the seed ran successfully.

### Error: "Congress.gov API error: 403 Forbidden"

**Possible causes:**
- Invalid API key
- API key not activated yet
- Typo in API key

**Solution:**
1. Double-check your API key in `.env`
2. Verify the email from api.data.gov with your key
3. Request a new one if needed at https://api.data.gov/signup/

### Error: "Congress.gov API error: 429 Too Many Requests"

**Unlikely** but if it happens:
- Wait 1 hour and try again
- Check if another script is hitting the API
- Contact api.data.gov support if persistent

## Future Enhancements

Potential additions to the scripts directory:

- `import-votes.ts` - Import voting records for key bills
- `import-donations.ts` - Import campaign finance data from OpenSecrets
- `calculate-grades.ts` - Calculate politician grades based on voting records
- `sync-all.ts` - Master script to run all imports in sequence
- `cleanup-old-data.ts` - Archive/delete outdated records

## Resources

- [Congress.gov API Docs](https://api.congress.gov/)
- [Congress.gov API Signup](https://api.data.gov/signup/)
- [OpenSecrets API Docs](https://www.opensecrets.org/open-data/api)
- [Prisma Upsert Guide](https://www.prisma.io/docs/concepts/components/prisma-client/crud#upsert)
- [Bioguide IDs Reference](https://bioguide.congress.gov/)
- [UnitedStates GitHub (Backup Data Source)](https://github.com/unitedstates/congress-legislators)

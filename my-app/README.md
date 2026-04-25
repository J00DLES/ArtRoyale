# Some details I want to keep track of

## Database Schema 

PostgreSQL database with the following tables.
- **users** - store account information
- **sessions** - store session information
- **characters** - store character information
- **character-images** - store images for characters
- **attacks** - store attack infromation

These tables have relationships
- User → Characters (1-to-many)
- Character → Images (1-to-many) 
- Users ↔ Attacks (many-to-many via attacker/defender)
- Character → Attacks (1-to-many)

Note that the attack table is doing something special
- creates a many-to-many relationship between users
- Many users attack many other users, but instead of a join table, you store:
  - attacker_id
  - defender_id

This is a self-referencing relationship.

## Routes (database side)
Public Routes (some display/links will depend on authentication)
- [ ] `GET/` - Home page with a quick description of how it works, and recent characters (maybe even include team statistics/leaderboard)
- [x] `GET/users/:id` - Shows a page with information about a specific user.
- [ ] `GET/characters/recent` Shows recent characters (from anyone) (link to this on home page?)
- [x] `GET/characters/:id` Shows a specific character's page.
- [ ] `GET/users/:id/characters` Shows all characters by a specific user
- [ ] `GET/users/:id/attacks` - shows all attacks by a specific user

Private routes
- [x] `GET/characters/new` - Page to create a new character
- [ ] `GET /attack/new` - page to attack
- [x] `POST/characters/new` - submit new character
- [ ] `POST/characters/:id/delete` - delete existing character

# CURRENTLY....
I added the character previews on the user page and fixed image sizing. Next i need to implement the delte character endpoint
and implement attacks.

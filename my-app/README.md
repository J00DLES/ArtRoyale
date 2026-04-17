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


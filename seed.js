// --- THE SUPER SCRIPT ---

require('dotenv').config();
const pool = require('./db');
const bcrypt = require('bcrypt');

// 1. All of your table-creation SQL is now stored in this constant
const schemaSQL = `
  -- Drop existing tables to start fresh (optional, but good for rerunning the script)
  DROP TABLE IF EXISTS hints, transactions, team_items, prices, items, teams, games, gms CASCADE;

  -- Table for Game Masters (GMs)
  CREATE TABLE gms (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL
  );

  -- Table for Game Instances
  CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      game_code VARCHAR(255) UNIQUE NOT NULL,
      gm_id INTEGER REFERENCES gms(id),
      status VARCHAR(50) DEFAULT 'pending', -- pending, active, finished
      current_round INTEGER DEFAULT 0,
      total_rounds INTEGER DEFAULT 9,
      round_time INTEGER DEFAULT 420 -- 7 minutes in seconds
  );

  -- Table for Teams
  CREATE TABLE teams (
      id SERIAL PRIMARY KEY,
      game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      cash NUMERIC(12, 2) DEFAULT 4000.00,
      UNIQUE(game_id, name)
  );

  -- Table for Item Types
  CREATE TABLE items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
  );

  -- Table for Item Prices per Round
  CREATE TABLE prices (
      id SERIAL PRIMARY KEY,
      item_id INTEGER REFERENCES items(id),
      round INTEGER NOT NULL,
      price NUMERIC(10, 2) NOT NULL
  );

  -- Table to track items owned by teams
  CREATE TABLE team_items (
      id SERIAL PRIMARY KEY,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES items(id),
      quantity INTEGER DEFAULT 0,
      UNIQUE(team_id, item_id)
  );

  -- Table to log all transactions
  CREATE TABLE transactions (
      id SERIAL PRIMARY KEY,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      item_id INTEGER REFERENCES items(id),
      quantity INTEGER NOT NULL,
      price_per_item NUMERIC(10, 2) NOT NULL,
      transaction_type VARCHAR(4) NOT NULL, -- 'buy' or 'sell'
      round INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Table for hint purchases
  CREATE TABLE hints (
      id SERIAL PRIMARY KEY,
      team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
      round INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
`;

async function setupDatabase() {
  try {
    // 2. Run the schema creation query first
    console.log('--- Step 1: Creating database schema... ---');
    await pool.query(schemaSQL);
    console.log('Schema created successfully.');

    // --- SEEDING DATA ---
    console.log('--- Step 2: Seeding initial data... ---');

    // Seed GMs
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);
    await pool.query("INSERT INTO gms (username, password_hash) VALUES ('game_master', $1) ON CONFLICT (username) DO NOTHING", [password_hash]);
    console.log('GM seeded.');

    // Seed Items
    // IMPORTANT: Replace these with your actual item names
    const items = ['Kryptonite', 'Unobtanium', 'Adamantium', 'Vibranium', 'Mithril', 'Dragon Glass'];
    for (const name of items) {
      await pool.query("INSERT INTO items (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [name]);
    }
    console.log('Items seeded.');

    // Seed Prices
    const prices = [
        // --- Round 1 Prices ---
        { item_id: 1, round: 1, price: 800 }, // Price for Apples
        { item_id: 2, round: 1, price: 800 }, // Price for Beef
        { item_id: 3, round: 1, price: 800 }, // Price for Coffee
        { item_id: 4, round: 1, price: 800 }, // Price for Xylitol
        { item_id: 5, round: 1, price: 800 }, // Price for Yoghurt
        { item_id: 6, round: 1, price: 800 }, // Price for Zucchini

        // --- Round 2 Prices ---
        { item_id: 1, round: 2, price: 1000 }, // Price for Apples
        { item_id: 2, round: 2, price: 1000 }, // Price for Beef
        { item_id: 3, round: 2, price: 1200 }, // Price for Coffee
        { item_id: 4, round: 2, price: 1400 }, // Price for Xylitol
        { item_id: 5, round: 2, price: 1000 }, // Price for Yoghurt
        { item_id: 6, round: 2, price: 1400 }, // Price for Zucchini

        // --- Round 3 Prices ---
        { item_id: 1, round: 3, price: 1600 }, // Price for Apples
        { item_id: 2, round: 3, price: 2000 }, // Price for Beef
        { item_id: 3, round: 3, price: 600 }, // Price for Coffee
        { item_id: 4, round: 3, price: 1800 }, // Price for Xylitol
        { item_id: 5, round: 3, price: 2000 }, // Price for Yoghurt
        { item_id: 6, round: 3, price: 1200 }, // Price for Zucchini
        
        // --- Round 4 Prices ---
        { item_id: 1, round: 4, price: 1400 }, // Price for Apples
        { item_id: 2, round: 4, price: 1200 }, // Price for Beef
        { item_id: 3, round: 4, price: 1000 }, // Price for Coffee
        { item_id: 4, round: 4, price: 1200 }, // Price for Xylitol
        { item_id: 5, round: 4, price: 2600 }, // Price for Yoghurt
        { item_id: 6, round: 4, price: 2000 }, // Price for Zucchini

        // --- Round 5 Prices ---
        { item_id: 1, round: 5, price: 3000 }, // Price for Apples
        { item_id: 2, round: 5, price: 600 }, // Price for Beef
        { item_id: 3, round: 5, price: 3000 }, // Price for Coffee
        { item_id: 4, round: 5, price: 600 }, // Price for Xylitol
        { item_id: 5, round: 5, price: 600 }, // Price for Yoghurt
        { item_id: 6, round: 5, price: 3000 }, // Price for Zucchini

        // --- Round 6 Prices ---
        { item_id: 1, round: 6, price: 1600 }, // Price for Apples
        { item_id: 2, round: 6, price: 2400 }, // Price for Beef
        { item_id: 3, round: 6, price: 1400 }, // Price for Coffee
        { item_id: 4, round: 6, price: 2200 }, // Price for Xylitol
        { item_id: 5, round: 6, price: 1800 }, // Price for Yoghurt
        { item_id: 6, round: 6, price: 1400 }, // Price for Zucchini

        // --- Round 7 Prices ---
        { item_id: 1, round: 7, price: 2000 }, // Price for Apples
        { item_id: 2, round: 7, price: 2000 }, // Price for Beef
        { item_id: 3, round: 7, price: 1800 }, // Price for Coffee
        { item_id: 4, round: 7, price: 1600 }, // Price for Xylitol
        { item_id: 5, round: 7, price: 2200 }, // Price for Yoghurt
        { item_id: 6, round: 7, price: 2000 }, // Price for Zucchini

        // --- Round 8 Prices ---
        { item_id: 1, round: 8, price: 2800 }, // Price for Apples
        { item_id: 2, round: 8, price: 2400 }, // Price for Beef
        { item_id: 3, round: 8, price: 2600 }, // Price for Coffee
        { item_id: 4, round: 8, price: 2000 }, // Price for Xylitol
        { item_id: 5, round: 8, price: 2600 }, // Price for Yoghurt
        { item_id: 6, round: 8, price: 1800 }, // Price for Zucchini

        // --- Round 9 Prices ---
        { item_id: 1, round: 9, price: 4000 }, // Price for Apples
        { item_id: 2, round: 9, price: 1000 }, // Price for Beef
        { item_id: 3, round: 9, price: 3000 }, // Price for Coffee
        { item_id: 4, round: 9, price: 4000 }, // Price for Xylitol
        { item_id: 5, round: 9, price: 3000 }, // Price for Yoghurt
        { item_id: 6, round: 9, price: 4000 }, // Price for Zucchini
    ];

    for (const p of prices) {
      await pool.query("INSERT INTO prices (item_id, round, price) VALUES ($1, $2, $3)", [p.item_id, p.round, p.price]);
    }
    console.log('Prices seeded.');

    console.log('--- Database setup complete! ---');

  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    // End the pool so the script doesn't hang
    pool.end();
  }
}

// 3. Run the main function
setupDatabase();
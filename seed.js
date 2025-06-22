const pool = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    // Seed GMs
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);
    await pool.query("INSERT INTO gms (username, password_hash) VALUES ('game_master', $1) ON CONFLICT (username) DO NOTHING", [password_hash]);

    // Seed Items
    const items = ['Apples', 'Beef', 'Coffee', 'Xylitol', 'Yoghurt', 'Zucchini'];
    for (const name of items) {
      await pool.query("INSERT INTO items (name) VALUES ($1) ON CONFLICT (name) DO NOTHING", [name]);
    }

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

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    pool.end();
  }
}

seed();
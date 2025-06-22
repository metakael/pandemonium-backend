const express = require('express');
const pool = require('../db');
const router = express.Router();
// You would add a middleware here to protect routes that require GM authentication

// Create a new game
router.post('/', async (req, res) => {
  const { game_code, gm_id } = req.body;
  try {
    const newGame = await pool.query(
      'INSERT INTO games (game_code, gm_id) VALUES ($1, $2) RETURNING *',
      [game_code, gm_id]
    );
    res.json(newGame.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get game details
router.get('/:game_code', async (req, res) => {
    const { game_code } = req.params;
    try {
        const gameRes = await pool.query('SELECT * FROM games WHERE game_code = $1', [game_code]);
        if (gameRes.rows.length === 0) {
            return res.status(404).json({ msg: 'Game not found' });
        }
        res.json(gameRes.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
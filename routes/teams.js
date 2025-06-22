const express = require('express');
const pool = require('../db');
const router = express.Router();

// Team joins a game
router.post('/join', async (req, res) => {
  const { game_code, team_name } = req.body;
  try {
    const gameResult = await pool.query('SELECT id FROM games WHERE game_code = $1', [game_code]);
    if (gameResult.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    const game_id = gameResult.rows[0].id;

    const newTeam = await pool.query(
      'INSERT INTO teams (game_id, name) VALUES ($1, $2) RETURNING *',
      [game_id, team_name]
    );
    res.json(newTeam.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.constraint === 'teams_game_id_name_key') {
        return res.status(400).json({ error: 'Team name already taken in this game.' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
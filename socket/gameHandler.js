module.exports = (io, socket, pool) => {
    const joinGame = async ({ game_code, team_id }) => {
        socket.join(game_code);
        console.log(`Team ${team_id} joined game ${game_code}`);
        // Notify others in the room
        io.to(game_code).emit('player_joined', { team_id });
    };

    const buyItem = async ({ game_code, team_id, item_id, quantity, price_per_item, round }) => {
        // ... transaction logic ...
        // 1. Check team's cash
        // 2. Update team's cash
        // 3. Update team_items
        // 4. Log transaction
        // 5. Emit updated game state to the room
    };

    const sellItem = async ({ game_code, team_id, item_id, quantity, price_per_item, round }) => {
        // ... transaction logic ...
        // 1. Check team's item quantity
        // 2. Update team's item quantity
        // 3. Update team's cash
        // 4. Log transaction
        // 5. Emit updated game state to the room
    };

    socket.on('join_game', joinGame);
    socket.on('buy_item', buyItem);
    socket.on('sell_item', sellItem);
};
const cron = require('node-cron');
const Booking = require('../models/booking');

// Щодня о 00:01 видаляє бронювання у яких checkOut < сьогодні
cron.schedule('1 0 * * *', async () => {
    try {
        const expired = await Booking.find({ checkOut: { $lt: new Date() } });

        for (const booking of expired) {
            await booking.deleteOne(); // спрацьовує post-hook → room.available = true
        }

        console.log(`[CRON] ${new Date().toISOString()} — видалено ${expired.length} прострочених бронювань`);
    } catch (err) {
        console.error('[CRON] Помилка:', err.message);
    }
});
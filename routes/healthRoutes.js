const router = require('express').Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
    const dbOk = mongoose.connection.readyState === 1;

    res.status(dbOk ? 200 : 503).json({
        status: dbOk ? 'ok' : 'error',
        db:     dbOk ? 'connected' : 'disconnected',
        uptime: Math.round(process.uptime()) + 's',
        env:    process.env.NODE_ENV,
    });
});

module.exports = router;
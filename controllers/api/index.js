const router = require('express').Router();
const userRoutes = require('./userRoutes.js');
const artworkRoutes = require('./artworkRoutes.js');
const updateRoutes = require('./updateRoutes.js');

router.use('/users', userRoutes);
router.use('/artwork', artworkRoutes);
router.use('/updates', updateRoutes);

module.exports = router;
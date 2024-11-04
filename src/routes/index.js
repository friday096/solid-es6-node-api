import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send({ status: 'Node Express API is working' });
});


export default router;

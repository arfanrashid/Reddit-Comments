const Router = require('koa-router');

const topicController = require('../controllers/topics');

const mongoose = require('mongoose');

const api = new Router();

api.prefix('/api');
api.param('topicId', topicController.asParameter);
api.get('/topics/', topicController.all);
api.post('/topics/', topicController.create);
api.get('/topics/:topicId/', topicController.one);
api.put('/topics/:topicId/', topicController.update);

module.exports = api;

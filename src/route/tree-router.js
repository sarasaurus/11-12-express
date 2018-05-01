'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Tree from '../model/tree';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const noteRouter = new Router();
// const noteRouter = module.exports = new Router(); // ES5

noteRouter.post('/api/trees', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.type) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Tree(request.body).save()
    .then((tree) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(tree);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});


noteRouter.get('/api/trees/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Tree.findById(request.params.id)
    .then((item) => { // Vinicio - note found OR note not found, but the id looks good
      if (!item) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(item);
    })
    .catch((error) => { // Vinicio - mongodb error or parsing id error
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

export default noteRouter;

'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Tree from '../model/tree';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const treeRouter = new Router();

treeRouter.post('/api/trees', jsonParser, (request, response) => {
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


treeRouter.get('/api/trees/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Tree.findById(request.params.id)
    .then((item) => { 
      if (!item) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      logger.log(logger.INFO, `GET - resource is: ${item}`);
      return response.json(item);
    })
    .catch((error) => {
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
treeRouter.get('/api/trees', (request, response) => {
  logger.log(logger.INFO, 'GET ALL - processing a request');

  return Tree.find()
    .then((array) => { 
      logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
      if (!array) {
        logger.log(logger.INFO, 'GET ALL - responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET ALL - responding with a 200 status code');
      logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
      return response.json(array);
    })
    .catch((error) => { 
      logger.log(logger.ERROR, '__GET ALL_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});
treeRouter.delete('/api/trees/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');
  
  return Tree.findByIdAndRemove(request.params.id)
    .then((item) => {
      if (!item) {
        logger.log(logger.INFO, 'DELETE- responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      logger.log(logger.INFO, `DELETE - resource is: ${item}`);
      // QUESTION: how to add empty string to body
      return response.sendStatus(204);
    })
    .catch((error) => { 
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(400);
      }
      logger.log(logger.ERROR, '__DELETE_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});
export default treeRouter;

'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Tree from '../model/tree';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const treeRouter = new Router();
// const noteRouter = module.exports = new Router(); // ES5

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
  //   DONE: with an id in the query string it should respond with the details of a specifc resource (as JSON)
  //   if the id is not found respond with a 404

  return Tree.findById(request.params.id)
    .then((item) => { // Vinicio - note found OR note not found, but the id looks good
      if (!item) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      logger.log(logger.INFO, `GET - resource is: ${item}`);
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
treeRouter.get('/api/trees', (request, response) => {
  logger.log(logger.INFO, 'GET ALL - processing a request');
  // TODO: with no id in the query string it should respond with an array of all of your resources

  return Tree.find()
    .then((array) => { // Sarah - uhh what is happening here?
      logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
      if (!array) {
        logger.log(logger.INFO, 'GET ALL - responding with a 404 status code - (!item)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET ALL - responding with a 200 status code');
      logger.log(logger.INFO, `GET ALL - the ARRAY: ${array}`);
      return response.json(array);
    })
    .catch((error) => { // this is for a DB or server error
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
      // delete the item
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

// TODO: DELETE /api/<resource-name>/:id
// the route should delete a note with the given id
// on success this should return a 204 status code with no content in the body
// on failure due to lack of id in the query respond with a 400 status code
// on failure due to a resouce with that id not existing respond with a 404 status code

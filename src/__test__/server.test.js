'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Tree from '../model/tree';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/trees`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const createTreeMock = () => {
  return new Tree({
    type: faker.lorem.words(10),
    genus: faker.lorem.words(25),
  }).save();
};

describe('/api/trees', () => {
  // I know that I'll gave a POST ROUTE
  // The post route will be able to insert a new note to my application
  beforeAll(startServer); // Vinicio - we don't use startServer() because we need a function
  afterAll(stopServer);
  afterEach(() => Tree.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const treeToPost = {
      type: faker.lorem.words(10),
      genus: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(treeToPost)
      .then((response) => {
        // Vinicio - testing status codes
        expect(response.status).toEqual(200);
        // Vinicio - Testing for specific values
        expect(response.body.type).toEqual(treeToPost.type);
        expect(response.body.genus).toEqual(treeToPost.genus);
        // Vinicio - Testing that properties are present
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const noteToPost = {
      genus: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(noteToPost)
      .then(Promise.reject) // Vinicio - this is needed because we are testing for failures
      .catch((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/trees', () => {
    test('should respond with 200 if there are no errors', () => {
      let noteToTest = null; //  Vinicio - we need to preserve the note because of scope rules
      return createTreeMock() // Vinicio - test only a GET request
        .then((tree) => {
          noteToTest = tree;
          return superagent.get(`${apiURL}/${tree._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual(noteToTest.type);
          expect(response.body.genus).toEqual(noteToTest.genus);
        });
    });
    test('should respond with 404 if there is no note to be found', () => {
      return superagent.get(`${apiURL}/THisIsAnInvalidId`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
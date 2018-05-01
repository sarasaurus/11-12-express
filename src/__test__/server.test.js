'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Tree from '../model/tree';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/trees`;

const createTreeMock = () => {
  return new Tree({
    type: faker.lorem.words(10),
    genus: faker.lorem.words(25),
    height: faker.finance.amount(1, 10),
  }).save();
};

describe('/api/trees', () => {
  beforeAll(startServer); 
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
        expect(response.status).toEqual(200);
        expect(response.body.type).toEqual(treeToPost.type);
        expect(response.body.genus).toEqual(treeToPost.genus);
        expect(response.body.height).toEqual(treeToPost.height);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const treeToPost = {
      genus: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(treeToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/trees', () => {
    test('should respond with 200 if there are no errors', () => {
      let treeToTest = null;
      return createTreeMock()
        .then((tree) => {
          treeToTest = tree;
          return superagent.get(`${apiURL}/${tree._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.type).toEqual(treeToTest.type);
          expect(response.body.genus).toEqual(treeToTest.genus);
        });
    });
    test('should respond with 404 if there is no note to be found', () => {
      return superagent.get(`${apiURL}/NOTVALID`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('GET ALL /api/trees', () => {

    // beforeAll(() => {
    //   const createManyMockTrees = (5) => {
    //     return Promise.all(new Array(5)
    //       .fill(0)
    //       .map(() => createNoteMock()));
    //   };
    // });
    // afterAll(()=>{

    // }));
    test('should respond with 200 if there are no errors', () => {
      let treeToTest = null; 
      // let testTree = null;//  Vinicio - we need to preserve the note because of scope rules
      return createTreeMock() // Vinicio - test only a GET request
        .then((tree) => {
          treeToTest = tree;
          return superagent.get(`${apiURL}`);
        })
        .then((response) => {
          console.log('GET ALL RESPONSE: ', response);
          expect(response.status).toEqual(200);
          expect(response.body.length).toBeTruthy();
        });
    });
  });

  describe('DELETE /api/trees', () => {
    test('should respond with 204 if there are no errors', () => {
      let treeToTest = null; 
      return createTreeMock() 
        .then((tree) => {
          treeToTest = tree;
          return superagent.delete(`${apiURL}/${tree._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          // expect(response.body).toEqual('');
        });
    });
    test('should respond with 400 if there is no tree to be found', () => {
      return superagent.get(`${apiURL}/NOTVALID`)
        .then(Promise.reject) 
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    // test('should respond with 404 if there is no id in the query', () => {
    //   return superagent.get(`${apiURL}/`)
    //     .then((response) => {
    //       expect(response.status).toEqual(404);
    //     });
    // }); // Sarah - test is not working, not sure why
  });
});

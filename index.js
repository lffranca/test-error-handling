'use strict';

const app = require('express')();
const Promise = require('bluebird');

class MyCustomErrors extends Error {
  constructor(options) {
    super();
    this.error = options;
  }
}

let primary = () => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log('Promise Primary!');
      resolve('Promise Primary!');
    }, 5000);
  });
};

let secundary = () => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      console.log('Promise Secundary!');
      resolve(['Promise Secundary!']);
    }, 4000);
  });
};

let tertiary = () => {
  return new Promise((resolve,reject) => {
    throw new Error('teste de error!');
    setTimeout(() => {
      console.log('Promise Tertiary!');
      resolve(['Promise Tertiary!']);
    }, 3000);
  });
};

app.get('/', (req, res) => {
  primary().then(value => {
    return secundary(value);
  }).then(value => {
    return tertiary(value);
  }).then(value => {
    console.log(value);
    res.json(value);
  }).catch(MyCustomErrors, err => {
    console.log(err.error);
    res.json(err);
  }).catch(err => {
    console.log(err.message);
    res.json(err.message);
  });
});

app.listen(3000, () => {
  console.log('SERVIDOR RODANDO!');
});

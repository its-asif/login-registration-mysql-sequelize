const express = require('express');

const configureMiddlewares = (app) => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

};

module.exports = configureMiddlewares;

const express = require('express');
const Route = express.Router();

Route.get('/about', (req, res) => {
    res.render('Company Pages/about');
});

Route.get('/policy', (req, res) => {
    res.render('Company Pages/privacyPolicy');
});

Route.get('/contact', (req, res) => {
    res.render('Company Pages/contact');
});

Route.get('/terms', (req, res) => {
    res.render('Company Pages/termsConditions');
});

module.exports = Route;
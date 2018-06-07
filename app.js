"use strict";
exports.__esModule = true;
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var RecipeModel_1 = require("./model/RecipeModel");
var RecipeCatalogModel_1 = require("./model/RecipeCatalogModel");
var RecipeCatalogDetailsModel_1 = require("./model/RecipeCatalogDetailsModel");
//import GooglePassportObj from './GooglePassport';
var passport = require('passport');
var fs = require('fs');
var cors = require('cors');
var max = 500;
var min = 8;
// Creates and configures an ExpressJS web server.
var App = /** @class */ (function () {
    //public googlePassportObj:GooglePassportObj;
    //Run configuration methods on the Express instance.
    function App() {
        this.expressApp = express();
        this.middleware();
        this.routes();
        this.idGenerator = Math.floor(Math.random() * (max - min) + min);
        this.Recipes = new RecipeModel_1.RecipeModel();
        this.RecipesCatalog = new RecipeCatalogModel_1.RecipeCatalogModel();
        this.RecipeCatalogDetails = new RecipeCatalogDetailsModel_1.RecipeCatalogDetailsModel();
    }
    // Configure Express middleware.
    App.prototype.middleware = function () {
        this.expressApp.use(logger('dev'));
        this.expressApp.use(bodyParser.json());
        this.expressApp.use(bodyParser.urlencoded({ extended: false }));
        // this.express.use(session({ secret: 'keyboard cat' }));
        // this.express.use(passport.initialize());
        // this.express.use(passport.session());
    };
    //   private validateAuth(req, res, next):void {
    //     if (req.isAuthenticated()) { return next(); }
    //         res.redirect('/');
    //   }
    // Configure API endpoints.
    App.prototype.routes = function () {
        var _this = this;
        var router = express.Router();
        router.use(cors());
        router.options('*', cors());
        //oauth
        // 	router.get('/auth/facebook', 
        //     passport.authenticate('facebook', 
        //         {scope: ['public_profile', 'email'] }
        //     )
        // );
        // router.get('/auth/facebook/callback', 
        //     passport.authenticate('facebook', 
        //         { failureRedirect: '/', successRedirect: '/myprofile' }
        //     )
        // );
        // router.get('/auth/userdata', this.validateAuth, (req, res) => {
        //     console.log('user object:' + JSON.stringify(req.user));
        //     this.username = JSON.stringify(req.user);
        //     res.json(req.user);
        // });
        router.post('/app/recipe/:recipeID', function (req, res) {
            var id = req.params.recipeID;
            console.log('Query changed single list with id: ' + id);
            console.log(res.header);
            res.send("Received post for id:" + id);
        });
        router["delete"]('/app/recipe/:recipeID', function (req, res) {
            var id = req.params.recipeID;
            console.log('Query single recipe with id: ' + id);
            _this.Recipes.DeleteRecipe(res, { rrecipeId: id });
        });
        // router.get('/', (req, res) => {
        //     console.log('Query All list');
        //     this.Recipes.retrieveAllRecipes(res);
        // });
        router.post('/app/recipe/', function (req, res) {
            console.log("Inside Post");
            var jsonObj = req.body;
            jsonObj.rrecipeId = _this.idGenerator;
            console.log("id..." + jsonObj.rrecipeId);
            _this.Recipes.model.create([jsonObj], function (err) {
                if (err) {
                    console.log('object creation failed');
                }
            });
            res.send({ message: 'Recipe created!' });
            _this.idGenerator++;
        });
        router.get('/app/recipe/', function (req, res) {
            console.log('Query All Recipes');
            _this.Recipes.retrieveAllRecipes(res);
        });
        router.get('/app/recipe/:recipeID', function (req, res) {
            var id = req.params.recipeID;
            console.log('Query single recipe with id: ' + id);
            _this.Recipes.retrieveRecipeDetails(res, { rrecipeId: id });
        });
        router.get('/app/catalog', function (req, res) {
            console.log('Query All Recipe catalog');
            _this.RecipesCatalog.retrieveAllCatalog(res);
        });
        router.get('/app/catalog/:recipeCatalogDetails', function (req, res) {
            var id = req.params.recipeCatalogDetails;
            console.log('Query single recipe with catalog: ' + id);
            _this.RecipeCatalogDetails.retrieveRecipeCatalogDetails(res, { rcId: id });
        });
        this.expressApp.use('/', router);
        this.expressApp.use('/', express.static(__dirname + '/recipeAngularDist'));
        this.expressApp.use('/images', express.static(__dirname + '/img'));
        this.expressApp.use('/', express.static(__dirname + '/pages'));
    };
    return App;
}());
exports.App = App;

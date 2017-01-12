"use strict";

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: viewsPath + 'index.html'
  }).otherwise({
    redirectTo: '404',
    templateUrl: viewsPath + '404.html'
  });
  $locationProvider.html5Mode(true);
});

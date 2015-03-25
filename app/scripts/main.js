/*global require*/
'use strict';

require.config({
    shim: {
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        threejs: '../bower_components/threejs/build/three'
    }
});

require([
    'backbone'
], function (Backbone) {

});

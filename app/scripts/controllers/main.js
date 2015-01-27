'use strict';

/**
 * @ngdoc function
 * @name arheadosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the arheadosApp
 */
angular.module('arheadosApp')
  .controller('MainCtrl', function ($scope, drawManager) {

    var colors = {
      transparent: 'rgba(0, 0, 0, 0)',
      black:       'rgba(0, 0, 0, 1)',
      gray:        'rgba(180, 180, 180, 1)'
    };

    //Internal
    var
    //Variables
    canvas,

    resizeCanvas = function () {
      var container = document.getElementById('canvasContainer');
      var w = container.clientWidth;
      var h = window.innerHeight * 0.70;

      canvas.width  = w;
      canvas.height = h;

      drawManager.setCanvasSize(canvas.width, canvas.height);
      drawManager.resetDraw();
    }
    ;

    //Bindings
    $scope.shape = {
        tool       : 'pencil',
        lineColor  : colors.black,
        lineWidth  : 1,
        lineCap    : 'round',
        fillStyle  : colors.transparent,
        filled     : true,
        stroked    : true
    };

    //Funcions

    $scope.init = function () {
      canvas = document.getElementById('canvas');
      drawManager.setContext(canvas.getContext('2d'));

      canvas.ontouchstart =
      canvas.onmousedown = function () {
        drawManager.startDrawing($scope.shape);
      };

      canvas.ontouchmove = function () {
        event.preventDefault();
        drawManager.continueDrawing ();
      };

      canvas.onmousemove = function () {
        drawManager.continueDrawing ();
      };

      canvas.ontouchend =
      canvas.ontouchcancel =
      canvas.onmouseup = function () {
        drawManager.endDrawing();
      };

      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('load', resizeCanvas());

    };

    $scope.resetDraw = function (){
      drawManager.resetDraw();
    };

    $scope.undo = function () {
      drawManager.undo();
    };

    $scope.$watch('shape.tool', function () {
      $scope.shape.filled = $scope.shape.tool !== 'pencil';
    });
});

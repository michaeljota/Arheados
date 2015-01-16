'use strict';

/**
 * @ngdoc function
 * @name arheadosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the arheadosApp
 */
angular.module('arheadosApp')
  .controller('MainCtrl', function ($scope) {

    var colors = {
      transparent: 'rgba(0,0,0,0)',
      black: 'rbga(0,0,0,1)',
      gray: 'rgba(180,180,180,1)'
    };

    //Internal
    var
    //Variables
    canvas,
    context,
    drawing,
    points,
    shapeStorage,

    //Functions

    renderShape = function(shape){
      context.beginPath();
      context.lineWidth = shape.LineWidth;
      context.lineCap = shape.LineCap;
      context.fillStyle = shape.Filled ? shape.FillStyle : colors.transparent;
      context.strokeStyle = shape.Stroked ? shape.LineColor : colors.transparent;
      switch (shape.ToolName){
        case 'pencil':
          pencil(shape);
          break;
        case 'line':
          line(shape);
          break;
        case 'rectangle':
          rectangle(shape);
          break;
        case 'circle':
          circle(shape);
          break;
        default:
          console.log('ERR! ToolName undefined or invalid');
          resetPoints();
          break;
      }
      context.fill();
      context.stroke();
    },

    pencil = function(shape){
      context.moveTo(shape.Points[0].x, shape.Points[0].y);
      for (var i = 0; i < shape.Points.length; i++) {
        context.lineTo(shape.Points[i].x, shape.Points[i].y);
      }
    },

    line = function(shape){
      context.moveTo(shape.Points[0].x, shape.Points[0].y);
      context.lineTo(shape.Points[1].x, shape.Points[1].y);
    },

    rectangle = function(shape){
      var width, height;
      width = shape.Points[1].x - shape.Points[0].x;
      height = shape.Points[1].y - shape.Points[0].y;
      context.rect(shape.Points[0].x, shape.Points[0].y, width, height);
    },

    circle = function(shape){
      var radius = (Math.abs(shape.Points[1].x - shape.Points[0].x) + (Math.abs(shape.Points[1].y - shape.Points[0].y)) / 2);
      context.arc(shape.Points[1].x, shape.Points[1].y, radius, 0, Math.PI * 2, false);
    },

    renderShapeStorage = function() {
      context.clearRect(0,0, canvas.width, canvas.height);
      for (var i = 0; i < shapeStorage.length; i++) {
        renderShape(shapeStorage[i]);
      }
    },

    getShape = function() {
      if($scope.tool !== 'pencil' && points.length > 1) {
        var starPoint, endPoint;
        starPoint = points[0];
        endPoint = points[points.length - 1];
        points = [];
        points.push(starPoint);
        points.push(endPoint);
        $scope.filled = true;
      }else{ 
        $scope.filled = false;
      }
      return {
        ToolName: $scope.tool,
        LineColor: $scope.lineColor,
        LineWidth: $scope.lineWidth,
        LineCap: $scope.lineCap,
        FillStyle: $scope.fillStyle,
        Points: points,
        Filled: $scope.filled,
        Stroked: $scope.stroked
      };
    },

    startDrawing = function() {
      drawing = true;
    },

    continueDrawing = function (mobile) {
      if (drawing) {
        var point = {x:0, y:0};
        if(mobile){
          point.x = event.touches[0].pageX - event.target.offsetLeft;
          point.y = event.touches[0].pageY - event.target.offsetTop;
        }else{
          point.x = event.pageX - event.target.offsetLeft;
          point.y = event.pageY - event.target.offsetTop;
        }
        points.push(point);
        if($scope.tool !== 'pencil'){
          renderShapeStorage();
        }
        if(points.length > 1){
          renderShape(getShape());
        }
      }
    },

    endDrawing = function () {
      if(points.length > 1){
          shapeStorage.push(getShape());
      }
      renderShapeStorage();
      resetPoints();
    },

    resetPoints = function() {
      points = [];
      drawing = false;
    },

    resizeCanvas = function () {
      var container = document.getElementById('canvasContainer');
      var w = container.clientWidth;
      var h = window.innerHeight * 0.70;

      canvas.width  = w;
      canvas.height = h;
      
      context.translate(0,0);
      renderShapeStorage();
    }
    ;

    //Bindings
    $scope.tool = 'pencil';
    $scope.lineColor = colors.black;
    $scope.lineWidth = 1;
    $scope.lineCap = 'round';
    $scope.fillStyle = colors.transparent;
    $scope.filled = true;
    $scope.stroked = true;
    
    //Funcions

    $scope.init = function () {
      canvas = document.getElementById('canvas');
      context = canvas.getContext('2d');
      $scope.resetCanvas();

      canvas.ontouchstart =
      canvas.onmousedown = function () {
        startDrawing();
      };

      canvas.ontouchmove = function () {
        event.preventDefault();
        continueDrawing (true);
      };

      canvas.onmousemove = function () {
        continueDrawing (false);
      };

      canvas.ontouchend =
      canvas.ontouchcancel =
      canvas.onmouseup = function () {
        endDrawing();
      };

      window.addEventListener('resize', resizeCanvas);
      window.addEventListener('load', resizeCanvas());

    };


    $scope.resetCanvas = function (){
      shapeStorage = [];
      renderShapeStorage();
      resetPoints();
    };

    $scope.undo = function () {
      shapeStorage.pop();
      renderShapeStorage();
      resetPoints();
    };

});

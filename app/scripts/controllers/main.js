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

    function Shape (shape) {
      this.ToolName   = shape.tool;
      this.LineColor  = shape.lineColor;
      this.LineWidth  = shape.lineWidth;
      this.LineCap    = shape.lineCap;
      this.FillStyle  = shape.fillStyle;
      this.isFilled   = shape.filled;
      this.isStroked  = shape.stroked;
      this.Points     = [];
    }

    Shape.prototype.addPoint = function(point){
      if(this.ToolName!=='pencil' && this.Points.length>1){
        this.Points.pop();
      }
      this.Points.push(point);
    };

    var colors = {
      transparent: 'rgba(0, 0, 0, 0)',
      black:       'rgba(0, 0, 0, 1)',
      gray:        'rgba(180, 180, 180, 1)'
    };

    //Internal
    var
    //Variables
    canvas,
    context,
    shapeStorage,
    tmpShape,

    //Functions

    renderShape = function(shape){
      context.beginPath();
      context.lineWidth = shape.LineWidth;
      context.lineCap = shape.LineCap;
      context.strokeStyle = shape.isStroked ? shape.LineColor : colors.transparent;
      context.fillStyle = shape.isFilled ? shape.FillStyle : colors.transparent;
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
          resetTmpShape();
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

    startDrawing = function() {
      tmpShape = new Shape($scope.shape);
    },

    continueDrawing = function () {
      if (tmpShape) {
        var point = (event.touches) ?
          {
            x: event.touches[0].pageX - event.target.offsetLeft,
            y: event.touches[0].pageY - event.target.offsetTop
          } : 
          {
            x: event.pageX - event.target.offsetLeft,
            y: event.pageY - event.target.offsetTop
          };
        if(tmpShape.ToolName !== 'pencil'){
          renderShapeStorage();
        }
        tmpShape.addPoint(point);
        if(tmpShape.Points.length > 1){
          renderShape(tmpShape);
        }
      }
    },

    endDrawing = function () {
      if(tmpShape){
        if(tmpShape.Points.length > 1){
          shapeStorage.push(tmpShape);
        }
        renderShapeStorage();
        resetTmpShape();
      }
    },

    resetTmpShape = function() {
      tmpShape = null;
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
      context = canvas.getContext('2d');
      $scope.resetCanvas();

      canvas.ontouchstart =
      canvas.onmousedown = function () {
        startDrawing();
      };

      canvas.ontouchmove = function () {
        event.preventDefault();
        continueDrawing ();
      };

      canvas.onmousemove = function () {
        continueDrawing ();
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
      resetTmpShape();
    };

    $scope.undo = function () {
      shapeStorage.pop();
      renderShapeStorage();
      resetTmpShape();
    };

    $scope.$watch('shape.tool', function () {
      $scope.shape.filled = $scope.shape.tool === 'pencil' ? false : true;
    });
});

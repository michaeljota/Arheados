'use strict';

/**
 * @ngdoc service
 * @name arheadosApp.drawManager
 * @description
 * # drawManager
 * Factory in the arheadosApp.
 */
angular.module('arheadosApp')
  .factory('drawManager', function () {

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

    var
    canvasSize,
    context,
    shapeStorage,
    tmpShape,

    //Functions

    renderShape = function(shape){
      context.beginPath();
      context.lineWidth = shape.LineWidth;
      context.lineCap = shape.LineCap;
      context.strokeStyle = shape.isStroked ? shape.LineColor : 'rgba(0, 0, 0, 0)';
      context.fillStyle = shape.isFilled ? shape.FillStyle : 'rgba(0, 0, 0, 0)';
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
      context.clearRect(0,0, canvasSize.width, canvasSize.height);
      for (var i = 0; i < shapeStorage.length; i++) {
        renderShape(shapeStorage[i]);
      }
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
    };

    return {

      startDrawing : function (shape) {
        tmpShape = new Shape(shape);
      },

      continueDrawing : function () {
        continueDrawing();
      },

      endDrawing : function () {
        endDrawing();
      },

      setContext : function (ctx) {
        context = ctx;
      },

      setCanvasSize : function (width, height) {
        console.log('Setting Canvas Size');
        canvasSize = {
          width: width,
          height: height
        };
      },

      resetDraw : function () {
        context.translate(0,0);
        shapeStorage = [];
        renderShapeStorage();
        resetTmpShape();
      },

      undo : function () {
        shapeStorage.pop();
        renderShapeStorage();
        resetTmpShape();
      }

    };
  });

angular
.module('ui.tilegen', [])
.directive('slider', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    compile: function () {
      return function (scope, element, attrs, ngModel) {
        var div, label, slider, sliderView, sliderViewText;

        div = document.createElement('div');
        div.classList.add('input-field');

        label = document.createElement('label');
        label.classList.add('input-field-label');
        label.appendChild(document.createTextNode(attrs.label));

        slider = document.createElement('input');
        slider.type = 'range';
        slider.name = attrs.ngModel;
        slider.min = attrs.min;
        slider.max = attrs.max;

        sliderView = document.createElement('span');
        sliderView.classList.add('slider-view');
        sliderViewText = document.createTextNode('');
        sliderView.appendChild(sliderViewText);

        div.appendChild(label);
        div.appendChild(slider);
        div.appendChild(sliderView);

        element.append(div);

        ngModel.$render = function () {
          slider.value = ngModel.$viewValue;
          sliderViewText.nodeValue = ngModel.$viewValue;
        };

        slider.addEventListener('change', function () {
          ngModel.$setViewValue(slider.value);
          sliderViewText.nodeValue = ngModel.$viewValue;
          scope.$apply();
        });
      }
    }
  };
})
.directive('radios', function () {
  return {
    restrict: 'E',
    require: 'ngModel',
    compile: function () {
      return function (scope, element, attrs, ngModel) {
        var div, label, items;

        div = document.createElement('div');
        div.classList.add('input-field');

        label = document.createElement('label');
        label.classList.add('input-field-label');
        label.appendChild(document.createTextNode(attrs.label));
        div.appendChild(label);

        items = scope[attrs.items];
        Object.keys(items).forEach(function (key) {
          var radio, item = items[key];

          radio = document.createElement('input');
          radio.type = 'radio';
          radio.id = 'radios-' + key;
          radio.dataset.key = key;
          radio.name = attrs.ngModel;
          radio.value = item.value;
          
          label = document.createElement('label');
          label.classList.add('radio-label');
          label.appendChild(document.createTextNode(key));
          label.setAttribute('for', radio.id);

          div.appendChild(radio);
          div.appendChild(label);
        });

        element.append(div);

        div.addEventListener('change', function (e) {
          ngModel.$setViewValue(e.target.dataset.key);
          scope.$apply();
        });

        ngModel.$render = function () {
          var el = document.querySelector('[data-key="' + ngModel.$viewValue + '"]');
          el.checked = true;
        }
      };
    }
  }
})
.directive('colorpicker', function () {
  return {
    restrict: 'E',
    require: 'ngModel',
    compile: function () {
      return function (scope, element, attrs, ngModel) {
        var div, label, colorPicker;

        div = document.createElement('div');
        div.classList.add('input-field');

        label = document.createElement('label');
        label.classList.add('input-field-label');
        label.appendChild(document.createTextNode(attrs.label));
        div.appendChild(label);

        colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.name = attrs.ngModel;
        div.appendChild(colorPicker);

        element.append(div);

        ngModel.$render = function () {
          colorPicker.value = ngModel.$viewValue;
        };

        colorPicker.addEventListener('change', function () {
          ngModel.$setViewValue(colorPicker.value);
          scope.$apply();
        });
      };
    }
  }
});


angular
.module('tilegen', ['ui.tilegen'])
.controller('Ctrl', function ($scope) {
  $scope.opacity = 10;
  $scope.size = 4;
  $scope.margin = 1;
  $scope.bgColor = '#ffffff';
  $scope.color = 'black';
  
  $scope.colors = {
    white: {
      label: 'white',
      value: 255
    },
    black: {
      label: 'black',
      value: 0
    }
  };

  $scope.download = function () {
    location.href = canvas.toDataURL();
  };

  $scope.changeBgColor = function () {
    document.body.style.backgroundColor = $scope.bgColor;
  };

  var n, canvas, ctx, tiles, setTileFn;

  n = 32;
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  tiles = new Uint8Array(n * n);

  $scope.generateTiles = function () {
    var tile;
    for (var i = 0; i < n * n; ++i) {
      do { tile = Math.floor(Math.random() * 255); } while (tile < 30);
      tiles[i] = tile;
    }
  };

  $scope.setTiles = function () {
    if (setTileFn) {
      return setTileFn(
        tiles,
        +$scope.size,
        +$scope.margin,
        +$scope.opacity / 65535,
        '' + $scope.colors[$scope.color].value,
        canvas,
        ctx
      );
    } 
    var s = '';
    s += 'var wm = w + m;';
    s += 'canvas.width = canvas.height = wm * ' + n + ';';
    s += 'ctx.beginPath();'
    s += 'ctx.clearRect(0, 0, canvas.width, canvas.height);';

    for (i = 0; i < n; ++i) {
      for (j = 0; j < n; ++j) {
        s += 'ctx.fillStyle = "rgba(" +c+","+c+","+c+","+(t[' + (i * n + j) + '] * o)+")";';
        s += 'ctx.fillRect(wm * ' + j + ', wm *' + i + ', w, w);';
      }
    }
    
    s += "document.body.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';";

    setTileFn = new Function('t', 'w', 'm', 'o', 'c', 'canvas', 'ctx', s);
    $scope.setTiles();
  };

  $scope.generateTiles();
  $scope.setTiles();
});

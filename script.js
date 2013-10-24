angular
.module('ui.tilegen', [])
.value('callNgChange', function (scope, element, attrs) {
  scope.$watch('ngModel', function () {
    // なぜかngChangeが呼ばれないので手動で呼ぶ
    scope.ngChange();
  });
})
.directive('slider', function (callNgChange) {
  return {
    restrict: 'E',
    scope: {
      label: '@',
      min: '@',
      max: '@',
      ngModel: '=',
      ngChange: '&'
    },
    template:
      '<div class="input-field">' +
        '<label class="input-field-label">{{label}}</label>' +
        '<input type="range" min="{{min}}" max="{{max}}" ng-model="ngModel">' +
        '<span class="slider-view">{{ngModel}}</span>' +
      '</div>',
    link: callNgChange,
    replace: true
  };
})
.directive('radios', function (callNgChange) {
  return {
    restrict: 'E',
    scope: {
      label: '@',
      radios: '=',
      name: '@',
      ngModel: '=',
      ngChange: '&'
    },
    template:
      '<div class="input-field">' +
        '<label class="input-field-label">{{label}}</label>' +
        '<ul class="input-field-radios">' +
          '<li ng-repeat="(i, radio) in radios">' +
            '<input type="radio" name="{{name}}" id="radio-{{name}}-{{radio.label}}" ' +
            'ng-model="$parent.ngModel" value="{{i}}">' +
            '<label for="radio-{{name}}-{{radio.label}}">{{radio.label}}</label>' +
          '</li>' +
        '</ul>' +
      '</div>',
    link: callNgChange,
    replace: true
  }
})
.directive('colorpicker', function (callNgChange) {
  return {
    restrict: 'E',
    scope: {
      label: '@',
      ngModel: '=',
      ngChange: '&'
    },
    template:
      '<div class="input-field">' +
        '<label class="input-field-label">{{label}}</label>' +
        '<input type="color" ng-model="ngModel">' +
      '</div>',
    link: callNgChange,
    replace: true
  }
});


angular
.module('tilegen', ['ui.tilegen'])
.controller('Ctrl', function ($scope) {
  $scope.opacity = 10;
  $scope.size = 4;
  $scope.margin = 1;
  $scope.bgColor = '#ffffff';
  
  $scope.colors = [
    {label: 'white', value: 255},
    {label: 'black', value: 0}
  ];

  $scope.color = 1;

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

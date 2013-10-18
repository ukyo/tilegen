var Ctrl = function ($scope) {
  $scope.opacity = 10;
  $scope.size = 4;
  $scope.margin = 1;
  $scope.bgColor = '#ffffff';
  $scope.color = "0";
  
  function watch(value) {
    $scope[this.exp] = +value;
    $scope.setTile();
  }

  $scope.$watch('opacity', watch);
  $scope.$watch('size', watch);
  $scope.$watch('margin', watch);

  $scope.download = function () {
    location.href = canvas.toDataURL();
  };

  $scope.changeBgColor = function () {
    document.body.style.backgroundColor = $scope.bgColor;
  };

  var n, canvas, ctx, tiles;

  n = 32;
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  tiles = [];

  $scope.generateTile = function () {
    var tile;
    for (var i = 0; i < n * n; ++i) {
      do { tile = Math.floor(Math.random() * 255); } while (tile < 30);
      tiles[i] = tile;
    }
  };

  function getFillStyle (opacity) {
    var c = $scope.color;
    return 'rgba(' + c + ',' + c + ',' + c + ',' + opacity + ')';
  }

  $scope.setTile = function () {
    var i, j, x, y, w, opacity;
    w = $scope.size + $scope.margin;
    opacity = $scope.opacity / 255;
    canvas.width = canvas.height = w * n;

    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < n; ++i) {
      for (j = 0; j < n; ++j) {
        x = w * j;
        y = w * i;
        ctx.beginPath();
        ctx.fillStyle = getFillStyle(tiles[i * n + j] / 255 * opacity);
        ctx.fillRect(x, y, $scope.size, $scope.size);
      }
    }
    document.body.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
  };

  $scope.generateTile();
  $scope.setTile();
};

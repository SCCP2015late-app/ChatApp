var app = angular.module('burning', [], function($provide) {
      $provide.decorator('$window', function($delegate) {
      $delegate.history = null;
    return $delegate;
  });
});

app.controller('NavigationPanelController', function($scope) {
  $scope.group = {icon: './assets/misoton.png', name: "mogemoge group"};
});

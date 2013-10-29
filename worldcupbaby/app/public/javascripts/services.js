(function() {
  'use strict';
  /* Services*/

  angular.module('baby').factory("Faye", [
    "$faye", function($faye) {
      return $faye("/faye");
    }
  ]);

}).call(this);

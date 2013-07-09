'use strict'

### Services ###
#

angular.module('baby').factory "Faye", ["$faye", ($faye) ->
  $faye "/faye" # set faye url in one place
]        

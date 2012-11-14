// function Create2DArray(rows) {
//   var arr = [];

//   for (var i=0;i<rows;i++) {
//      arr[i] = [];
//   }

//   return arr;
// }



exports.InitContext = function(nbrOfChannel){

    var context = new Array(nbrOfChannel);
    console.log(context);
    return context;
} 

exports.ReleaseContext = function(context){

    context = 0;
    console.log(context);
} 


exports.setContext = function(channelNbr,nbrOfPlayer){

    context[channelNbr] = nbrOfPlayer;
} 


exports.getContext = function(channelNbr){

    return context[channelNbr];
} 

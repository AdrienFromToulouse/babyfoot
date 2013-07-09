(function() {
  'use strict';
  var module_directives;

  module_directives = angular.module("baby.directives", []);

  module_directives.directive("konami", function($document) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var do_want, state;
        if (window.addEventListener) {
          state = 0;
          do_want = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
          return window.addEventListener("keydown", (function(e) {
            if (e.keyCode === do_want[state]) {
              state++;
            } else {
              state = 0;
            }
            if (state === 10) return eval(attrs.konami);
          }), true);
        }
      }
    };
  });

  module_directives.directive("trackevent", function($document, $location, $parse) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        return element.on("click", function(event) {
          var params;
          params = scope.$eval(attrs.trackevent);
          return _gaq.push(['_trackEvent', params.category, params.action, params.opt_label]);
        });
      }
    };
  });

  module_directives.directive("uploader", function($document, $location, $cookieStore, $parse) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var manualuploader;
        manualuploader = $(element).fineUploader({
          request: {
            endpoint: "../backend/fineuploader/uploader.php?BAid=" + $cookieStore.get("me").id
          },
          text: {
            uploadButton: ''
          },
          failedUploadTextDisplay: {
            mode: 'custom',
            maxChars: 40,
            responseProperty: 'error',
            enableTooltip: true
          },
          validation: {
            allowedExtensions: ["jpeg", "jpg", "gif", "png"],
            sizeLimit: 3 * 1024 * 1024
          },
          autoUpload: true
        }).on("complete", function(event, id, fileName, responseJSON) {
          var isPic1_Deleted, isPic2_Deleted, myid;
          if (responseJSON.success) {
            isPic1_Deleted = $cookieStore.get("isPic1_Deleted");
            isPic2_Deleted = $cookieStore.get("isPic2_Deleted");
            myid = $cookieStore.get("my_nmbr_ofpic");
            if (myid === 0) {
              $cookieStore.put("isPic1_Deleted", 0);
              $cookieStore.put("isPic2_Deleted", 0);
              $cookieStore.put("srcPic1", fileName);
              $cookieStore.put("my_nmbr_ofpic", 1);
              $(".thumb1").attr("src", "../uploads/" + fileName);
              $(".dlte1").attr("src", "images/delete_red.png");
              return $(".dlte1").css("display", "block");
            } else if (myid === 1) {
              if (isPic1_Deleted === 1) {
                $cookieStore.put("srcPic1", fileName);
                $cookieStore.put("my_nmbr_ofpic", 2);
                $(".thumb1").attr("src", "../uploads/" + fileName);
                $(".dlte1").attr("src", "images/delete_red.png");
                $(".dlte1").css("display", "block");
              }
              if (isPic2_Deleted === 1) {
                $cookieStore.put("srcPic2", fileName);
                $cookieStore.put("my_nmbr_ofpic", 2);
                $(".thumb2").attr("src", "../uploads/" + fileName);
                $(".dlte2").attr("src", "images/delete_red.png");
                $(".dlte2").css("display", "block");
              }
              if (isPic1_Deleted === 0 && isPic2_Deleted === 0) {
                $cookieStore.put("srcPic2", fileName);
                $cookieStore.put("my_nmbr_ofpic", 2);
                $(".thumb2").attr("src", "../uploads/" + fileName);
                $(".dlte2").attr("src", "images/delete_red.png");
                return $(".dlte2").css("display", "block");
              }
            } else {
              return console.log("no myid");
            }
          }
        });
        return _gaq.push(["_trackEvent", "Upload", "BA", fileName]);
      }
    };
  });

  module_directives.directive("weather", function($document, $location, $cookieStore, $parse) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        return $(element).weatherfeed(["SNXX0006"]);
      }
    };
  });

  module_directives.directive("toggle", function($document, $location, $cookieStore, $parse) {
    return {
      restrict: "EA",
      link: function(scope, element, attrs) {
        return element.click(function() {
          element.removeClass("on");
          element.next().slideUp("normal");
          if ($(this).next().is(":hidden") === true) {
            $(this).addClass("on");
            return $(this).next().slideDown("normal");
          }
        });
      }
    };
  });

  module_directives.directive("zoomimg", function($document, $location, $parse) {
    return {
      restrict: "A",
      link: function(scope, element, attrs) {
        var box, filter, global, ref;
        box = $('#zoomimg');
        filter = $('#filter');
        ref = $('#gallery');
        global = $('#global');
        element.click(function(event) {
          var $image, _width;
          event.preventDefault();
          event.stopPropagation();
          box.empty();
          $image = $('<img alt="" src="' + element.attr('src') + '" width="100%">');
          $image.appendTo(box);
          _width = global.find('article').width() - 200;
          box.css('width', _width + 'px');
          box.css('margin-top', '-' + (box.height() + 60) / 2 + 'px');
          box.css('margin-left', '-' + _width / 2 + 'px');
          box.addClass('visible');
          return filter.addClass('visible');
        });
        return $(document.body).click(function() {
          if (box.hasClass('visible')) {
            box.removeClass('visible');
            return filter.removeClass('visible');
          }
        });
      }
    };
  });

}).call(this);

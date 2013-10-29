# Directives

'use strict'

# angular.module('baby').directive '', ($scope) ->


module_directives = angular.module("baby.directives", [])

module_directives.directive "konami", ($document) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    if window.addEventListener
      state = 0
      do_want = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
      window.addEventListener "keydown", ((e) ->
        if e.keyCode is do_want[state]
          state++
        else
          state = 0
        eval (attrs.konami)  if state is 10
      ), true

module_directives.directive "trackevent", ($document, $location, $parse) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    element.on "click", (event) ->
      params = scope.$eval(attrs.trackevent)
      _gaq.push(['_trackEvent', params.category, params.action, params.opt_label])

module_directives.directive "uploader", ($document, $location, $cookieStore, $parse) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    manualuploader = $(element).fineUploader(
      request:
        endpoint: "../backend/fineuploader/uploader.php?BAid=" + $cookieStore.get("me").id
      text:
        uploadButton: ''

      failedUploadTextDisplay:
        mode: 'custom',
        maxChars: 40,
        responseProperty: 'error',
        enableTooltip: true

      # classes: 
      #   success: 'alert alert-success',
      #   fail: 'alert alert-error'

      validation:
        allowedExtensions: ["jpeg", "jpg", "gif", "png"]
        #itemLimit: 3
        sizeLimit: 3 * 1024 * 1024

      autoUpload: true
    ).on("complete", (event, id, fileName, responseJSON) ->
      if responseJSON.success

        isPic1_Deleted = $cookieStore.get("isPic1_Deleted")
        isPic2_Deleted = $cookieStore.get("isPic2_Deleted")
        myid = $cookieStore.get("my_nmbr_ofpic")

        if myid is 0

          $cookieStore.put("isPic1_Deleted", 0)
          $cookieStore.put("isPic2_Deleted", 0)
          $cookieStore.put("srcPic1", fileName)
          $cookieStore.put("my_nmbr_ofpic", 1)
          $(".thumb1").attr("src", "../uploads/" + fileName)
          $(".dlte1").attr("src", "images/delete_red.png")
          $(".dlte1").css "display", "block"

        else if myid is 1

          if isPic1_Deleted is 1

            $cookieStore.put("srcPic1", fileName)
            $cookieStore.put("my_nmbr_ofpic", 2)
            $(".thumb1").attr("src", "../uploads/" + fileName)
            $(".dlte1").attr("src", "images/delete_red.png")
            $(".dlte1").css "display", "block"

          if isPic2_Deleted is 1

            $cookieStore.put("srcPic2", fileName)
            $cookieStore.put("my_nmbr_ofpic", 2)
            $(".thumb2").attr("src", "../uploads/" + fileName)
            $(".dlte2").attr("src", "images/delete_red.png")
            $(".dlte2").css "display", "block"

          if isPic1_Deleted is 0 and isPic2_Deleted is 0

            $cookieStore.put("srcPic2", fileName)
            $cookieStore.put("my_nmbr_ofpic", 2)
            $(".thumb2").attr("src", "../uploads/" + fileName)
            $(".dlte2").attr("src", "images/delete_red.png")
            $(".dlte2").css "display", "block"
        else
          console.log "no myid"
    )
    _gaq.push ["_trackEvent", "Upload", "BA", fileName]


module_directives.directive "weather", ($document, $location, $cookieStore, $parse) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    $(element).weatherfeed ["SNXX0006"]

module_directives.directive "toggle", ($document, $location, $cookieStore, $parse) ->
  restrict: "EA"
  link: (scope, element, attrs) ->
    element.click ->
      element.removeClass "on"
      element.next().slideUp "normal"
      if $(this).next().is(":hidden") is true
        $(this).addClass "on"
        $(this).next().slideDown "normal"

module_directives.directive "zoomimg", ($document, $location, $parse) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    box = $('#zoomimg')
    filter = $('#filter')
    ref = $('#gallery')
    global = $('#global')
    element.click (event) ->
      event.preventDefault()
      event.stopPropagation()
      box.empty()
      $image = $('<img alt="" src="' + element.attr('src') + '" width="100%">')
      $image.appendTo(box)
      _width = global.find('article').width() - 200
      box.css('width', _width + 'px')
      box.css('margin-top', '-' + (box.height() + 60) / 2 + 'px')
      box.css('margin-left', '-' + _width / 2 + 'px')
      box.addClass 'visible'
      filter.addClass 'visible'
    $(document.body).click ->
      if box.hasClass 'visible'
        box.removeClass 'visible'
        filter.removeClass 'visible'

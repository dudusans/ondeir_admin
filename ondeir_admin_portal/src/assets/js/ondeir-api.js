var ondeIrApi = (function() {
  return {
    init: function() {
      var script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
      document.getElementsByTagName('head')[0].appendChild(script);
    },
    listStores: function(cityId, filter) {
      alert("city: " + cityId + " filter: " + filter);

      serviceURL = "http://www.appondeir.com.br/sistema/rest/search_stores.php?codcidade=" + cityId + "&keywords=" + filter;
      $.ajax({
        url: serviceURL,
        type: 'GET',
        cache: false,
        async: true,
        dataType: 'json',
        success: function (result) {
          console.log(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          //alert("Error - " + ajaxOptions);
          console.log(xhr);
          console.log(thrownError);
          console.log(ajaxOptions);
      }
      });

      return "OK";
    }
  }
})(ondeIrApi||{})

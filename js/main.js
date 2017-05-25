jQuery(document).ready(function($){

// Creating varaibles to store data and perform operations
var ip = "",
	url = "",
	latitude =0,
	longitude = 0,
	accuracy= 0,
	map,
	myLatLng,
	marker,
  region;

//Getting Client ip from api.ipify.org and displaying in the <p> paragraph element
$.getJSON("https://api.ipify.org?format=jsonp&callback=?", function (data) {
      ip = data.ip;
        //console.log(ip); 
        $("#ip p:nth-child(1)").text(ip);      
    });

//Getting Client City name from his ip using freegeoip api
$.getJSON("http://ip-api.com/json/"+ip, function (data) {
      region = data.regionName;
      $("#ip p:nth-child(3)").text(region);      
  });


//Checking for HTML5 Geo location Tracking Access 
if (navigator.geolocation) {

navigator.geolocation.watchPosition(function(position) // Client granted Access to HTML5 Geolocaiton
{    
  //console.log("HTML5 with geolocation");	
  //console.log("Latitude: " + position.coords.latitude+"<br>Longitude: " + position.coords.longitude);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    accuracy = position.coords.accuracy;

    $("#ip p:nth-child(5)").text("Latitude:  "+latitude); 
    $("#ip p:nth-child(6)").text("Longitude:  "+longitude); 
    console.log("Accuracy"+accuracy);
    initmap();
},
function (error) // Client Rejected access to HTML5 Geo location
{ 
  if (error.code == error.PERMISSION_DENIED)
    //console.log("HTML5 without geolocation");

  //Retriving Client Geo location co-ordinates from freegeoip api
  $.getJSON("http://ip-api.com/json/"+ip, function (data) {
   	console.log("Latitude: " + data.latitude + "<br>Longitude: " + data.longitude); 
  latitude = data.lat;
  longitude = data.lon;
  $("#ip p:nth-child(5)").text("Latitude:    "+latitude);  // Displaying client lat and long on website. 
  $("#ip p:nth-child(6)").text("Longitude:   "+longitude); 
  initmap();
});
},{maximumAge:0, timeout:5000, enableHighAccuracy: true} // Enabling High accuracy
);
}

//Generating google api map
function initmap()
{
   var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(latitude,longitude), //Center of map is assigned to client location
        mapTypeControl: true,
        mapTypeControlOptions: 
        {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        },
        gestureHandling: 'cooperative',
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }   

    map = new google.maps.Map(document.getElementById('contact'), mapOptions);

    myLatLng = new google.maps.LatLng(latitude,longitude);
    // Placing marker on the Client location
    marker = new google.maps.Marker({   
            position: myLatLng,
            map: map,            
     });

    // For visual experience an radius range of 200 meters is added to the marker
    var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: new google.maps.LatLng(latitude,longitude),
            radius: 200
    });

    var data = {};

    console.log(latitude);
    console.log(longitude);

    data.latitude = latitude;
    data.longitude = longitude;

   $.getJSON("insert_data.php",data, function(result) 
  {
    if(result == true)
      console.log("Data sent");
    else
      console.log("Transmission failed");
  });

}


// Signup functionality
$(".login-help").css("display", "none");

$("input[name = 'login']").click(function(){
			var username = $("#username").val(),
	    	password = $("#password").val();
		if(username == "admin" && password == "admin")
		{
			 $(".login-help").css("display", "none");
			window.location.replace("admin/");
		}
		else
		{
			console.log(username);
			 $(".login-help").css("display", "inline");
		}

});

});

var map;
var markers = []; // Create a marker array to hold your markers
var myjson;
var oldjson = [];
var myLatLng;
var marker;
var data={};
var radio;

// Function to place markers on google map
function setMarkers() 
{ 

  // Getting radio button value from HTML form
  radio = $('input[name=radioButton]:checked').val();

  if(radio == 1) // Clients from past 5 mins
  {
	 data.duration = 5;
   $("#from-date").attr("disabled", true); 
   $("#from-time").attr("disabled", true);
   $("#to-date").attr("disabled", true); 
   $("#to-time").attr("disabled", true);  
  }
  else if(radio == 2) // Clients from all time
  {
 	  data.duration = 0;
   $("#from-date").attr("disabled", true); 
   $("#from-time").attr("disabled", true);
   $("#to-date").attr("disabled", true); 
   $("#to-time").attr("disabled", true);  
  }
  else    // Custome duration picker
  {
  	data.duration = 100;
  	data.from = $("#from-date").val()+" "+$("#from-time").val();
  	data.to = $("#to-date").val()+" "+$("#to-time").val();
   $("#from-date").attr("disabled", false); 
   $("#from-time").attr("disabled", false);
   $("#to-date").attr("disabled", false); 
   $("#to-time").attr("disabled", false);  
  }

  //Getting required geo co-ordinates from json.php with Ajax call and passing the admin input (data)
  $.getJSON("json.php",data, function(json) 
  {
    myjson = json; 
    if(myjson!= oldjson) // condition to check the change in json
    {
      if(Object.keys(myjson).length < Object.keys(oldjson).length) 
        removeMarkers();
      for (var i = 0; i < Object.keys(myjson).length; i++) 
      {
        myLatLng = new google.maps.LatLng(myjson[i].latitude,myjson[i].longitude);
        marker = new google.maps.Marker({
                       position: myLatLng,
                       map: map,
                       gestureHandling: 'cooperative'            
        });
        // Push marker to markers array
        markers.push(marker);
      }
    oldjson = myjson;
    }
    });
}

//function to remove all markers on google map
function removeMarkers()
{
    for(i=0; i<markers.length; i++)
    {
        markers[i].setMap(null);
    }
}

//for every 0.5 sec an ajax call is made to get latest data 
setInterval(setMarkers, 500);


// function to create a google map
function initialize() 
{
    var mapOptions = 
    {
        zoom: 2,
        center: new google.maps.LatLng(0,0), //Center of map is assigned to client location
        mapTypeControl: true,
        mapTypeControlOptions: 
        {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        gestureHandling: 'cooperative',
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    setMarkers();
    // Bind event listener on button to reload markers
}

// calling intialize
initialize();
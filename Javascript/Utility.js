/*Public Member Basic Position Status */
var GroundCoords = [          
          {name: '市政府', lat: 25.041077, lng: 121.565951, status: -1, cost: 100000}, //市政府
          {name: 'Taipei 101', lat: 25.033032, lng: 121.563159, status: -1, cost: 100000}, //Taipei 101
          {name: '公館', lat: 25.013921, lng: 121.534780, status: -1, cost: 30000}, //公館
          {name: '龍山寺', lat: 25.035311, lng: 121.500531, status: -1, cost: 20000}, //龍山寺
          {name: '台北車站', lat: 25.046393, lng: 121.517468, status: -1, cost: 100000}, //台北車站
          {name: '民權西', lat: 25.062959, lng: 121.519222, status: -1, cost: 10000}, //民權西
          {name: '圓山花博', lat: 25.071318, lng: 121.520051, status: -1, cost: 20000}, //圓山花博
          {name: '士林夜市', lat: 25.087814, lng: 121.524136, status: -1, cost: 30000}, //士林夜市
          {name: '松山機場', lat: 25.063103, lng: 121.551939, status: -1, cost: 20000}, //松山機場
          {name: '大直內湖', lat: 25.082656, lng: 121.557585, status: -1, cost: 25000}, //大直內湖
          {name: '饒河夜市', lat: 25.051081, lng: 121.577060, status: -1, cost: 15000}, //饒河夜市
          {name: '市政府', lat: 25.041077, lng: 121.565951, status: -1, cost: 100000} //市政府
        ];
/*Member Place Status */
var Rectangles = [];
var InfoWindows = [];
/*Member Player Status */
var Players = [];
var Markers = [];

/*****************************************************************************************************/
/*Initlize*/
function InitGround(){  
  for (i = 0; i < GroundCoords.length - 1; i++) {
    var name =  GroundCoords[i].name;
    var x = GroundCoords[i].lat;
    var y = GroundCoords[i].lng;
    var status =  GroundCoords[i].status;
    var cost =  GroundCoords[i].cost;

    MakeGround(name, x, y, status, cost);
    MakePath();
  }
}
/*Set how many players*/
function InitPlayer(){
  var p1 = new Person('Player1');
  p1.whoturn = true;
  var p2 = new Person('Player2');
  Players.push(p1);
  Players.push(p2);
}

function InitStar(){
  var goldStar = {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: 'yellow',
          fillOpacity: 0.8,
          scale: 0.2,
          strokeColor: 'gold',
          strokeWeight: 5
        };

  var lat = GroundCoords[0].lat;
  var lng = GroundCoords[0].lng;
  
  InitPlayer();
  
  for(i = 0; i < Players.length; i++) {
    var text = Players[i].name;
    //var pinColor = "FE7569";
    var pinColor = ReturnColor(i);

    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

    var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

    var marker = new google.maps.Marker({
          position: new google.maps.LatLng({lat: lat, lng: lng}),          
          icon: pinImage,
          shadow: pinShadow,
          //label: text[text.length-1],
          strokeColor: 'gold',
          map: map
        });

    /*Marker Click Event*/
     marker.addListener('click', function() {
          $("#Player_Name").html("<p>"+ Players[i].name +"</p>");
          $("#Player_Cash").html("<p>"+ Players[i].cash +"</p>");
        });

    Markers.push(marker);
  }

  Markers[0].setAnimation(google.maps.Animation.BOUNCE);
}
/*Return String Marker Color*/
function ReturnColor(i) {
  var strcolor;

  switch(i) {
    case 0:
        strcolor = "FF0000";
        break;
    case 1:
        strcolor = "00A600";
        break;
    case 2:
        strcolor = "0000C6";
        break;
    case 3:
        strcolor = "F9F900";
        break;
    case 4:
        strcolor = "FF0080";
        break;
    case 5:
        strcolor = "F75000";
        break;
    default:
        strcolor = "FE7569";
  }

  return strcolor;
}
/*****************************************************************************************************/
/*Methods*/
/*Draw Path*/
function MakePath(){  
  var flightPath = new google.maps.Polyline({
          path: GroundCoords,
          geodesic: true,
          strokeColor: '#6C6C6C',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        flightPath.setMap(map);
}

/*Draw Ground*/
function MakeGround(name, x, y, status, cost){
	var offset = 0.0025
	var rectangle = new google.maps.Rectangle({
          strokeColor: '#5B5B5B',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#8E8E8E',
          fillOpacity: 0.35,
          map: map,
          bounds: {
            north: x + offset,
            south: x - offset,
            east:  y + offset,
            west:  y - offset
          }
        });  
  
  var contentString = '<div id="content" style="width:200px;">'+ 
  '<h1 id="firstHeading" class="firstHeading">' + name +'</h1>'+
  '<div id="bodyContent">狀態: 無人買下 <br/> 土地金額: $' + cost + '</div>' + 
  '</div>'; 

  var infowindow = new google.maps.InfoWindow({
          content: contentString,
          position: new google.maps.LatLng({lat: x, lng: y})
        });

  rectangle.addListener('click', function() {
          infowindow.open(map, rectangle);
        });

  Rectangles.push(rectangle);
  InfoWindows.push(infowindow);
}

var flagdice = false;
/*Dice Play*/
function DoDice(){  
  var result = Math.floor((Math.random() * 6) + 1);

  /*Hide Cube*/
  $("#divdice").hide();
  var Now;
  var After;
  var p;

  for (i = 0; i < Players.length; i++) {
    if(Players[i].whoturn == true) {      
      p = Players[i];      
      Players[i].whoturn = false;

      Now = i;
      if(i + 1 == Players.length) After = 0;              
      else After = i + 1;
      
      Players[After].whoturn = true;
      break;
    }
  }  
  
  $('#cube').attr('class', 'show'+ result);

  /*Marker Walking Animation*/
  var Walking  = setInterval(function(){
    if(result == 0 ) 
    {
      clearInterval(Walking);

      /*Check Point*/
      if(GroundCoords[p.position].status == -1)
      {
        /*Buy Ground*/
        if(confirm("這塊地無人買，是否買下? 需花費 $" + GroundCoords[p.position].cost) == true){
          Players[Now].cash = Players[Now].cash - GroundCoords[p.position].cost;

          Rectangles[p.position].setOptions({            
            fillColor: '#' + ReturnColor(Now),            
            map: map
          });          

          var contentString = '<div id="content" style="width:200px;">'+ 
              '<h1 id="firstHeading" class="firstHeading">' + GroundCoords[p.position].name +'</h1>'+
              '<div id="bodyContent">狀態: 此地已由' + Players[Now].name + '買下</div>' + 
              '</div>';

          InfoWindows[p.position].setContent(contentString);
          GroundCoords[p.position].status = Now;
        }        
      }
      else
      {
        /*Pay for Players*/
        var whosbuy = GroundCoords[p.position].status;
        if(whosbuy != Now)
        {
          /*Pay for whosbuy*/
          Players[Now].cash = Players[Now].cash - GroundCoords[p.position].cost;

          /*Income for whosbuy*/
          Players[whosbuy].cash = Players[whosbuy].cash + GroundCoords[p.position].cost;

          alert("你必須付給" + Players[whosbuy].name + "  " + GroundCoords[p.position].cost + "元");

          if(Players[Now].cash < 0 )
          {
            alert("您破產了");
            return;
          }            
        }        
      }

      /*Show Dice*/;
      Markers[Now].setAnimation(null);
      Markers[After].setAnimation(google.maps.Animation.BOUNCE);      
      $("#Player_Name").html("<p>"+ Players[After].name +"</p>");
      $("#Player_Cash").html("<p>"+ Players[After].cash +"</p>");
      $("#divdice").show();
      
      return;
    }
      
    var index = p.position;
    index = index + 1;    

    //if(index > 10) index = 0;
    if(index >= GroundCoords.length - 1) index = 0;

    p.position = index;
    Markers[Now].setPosition(GroundCoords[index]);

    result = result - 1;
  },1000);
}
/*Member Class*/
/*example
var person1 = new Person('Bob');
person1['position']
*/
function Person(name){  
  this.name = name;
  /*Max Position Index 10*/
  this.position = 0;
  this.cash = 1000000;
  this.whoturn = false;
}

/*Position Class*/
function Location(name, x, y , level){
  this.name = name;
  this.level = level;
}


/*Show how to Play*/
function ShowhowtoPlay(){
  alert("簡易的大富翁遊戲 版本: v1.0 \n" +
        "遊戲玩法: 為兩人遊戲，輪流點選GO按扭來擲骰子，\n" +
        "當路過灰色土地時，可以買下占領土地為自己所有，\n" +
        "若對方走到自己土地時，將必須付過路費用。\n\n" +
        "遊戲勝負條件: 誰的金額為負債時將破產。\n\n" +
        "小提示: 點選土地時，會顯示需要買下此土地的金額。");
}
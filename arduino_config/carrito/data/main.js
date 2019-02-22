// Configuracion movimiento

var canvas_width = 400, canvas_height = 400;
var radio_base = 150;
var radio_handle = 72;
var radio_shaft = 120;
var rango = canvas_width/2 - 10;
var step = 18;
var ws;
var joystick = {x:0, y:0};
var click_state = 0;

var ratio = 1;

function inicio()
{
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	if(width < height)
		ratio = (width - 50) / canvas_width;
	else
		ratio = (height - 50) / canvas_width;
	
	canvas_width = Math.round(canvas_width*ratio);
	canvas_height = Math.round(canvas_height*ratio);
	radio_base = Math.round(radio_base*ratio);
	radio_handle = Math.round(radio_handle*ratio);
	radio_shaft = Math.round(radio_shaft*ratio);
	rango = Math.round(rango*ratio);
	step = Math.round(step*ratio);
	
	let canvas = document.getElementById("remote");
	canvas.width = canvas_width;
	canvas.height = canvas_height;
 
	canvas.addEventListener("touchstart", mouse_down);
	canvas.addEventListener("touchend", mouse_up);
	canvas.addEventListener("touchmove", mouse_move);
	canvas.addEventListener("mousedown", mouse_down);
	canvas.addEventListener("mouseup", mouse_up);
	canvas.addEventListener("mousemove", mouse_move);
	
	let ctx = canvas.getContext("2d");
	ctx.translate(canvas_width/2, canvas_height/2);
	ctx.shadowBlur = 20;
	ctx.shadowColor = "LightGray";
	ctx.lineCap="round";
	ctx.lineJoin="round";
		
	actualizarVista();
}
function conectar()
{
	if(ws == null)
	{
    
  // var Socket = new WebSocket('ws://' + window.location.hostname + ':81');
		ws = new WebSocket('ws://' + window.location.hostname + ':81');
		document.getElementById("ws_state").innerHTML = "CONECTANDO";
		ws.onopen = ws_onopen;
		ws.onclose = ws_onclose;
		ws.onmessage = ws_onmessage;
	}
	else
		ws.close();
}
function ws_onopen()
{
	document.getElementById("ws_state").innerHTML = "<font color='blue'>CONECTADO</font>";
	document.getElementById("bt_connect").innerHTML = "DESCONECTADO";
	actualizarVista();
}
function ws_onclose()
{
	document.getElementById("ws_state").innerHTML = "<font color='gray'>CERRADO</font>";
	document.getElementById("bt_connect").innerHTML = "CONECTADO";
	ws.onopen = null;
	ws.onclose = null;
	ws.onmessage = null;
	ws = null;
	actualizarVista();
}
function ws_onmessage(e_msg)
{
  e_msg = e_msg || window.event; // MessageEvent
  var distancia = parseInt(e_msg.data);
  drawDial(distancia, '#ff5600');
	
}


// Sensor

// drawDial(0, '#ff5600');
function drawDial(distancia, color) {
  let dialCanv = document.getElementById('dial');
  let ctx = dialCanv.getContext("2d");
  dialCanv.height = dialCanv.offsetHeight * 2;
  dialCanv.width = dialCanv.offsetWidth * 2;
  let centerX = dialCanv.width / 2;
  let centerY = dialCanv.height / 2;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(centerX, centerY.height / 2);
  ctx.arc(centerX, centerY, centerY*0.8, Math.PI * 1.5, (Math.PI * 2 * (porcentaje / 100)) + (Math.PI * 1.5), false);
  ctx.lineTo(centerX, centerY);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(centerX, centerY, centerY*0.65, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.closePath();
  ctx.font = "bold 90px sans-serif";
  ctx.fillStyle = color;
  ctx.textBaseline = "center";
  ctx.textAlign = "center";
  ctx.fillText(parseInt(distancia)+" cm", centerX, centerY * 1.1);
}

function enviarDatos()
{
	var x = joystick.x, y = joystick.y;
	var joystick_rango = rango - radio_handle;
	x = Math.round(x*100/joystick_rango);
	y = Math.round(-(y*100/joystick_rango));
	
	if(ws != null)
		ws.send(x + ":" + y + "\r\n");
}
function actualizarVista()
{
	var x = joystick.x, y = joystick.y;
	
	var canvas = document.getElementById("remote");
	var ctx = canvas.getContext("2d");
	
	ctx.clearRect(-canvas_width/2, -canvas_height/2, canvas_width, canvas_height);
	
	ctx.lineWidth = 3;


	ctx.strokeStyle="black";
	ctx.fillStyle = "hsl(0, 0%, 20%)";
	ctx.beginPath();
	ctx.fillRect(-250,-250,500,500);
	ctx.stroke();
	ctx.fill();

	ctx.strokeStyle="black";
	ctx.fillStyle = "hsl(0, 0%, 35%)";
	ctx.beginPath();
	ctx.arc(0, 0, radio_base-50, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.fill();
	
	ctx.strokeStyle="black";
	
	var lineWidth = radio_shaft;
	var pre_x = pre_y = 0;
	var x_end = x/5;
	var y_end = y/5;
	var max_count  = (radio_shaft - 10)/step;
	var count = 1;
	
	while(lineWidth >= 10)
	{
		var cur_x = Math.round(count * x_end / max_count);
		var cur_y = Math.round(count * y_end / max_count);
		console.log(cur_x);
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.lineTo(pre_x, pre_y);
		ctx.lineTo(cur_x, cur_y);
		ctx.stroke();
		
		lineWidth -= step;
		pre_x = cur_x;
		pre_y = cur_y;
		count++;
	}
	
	var x_start = Math.round(x / 3);
	var y_start = Math.round(y / 3);
	lineWidth += step;
	
	ctx.beginPath();
	ctx.lineTo(pre_x, pre_y);
	ctx.lineTo(x_start, y_start);
	ctx.stroke();
		
	count = 1;
	pre_x = x_start;
	pre_y = y_start;
	
	while(lineWidth < radio_shaft)
	{
		var cur_x = Math.round(x_start + count * (x - x_start) / max_count);
		var cur_y = Math.round(y_start + count * (y - y_start) / max_count);
		ctx.lineWidth = lineWidth;
		ctx.beginPath();
		ctx.lineTo(pre_x, pre_y);
		ctx.lineTo(cur_x, cur_y);
		ctx.stroke();
		
		lineWidth += step;
		pre_x = cur_x;
		pre_y = cur_y;
		count++;
	}
	
	var grd = ctx.createRadialGradient(x, y, 0, x, y, radio_handle);
	for(var i = 85; i >= 50; i-=5)
		grd.addColorStop((85 - i)/35, "hsl(0, 100%, "+ i + "%)");
		
	ctx.fillStyle = grd;
	ctx.beginPath();
	ctx.arc(x, y, radio_handle, 0, 2 * Math.PI);
	ctx.fill();
}
function procesarEvento(event)
{
	var pos_x, pos_y;
	if(event.offsetX)
	{
		pos_x = event.offsetX - canvas_width/2;
		pos_y = event.offsetY - canvas_height/2;
	}
	else if(event.layerX)
	{
		pos_x = event.layerX - canvas_width/2;
		pos_y = event.layerY - canvas_height/2;
	}
	else
	{
		pos_x = (Math.round(event.touches[0].pageX - event.touches[0].target.offsetLeft)) - canvas_width/2;
		pos_y = (Math.round(event.touches[0].pageY - event.touches[0].target.offsetTop)) - canvas_height/2;
	}
	
	return {x:pos_x, y:pos_y}
}
function mouse_down()
{
	if(ws == null)
		return;
	
	event.preventDefault();
	
	var pos = procesarEvento(event);
	
	var delta_x = pos.x - joystick.x;
	var delta_y = pos.y - joystick.y;
	
	var dist = Math.sqrt(delta_x*delta_x + delta_y*delta_y);
	
	if(dist > radio_handle)
		return;
		
	click_state = 1;
	
	var radio = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
	
	if(radio <(rango - radio_handle))
	{
		joystick = pos;
		enviarDatos();
		actualizarVista();
	}
}
function mouse_up()
{
	event.preventDefault();
	click_state = 0;
}
function mouse_move()
{
	if(ws == null)
		return; 
	
	event.preventDefault();
	
	if(!click_state)
		return;
	
	var pos = procesarEvento(event);
	
	var radio = Math.sqrt(pos.x*pos.x + pos.y*pos.y);
	
	if(radio <(rango - radio_handle))
	{
		joystick = pos;
		enviarDatos();
		actualizarVista();
	}
}
window.onload = inicio();


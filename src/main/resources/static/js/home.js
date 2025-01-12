/**
 * 
 */
let stage;
let view;
$(document).ready( function(){
	stage = new StageBase("canvas1");
	
	view = new HomeView(stage);
	stage.drowStart();
	view.init();
});


function saveTaskBar(){
	if(view.view.homeView.homeEntity.containsType != "PROJECT")
		return;
	if($("#uuid").val() == "") 
		return;
	view.view.updateTaskBar();	
}

function addTaskBar(){
	if(view.view.homeView.homeEntity.containsType != "PROJECT")
		return;
	
	view.view.addTaskBar();	
}

function deleteTaskBar(){
	if(view.view.homeView.homeEntity.containsType != "PROJECT")
		return;
	
	if($("#uuid").val() == "") 
		return;
	
	view.view.removeTaskBar();	
	
	$("#taskRemoveIcon").addClass("bi-trash3");  
	$("#taskRemoveIcon").removeClass("bi-trash3-fill");  
	
}

function calendarFuture1m(){
	if(view.view.homeView.homeEntity.containsType == "MENU")
		return;
	view.view.calendarFuture1m();	
}

function calendarPast1m(){
	if(view.view.homeView.homeEntity.containsType == "MENU")
		return;
	view.view.calendarPast1m();	
}

function pushFavo(){
	if(view.view.homeView.homeEntity.containsType == "MENU")
		return;

	if(view.homeEntity.favorites == "1" ){
		$("#favoIcon").addClass("bi-star-fill"); 
		$("#favoIcon").removeClass("bi-star"); 
	}else{
		$("#favoIcon").addClass("bi-star"); 
		$("#favoIcon").removeClass("bi-star-fill"); 
	}
	
	view.view.pushFavo();	
}



exports.beforeRender = function(res, view, data){
	
	data.alert = message;
	
	if(message != null) 
		message = null;

	//render view
	res.render(view, data);
}
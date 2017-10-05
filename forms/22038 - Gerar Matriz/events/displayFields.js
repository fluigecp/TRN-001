function displayFields(form,customHTML){
	var modo = form.getFormMode();
	customHTML.append('<script>function getModo(){return"'+modo+'"}</script>');
	form.setHidePrintLink(true);
}
function enableFields(form){

	var activity = getValue('WKNumState');	

	if( activity == 5 || activity == 10){
		form.setEnabled('lotacao', false, true);
		form.setEnabled('cargo', false, true);
		form.setEnabled('haDescricaoCargo', false, true);

		if( activity == 10 ){
			form.setEnabled('docNaoAplicavel', false, true);
		}

	}	


}
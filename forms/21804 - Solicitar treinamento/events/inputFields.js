function inputFields(form){

	setAnalytics(form);

	if(form.getValue("codCargo") == "" || form.getValue("codCargo") == "undefined"){
		form.setValue('cargoNovo',  "Sim" );
		var cActive = DatasetFactory.createConstraint("metadata#active","true","true",ConstraintType.MUST);
		var cargo = DatasetFactory.getDataset("cadastro_treinamento",null,[cActive],["codCargo"]);
		var tamanho = cargo.rowsCount;
		var ultimoCodigo = tamanho == 0 ? 0 : retornaMaior( cargo );
		var proximoCodigo = ultimoCodigo*1 + 1;
		form.setValue("codCargo",proximoCodigo.toString());
	}

	var atividade = getValue('WKNumState');

	if ( atividade == 0 || atividade == 4 ) {
		form.setValue("matSolicitante", getValue('WKUser'));
	}
	
	if(	atividade == null || atividade == 0 || atividade == 4 || atividade == 5){
		form.setValue('ultimaAtualizacao',  getDataCorrente() );
	}
	
	var centroCusto = form.getValue('lotacao');
	var cargo = form.getValue('cargo');
	form.setValue('campoDescritor',  centroCusto + " - " + cargo);

}

function retornaMaior(dataSet){
	var arrayNumeros = [];
	for (var i = 0; i < dataSet.rowsCount; i++) {

		if( !isNaN(dataSet.getValue(i,"codCargo"))  ){
			arrayNumeros.push( parseInt( dataSet.getValue(i,"codCargo") ) );
		} else{
			arrayNumeros.push(0);
		}

		
	}

	arrayNumeros.sort(function(a, b) {
	  return a - b;
	});

	return arrayNumeros[arrayNumeros.length -1];


}

function getDataCorrente(){
	var dt = new Date();
	var txtData = (dt.getDate()<10?"0"+dt.getDate():dt.getDate()) + "/" 
					+ ((dt.getMonth()+1)<10?"0"+(dt.getMonth()+1):(dt.getMonth()+1)) + "/"
					+ dt.getFullYear() + " - " + (dt.getHours()<10?"0"+dt.getHours():dt.getHours()) + ":" + (dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes());
	return txtData;
}

function setAnalytics(form){

	var atividade = getValue('WKNumState');

	var intervaloDias = form.getValue('intervaloDias');
	form.setValue('custom_0', intervaloDias);
	form.setValue('fato_0', intervaloDias);
	var intervaloDiasTreinamento = form.getValue('intervaloDiasTreinamento');
	form.setValue('custom_9', intervaloDiasTreinamento);
	form.setValue('fato_1', intervaloDiasTreinamento);

	var matSGQ = form.getValue('matResponsavelSGQ');
	if(matSGQ != ""){
		form.setValue('custom_1', usuario(matSGQ));
		form.setValue('custom_2', matSGQ);
	}

	var cargo = form.getValue('cargo');
	form.setValue('custom_3', cargo);
	var lot = form.getValue('lotacao');
	form.setValue('custom_4', lot);
	var codLotacao = form.getValue('codLotacao');
	form.setValue('custom_5', codLotacao);
	form.setValue('custom_6', codLotacao + " - " +lot);

	var codCargo = form.getValue('codCargo');
	form.setValue('custom_7', codCargo);
	form.setValue('custom_8', lot +" - "+ cargo);

	form.setValue('custom_10', form.getValue('dataEstimativa'));
	form.setValue('custom_11', form.getValue('dataEstimativaTreinamento'));




}

function usuario(mat){
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",mat,mat,ConstraintType.MUST);
	var dsUser = DatasetFactory.getDataset("colleague",["colleagueName"],[c1],null);
	return dsUser.getValue(0,"colleagueName");
}
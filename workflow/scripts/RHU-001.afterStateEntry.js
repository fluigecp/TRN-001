function afterStateEntry(sequenceId){
	if( sequenceId == 10 || sequenceId == 14 ){
		hAPI.setCardValue('statusSolicitacao', "ok");
	}

	if( sequenceId == 5 ){
		hAPI.setCardValue('dataEstimativa', calculaEstimativa(24));
	}
	if( sequenceId == 10 ){
		hAPI.setCardValue('dataEstimativaTreinamento', calculaEstimativa(16));
	}
}

function calculaEstimativa(horas){
	var date = new Date();
  	var obj = hAPI.calculateDeadLineHours(date, 0, horas, "Horário_Comercial");
 	var d = new String(obj[0]);
 	var arrayData = d.split(" ");
 	return arrayData[5] + "/"+retornaNumeroMes(arrayData[1])+"/"+arrayData[2];
 	
}

function retornaNumeroMes(mes){
	var meses = ["XXX", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var abreviacao = mes.substring(0,3);

	var index = meses.indexOf(abreviacao);

	if(index < 10){
		index = "0" + index;
	}

	return index;

}
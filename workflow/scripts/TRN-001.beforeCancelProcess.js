function beforeCancelProcess(colleagueId,processId){
	hAPI.setCardValue("situacaoCargo", "Inativo");
	hAPI.setCardValue('ultimaAtualizacao',  getDataCorrente() );
}

function getDataCorrente(){
	var dt = new Date();
	var txtData = (dt.getDate()<10?"0"+dt.getDate():dt.getDate()) + "/" 
					+ ((dt.getMonth()+1)<10?"0"+(dt.getMonth()+1):(dt.getMonth()+1)) + "/"
					+ dt.getFullYear() + " - " + (dt.getHours()<10?"0"+dt.getHours():dt.getHours()) + ":" + (dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes());
	return txtData;
}

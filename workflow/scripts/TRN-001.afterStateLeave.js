function afterStateLeave(sequenceId){
	var activity = getValue('WKNumState');

	if(activity == 5){

		var dataEstimativa = hAPI.getCardValue('dataEstimativa');
		var dataSaida =  getAnoMesDia();

		var intervaloDias = daysBetween(dataEstimativa, dataSaida );

		if(intervaloDias > 0 ){
			hAPI.setCardValue("intervaloDias", intervaloDias);
		}
	
	}

	if(activity == 10){

		var dataEstimativaTreinamento = hAPI.getCardValue('dataEstimativaTreinamento');
		var dataSaidaTreinamento =  getAnoMesDia();

		var intervaloDiasTreinamento = daysBetween(dataEstimativaTreinamento, dataSaidaTreinamento );

		if(intervaloDiasTreinamento > 0 ){
			hAPI.setCardValue("intervaloDiasTreinamento", intervaloDiasTreinamento);
			hAPI.setCardValue('custom_1', intervaloDiasTreinamento);
			hAPI.setCardValue('fato_1', intervaloDiasTreinamento);
		}
	
	}
}

//yyyy/MM/dd
function daysBetween(date1, date2) {

		    if (date1.indexOf("-") != -1) {
		      date1 = date1.split("-");
		    } else if (date1.indexOf("/") != -1) {
		      date1 = date1.split("/");
		    } else {
		      return 0;
		    }
		    if (date2.indexOf("-") != -1) {
		      date2 = date2.split("-");
		    } else if (date2.indexOf("/") != -1) {
		      date2 = date2.split("/");
		    } else {
		      return 0;
		    }
		    if (parseInt(date1[0], 10) >= 1000) {
		      var sDate = new Date(date1[0] + "/" + date1[1] + "/" + date1[2]);
		    } else if (parseInt(date1[2], 10) >= 1000) {
		      var sDate = new Date(date1[2] + "/" + date1[0] + "/" + date1[1]);
		    } else {
		      return 0;
		    }
		    if (parseInt(date2[0], 10) >= 1000) {
		      var eDate = new Date(date2[0] + "/" + date2[1] + "/" + date2[2]);
		    } else if (parseInt(date2[2], 10) >= 1000) {
		      var eDate = new Date(date2[2] + "/" + date2[0] + "/" + date2[1]);
		    } else {
		      return 0;
		    }
		    var one_day = 1000 * 60 * 60 * 24;
	      	var diferenca = sDate.getTime() - eDate.getTime();

	      	//para estar atrasado deve estar negativo
			if(diferenca  > 0){
				return 0;
			}
			var daysApart = Math.abs(Math.ceil(diferenca / one_day));

		  	 return daysApart;
	}

function getAnoMesDia() {
    var dt = new Date();
    var txtData = dt.getFullYear()  + "/" + ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + "/" + (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate());
    return txtData;
}



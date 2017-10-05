function createDataset(fields, constraints, sortFields) {

	var filtro = [];
	var haDescricaoFiltro = "";
	var situacaoCargoFiltro = "";
	filtro.push( DatasetFactory.createConstraint("metadata#active","true","true",ConstraintType.MUST) );

	if(constraints != null){
    	log.warn("+++++ QUANTIDADE: " + constraints.length);
        for(var c in constraints){
        	if(constraints[c].fieldName != 'sqlLimit'){
        		if(constraints[c].fieldName == "haDescricaoCargo" ){
        			haDescricaoFiltro = constraints[c].initialValue;
        		} else if(constraints[c].fieldName == "situacaoCargo"){
        			situacaoCargoFiltro = constraints[c].initialValue;
        		}else{
        			var fdname = constraints[c].fieldName+"";
	        		var iniValue = constraints[c].initialValue+"";
	        		var fnValue = constraints[c].finalValue+"";
	        		var tipo = constraints[c].constraintType;
	        		filtro.push( DatasetFactory.createConstraint(fdname,  iniValue, fnValue,  tipo) );	
        		}
        		
        		
        	}
        }

    }

    var result = DatasetFactory.getDataset("cadastro_treinamento", null, filtro, ["lotacao"]);
    


    return getCargosAtualizados(result, haDescricaoFiltro ,situacaoCargoFiltro);



}


function getCargosAtualizados(cargosRestantes, haDescricaoFiltro ,situacaoCargoFiltro){
	
	try{
		var dataset = DatasetBuilder.newDataset();
	    
	    //Cria as colunas
		dataset.addColumn("ultimaAtualizacao");
		dataset.addColumn("cargo");
		dataset.addColumn("codCargo");
		dataset.addColumn("haDescricaoCargo");
		dataset.addColumn("tableid");
		dataset.addColumn("cardid");
		dataset.addColumn("metadata#version");
		dataset.addColumn("metadata#id");
		dataset.addColumn("situacaoCargo");
		dataset.addColumn("lotacao");
		dataset.addColumn("statusSolicitacao");
		dataset.addColumn("docNaoAplicavel");
		dataset.addColumn("codigo");
		log.warn("$$$$$$$ Criei as colunas");
	   
		var jaAdicionados = [];
		
		log.warn("$$$$$$$ Qtd cargos: "+cargosRestantes.rowsCount);

		for (var j = 0 ; j < cargosRestantes.rowsCount; j++) {
			var cargoRepetido = false;

			if( jaAdicionados.length == 0 ){
				
				jaAdicionados.push([cargosRestantes.getValue(j,"ultimaAtualizacao"), cargosRestantes.getValue(j,"cargo"), cargosRestantes.getValue(j,"codCargo"),  cargosRestantes.getValue(j,"haDescricaoCargo"),  cargosRestantes.getValue(j,"tableid"), cargosRestantes.getValue(j,"cardid"), cargosRestantes.getValue(j,"metadata#version"), cargosRestantes.getValue(j,"metadata#id"), cargosRestantes.getValue(j,"situacaoCargo"), cargosRestantes.getValue(j,"lotacao"), cargosRestantes.getValue(j,"statusSolicitacao"), cargosRestantes.getValue(j,'docNaoAplicavel'), retornaDocs( cargosRestantes.getValue(j,"metadata#id") ) ]);
				log.warn("$$$$$$$ PRIMEIRO REGISTRO ADICIONADO ");
				continue;
			}


			for (var i = 0 ; i < jaAdicionados.length; i++) {

				if( jaAdicionados[i][2] == cargosRestantes.getValue(j, "codCargo") ){

					cargoRepetido = true;
					if( parseInt( jaAdicionados[i][7] ) <  parseInt( cargosRestantes.getValue(j, "metadata#id") ) ){ 
						jaAdicionados.splice(i,1);
				
						i--;
						jaAdicionados.push([cargosRestantes.getValue(j,"ultimaAtualizacao"), cargosRestantes.getValue(j,"cargo"), cargosRestantes.getValue(j,"codCargo"),  cargosRestantes.getValue(j,"haDescricaoCargo"),  cargosRestantes.getValue(j,"tableid"), cargosRestantes.getValue(j,"cardid"), cargosRestantes.getValue(j,"metadata#version"), cargosRestantes.getValue(j,"metadata#id"), cargosRestantes.getValue(j,"situacaoCargo"), cargosRestantes.getValue(j,"lotacao"), cargosRestantes.getValue(j,"statusSolicitacao"), cargosRestantes.getValue(j,'docNaoAplicavel'), retornaDocs( cargosRestantes.getValue(j,"metadata#id") ) ]);
						
						continue;

					}
		
				}

			}

			if(!cargoRepetido ){
				jaAdicionados.push([cargosRestantes.getValue(j,"ultimaAtualizacao"), cargosRestantes.getValue(j,"cargo"), cargosRestantes.getValue(j,"codCargo"),  cargosRestantes.getValue(j,"haDescricaoCargo"),  cargosRestantes.getValue(j,"tableid"), cargosRestantes.getValue(j,"cardid"), cargosRestantes.getValue(j,"metadata#version"), cargosRestantes.getValue(j,"metadata#id"), cargosRestantes.getValue(j,"situacaoCargo"), cargosRestantes.getValue(j,"lotacao"), cargosRestantes.getValue(j,"statusSolicitacao"), cargosRestantes.getValue(j,'docNaoAplicavel'), retornaDocs( cargosRestantes.getValue(j,"metadata#id") )]);
			}

		}

		log.warn("$$$$$$$ HORA DE ADICIONAR OS REGISTROS - TOTAL: "+jaAdicionados.length);
		for(var j in jaAdicionados){
			 //Cria os registros
			 if((haDescricaoFiltro == "" || jaAdicionados[j][3] == haDescricaoFiltro) && (situacaoCargoFiltro == "" || jaAdicionados[j][8] == situacaoCargoFiltro )){
			 	log.warn("$$$$$%% Iteração "+jaAdicionados[j].toString());
	   		 	dataset.addRow(new Array( jaAdicionados[j][0], jaAdicionados[j][1], jaAdicionados[j][2], jaAdicionados[j][3], jaAdicionados[j][4], jaAdicionados[j][5], jaAdicionados[j][6], jaAdicionados[j][7], jaAdicionados[j][8], jaAdicionados[j][9], jaAdicionados[j][10], jaAdicionados[j][11], jaAdicionados[j][12]  ));
			 }
			 
		}

		return dataset;
	} catch(e){
		log.error("$$$$$$$ ERRO NO DATASET DA MATRIZ DE TREINAMENTO: "+e);
	}

	

}

function convertStringToDate(txtData) {
	
	txtData = txtData.split(" - ");
	var data = txtData[0].toString();
	var hora = txtData[1].split(":");

    data = data.split("/");
    var dia = parseInt(data[0]);
    var mes = parseInt(data[1]) -1;
    var ano = parseInt(data[2]);
   var dataFinal = new Date();
    dataFinal.setFullYear(ano);
    dataFinal.setMonth(mes);
    dataFinal.setDate(dia);
  	dataFinal.setHours(parseInt( hora[0].toString() ));
    dataFinal.setMinutes(parseInt( hora[1].toString() ));

    if(dataFinal == "Invalid Date"){
    	log.warn("@@@@@@@ DEU INVALID DATE @@@@@@");
    	var outraData = new Date();
    	log.warn("@@@@@@@ outraData (atual): "+outraData);
    	outraData.setFullYear(ano);
    	log.warn("@@@@@@@ outraData setando o ano: "+ano +" ==== "+outraData);
	    outraData.setMonth(mes);
	    log.warn("@@@@@@@ outraData setando o mes: "+mes +" ==== "+outraData);
	    outraData.setDate(dia);
	    log.warn("@@@@@@@ outraData setando o dia: "+dia +" ==== "+outraData);
	  	outraData.setHours(parseInt( hora[0].toString() ));
	  	log.warn("@@@@@@@ outraData setando a hora: "+hora[0].toString() +" ==== "+outraData);
	    outraData.setMinutes(parseInt( hora[1].toString() ));
	    log.warn("@@@@@@@ outraData setando o minuto: "+hora[1].toString() +" ==== "+outraData);

    	 log.warn("$$$$$$$ A data entrou assim: TXTDATA: "+txtData.toString()+" sendo que DATA: "+data.toString()+" HORA: "+hora[0]+" MINUTOS: "+hora[1]+" DIA: "+dia+" MES: "+mes+" ANO: "+ano+" e saiu assim "+dataFinal);
    }


    
    return dataFinal;
}

function retornaDocs(documentId){

    //Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
    var c1 = DatasetFactory.createConstraint("tablename", "documentos" ,"documentos", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
    var constraintsFilhos = new Array(c1, c2);

    //Busca o dataset
    var datasetFilhos = DatasetFactory.getDataset("cadastro_treinamento", null, constraintsFilhos, null);
    var arrayDocumentosCargo = [];
    for (var j = 0; j < datasetFilhos.rowsCount; j++) {
    	arrayDocumentosCargo.push(datasetFilhos.getValue(j, "codDocumento"));
    }

    return arrayDocumentosCargo.toString();

}

function containsArray(array, valor){

	for (var a in array) {
		if(array[a] == valor){
			return true;
		}
	}

	return false;
}
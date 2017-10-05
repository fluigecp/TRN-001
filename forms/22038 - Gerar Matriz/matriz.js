var documentos = getDocumentos();
window.onload = function(){

	$("#lotacao").on('fluig.filter.item.added', function(data) {

		var m2 = data.item.codLotacao;
		
		document.getElementsByName('codLotacao')[0].value = m2;

	});
	$("#departamento").on('fluig.filter.item.added', function(data) {

		var m1 = data.item.codDepartamento;
		
		document.getElementsByName('codDepartamento')[0].value = m1;

	});	

	document.getElementById('exibeDescricaoCArgo').checked = true;
	document.getElementById('exibeDocumentos').checked = true;
	if(getModo() != "VIEW"){
		$("#botaoGerarMatriz").css("display", "block");
	}
}

function exibeFiltro(valor){
	if( valor == "Departamento" ){
		document.getElementById('divDepartamento').style.display = 'block';
		document.getElementById('divLotacao').style.display = 'none';
	} else{
		document.getElementById('divLotacao').style.display = 'block';
		document.getElementById('divDepartamento').style.display = 'none';
	}
}



function gerar( ){
		console.log("Bora gerar");		
		var retorno = construirMatriz();
		myWindow = window.open("matrizTreinamento.html", "myWindow", "width=auto, height=auto");
		console.log("RETOOOORNO "+retorno[1]);
		setTimeout(function(){ 
			myWindow.document.getElementById("loader").style.display = "none";
	        myWindow.document.getElementById('tabelaCorpo').innerHTML = retorno[0];
	        myWindow.document.getElementById('qtdCargos').innerHTML = retorno[1];
	        myWindow.document.getElementById('qtdDocumentos').innerHTML = retorno[2];
	        
			myWindow.focus();
		
			 
		}, 1000);

	  
}

function construirMatriz(){

	var codLotacao = document.getElementById('codLotacao').value;
	var codDepartamento = document.getElementById('codDepartamento').value;
	var cargo = document.getElementById('cargo').value;
	var situacaoCargo = document.getElementById('situacaoCargo').value;
	var descricaoCargo = document.getElementById('descricaoCargo').value;
	var exibeCargosEmAberto = document.getElementById('exibeCargosEmAberto').checked;

	var arrayCargo = buscaCargos(cargo, exibeCargosEmAberto, codLotacao, descricaoCargo, codDepartamento);

	var cargoXdocumentos = [];

	for (var i = 0; i < arrayCargo.values.length; i++) {

		var arrayCodDocumento = retornaDocumento(arrayCargo.values[i]["codigo"]);
		
	    cargoXdocumentos.push([ arrayCargo.values[i]["situacaoCargo"], arrayCargo.values[i]["lotacao"], arrayCargo.values[i]["cargo"], arrayCargo.values[i]["haDescricaoCargo"], arrayCargo.values[i]["statusSolicitacao"], arrayCargo.values[i]["docNaoAplicavel"], arrayCodDocumento ]);

	    	/*
	0 - Data da última atualização
	1 - Nome do cardo
	2 - Código do cargo
	3 - Descrição do cardo
	4 - Tabela de documentos
	5 - Cardid
	6 - version
	7 - documentid
	8 - situacaoCArgo
	9 - nomeArea
	10 - status da solicitacao
	11 - NA nos docs
	12 - array de cod de documento

	*/
	    
	}

	var pag = criaMatriz(documentos, cargoXdocumentos, situacaoCargo );

	return [pag, cargoXdocumentos.length,  documentos.length ];


}


function getDocumentos(){
	 var doc = DatasetFactory.getDataset("documentosSGQ", null, [], null);
	 var array = [];
	 for (var i = 0; i <  doc.values.length; i++) {
	 	array.push({codigo:doc.values[i]["codigo"], documento:doc.values[i]["documento"]});

	 }

	 console.log("Carreguei "+array.length+" documentos");

	 return array;
}

function buscaCargos( filtroNomeCargo, exibirEmAberto, codArea, descricaoCargo, codDepartamento){

	var arrayFiltroNomeCargo = [];

	if( codArea != null && codArea != "" && document.getElementsByName('filtrarPor')[1].checked ){
		var c2 = DatasetFactory.createConstraint("codLotacao",codArea,codArea,ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c2);

	}

	if( codDepartamento != null && codDepartamento != "" && document.getElementsByName('filtrarPor')[0].checked ){

		var arrayCodLotacao = getLotacoesByDepto( codDepartamento );
		for(var i = 0; i < arrayCodLotacao.length; i++){
			var c2 = DatasetFactory.createConstraint("codLotacao",arrayCodLotacao[i],arrayCodLotacao[i],ConstraintType.SHOULD);
			arrayFiltroNomeCargo.push(c2);
		}

		

	}

	if( filtroNomeCargo != null && filtroNomeCargo != "" ){
		var c3 = DatasetFactory.createConstraint("cargo", "%" + filtroNomeCargo + "%" , "%" + filtroNomeCargo + "%",  ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c3);
	}
	
	if( !exibirEmAberto ){
		var c4 = DatasetFactory.createConstraint("statusSolicitacao","ok","ok",ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c4);
	}


	if( descricaoCargo != null && descricaoCargo != "" ){

		var c6 = DatasetFactory.createConstraint("haDescricaoCargo",descricaoCargo,descricaoCargo,ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c6);
	}

	var result = DatasetFactory.getDataset("dsMatrizTreinamento", null, arrayFiltroNomeCargo, ["lotacao"]);



	return result;

	/*
	0 - Data da última atualização
	1 - Nome do cardo
	2 - Código do cargo
	3 - Descrição do cardo
	4 - Tabela de documentos
	5 - Cardid
	6 - version
	7 - documentid
	8 - situacaoCArgo
	9 - nomeArea

	*/

	

}


function getLotacoesByDepto(codDepartamento){

	var c = DatasetFactory.createConstraint("codDepartamento",codDepartamento,codDepartamento,ConstraintType.MUST);
	var c1 = DatasetFactory.createConstraint("metadata#active","true","true",ConstraintType.MUST);

	var result = DatasetFactory.getDataset("cadastro_lotacao", null, [c, c1], null);

	var arrayRetorno = [];

	for (var j = 0 ; j < result.values.length; j++) {
		arrayRetorno.push(result.values[j]["codLotacao"]);
	}

	return arrayRetorno;


}



function retornaDocumento(arrayCodigos){
	console.log("Entrei");
	var arrayDocumentosCargo = [];
	if(arrayCodigos == ""){
		return arrayDocumentosCargo;
	}
	var arrayCodDocumento = arrayCodigos.split(",");
	var qtd = arrayCodDocumento.length;
		
	for (var doc in documentos) {
		var cod1 = documentos[doc].codigo+"";
		if(arrayCodDocumento.indexOf( cod1 ) > -1){
			arrayDocumentosCargo.push( documentos[doc].documento );
			qtd--;
		}

		if(qtd == 0){
			break;
		}
	}

	console.log(arrayDocumentosCargo.toString());
	return arrayDocumentosCargo;
}




function criaMatriz(documentos, cargoXdoc, situacaoCargo){

var exibeDescricaoCArgo = document.getElementById('exibeDescricaoCArgo').checked;
var exibeDocumentos = document.getElementById('exibeDocumentos').checked;


var pagina = "";

pagina+='	<table style="border-top: none !important;" id="tabelaMatriz" class="table table-bordered table-responsive table-striped table-condensed scroll">        ';
pagina+='		<thead name="checagemCabecalho">                                ';
pagina+='		<tr class="table_style">                            ';
pagina+='		<th style="min-width: 278px !important; text-align: center; cursor: pointer;" onclick="sortTable(0);" class="table_style color1" data-class="color1" data-color="0">                     ';
pagina+='			<span>Lotação</span>';
pagina+='		</th>';
pagina+='		<th style="min-width: 278px !important; text-align: center; cursor: pointer;" class="table_style color1" onclick="sortTable(1);" data-class="color1" data-color="0">                     ';
pagina+='			<span>Nome cargo</span>';
pagina+='		</th>';
if( exibeDescricaoCArgo ){
	pagina+='		<th style="min-width: 170px !important; text-align: center;" class="table_style color1" data-class="color1" data-color="0">                     ';
	pagina+='			<span>Descrição cargo</span>';
	pagina+='		</th>';

}

if(exibeDocumentos){
		pagina+='		<th style="min-width: 30px !important;" class="table_style color1" data-class="color1" data-color="0">                     ';
		pagina+='			<span class="table_rotate"  style="cursor: pointer;">N/A</span>';
		pagina+='		</th>';
	for (var i = 0; i < documentos.length; i++) {
		pagina+='		<th style="min-width: 30px !important" class="table_style color1" data-class="color1" data-color="0">                     ';
		console.log("Estou no i: "+i+" o documento é "+documentos[i].documento);
		pagina+='			<span class="table_rotate" title="'+(documentos[i].documento).split('|')[1]+'" style="cursor: pointer;">'+(documentos[i].documento).split('|')[0]+'</span>';
		pagina+='		</th>';
	}
} else{
	pagina+='		<th style="min-width: 150px !important" class="table_style color1" data-class="color1" data-color="0">                     ';
	pagina+='			<span  style="cursor: pointer;">Qtd documentos</span>';
	pagina+='		</th>';
}

pagina+='   </tr>          ';
pagina+='    </thead>         ';
/*pagina+='    </table>         ';

var paginaBody='    <div>         ';
paginaBody+='<table>	';*/
pagina+='<tbody>	';

var qtdTotal = 100 / cargoXdoc.length;

for (var i = 0; i < cargoXdoc.length; i++) {

		var pctg = Math.round(i * qtdTotal)+"%";
		
		console.log(Math.round(i * qtdTotal) +"%");


	if(situacaoCargo == "" || situacaoCargo == cargoXdoc[i][0]){


		pagina+=' <tr class="tableBodyRow checagem_aud"> ';
	 	pagina+='     <td class="alinha_check lotacao" style="padding:0.5em; min-width: 278px !important" >';
	 	pagina+='         <span>'+cargoXdoc[i][1]+'</span>';
	  	pagina+='     </td>';
	  	if( cargoXdoc[i][4] == "ok" && cargoXdoc[i][0] == "Ativo"){
	  		pagina+='     <td class="alinha_check cargo" style="min-width: 278px !important" >';
	  	} else if( cargoXdoc[i][4] == "" && cargoXdoc[i][0] == "Ativo" ){
	  		pagina+='     <td class="alinha_check cargo" style="min-width: 278px !important; background-color: #ffff80;">';
	  	}else{
	  		pagina+='     <td class="alinha_check" style="min-width: 278px !important; background-color: #ff9999;">';
	  	}
	 	
	 	pagina+='         <span>'+cargoXdoc[i][2]+'</span>';
	  	pagina+='     </td>';
	  	if( exibeDescricaoCArgo ){
		 	pagina+='     <td class="alinha_check" style="min-width: 170px !important; text-align: center;" >';
	 		pagina+='         <span>'+cargoXdoc[i][3]+'</span>';
	  		pagina+='     </td>';
	  	}
	  	if(exibeDocumentos){

	  		if( cargoXdoc[i][5] == "" || cargoXdoc[i][5] == null){
	    	 	pagina+='     <td class="alinha_check color00 classControl" style="min-width: 30px; background-color: #d6d6c2 "  data-color="00" data-on="off">';
		    	pagina+='         <span>N</span>';
		    } else{
	    	 	pagina+='     <td class="alinha_check color00 classControl" style="min-width: 30px; background-color: #014f93 " data-color="00" data-on="on">';
		    	pagina+='         <span style="color: white;">S</span>';
		    }
			 	pagina+='     </td>';



			for (var j = 0; j < documentos.length; j++) {
			   
			    if( cargoXdoc[i][6].indexOf(documentos[j].documento) == -1 ){
			    	 pagina+='     <td class="alinha_check classControl"  style="min-width: 30px; background-color: #d6d6c2 "  data-color="'+j+'" data-on="off"> ';
			    	pagina+='         <span>N</span>';
			    } else{
			    	 pagina+='     <td class="alinha_check color'+j+' classControl" style="min-width: 30px; background-color: #014f93 " data-color="'+j+'" data-on="on">';
			    	pagina+='         <span style="color: white;">S</span>';
			    }
			 	
			    pagina+='     </td>';
			}
		} else{
			pagina+='     <td class="alinha_check" style="min-width: 150px; "  data-color="0">';
	    	pagina+='         <span>'+cargoXdoc[i][6].length+'</span>';
			pagina+='     </td>';
		}
		pagina+='  </tr>                            ';
	}
}

pagina+='      </tbody>                            ';
pagina+='    </table>                              ';                                         


return pagina;


}


function convertStringToDate(txtData) {

	txtData = txtData.split(" - ");
	var data = txtData[0];
	var hora = txtData[1].split(":");

    data = data.split("/");
    var dia = parseInt(data[0]);
    var mes = parseInt(data[1]) -1;
    var ano = parseInt(data[2]);
    var dataFinal = new Date(ano, mes, dia);
  	dataFinal.setHours(parseInt(hora[0]));
    dataFinal.setMinutes(parseInt(hora[1]));

    return dataFinal;
}
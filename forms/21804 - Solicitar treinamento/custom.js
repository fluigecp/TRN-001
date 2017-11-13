
window.onload = function(){
	//carregaLotacoes();
	desabilitaDocumentos();
	if( getWKNumState() == 5 || getWKNumState() == 10 ){
		FLUIGC.switcher.disable('#situacaoCargoSwitcher');
	}

	verificaSituacao(FLUIGC.switcher.getState('#situacaoCargoSwitcher'));

/* 	$("#lotacao").on('fluig.autocomplete.selected', function(data) {

		var m2 = data.item.codLotacao;
		var nomeLotacao = data.item.lotacao;

		document.getElementsByName('codLotacao')[0].value = m2;
		document.getElementsByName('nomeLotacao')[0].value = nomeLotacao;

		var myLoading1 = FLUIGC.loading('#loading');
		myLoading1.show();
		setTimeout(function() {
			verificaResponsavel(m2);
			carregaOpcoesCargo();
			myLoading1.hide();
		}, 500);


	}); */

	$(document).ready(function(){
    $("button").click(function(){
        $("p").slideToggle();
    });
});
}


function verificaSituacao(isChecked){
	console.log("Start verificaSituacao");
	if(!isChecked){
    	document.getElementsByName('situacaoCargo')[0].value = "Ativo";
  	} else{
	    document.getElementsByName('situacaoCargo')[0].value = "Inativo";
  	}
}

function carregaOpcoesCargo(){

	console.log("Start carregaOpcoesCargo");

	var codLotacaoSelecionada = document.getElementById('codLotacao').value;
	limpaCampos();
	document.getElementById('cargo').value = "";

	if( codLotacaoSelecionada == "" || codLotacaoSelecionada == null || codLotacaoSelecionada == undefined ){
		return;
	}


	var cargosRestantes = buscaCargos(null, false, codLotacaoSelecionada);

	var arrayCArgo = [];

	for (var j = 0 ; j < cargosRestantes.length; j++) {
		arrayCArgo.push(cargosRestantes[j][1]);
	}

	formarDataList(arrayCArgo);


}


function formarDataList(arrayCargos){
	console.log("Start formarDataList");
	var datalist = "";

	for (var j = 0 ; j < arrayCargos.length; j++) {
		datalist+="<option value='"+arrayCargos[j]+"'>";
	}

	document.getElementById('cargos').innerHTML = datalist;

}

function buscaDocs( filtro ){
	console.log("Start buscaDocs");
	var myLoading1 = FLUIGC.loading('#loading');
	myLoading1.show();
	setTimeout(function() {
		carregaDocumentos( filtro );
		myLoading1.hide();
	}, 500);
}


function carregaDocumentos( filtro ){

	console.log("Start carregaDocumentos");
	if( filtro == "" ){
		limpaCampos();
		return;
	}

	var codLotacaoSelecionada = document.getElementById('codLotacao').value;

	if( codLotacaoSelecionada == "" || codLotacaoSelecionada == null || codLotacaoSelecionada == undefined ){
		alert('Selecione a área para que o sistema possa verificar a existência do cargo');
		return;
	}

	var arrayCargo = buscaCargos( filtro , true, codLotacaoSelecionada);

	if( typeof arrayCargo == "string" ){
		FLUIGC.toast({
				title: 'Cargo em aberto: ',
				message: 'Já foi aberta uma solicitação para este cargo, cujo número é '+arrayCargo,
				type: 'danger'
			});
		return;
	}

	if( arrayCargo.length == 0 ){
	
		FLUIGC.toast({
			title: 'Cargo novo: ',
			message: 'Não foi encontrado nenhum cargo',
			type: 'warning',
			timeout: 2000
		});
		limpaCampos();
		document.getElementById('cargoNovo').value = "Sim";
		document.getElementsByName('alterarRelacaoDocumentos')[0].checked = true;
		document.getElementById('divAlterarRelacaoDocumentos').style.display = "none";
		return;
	} 

	if($('#checkSolicitanteSGQ').val() == "false"){
		document.getElementById('divAlterarRelacaoDocumentos').style.display = "inline";
		document.getElementsByName('alterarRelacaoDocumentos')[0].checked = false;
	}
	

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
*/



	var documentId = arrayCargo[0][7];
    var documentVersion = arrayCargo[0][6];
     
    //Cria as constraints para buscar os campos filhos, passando o tablename, número da formulário e versão
    var c1 = DatasetFactory.createConstraint("tablename", "documentos" ,"documentos", ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST);
    var constraintsFilhos = new Array(c1, c2, c3);

    //Busca o dataset
    var datasetFilhos = DatasetFactory.getDataset("cadastro_treinamento", null, constraintsFilhos, null);

	console.log(datasetFilhos);

	limpaCampos();

	document.getElementById('codCargo').value = arrayCargo[0][2];
	document.getElementById('cargoNovo').value = "Não";

	document.getElementsByName('haDescricaoCargo')[0].checked = arrayCargo[0][3] == document.getElementsByName('haDescricaoCargo')[0].value ? true : false;
	document.getElementsByName('haDescricaoCargo')[1].checked = arrayCargo[0][3] == document.getElementsByName('haDescricaoCargo')[1].value ? true : false;
	document.getElementsByName('cargo')[0].readOnly = true;
	
	if( arrayCargo[0][8] == "Inativo" ){
		FLUIGC.switcher.setTrue('#situacaoCargoSwitcher');
	} else{
		FLUIGC.switcher.setFalse('#situacaoCargoSwitcher');
	}

	document.getElementsByName('ultimaAtualizacao')[0].value = arrayCargo[0][0];
	

	for (var i = 0; i <  datasetFilhos.values.length; i++) { 
		var index = addDoc();
		document.getElementsByName('documentoTxt___'+index)[0].style.display = "inline";
		document.getElementsByName('documentoTxt___'+index)[0].readOnly = false;

		document.getElementsByName('documentoTxt___'+index)[0].value = datasetFilhos.values[i]["documentoTxt"] == "" ? datasetFilhos.values[i]["documento"] : datasetFilhos.values[i]["documentoTxt"];

		document.getElementsByName('documentoTxt___'+index)[0].readOnly = true;

		document.getElementsByName('codDocumento___'+index)[0].value = datasetFilhos.values[i]["codDocumento"];

		$('[name="documento___'+index+'"]').parent().css("display", "none");
	}




}

function buscaCargos( filtroNomeCargo, validaEmAberto, codLotacao ){

	console.log("Start buscaCargos");
	var c1 = DatasetFactory.createConstraint("metadata#active","true","true",ConstraintType.MUST);
	var arrayFiltroNomeCargo = [c1];
	if( getDocumentId() != null && getDocumentId() != "" ){
		var cCardid = DatasetFactory.createConstraint("metadata#id",getDocumentId(),getDocumentId(),ConstraintType.MUST_NOT);
		arrayFiltroNomeCargo.push(cCardid);
	}
	
	if( codLotacao != null && codLotacao != "" ){
		var c2 = DatasetFactory.createConstraint("codLotacao",codLotacao,codLotacao,ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c2);

	}

	if( filtroNomeCargo != null && filtroNomeCargo != "" ){
		var c3 = DatasetFactory.createConstraint("cargo",filtroNomeCargo,filtroNomeCargo,ConstraintType.MUST);
		arrayFiltroNomeCargo.push(c3);
	}
	
	var result = DatasetFactory.getDataset("cadastro_treinamento", null, arrayFiltroNomeCargo, ["ultimaAtualizacao"]);



	return getCargosAtualizados(result, validaEmAberto);

	/*
	0 - Data da última atualização
	1 - Nome do cardo
	2 - Código do cargo
	3 - Descrição do cardo
	4 - Tabela de documentos
	5 - Cardid
	6 - version
	7 - documentid

	*/

	

}


function getCargosAtualizados(cargosRestantes, validaEmAberto){
	console.log("Start getCargosAtualizados");
	var jaAdicionados = [];
	console.log(cargosRestantes);

	for (var j = 0 ; j < cargosRestantes.values.length; j++) {
		var cargoRepetido = false;
		var restante = cargosRestantes.values[j];

		if( validaEmAberto && restante["statusSolicitacao"] != "ok"){
			document.getElementsByName('cargo')[0].value = "";
			document.getElementsByName('cargo')[0].focus();
			return restante['numeroSolicitacao'];
		}


		if( jaAdicionados.length == 0 ){
			jaAdicionados.push([restante["ultimaAtualizacao"], restante["cargo"], restante["codCargo"],  restante["haDescricaoCargo"],  restante["numeroSolicitacao"], restante["cardid"], restante["metadata#version"], restante["metadata#id"], restante["situacaoCargo"] ]);
			continue;
		}


		for (var i = 0 ; i < jaAdicionados.length; i++) {

			if( jaAdicionados[i][1] == restante["cargo"]  ){
				cargoRepetido = true;
				if( convertStringToDate( jaAdicionados[i][0] ) <  convertStringToDate( restante["ultimaAtualizacao"] ) ){ 
					jaAdicionados.splice(i,1);
					i--;
					jaAdicionados.push([restante["ultimaAtualizacao"], restante["cargo"], restante["codCargo"],  restante["haDescricaoCargo"],  restante["numeroSolicitacao"], restante["cardid"], restante["metadata#version"], restante["metadata#id"], restante["situacaoCargo"] ]);
					continue;

				}
	
			}

		}

		if(!cargoRepetido){
			jaAdicionados.push([restante["ultimaAtualizacao"], restante["cargo"], restante["codCargo"],  restante["haDescricaoCargo"],  restante["numeroSolicitacao"], restante["cardid"], restante["metadata#version"], restante["metadata#id"], restante["situacaoCargo"]]);
		}
		

	}

	return jaAdicionados;

}


function addDoc() {

	var row = wdkAddChild('documentos');

	/*$("#documento___" + row).on('fluig.autocomplete.beforeItemAdd', function(data) {

		var cod = data.item.codigo;
		if(jaExisteDoc(cod)){
			$(".documentosLixeira").each(function(index){
				var valor = $(this).closest('tr').find("#documento___" + row).val();
		    	if( valor != undefined && valor != null && valor != ""){
		    		fnWdkRemoveChild(this);
		    	}       
		    });
		} else{
			$("#codDocumento___" + row).val(data.item.codigo);
			$("#documentoTxt___" + row).val(data.item.documento);
		}

		
	});*/

	return row;
}

function jaExisteDoc(cod){

	var retorno = false;

	$("input[name*='codDocumento___']").each(function(index){
    	if( cod == this.value ){
    		retorno = true;
    	}       
    });

    return retorno;

}

function addUsuario() {

	var row = wdkAddChild('treinamento');

	$("#nomeUsuarioTreinamento___" + row).on('fluig.filter.item.added', function(data) {
		$("#matriculaUsuarioTreinamento___" + row).val(data.item.colleagueId);
		
	});
}

function atualizaHistorico(){
	if($("#observacoes").val() != ""){
		var txtTemp = $("#historico").val();
		txtTemp += data() + " - " + usuario(getWKUser()) + "\n" + $("#observacoes").val() + "\n \n";
		$("#historico").val(txtTemp);
		$("#observacoes").val("");
		$("#ctrHistorico").val("OK");
	}
}

function data(){
	var dt = new Date();
	var txtData = (dt.getDate()<10?"0"+dt.getDate():dt.getDate()) + "/" 
					+ ((dt.getMonth()+1)<10?"0"+(dt.getMonth()+1):(dt.getMonth()+1)) + "/"
					+ dt.getFullYear() + " - " + (dt.getHours()<10?"0"+dt.getHours():dt.getHours()) + ":" + (dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes());
	return txtData;
}

function usuario(mat){
	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",mat,mat,ConstraintType.MUST);
	var dsUser = DatasetFactory.getDataset("colleague",["colleagueName"],[c1],null);
	return dsUser.values[0]["colleagueName"];
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

function limpaCampos(){

	var quantidade = document.getElementsByClassName('documentosLixeira').length;

	if( quantidade > 1 ){
	    $(".documentosLixeira").each(function(index){
	    	if( index != 0 ){
	    		fnWdkRemoveChild(this);
	    	}       
	    });
	}

    $(".controleLimpeza").each(function(){
		$(this).val("");       
    });

    document.getElementsByName('cargo')[0].readOnly = false;

    document.getElementsByName('haDescricaoCargo')[0].checked = false;
    document.getElementsByName('haDescricaoCargo')[1].checked = false;

    FLUIGC.switcher.setFalse('#situacaoCargoSwitcher');
}

function desabilitaDocumentos(){
	var quantidade = getChildrenIndexes('documentoTxt');

	for (var i = 0; i < quantidade.length; i++) {
		if( document.getElementsByName('documentoTxt___'+quantidade[i])[0].value != "" ){
			document.getElementsByName('documentoTxt___'+quantidade[i])[0].style.display = "inline";
			$('[name="documento___'+quantidade[i]+'"]').parent().css("display", "none");
		
		}

	}

}

function exibeTabela(chk){

	if(chk){
		document.getElementById('divTableDocumentos').style.display = "none";
		document.getElementById('btnAdicionarDoc').style.display = "none";
	} else{
		document.getElementById('divTableDocumentos').style.display = "inline";
		document.getElementById('btnAdicionarDoc').style.display = "inline";
	}

}



function verificaResponsavel( codLotacao ){
try{
	$("#matResponsavelSGQ").val("");
	$("#nomeResponsavelSGQ").val("");

	var codDepartamento = getDptoByCodLotacao( codLotacao );
	if( codDepartamento != null &&  codDepartamento != ""  ){
		var matriculaSGQ = getResponsavelSGQByCodDepartmento( codDepartamento );
		if( matriculaSGQ != null &&  matriculaSGQ != ""  ){
			$("#matResponsavelSGQ").val(matriculaSGQ);
			$("#nomeResponsavelSGQ").val(usuario(matriculaSGQ));
		}
	}
	
} catch(e){
	console.log(e);
}
	
	
}

function getDptoByCodLotacao(codLotacao){
	try{
		var c1 = DatasetFactory.createConstraint("metadata#active", "true", "true",  ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("codLotacao",codLotacao,codLotacao,ConstraintType.MUST);
		var dataset = DatasetFactory.getDataset("cadastro_lotacao",null,[c1, c2],null);
		return dataset.values[0]["codDepartamento"];
	} catch(e){
		console.log('ERRO na function getDptoByCodLotacao: '+e);
		return "";

	}
	

}

function getResponsavelSGQByCodDepartmento( codDepartamento ){
	try{

		var c2 = DatasetFactory.createConstraint("idDepartamento",codDepartamento,codDepartamento,ConstraintType.MUST);
		var c1 = DatasetFactory.createConstraint("metadata#active","true","true",ConstraintType.MUST);
		var dsResponsavel = DatasetFactory.getDataset("rnc_responsavel_departamento",null,[c2, c1],null);

		return dsResponsavel.values[0]["matriculaResponsavel"];
	} catch(e){
		console.log('ERRO na function getResponsavelSGQByCodDepartmento: '+e);
		return "";

	}
}


// método do campo zoom de departamentos
function setSelectedZoomItem(selectedItem) {
	if (selectedItem.inputName == 'lotacao') {
		var m2 = selectedItem.codLotacao;
		var nomeLotacao = selectedItem.lotacao;

		document.getElementsByName('codLotacao')[0].value = m2;
		document.getElementsByName('nomeLotacao')[0].value = nomeLotacao;

		var myLoading1 = FLUIGC.loading('#loading');
		myLoading1.show();
		setTimeout(function() {
			verificaResponsavel(m2);
			carregaOpcoesCargo();
			myLoading1.hide();
		}, 500);
	}

	if (selectedItem.inputName.indexOf("documento___") !== -1) {
		var cod = selectedItem.codigo;
		if(jaExisteDoc(cod)){
			$(".documentosLixeira").each(function(index){
				var valor = $(this).closest('tr').find("#" + selectedItem.inputName).val();
		    	if( valor != undefined && valor != null && valor != ""){
					//fnWdkRemoveChild(this);
					$(this).click();
		    	}       
		    });
		} else{
			$("#" + selectedItem.inputName).closest('.tableBodyRow').find("[name*=codDocumento___]").val(selectedItem.codigo);
			$("#" + selectedItem.inputName).closest('.tableBodyRow').find("[name*=documentoTxt___]").val(selectedItem.documento);
		}
	}
}


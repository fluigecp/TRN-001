function displayFields(form,customHTML){
	
	var activity = getValue('WKNumState');
    customHTML.append("<script>");
    customHTML.append("function getWKNumState(){return " + getValue("WKNumState") + "}");
    customHTML.append("function getDocumentId(){return '" + form.getDocumentId().toString() + "';}");
    customHTML.append("function getWKUser(){return '" + getValue("WKUser") + "'}");
    customHTML.append("</script>");


    if( activity == null && form.getValue('codCargo') == "" ){
        form.setValue("statusSolicitacao", "ok");
    }

    if( form.getFormMode() == "VIEW" ){
    	customHTML.append('<script>');
    	customHTML.append('$(\'span[name^="documento___"\').css(\'display\', \'none\');');
    	customHTML.append('$(\'span[name^="documentoTxt___"\').css(\'display\', \'inline\');');
    	customHTML.append('</script>');
    }

	if( activity == 0 || activity == 4  ){
        if( !isSgq() ){
            ocultaId('btnAdicionarDoc');
            ocultaId('divDocNaoAplicavel');
            ocultaClasse('btn-delete');
        } else{
            oculta('alterarRelacaoDocumentos');
        }
        form.setValue("checkSolicitanteSGQ", isSgq());
	}

	if( activity == 10 || activity == 12 ){
		ocultaId('btnAdicionarDoc');
        ocultaClasse('btn-delete');
        oculta('alterarRelacaoDocumentos');
	}

    if( activity == 5 ){
        oculta('situacaoCargo');
        oculta('alterarRelacaoDocumentos');
    }


	function oculta(variavel) {
        customHTML.append('<script>                                       ');
        customHTML.append('$(\'[name="' + variavel + '"]\').css(\'display\', \'none\');                      ');
        customHTML.append('$([name="' + variavel + '"]).parent().css(\'display\', \'none\');                                     ');
        customHTML.append('var closers = $([name="' + variavel + '"]).closest(\'.form-field\').find(\'input, textarea, select, table\');');
        customHTML.append('var hideDiv = true;                                                                               ');
        customHTML.append('$.each(closers, function(i, close) {                                                              ');
        customHTML.append('  if (close.style.display != \'none\') {                                                          ');
        customHTML.append('    hideDiv = false;                                                                              ');
        customHTML.append('  }                                                                                               ');
        customHTML.append('});                                                                                               ');
        customHTML.append('                                                                                                  ');
        customHTML.append('if (hideDiv == true) {                                                                            ');
        customHTML.append('  $([name="' + variavel + '"]).closest(\'.form-field\').css(\'display\', \'none\');                   ');
        customHTML.append('}                                                                                                 ');
        customHTML.append('$(\'[name="' + variavel + '"]\').closest(".form-field").hide();                                       ');
        customHTML.append('</script>                                       ');
    }
    function ocultaId(id) {
        customHTML.append('<script>');
        customHTML.append('$(\'#' + id + '\').css(\'display\', \'none\')');
        customHTML.append('</script>');
    }
    function ocultaClasse(classe) {
        customHTML.append('<script>');
        customHTML.append('$(\'.' + classe + '\').css(\'display\', \'none\')');
        customHTML.append('</script>');
    }
}

function data(){
	var dt = new Date();
	var txtData = (dt.getDate()<10?"0"+dt.getDate():dt.getDate()) + "/" 
					+ ((dt.getMonth()+1)<10?"0"+(dt.getMonth()+1):(dt.getMonth()+1)) + "/"
					+ dt.getFullYear() + " - " + (dt.getHours()<10?"0"+dt.getHours():dt.getHours()) + ":" + (dt.getMinutes()<10?"0"+dt.getMinutes():dt.getMinutes());
	return txtData;
}

function isSgq() {
    var sgq = "SGQ";
    var c1 = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", getValue("WKUser") , getValue("WKUser") , ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("colleagueGroupPK.groupId", sgq, sgq, ConstraintType.MUST);
    var dsUser = DatasetFactory.getDataset("colleagueGroup", null, [c1, c2], null);
    return dsUser.rowsCount > 0;
}



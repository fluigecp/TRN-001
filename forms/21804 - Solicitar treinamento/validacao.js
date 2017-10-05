function validaCampos(atividade, proximaAtividade){
  console.log('entrei no validacampos');
  var inicial = 0;
  var inicio = 4;
  var relacionarDocumentos = 5;
  var tomarConhecimento = 12;
  var treinarFuncionarios = 10;


  if( atividade == inicial || atividade == inicio){

    addHasFree('lotacao');
    addHasFree('cargo');  
    addHasFree('nomeResponsavelSGQ');
    addHasFree('haDescricaoCargo');

    if(getValue('checkSolicitanteSGQ') == "false"){
      addHasFree('alterarRelacaoDocumentos');
    }
    $("#nomeDocumentos").val( convertAllDocumentsToString() );
  }

  if( atividade == relacionarDocumentos){

    if( getValue('docNaoAplicavel') == "" ){
      addHasFreeTable('text', 'codDocumento', 0)
    }
    $("#nomeDocumentos").val( convertAllDocumentsToString() );
 
  }


  if( getValue('observacoes') != "" && getValue("ctrHistorico") == "" ){

    addHasFreeArray(['ctrHistorico']);

  }


  function convertAllDocumentsToString() {
    var arrayDocuments = [];
    $("#divTableDocumentos tbody .tableBodyRow:not(:first-child)").each(function(){ 
       var docName = $(this).find("input[name*='documentoTxt___']").val();  
       arrayDocuments.push(docName);
     });
     return arrayDocuments.toString().replaceAll( "," , "\n" );
  }

  
}








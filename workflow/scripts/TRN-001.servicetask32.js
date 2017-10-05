function servicetask32(attempt, message) {
	try {
		var numSolicPai = getValue('WKNumProces'); 
		
		var servico = ServiceManager.getService("ECMWorkflowEngineService").getBean(); 
		log.warn("%%%%%% servico : " + servico);
		
		var locator = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService"); 
		log.warn("%%%%%% locator : " + locator);
  
		var WorkflowEngineService = locator.getWorkflowEngineServicePort(); 
		log.warn("%%%%%% WorkflowEngineService : " + WorkflowEngineService);
  
		var username = hAPI.getAdvancedProperty("loginUserWS"); 
  		log.warn("%%%%%% username : " + username);
  
  		var password = hAPI.getAdvancedProperty("passwdUserWS"); 
  		log.warn("%%%%%% password : " + password);
  
  		var companyId = parseInt(getValue("WKCompany")); 
		log.warn("%%%%%% companyId : " + companyId);
  
		var processId = "TRN-005";

		var choosedState = 30; // atividade condicional FX-41
		
		var comments = "Solicitação aberta por: Nº " + numSolicPai;  
		log.warn("%%%%%% comments : " + comments);
  
		var userId = hAPI.getAdvancedProperty("matUserWS");   
		log.warn("%%%%%% userId : " + userId);
  
		var completeTask = true;   
		log.warn("%%%%%% completeTask : " + completeTask);
  
		var attachments = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray");   
		log.warn("%%%%%% attachments : " + attachments);
  
		var appointment = servico.instantiate("com.totvs.technology.ecm.workflow.ws.ProcessTaskAppointmentDtoArray");   
		log.warn("%%%%%% appointment : " + appointment);
		  
		var managerMode = false;  
		log.warn("%%%%%% managerMode : " + managerMode);
		  
		var novaSolic;
		
		var colleagueIds = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		colleagueIds.getItem().add('System:Auto');
		log.warn("%%%%%% colleagueIds " + colleagueIds); 

		var cardData = servico.instantiate("net.java.dev.jaxb.array.StringArrayArray");
		log.warn("%%%%%% cardData");

		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("documentosMatriz");
		solicOrigemMatriz.getItem().add(hAPI.getCardValue('nomeDocumentos'));
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Documentos");

		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("numSolicMatriz");
		solicOrigemMatriz.getItem().add(hAPI.getCardValue("numeroSolicitacao"));
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Número da solicitação da matriz");

		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("matResponsavel");
		solicOrigemMatriz.getItem().add(hAPI.getCardValue("matResponsavelSGQ"));
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Matricula solicitante");

		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("atividadeAutomatica");
		solicOrigemMatriz.getItem().add("Sim");
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Atividade automatica");
		
		
		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("areaMatriz");
		solicOrigemMatriz.getItem().add(hAPI.getCardValue("nomeLotacao"));
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Área Matriz");

		var solicOrigemMatriz = servico.instantiate("net.java.dev.jaxb.array.StringArray");
		solicOrigemMatriz.getItem().add("cargoMatriz");
		solicOrigemMatriz.getItem().add(hAPI.getCardValue("cargo"));
		cardData.getItem().add(solicOrigemMatriz);
		log.warn("%%%%%% Cargo Matriz");



		novaSolic = WorkflowEngineService.startProcess(username,password,companyId,processId,choosedState,colleagueIds,comments,userId,completeTask,attachments,cardData,appointment,managerMode);
		log.warn("%%%%%% Nova solicitacao");
	} catch(error) { 
		log.error(error);
		throw error;
	}

}
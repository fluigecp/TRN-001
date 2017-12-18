# TRN-001 - CONTROLAR MATRIZ DE TREINAMENTOS #

## Descrição: ##

Processo com a finalidade de controlar os cargos de cada lotação, atribuir documentos a cargos existentes
ou adicionar um novo.

## FLUXO PRINCIPAL: ##

    1 - Solicitante preenche lotação e nome do cargo:

        1.1 - Caso for cargo novo, solicitante indica se há descrição do cargo;
        1.2 - Em caso de cargo já existente, solicitante indica se há necessidade de atualização de documentos,
        a lista de documentos é populada com os documentos já existentes.

    2 - Solicitante adiciona ou remove documentos da tabela:

        2.1 - Caso o solicitante tenha esteja adicionando um novo cargo, ou tenha optado por atualizar os documentos de
        um cargo já existente. O planejamento pode adicionar ou remover um documento da tabela de documentos.
        2.2 - Planejamento pode decidir se é ou não aplicável uma atualização de documentos:
            2.2.1 - Caso não, a solicitação é finalizada;
            2.2.2 - Caso sim, os documentos serão atualizados e a solicitação avança.

    3 - Após a atualização de documentos, é aberto, de forma automática, uma solicitação do Processo TRN-005 - Registrar Treinamentos,
    para que os funcionários que possui o cargo atualizado possa ser treinado conforme a nova documentação:

        3.1 - Em caso de erro ao abrir a solicitação de registro de treinamento, a solicitação é encaminhada a equipe
        de processos para a correção do erro.
        3.2 - Após aberta a solicitação de registro de treinamento, o processo é finalizado.

### FLUXO ALTERNATIVO: ###

    1 - Solicitante preenche lotação e nome do cargo:

    1.1 - Caso for cargo novo, solicitante indica se há descrição do cargo;
    1.2 - Em caso de cargo já existente, solicitante indica se há necessidade de atualização de documentos,
    a lista de documentos é populada com os documentos já existentes.

    2 - Usuário indica que não há necessidade de atualização de cargos, ou atualiza a situação do cargo para "Inativo";

    3 - O processo é finalizado.
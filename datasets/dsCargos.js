function createDataset(fields, constraints, sortFields) {
    try {
        // VARIABLES    
        var customDataset = DatasetBuilder.newDataset(),
            arrayList = [],
            sqlLimit = false,
            limitReturn = 0,
            listSuport = [],
            filterI = '',
            filterII = '',
            filterIII = '',
            filterIV = '',
            filterStrI = '',
            filterStrII = '',
            filters = [];

        //Estrutura do novo dataset
        customDataset.addColumn("idCargo");
        customDataset.addColumn("cargo");
        customDataset.addColumn("lotacao");
        customDataset.addColumn("idDepartamento");
        customDataset.addColumn("departamento");
        customDataset.addColumn("situacaoCargo");
        customDataset.addColumn("descricaoCargo");

        //Verifica se tem filtros a serem tratados
        if (constraints !== null && constraints !== undefined && constraints.length > 0) {
            log.warn("%%% CONSTRAINTS: "+constraints);
            //itera todas as constraints, verifica e configura cada filtro
            for (var index = 0; index < constraints.length; index++) {
                if (constraints[index].fieldName == 'sqlLimit') {
                    sqlLimit = true;
                    limitReturn = parseInt(constraints[index].initialValue);
                }

                if (constraints[index].fieldName == 'situacaoCargo') {
                    log.warn("%%% CONSTRAINTS(situacaoCargo): "+constraints[index]);
                    filterI = DatasetFactory.createConstraint("situacaoCargo", constraints[index].initialValue ,  constraints[index].finalValue , ConstraintType.MUST );
                    filterI.setLikeSearch(true);
                    filters.push(filterI);
                }

                if (constraints[index].fieldName == 'descricaoCargo') {
                    log.warn("%%% CONSTRAINTS(descricaoCargo): "+constraints[index]);
                    filterII = DatasetFactory.createConstraint("HaDescricaoCargo", constraints[index].initialValue , constraints[index].finalValue  , ConstraintType.MUST);
                    filterII.setLikeSearch(true);
                    filters.push(filterII);
                }

                if (constraints[index].fieldName == 'lotacao') {
                    log.warn("%%% CONSTRAINTS(lotacao): "+constraints[index]);
                    filterIII = DatasetFactory.createConstraint("lotacao", "%" + constraints[index].initialValue + "%", "%" + constraints[index].finalValue  + "%", ConstraintType.MUST);
                    filterIII.setLikeSearch(true);
                    filters.push(filterIII);
                }

                if (constraints[index].fieldName == 'departamento') {
                    log.warn("%%% CONSTRAINTS(departamento): "+constraints[index]);
                    var filterDpto = DatasetFactory.createConstraint("departamento", "%" + constraints[index].initialValue + "%", "%" + constraints[index].finalValue  + "%", ConstraintType.MUST);
                    var lotacoes_dpto = DatasetFactory.getDataset('cadastro_lotacao', null, [filterDpto], null);
                    log.warn("%%% DATASET(departamento): "+lotacoes_dpto);
                    for (var i = 0; i < lotacoes_dpto.rowsCount; i++) {
                        log.warn("%%% DATASET - lotacao(departamento): "+lotacoes_dpto.getValue(i, "lotacao"));
                        var constraintDpto = DatasetFactory.createConstraint("lotacao", "%" + lotacoes_dpto.getValue(i, "lotacao") + "%",
                         "%" + lotacoes_dpto.getValue(i, "lotacao") + "%", ConstraintType.SHOULD);
                         constraintDpto.setLikeSearch(true);
                         filters.push(constraintDpto);
                    }
                }

                if (constraints[index].fieldName == 'cargo') {
                    filterStrI = (constraints[index].initialValue).toLowerCase();
                }
            }
        }

        // Caso tenha filtros
        if (filters.length > 0) {
            //constraint para obter todos os dados do dataset ativos
            var metadata = DatasetFactory.createConstraint("metadata#active", 'true', 'true', ConstraintType.MUST);
            //obtendo todas as lotações em ordem crescente(filtro pelo documentid)
            var cargos = DatasetFactory.getDataset('dsMatrizTreinamento', null, filters, null);
            var lotacoes_dpto = DatasetFactory.getDataset('cadastro_lotacao', null, [metadata], ['documentid']);

            for (var i = 0; i < cargos.rowsCount; i++) {
                var cargoNameReturn = (cargos.getValue(i, "cargo")).toLowerCase();
                var findText = cargoNameReturn.contains(filterStrI);
                if (findText) {
                    var dpto, dptoId;
                    for (var y = 0; y < lotacoes_dpto.rowsCount; y++) {
                        if (cargos.getValue(i, "lotacao") == lotacoes_dpto.getValue(y, "lotacao")) {
                            dpto = lotacoes_dpto.getValue(y, "departamento");
                            dptoId = lotacoes_dpto.getValue(y, "codDepartamento");
                        }
                    }
                    if (sqlLimit == true && customDataset.rowsCount < limitReturn) {
                        customDataset.addRow(new Array(
                            cargos.getValue(i, "codCargo"),
                            cargos.getValue(i, "cargo"),
                            cargos.getValue(i, "lotacao"),
                            dptoId,
                            dpto,
                            cargos.getValue(i, "situacaoCargo"),
                            cargos.getValue(i, "haDescricaoCargo")));
                    } else if (sqlLimit == false) {
                        customDataset.addRow(new Array(
                            cargos.getValue(i, "codCargo"),
                            cargos.getValue(i, "cargo"),
                            cargos.getValue(i, "lotacao"),
                            dptoId,
                            dpto,
                            cargos.getValue(i, "situacaoCargo"),
                            cargos.getValue(i, "haDescricaoCargo")));
                    }
                }
            }
        } else { // caso não tenha filtros
            //constraint para obter todos os dados do dataset ativos
            var metadata = DatasetFactory.createConstraint("metadata#active", 'true', 'true', ConstraintType.MUST);
            //obtendo todas as lotações em ordem crescente(filtro pelo documentid)
            var cargos = DatasetFactory.getDataset('dsMatrizTreinamento', null, [metadata], ['documentid']);
            var lotacoes_dpto = DatasetFactory.getDataset('cadastro_lotacao', null, [metadata], ['documentid']);
            if (cargos != undefined && cargos != null && lotacoes_dpto != undefined && lotacoes_dpto != null) {
                for (var i = 0; i < cargos.rowsCount; i++) {
                    var cargoNameReturn = (cargos.getValue(i, "cargo")).toLowerCase();
                    var findText = cargoNameReturn.contains(filterStrI);
                    if (findText) {
                        var dpto, dptoId;
                        for (var y = 0; y < lotacoes_dpto.rowsCount; y++) {
                            if (cargos.getValue(i, "lotacao") == lotacoes_dpto.getValue(y, "lotacao")) {
                                dpto = lotacoes_dpto.getValue(y, "departamento");
                                dptoId = lotacoes_dpto.getValue(y, "codDepartamento");
                            }
                        }
                        if (sqlLimit == true && customDataset.rowsCount < limitReturn) {
                            customDataset.addRow(new Array(
                                cargos.getValue(i, "codCargo"),
                                cargos.getValue(i, "cargo"),
                                cargos.getValue(i, "lotacao"),
                                dptoId,
                                dpto,
                                cargos.getValue(i, "situacaoCargo"),
                                cargos.getValue(i, "haDescricaoCargo")));
                        } else if (sqlLimit == false) {
                            customDataset.addRow(new Array(
                                cargos.getValue(i, "codCargo"),
                                cargos.getValue(i, "cargo"),
                                cargos.getValue(i, "lotacao"),
                                dptoId,
                                dpto,
                                cargos.getValue(i, "situacaoCargo"),
                                cargos.getValue(i, "haDescricaoCargo")));
                        }
                    }
                }
            }
        }
        return customDataset;

    } catch (e) {
        log.warn('>>> >>> e.message ' + e.message);
    }
}
"use strict";
/**
 * @module cargoAutoCompleteServices
 */
var cargoAutoCompleteServices = (function(){
    var getAllCargos = function(){
        var c1 = DatasetFactory.createConstraint("metadata#active", true, true, ConstraintType.MUST);
        var result = DatasetFactory.getDataset("dsMatrizTreinamento", null, [c1], null);
        return result.values;
    };

    var getLotacoes = function () {
        var c1 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
        var result = DatasetFactory.getDataset("cadastro_lotacao", null, [c1], null);
        return result.values;  
    }

    return {
        get: {
            allCargos: getAllCargos,
            allLotacoes: getLotacoes
        }
    }
})();
/**
 * @module cargosMatcherFactoryModule
 */
var cargosMatcherFactoryModule = (function(){
    var makeMatcher = function (lotacoes, config, cargos) {
        var dataValues = filters.filterByConfig(lotacoes, config, cargos);
        return function findMatches(q, cb) {
            var matches, substrRegex;
            matches = [];
            substrRegex = new RegExp(q, 'i');
            $.each(dataValues, function (i, dataValue) {
                if (substrRegex.test(dataValue)) {
                    matches.push({
                        description: dataValue
                    });
                }
            });
            cb(matches);
        };
    };

    var filters = {
        filterByConfig: function (lotacoes, config, cargos) {
            var dataValues = [];
            if (config.filterName == "departamento"){
                var lotacoes = filterLotacoesByDpto(lotacoes, config.filterValue);
                $.each(lotacoes, function(i, lotacao){
                    var cargosLotacao = filterCargosByLotacao(lotacao, cargos);
                    dataValues = dataValues.concat(  cargosLotacao );
                });
            }
            if (config.filterName == "lotacao"){
                dataValues = dataValues.concat( filterCargosByLotacao(config.filterValue, cargos) );
            }
            if (config.filterName == "all"){
                $.each(cargos, function(i, cargo){
                    dataValues.push(cargo.cargo);
                });
            }
            return dataValues;
        },

        filterLotacoesByDpto: function(lotacoes, codDpto){
            var filteredLotacoes = [];
            $.each(lotacoes, function(i, lotacao) {
                if (lotacao.codDepartamento == codDpto){
                    filteredLotacoes.push(lotacao.lotacao);
                }
            });
            return filteredLotacoes;
        },

        filterCargosByLotacao: function(lotacaoName, cargos){
            var filteredCargos = [];
            $.each(cargos, function(i, cargo) {
                if (cargo.lotacao == lotacaoName) {
                    filteredCargos.push(cargo.cargo);
                }
            });
            return filteredCargos;
        }
    };

    return {
        make: makeMatcher
    }

})();
/**
 * @module cargosMatcherFactoryModule
 */
var autoCompleteModule = (function(){
    var _cargos;
    var _lotacoes;
    var _codDpto;
    
    var makeAutoComplete = function (fieldId, matcher, options) {
        FLUIGC.autocomplete('#' + fieldId).destroy();
        FLUIGC.autocomplete('#' + fieldId, {
            source: matcher(_lotacoes, options, _cargos),
            displayKey: 'description',
            tagClass: 'tag-gray',
            maxTags:1,
            type: 'tagAutocomplete'
        });
    };

    var setup = function() {
        _cargos = cargoAutoCompleteServices.get.allCargos();
        _lotacoes = cargoAutoCompleteServices.get.allLotacoes();
        console.log(_cargos);
        console.log(_lotacoes);

    };

    var init = function () {
        setup();
        update( {filterName: "all"} );
    };

    var setCodDpto = function(cod) {
        _codDpto = cod;
    };

    var update = function(options) {
        makeAutoComplete("cargo", cargosMatcherFactoryModule.make, options);
    };
    return {
        init: init,
        update: update
    };
})();

// IIFE - Immediately Invoked Function Expression
(function ($, window, document) {
    /** The $ is now locally scoped 
    Listen for the jQuery ready event on the document */
    $(autoCompleteModule.init);

}(window.jQuery, window, document));

// CHECK IF WINDOW LOADED
window.addEventListener("load", function () {
    window.loaded = true;
});

(function listen() {
    if (window.loaded) {
        $("#departamento, #lotacao").on("fluig.autocomplete.itemRemoved", function(){
            autoCompleteModule.update ( { filterName: "all" } );
        });
    } else {
        console.log("notLoaded");
        window.setTimeout(listen, 50);
    }
})();

function setSelectedZoomItem(selectedItem) {
    if ( selectedItem.inputName == "departamento" ) {
        autoCompleteModule.update ( {filterName: "departamento", filterValue: selectedItem.codDepartamento } );
    }

    if ( selectedItem.inputName == "lotacao" ) {
        autoCompleteModule.update ( {filterName: "lotacao", filterValue: selectedItem.lotacao } );
    }
}

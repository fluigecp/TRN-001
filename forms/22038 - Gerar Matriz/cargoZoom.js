"use strict";

/**
 * @module cargoZoom
 */

var cargoZoom = (function () {
    var _filtersDescricaoCargo = "";
    var _filtersSituacaoCargo = "situacaoCargo,Ativo";
    var _filtersLotacao = "";
    var _filtersDepartamento = "";
    var lifecycle = {

        setup: function () {
            lifecycle.listeners();
        },

        logFilters: function () {
            console.log("Current filter: ", _filtersLotacao + _filtersDepartamento + _filtersDescricaoCargo + _filtersSituacaoCargo);
        },

        updateZoomFilters: function () {
            reloadZoomFilterValues('cargo', _filtersLotacao + _filtersDepartamento + _filtersDescricaoCargo + _filtersSituacaoCargo);
        },

        listeners: function () {
            $("#descricaoCargo").on("change", lifecycle.descricaoCargoFn);
            $("#situacaoCargo").on("change", lifecycle.situacaoCargoFn);
        },

        descricaoCargoFn: function () {
            _filtersDescricaoCargo = $(this).val() != "" ? 'descricaoCargo,' + $(this).val() + "," : "";
            lifecycle.logFilters();
            lifecycle.updateZoomFilters();
        },

        situacaoCargoFn: function () {
            _filtersSituacaoCargo = $(this).val() != "" ? 'situacaoCargo,' + $(this).val() + "," : "";
            lifecycle.logFilters();
            lifecycle.updateZoomFilters();
        },

        init: function () {
            lifecycle.setup();
        }
    };

    var loadEvents = function () {
        lifecycle.updateZoomFilters();
    };

    var zoomEvents = {
        listen: function (selectedItem) {
            if (selectedItem.inputName == "departamento") {
                _filtersDepartamento = 'departamento,' + selectedItem.departamento + ",";
                //reloadZoomFilterValues( 'cargo','departamento,' + selectedItem.departamento);
                _filtersLotacao = "";
                lifecycle.logFilters();
                lifecycle.updateZoomFilters();
            }

            if (selectedItem.inputName == "lotacao") {
                // autoCompleteModule.update ( {filterName: "lotacao", filterValue: selectedItem.lotacao } );
                _filtersLotacao = "lotacao," + selectedItem.lotacao + ",";
                _filtersDepartamento = "";
                lifecycle.logFilters();
                lifecycle.updateZoomFilters();
            }
        }
    };

    return {
        init: lifecycle.init,
        loadEvents: loadEvents,
        zoomEvents: zoomEvents
    }
})();


// IIFE - Immediately Invoked Function Expression
(function ($, window, document) {
    /** The $ is now locally scoped 
    Listen for the jQuery ready event on the document */
    $(cargoZoom.init);

}(window.jQuery, window, document));

// CHECK IF WINDOW LOADED
window.addEventListener("load", function () {
    window.loaded = true;
});

(function listen() {
    if (window.loaded) {
        cargoZoom.loadEvents();
    } else {
        console.log("notLoaded");
        window.setTimeout(listen, 50);
    }
})();

function setSelectedZoomItem(selectedItem) {
    cargoZoom.zoomEvents.listen(selectedItem);
}

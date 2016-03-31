/**
 * Created by filles-dator on 2016-03-27.
 */
///<reference path="./../physics/cloth.ts"/>
///<reference path="./../app.ts"/>
/// <reference path="./../lib/jquery.d.ts" />
var GuiHandler = (function () {
    function GuiHandler(app) {
        this._app = app;
        //this._cloth = cloth;
        //this.handlePropertiesChange();
        this.handleDimensionChange();
        //this.handleGravityChange();
        this.handleSelctionChange();
        //this.handleIntegrationChange();
    }
    GuiHandler.prototype.handlePropertiesChange = function () {
        var self = this;
        $('#dampingFactor').val(self._cloth.dampingFactor);
        $('#stiffnessFactor').val(self._cloth.stiffnessFactor);
        $('#dampingFactor').on('change', function () {
            self._cloth.dampingFactor = Math.max(0, Math.min(2, $('#dampingFactor').val()));
            $('#dampingFactor').val(self._cloth.dampingFactor);
        });
        $('#stiffnessFactor').on('change', function () {
            self._cloth.stiffnessFactor = Math.max(0, Math.min(1.5, $('#stiffnessFactor').val()));
            $('#stiffnessFactor').val(self._cloth.stiffnessFactor);
        });
    };
    GuiHandler.prototype.handleDimensionChange = function () {
        var self = this;
        $('#dimX').val(this._app.dimensions.x);
        $('#dimY').val(this._app.dimensions.y);
        $('#dimZ').val(this._app.dimensions.z);
        $('#dimX').on('change', function () {
            self._app.dimensions.x = Math.max(2, Math.min(500, $('#dimX').val()));
            $('#dimX').val(self._app.dimensions.x);
            self._app.regenerateSoftBox();
        });
        $('#dimY').on('change', function () {
            self._app.dimensions.y = Math.max(2, Math.min(500, $('#dimY').val()));
            $('#dimY').val(self._app.dimensions.y);
            self._app.regenerateSoftBox();
        });
        $('#dimZ').on('change', function () {
            self._app.dimensions.z = Math.max(2, Math.min(500, $('#dimZ').val()));
            $('#dimZ').val(self._app.dimensions.z);
            self._app.regenerateSoftBox();
        });
    };
    GuiHandler.prototype.handleGravityChange = function () {
        var self = this;
        $('#gravityX').val(self._cloth.gravity.x);
        $('#gravityY').val(self._cloth.gravity.y);
        $('#gravityZ').val(self._cloth.gravity.z);
        $('#gravityX').on('change', function () {
            self._cloth.gravity.x = Math.max(-100, Math.min(100, $('#gravityX').val()));
            $('#gravityX').val(self._cloth.gravity.x);
        });
        $('#gravityY').on('change', function () {
            self._cloth.gravity.y = Math.max(-100, Math.min(100, $('#gravityY').val()));
            $('#gravityY').val(self._cloth.gravity.y);
        });
        $('#gravityZ').on('change', function () {
            self._cloth.gravity.z = Math.max(-100, Math.min(100, $('#gravityZ').val()));
            $('#gravityZ').val(self._cloth.gravity.z);
        });
    };
    GuiHandler.prototype.handleSelctionChange = function () {
        var self = this;
        this._selectionMode = GuiHandler.MOVE_CLOTH;
        $('#moveCloth').addClass('active-btn');
        $('#moveCloth').click(function () {
            self._selectionMode = GuiHandler.MOVE_CLOTH;
            $('#moveCloth').addClass('active-btn');
            $('#addPin').removeClass('active-btn');
        });
        $('#addPin').click(function () {
            self._selectionMode = GuiHandler.ADD_PIM;
            $('#addPin').addClass('active-btn');
            $('#moveCloth').removeClass('active-btn');
        });
    };
    GuiHandler.prototype.handleIntegrationChange = function () {
        var self = this;
        $('#verletIntegration').addClass('active-btn');
        $('#verletIntegration').click(function () {
            self._app.integration.method = Integration.VERLET;
            $('#verletIntegration').addClass('active-btn');
            $('#rungeKuttaIntegration').removeClass('active-btn');
            $('#eulerIntegration').removeClass('active-btn');
        });
        $('#rungeKuttaIntegration').click(function () {
            self._app.integration.method = Integration.RUNGE_KUTTA_4;
            $('#rungeKuttaIntegration').addClass('active-btn');
            $('#verletIntegration').removeClass('active-btn');
            $('#eulerIntegration').removeClass('active-btn');
        });
        $('#eulerIntegration').click(function () {
            self._app.integration.method = Integration.EULER;
            $('#eulerIntegration').addClass('active-btn');
            $('#verletIntegration').removeClass('active-btn');
            $('#rungeKuttaIntegration').removeClass('active-btn');
        });
    };
    Object.defineProperty(GuiHandler.prototype, "selectionMode", {
        get: function () {
            return this._selectionMode;
        },
        enumerable: true,
        configurable: true
    });
    GuiHandler.MOVE_CLOTH = 0;
    GuiHandler.ADD_PIM = 1;
    return GuiHandler;
})();
//# sourceMappingURL=gui_handler.js.map
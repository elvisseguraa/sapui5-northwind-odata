sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, MessageToast, MessageBox) {
    "use strict";

    var _that, _oDialogCategories;

    return Controller.extend("esegura.demonorthwind1.controller.Main", {
      onInit: function () {
        this.listProducts();
        this.listInvoices();
        this.matchcodeCategories();
      },

      listProducts: function () {
        const oDataModel = this.getOwnerComponent().getModel("oDataNorthwind");
        const oModel = new sap.ui.model.json.JSONModel();
        const oPanel = this.getView().byId("panelProducts");

        oDataModel.read("/Products", {
          success: function (oData, oResponse) {
            // console.log("oData", oData);
            oModel.setData(oData.results);
            oPanel.setHeaderText(
              `${oPanel.getHeaderText()} (${oData.results.length})`
            );
          },
          error: function (oError) {
            console.log("Error", oError);
          },
        });

        this.getView().setModel(oModel, "oDataProducts");
      },

      listInvoices: function () {
        const oDataModel = this.getOwnerComponent().getModel("oDataNorthwind");
        const oModel = new sap.ui.model.json.JSONModel();
        const oPanel = this.getView().byId("panelInvoices");

        oDataModel.read("/Invoices", {
          success: function (oData, oResponse) {
            //   console.log("Data", oData);
            oModel.setData(oData.results);
            oPanel.setHeaderText(
              `${oPanel.getHeaderText()} (${oData.results.length})`
            );
          },
          error: function (oError) {
            console.log("Error", oError);
            // MessageBox.error("Error al cargar los Centros");
          },
        });

        this.getView().setModel(oModel, "oDataInvoices");
      },

      onMatchcodeCategories: function () {
        _oDialogCategories.open();
      },

      matchcodeCategories: function () {

        const model = new sap.ui.model.json.JSONModel();
        const newurl =
          "https://services.odata.org/Northwind/Northwind.svc/Categories/?";
        model.loadData(newurl, null, false, "GET", false, false, null);
        _that = this;

        const handleClose = function (oEvent) {
          var oSelectedItem = oEvent.getParameter("selectedItem");
          if (oSelectedItem) {
            _that.getView().byId("txtCategory").setValue(oSelectedItem.getTitle());
            // MessageToast.show(oSelectedItem.getTitle());
          }
          oEvent.getSource().getBinding("items").filter([]);
        };

        // Create a SelectDialog and display it; bind to the same
        // model as for the suggested items

        _oDialogCategories = new sap.m.SelectDialog("selectDialogCat", {
          title: "Categories",
          items: {
            path: "/value",
            template: new sap.m.StandardListItem({
              title: "{CategoryName}",
              active: true,
            }),
          },
          search: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oFilter = new sap.ui.model.Filter(
              "CategoryName",
              sap.ui.model.FilterOperator.Contains,
              sValue
            );
            oEvent.getSource().getBinding("items").filter([oFilter]);
          },
          confirm: handleClose,
          cancel: handleClose,
        });

        _oDialogCategories.setModel(model);
      },
    });
  }
);

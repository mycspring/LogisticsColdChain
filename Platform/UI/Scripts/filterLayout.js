﻿"use strict";

function initSelectorAndFilterLayout() {
    var selector = document.getElementById('selector');
    selector.innerHTML = getInnerHtml();
    updateFilterAndResult(Property.tableNames[0]);

    function getInnerHtml(){
        var result = '';
        $.each(Property.tableNames, function (i, tableName) {
            result += getOptionItem(tableName, Property.tableDisplayNames[i]);
        });
        return result;
    }

    function getOptionItem(value, displayValue) {
        return '<option value="' + value + '">' + displayValue + '</option>';
    }
}

function updateFilterAndResult(tableName) {
    var filter = document.getElementById('filter');
    filter.innerHTML = getInnerHtml(tableName);
    filterResult();

    function getInnerHtml(tableName) {
        var properties = Property[tableName];
        var propertiesDisplay = Property[tableName + Property.DISPLAY];
        var propertiesType = Property[tableName + Property.TYPE];
        if (!properties || !propertiesDisplay) {
            return '';
        }

        var result = '';
        $.each(properties, function (i, property) {
            result += getInputHtml(tableName + property, propertiesDisplay[i], propertiesType[i]);
        });
        return result;
    }

    function getInputHtml(id, displayText, propertyType) {
        switch (propertyType) {
            case PropertyType.STRING:
                return '<p>' + displayText + ':&nbsp;<input id="' + id + '" type="text" onchange="filterResult()"></p>';
            case PropertyType.NUMBER:
                return '<p>' + displayText + ':&nbsp;<input id="' + id + Property.NumberMin + '" type="text" onchange="filterResult()">' + '&nbsp;&nbsp;-&nbsp;&nbsp;<input id="' + id + Property.NumberMax + '" type="text" onchange="filterResult()">' + '</p>';
            default:
                return '';
        }
    }
}
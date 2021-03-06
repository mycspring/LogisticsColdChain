﻿"use strict";

var Filter = {
    endpoint: ''
}

function initEndpoint(endpoint) {
    Filter.endpoint = endpoint;
}

function filterResult() {
    var result = document.getElementById('result');
    result.innerHTML = getInnerHtml();

    function getInnerHtml() {
        var tableName = document.getElementById('selector').value
        var url = getUrl(tableName);
        var result = '';
        $.ajax({
            method: 'GET',
            url: url,
            async: false,
            success: function (data) {
                result = getTable(tableName, data.value);
            },
            error: function () {
                result = 'Sorry, we cannot get data for you now.'
            }
        });
        return result;
    }

    function getUrl(tableName) {
        return Filter.endpoint + tableName + '?' + getFilter(tableName);
    }

    function getFilter(tableName) {
        var filter = '$filter=';
        $.each(Property[tableName], function (i, property) {
            var type = Property[tableName + Property.TYPE][i];
            filter = appendFilter(filter, tableName, property, type);
        });
        if (filter.endsWith('=')) {
            return '';
        } else {
            return filter;
        }
    }

    function appendFilter(filter, tableName, property, type) {
        switch (type) {
            case PropertyType.STRING:
                return appendStringFilter(filter, tableName, property);
            case PropertyType.NUMBER:
                return appendMinMaxNumberFilter(filter, tableName, property);
            default:
                return filter;
        }
    }

    function appendStringFilter(filter, tableName, property) {
        var value = document.getElementById(tableName + property).value;
        if (!value || value === '') {
            return filter;
        }

        if (!filter.endsWith('=')) {
            filter += ' and ';
        }

        filter += 'indexof(' + property + ',\'' + value + '\') ge 0';
        return filter;
    }

    function appendMinMaxNumberFilter(filter, tableName, property) {
        var minValue = document.getElementById(tableName + property + Property.NumberMin).value;
        var maxValue = document.getElementById(tableName + property + Property.NumberMax).value;
        filter = appendNumberFilter(filter, property, minValue, 'ge');
        filter = appendNumberFilter(filter, property, maxValue, 'le');
        return filter;
    }

    function appendNumberFilter(filter, property, value, operator) {
        if (!value || value === '') {
            return filter;
        }

        if (!filter.endsWith('=')) {
            filter += ' and ';
        }

        filter += property + ' ' + operator + ' ' + value;
        return filter;
    }

    function getTable(tableName, entities) {
        var result = '<table>';
        result += getTableHeader(tableName);
        result += getTableBody(tableName, entities);
        result += '</table>';
        return result;
    }

    function getTableHeader(tableName) {
        var result = '<tr>';
        $.each(Property[tableName + Property.DISPLAY], function (_, propertyDisplay) {
            result += getTh(propertyDisplay);
        });
        result += '</tr>';
        return result;
    }

    function getTableBody(tableName, entities) {
        var result = '';
        $.each(entities, function (_, entity) {
            result += '<tr>';
            $.each(Property[tableName], function (_, property) {
                result += getTd(entity[property]);
            });
            result += '</tr>';
        });
        return result;
    }

    function getTh(name) {
        return '<th>' + name + '</th>';
    }

    function getTd(name) {
        if (name === null) {
            name = '';
        }
        return '<td>' + name + '</td>';
    }
}
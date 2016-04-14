var showGroups = function() {
    $.ajax({
        type: "GET",
        cache: false,
        url: '/group/fetch',
        data: "",
        success: function (response) {
            var html = "<span class='pure-menu-heading'>Parameters</span><ul class='pure-menu-list'>";
            $.each(response.data, function (i) {
                var name = response.data[i].name;
                var id = response.data[i].id;
                html = html + "<li class='pure-menu-item'><a id='group_" + id + "' class='pure-menu-link' onclick=chooseGroup(" + id + ")>" + name + "</a></li>";
            });
            html = html + "<li class='pure-menu-item'><a class='pure-menu-link' onclick=showAddGroup()>+</a></li></ul>";
            $('#groups').html(html);
        }
    });
}

var chooseGroup = function(groupId) {
    $('#parameters').html("");
    var gName = document.getElementById("group_" + groupId).text;

    $('#add_parameter').html("<a onclick=showAddParameter(" + groupId + ")>+ parameter of " + gName + "</a>");
    $.ajax({
        type: "GET",
        cache: false,
        url: '/instance/' + groupId,
        data: "",
        success: function (response) {
        var html = "<span class='pure-menu-heading'>" + gName + "</span><ul class='pure-menu-list'>";
        $.each(response.data, function (i) {
            var name = response.data[i].name;
            var id = response.data[i].id;
            html = html + "<li class='pure-menu-item'><a id='instance_"+ id + "' class='pure-menu-link' onclick=chooseParams(" + id + ")>" + name + "</a></li>";
        });
        html = html + "<li class='pure-menu-item'><a class='pure-menu-link' onclick=showAddGroupInstance(" + groupId + ")>+</a></li></ul>";
        $('#instances').html(html);
        }
    });
}

var chooseParams = function(instanceId) {
    var iName = document.getElementById("instance_" + instanceId).text;

    var filter = "";
    if (document.getElementById('parameter_filter') != null) {
        filter = document.getElementById('parameter_filter').value;
    }
    $.ajax({
        type: "GET",
        cache: false,
        url: '/parameters/' + instanceId,
        data: {'filter':filter},
        success: function (response) {
            var html = "<table width='100%' id='parameters_table' instanceId=" + instanceId + " class='pure-table'>" +
            "<thead><tr><th><input onchange=chooseParams(" + instanceId + ") size=30 id='parameter_filter' type='text' value='" + filter + "'></th><th></th><th></th><th>" + iName + "</th></tr></thead>";
            $.each(response.data, function (i) {
                var value = "";
                var parameterId = response.data[i].parameter.id;
                if (response.data[i].value != null) {
                    value = response.data[i].value.value;
                    id = response.data[i].value.id;
                }
                var description = "";
                if (response.data[i].parameter.description != null) {
                    description =  response.data[i].parameter.description;
                }
                var name = response.data[i].parameter.name;
                html = html + "<tr><td>" + name + "</td><td><div id='i_" +
                instanceId + "_p_" + parameterId + "'>" + value + "</div></td>" +
                "<td><a onclick=editParam(" + instanceId + "," + parameterId + ")>#</a></td><td>" + description + "</td></tr>";
            });
            html = html + "</table>";
            $('#parameters').html(html);
        }
    });
    setLink(instanceId);
}

var showAddGroup = function(){
    var html = "<form class='pure-form pure-form-stacked'>" +
    "<fieldset><legend>Add new group</legend>" +
    "<input id='addGroupName' type='text' placeholder='Group Name'>" +
    "<input id='description' type='text' placeholder='Description'>" +
    "<button type='button' onclick=saveGroup()  " +
    "class='pure-button pure-button-primary'>Save group</button>" +
    " <button type='button' onclick=clearCenterContent()  " +
        "class='pure-button pure-button-primary'>Close</button></fieldset>";
    $('#center-content').html(html);
}

var showAddGroupInstance = function(id){
    var name = document.getElementById("group_" + id).text;
    var html = "<form class='pure-form pure-form-stacked'>" +
    "<fieldset><legend>Add new instance for " + name + "</legend>" +
    "<input id='addInstanceName' type='text' placeholder='Instance Name'>" +
    "<input id='description' type='text' placeholder='Description'>" +
    "<button type='button' onclick=saveGroupInstance(" + id + ")  " +
    "class='pure-button pure-button-primary'>Save instance</button>" +
    " <button type='button' onclick=clearCenterContent()  " +
        "class='pure-button pure-button-primary'>Close</button></fieldset>";
    $('#center-content').html(html);
}

var showAddParameter = function(id){
    var name = document.getElementById("group_" + id).text;
    var html = "<form class='pure-form pure-form-stacked'>" +
    "<fieldset><legend>Add new parameter for " + name + "</legend>" +
    "<input id='parameterName' type='text' placeholder='Parameter'>" +
    "<input id='description' type='text' placeholder='Description'>" +
    "<button type='button' onclick=saveParameter(" + id + ")  " +
    "class='pure-button pure-button-primary'>Save parameter</button>" +
    " <button type='button' onclick=clearCenterContent()  " +
        "class='pure-button pure-button-primary'>Close</button></fieldset>";
    $('#center-content').html(html);
}

var clearCenterContent = function() {
    $('#center-content').html("");
}

var saveGroup = function() {
    var name = document.getElementById('addGroupName').value;
    var description = document.getElementById('description').value;
    $.ajax({
        type: "POST",
        cache: false,
        url: '/group',
        data: {'groupName':name, 'description':description},
        success: function (response) {
            if (response.result == "success") {
                showGroups();
                clearCenterContent()
            }
            else {
                alert(response);
            }
        }
    });
}

var saveGroupInstance = function(id) {
    var name = document.getElementById('addInstanceName').value;
    var description = document.getElementById('description').value;
    $.ajax({
        type: "POST",
        cache: false,
        url: '/groupInstance',
        data: {'groupInstanceName': name, 'description': description, 'groupId': id},
        success: function (response) {
            if (response.result == "success") {
                chooseGroup(id);
                clearCenterContent()
            }
            else {
                alert(response);
            }
        }
    });
}


var editParam = function(instanceId, parameterId) {
    var html = "";
    if (document.getElementById("new_value_of_i_" + instanceId + "_p_" + parameterId) != null) {
        html = document.getElementById("new_value_of_i_" + instanceId + "_p_" + parameterId).value;
    }
    else {
        var value = document.getElementById("i_" + instanceId + "_p_" + parameterId).innerHTML;
        html = "<input size=40 id='new_value_of_i_" + instanceId + "_p_" + parameterId + "' onchange=changeParameter(" + instanceId + "," + parameterId + ") value='" + value + "'>";
    }
    $('#i_' + instanceId + '_p_' + parameterId).html(html);
}

var changeParameter = function(instanceId, parameterId) {
    var newValue = document.getElementById("new_value_of_i_" + instanceId + "_p_" + parameterId).value;
    $.ajax({
            type: "POST",
            cache: false,
            url: '/setParameter',
            data: {'instanceId':instanceId, 'parameterId':parameterId, 'value': newValue},
            success: function (response) {
                if (response.result == "success") {
                    editParam(instanceId, parameterId);
                }
                else {
                    alert(response);
                }
            }
        });
}

var saveParameter = function(groupId) {
    var name = document.getElementById('parameterName').value;
    var description = document.getElementById('description').value;
    $.ajax({
            type: "POST",
            cache: false,
            url: '/addParameter',
            data: {'groupId':groupId, 'name':name, 'description': description},
            success: function (response) {
                if (response.result == "success") {
                    if (document.getElementById('parameters_table') != null) {
                        var instanceId =document.getElementById('parameters_table').getAttribute('instanceid');;
                        chooseParams(instanceId);
                    }
                    clearCenterContent()
                }
                else {
                    alert(response);
                }
            }
        });
}

var setLink = function(instanceId, name) {
    var url = "<a class='pure-button' href='" + document.URL + "parameters/" + instanceId +  + "'>" + name + " link" + "</a>";
    $('#link_for_tests').html(url);
}

$(document).ready(function () {
    $('.text').addClass('ui-widget-content ui-corner-all');
    $('div[type=header]').each(function () {
        var header = $(this);
        header.prepend($('<div class="ui-widget-header ui-corner-all">' + header.attr('header') + '</div>'))
    });

    formatModTable();
    
    $('button#add-mod').button().click(addModDialog);
    $('button#remove-mods').button().click(removeModDialog);
    $('#modify-mod-dialog').dialog({
        autoOpen: false,
        buttons: {
            Submit: function () {
                // Do any preprocessing.
                var dialog = $(this);
                
                dialog.find('fieldset .blank-field').val('');
                
                dialog.children('span.form-error').remove();
                dialog.find('fieldset .ui-state-error').removeClass('ui-state-error');
            
                // Validate that the required information was given.
                var hasErrors = false;
                var required = dialog.find('fieldset label[type=required]')
                for (var i = 0; i != required.length; i++) {
                    var label = $(required[i]);
                    var element = $('#' + label.attr('for'));
                    if (element.val() == '') {
                        element.addClass('ui-state-error blank-field');                        
                        element.val(element.attr('default'));
                        
                        if (!hasErrors) {
                            hasErrors = true;
                        }
                    }
                }
                
                if (hasErrors) {
                    dialog.prepend($('<span class="form-error">Some errors were found. Make sure you fill out all required fields.</span>'));
                    return;
                }
                
                var action = 'mods/' + ($('#modify-mod-dialog-id').val() == '' ? 'add' : 'edit');
                var form = dialog.find('form');
                form.attr('action', action);
                
                dialog.find('form').submit();
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        },
        minWidth: 500,
        modal: true
    });
    prepareDialog($('#modify-mod-dialog'));
    
    $('#remove-mod-dialog').dialog({
        autoOpen: false,
        beforeClose: function () {
            $('#remove-mod-dialog-table').children().remove();
        },
        buttons: {
            Remove: function () {
                $(this).find('form').submit();
            },
            Cancel: function () {
                $(this).dialog('close');
            }
        },
        minWidth: 500,
        modal: true,
        open: function () {
            $(this).find('#remove-mod-dialog-table tr td[col=remove] button').button({
                icons: {
                    primary: 'ui-icon-closethick'
                },
                text: false
            }).click(function () {
                $(this).closest('tr').remove();
                
                if ($(this).closest('table').children('tr').length == 0) {
                    $('#remove-mod-dialog').dialog('close');
                }
            });
        }
    });
    prepareDialog($('#remove-mod-dialog'));
});

function formatModTable() {
    $('table#mods').tooltip({
        content: function () {
            var row = $(this);
            return row.find('td[col=description]').html();
        },
        items: 'tbody tr',
        track: true
    });

    if ($('table#mods thead tr th[col=remove]').length != 0) {
        $('table#mods thead tr th[col=remove]').addClass('ui-corner-tl');
        $('table#mods tbody tr:last td[col=remove]').addClass('ui-corner-bl');
    }
    else {
        $('table#mods thead tr th[col=name]').addClass('ui-corner-tl');
        $('table#mods tbody tr:last td[col=name]').addClass('ui-corner-bl');
    }
    
    $('table#mods thead tr th:last').addClass('ui-corner-tr');
    $('table#mods tbody tr:last td:last').addClass('ui-corner-br');
    
    
    $('table#mods tbody tr td[col=remove] button').button({
        icons: {
            primary: 'ui-icon-check'
        },
        text: false
    }).click(function () {
        var checkbox = $(this);
        var row = checkbox.closest('tr');
        
        row.attr('checked', !row.attr('checked'));
    });
    
    $('table#mods tbody tr td[col=edit] button').button().click(editModDialog);
    
    $('table#mods tbody tr').hover(function () {
        var row = $(this);
        
        row.children('td').addClass('ui-state-highlight');
    },
    function () {
        var row = $(this);
        
        row.children('td').removeClass('ui-state-highlight');
    });
    
    $('table#mods tbody tr td[col=edit] button').button({
        icons: {
            primary: "ui-icon-pencil"
        },
        text: false
    });
}

function addModDialog() {
    $('#modify-mod-dialog').dialog('open');
}

function editModDialog() {
    var row = $(this).closest('tr');
    
    var id = row.children('td[col=id]').html();
    var name = row.find('td[col=name] a').html();
    var version = row.children('td[col=version]').html();
    var url = row.find('td[col=name] a').attr('href');
    var donate = row.children('td[col=donate]').html();
    var wiki = row.children('td[col=wiki]').html();
    var description = row.children('td[col=description]').html();
    
    $('#modify-mod-dialog-id').val(id).removeClass('blank-field');
    $('#modify-mod-dialog-name').val(name).removeClass('blank-field');
    $('#modify-mod-dialog-version').val(version).removeClass('blank-field');
    $('#modify-mod-dialog-url').val(url).removeClass('blank-field');
    $('#modify-mod-dialog-donate-url').val(donate).removeClass('blank-field');
    $('#modify-mod-dialog-wiki').val(wiki).removeClass('blank-field');
    $('#modify-mod-dialog-description').val(description).removeClass('blank-field');
    
    $('#modify-mod-dialog').dialog('open');
}

function removeModDialog() {
    // Find all the mods that have been selected to be removed.
    var mods = $('table#mods tbody tr[checked=checked]');
    
    if (mods.length == 0) {
        alertDialog('You must select at least one mod.');
        return;
    }
    
    mods.each(function () {
        var mod = $(this);
        var id = mod.children('td[col=id]').html();
        var name = mod.find('td[col=name] a').html();
        
        var row = $('<tr><td col="id"><input name="' + id + '" /></td><td col="remove"><button>Remove</button></td><td col="name">' + name + '</td></tr>');
        $('#remove-mod-dialog-table').append(row);
        
        row.find('input').val(id);
    });

    $('#remove-mod-dialog').dialog('open');
}

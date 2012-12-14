function escapeData(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

function prepareDialog(dialog) {
    dialog.on('dialogbeforeclose', function () {
        dialog.children('span.form-error').remove();
        dialog.find('fieldset input[type=text], form fieldset input[type=text],' +
                    'fieldset input[type=password], form fieldset input[type=password],' +
                    'fieldset textarea, form fieldset textarea').filter(':not([role=next])').val('');
        dialog.find('.form-error').removeClass('form-error');
        
        dialog.find('fieldset label').each(function () {
            var element = $(this).next();
            
            element.addClass('blank-field').val(element.attr('default'));
        });
    }).find('fieldset label').each(function () {
        var label = $(this);
        var element = $('#' + label.attr('for'));
        
        if ((element.is('input') || element.is('textarea')) && element.val() == '') {
            element.addClass('blank-field');
            
            element.attr('default', label.html());
            element.addClass('ui-widget-header');
            element.val(label.html());
            
            element.focus(function () {
                element.removeClass('ui-state-error');
                
                if (element.hasClass('blank-field')) {
                    element.val('').removeClass('blank-field');
                }
            }).blur(function () {
                element.removeClass('ui-state-error');
                
                if (element.val() == '') {
                    element.val(element.attr('default')).addClass('blank-field');
                }
            });
        }
        
        if (label.attr('type') == 'required') {
            label.html(label.html() + '*');
        }
        
        label.html(label.html() + ':');
    });
    
    if (dialog.find('fieldset label[type=required]').length != 0) {
        dialog.find('fieldset').prepend($('<span>* required field</span>'));
    }
}

function alertDialog(message, title) {
    if (title == undefined) {
        title = '';
    }

    var dialog = $('<div title="' + title + '">' +
                       message +
                   '</div>');
    
    var exit = function () {
        dialog.remove();
    }
    
    $('body').append(dialog);
    dialog.dialog({
        autoOpen: true,
        beforeClose: exit,
        buttons: {
            OK: function () {
                dialog.dialog('close');
            }
        },
        modal: true
    }).siblings('.ui-dialog-titlebar').prepend($('<span class="ui-icon ui-icon-alert" style="display: inline; float: left; margin-top: 4px;"></span>'));
}

function confirmDialog(message, ok, cancel, title) {
    if (title == undefined) {
        title = '';
    }

    var dialog = $('<div title="' + title + '">' +
                       message +
                   '</div>');
    
    $('body').append(dialog);
    dialog.dialog({
        autoOpen: true,
        beforeClose: function () {
            var state = dialog.attr('state');
            dialog.remove();
                
            if (state != 'ok' && state != 'cancel' && cancel != undefined) {
                cancel();
            }
        },
        buttons: {
            OK: function () {
                if (ok != undefined) {
                    ok();
                }
                
                dialog.attr('state', 'ok').dialog('close');
            },
            Cancel: function () {
                if (cancel != undefined) {
                    cancel();
                }
                
                dialog.attr('state', 'cancel').dialog('close');
            }
        },
        modal: true
    });
}

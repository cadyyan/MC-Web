$(document).ready(function () {
    //$.fx.speeds._default = 1000;
    
    prepareLogin();
    
    $(window).resize(function () {
        $('#content').css('min-height', $('body').height() - $('#header').outerHeight() - $('nav').outerHeight() - $().outerHeight() - 35);
    }).resize();
});

function prepareLogin() {
    if ($('#login').length != 0) {
        $('#login').click(function () {
            $('#login-dialog').dialog('open');
        
            return false;
        });

        $('#login-dialog').dialog({
            autoOpen: false,
            buttons: {
                Login: function () {
                    var username = $('#login-dialog-username');
                    if (username.val() == '') {
                        $(this).prepend($('<span class="form-error">You must give the username.</span>'));
                        username.addClass('ui-state-error');
                        return;
                    }
                
                    $(this).find('form').submit();
                }
            },
            hide: 'blind',
            position: {
                of: 'nav',
                my: 'right top',
                at: 'right bottom'
            },
            resizable: false,
            show: 'blide'
        }).bind('clickoutside', function () {
            var dialog = $(this);
            if (dialog.parent().css('display') != 'none') {
                dialog.dialog('close');
            }
        }).parent().removeClass('ui-corner-all').addClass('ui-corner-bottom')
        .css('border-top', 'none')
        .children('.ui-dialog-titlebar').remove();
        
        prepareDialog($('#login-dialog'));
    }
    else {
        $('#user').click(function () {
            $('#user-dialog').dialog('open');
            
            return false;
        });
        
        $('#user-dialog-logout').button();
        
        $('#user-dialog').dialog({
            autoOpen: false,
            hide: 'blind',
            position: {
                of: 'nav',
                my: 'right top',
                at: 'right bottom'
            },
            show: 'blind',
            resizable: false
        }).bind('clickoutside', function () {
            var dialog = $(this);
            if (dialog.parent().css('display') != 'none') {
                dialog.dialog('close');
            }
        }).parent().removeClass('ui-corner-all').addClass('ui-corner-bottom')
        .css('border-top', 'none')
        .children('.ui-dialog-titlebar').remove();
        
        prepareDialog($('#user-dialog').closest('.ui-dialog'));
    }
}

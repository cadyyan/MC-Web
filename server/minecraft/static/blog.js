$(document).ready(function () {
    $('div[type=header-wrapper]').each(function () {
        var wrapper = $(this);
        var header = wrapper.children();
        
        wrapper.width(header.width());
    });
    
    $('div.post div.title button[type=remove]').button({
        icons: {
            primary: 'ui-icon-trash'
        },
        text: false
    }).click(function () {
		var post = $(this).closest('.post');
		
        confirmDialog('Are you sure you wish to delete this post?', function () {
            var form = post.find('form');
            form.attr('action', form.attr('action') + 'remove').submit();
        });
        
        return false;
    });
    
    $('div.post div.footer button[type=edit]').button({
    	icons: {
    		primary: 'ui-icon-pencil'
    	},
    	text: false
    }).click(function () {
    	var post = $(this).closest('.post');
    	
    	post.addClass('editing');
    	
    	var titleBar = post.find('.title');
    	var title = titleBar.find('a').html();
    	var titleText = $('<input name="title" type="text" class="ui-widget-content ui-corner-all" />').val(title);
    	titleBar.prepend(titleText);
    	titleBar.find('a').addClass('ui-helper-hidden');
    	titleBar.children('button').css('display', 'none');
    	
    	var contentArea = post.find('.content');
    	var content = post.find('.content p').html();
    	var contentText = $('<textarea name="content" type="text" class="ui-widget-content ui-corner-all"></textarea>').html(content);
    	contentArea.prepend(contentText);
    	contentArea.find('p').addClass('ui-helper-hidden');
    	
    	var footer = post.find('.footer');
    	footer.children('span').addClass('ui-helper-hidden');
    	footer.children('button').css('display', 'none');
    	footer.append($('<button type="submit">Submit</button>'));
    	footer.append($('<button type="cancel">Cancel</button>'));
    	
    	setupPostEditSubmit(post, 'edit');
    	setupPostEditCancel(post);
    	
    	return false;
    });

	newPost();
    $('#post').button().click(function () {
    	$('#new-post').removeClass('ui-helper-hidden');
    });
});

function newPost() {
    var post = $('#new-post');
    
    setupPostEditTitle(post);
    setupPostEditContent(post);
    setupPostEditSubmit(post);
    setupPostEditCancel(post);
}

function setupPostEditTitle(post) {
	post.find('input[name=title]').val('Title').addClass('blank-field')
    .focus(function () {
        var element = $(this);
        
        element.removeClass('ui-state-error');
        if (element.hasClass('blank-field')) {
            element.removeClass('blank-field').val('');
        }
    }).blur(function () {
        var element = $(this);
        
        if (element.val() == '') {
            element.addClass('blank-field').val('Title');
        }
    });
}

function setupPostEditContent(post) {
	post.find('textarea[name=content]').val('Post Content').addClass('blank-field')
    .focus(function () {
        var element = $(this);
        
        element.removeClass('ui-state-error');
        if (element.hasClass('blank-field')) {
            element.removeClass('blank-field').val('');
        }
    }).blur(function () {
        var element = $(this);
        
        if (element.val() == '') {
            element.addClass('blank-field').val('Post Content');
        }
    });
}

function setupPostEditSubmit(post, addAction) {
	
	post.find('button[type=submit]').click(function () {
        // Check that everything is filled out.
        var title = post.find('input[name=title]');
        var content = post.find('textarea[name=content]');
        
        if (title.hasClass('blank-field')) {
            title.val('').removeClass('blank-field');
        }
        
        if (content.hasClass('blank-field')) {
            content.val('').removeClass('blank-field');
        }
        
        post.children('span.form-error').remove();
        
        var hasErrors = false;
        
        if (title.val() == '') {
            title.val('Title').addClass('blank-field ui-state-error');
            hasErrors = true;
        }
        
        if (content.val() == '') {
            content.val('Post Content').addClass('blank-field ui-state-error');
            hasErrors = true;
        }
        
        if (hasErrors) {
            post.prepend($('<span class="form-error">You are missing some required information.</span>'));
            return;
        }
        
        var form = post.find('form');
        if (addAction != undefined && addAction != '') {
        	form.attr('action', form.attr('action') + addAction);
        }
        
        form.submit();
    }).button();
}

function setupPostEditCancel(post) {
	post.find('button[type=cancel]').click(function () {
        confirmDialog('Are you sure you want to cancel this post?', function () {
    		post.find('.title input').val('Title');
    		post.find('.content textarea').val('Post Content')
            post.addClass('ui-helper-hidden');
        });
    }).button();
}

$.extend(
{
    setAjaxForm: function(formID, callback)
    {
        form = $(formID); 

        var options = 
        {
            target  : null,
            timeout : 30000,
            dataType:'json',
            
            success: function(response)
            {
                $.enableForm(formID);
                var submitButton = $(formID).find(':input[type=submit], .submit');

                /* The response is not an object, some error occers, bootbox.alert it. */
                if($.type(response) != 'object')
                {
                    if(response) return bootbox.alert(response);
                    return bootbox.alert('No response.');
                }

                /* The response.result is success. */
                if(response.result == 'success')
                {
                    if(response.message && response.message.length)
                    {
                        submitButton.popover({trigger:'manual', content:response.message, placement:'right'}).popover('show');
                        submitButton.next('.popover').addClass('popover-success');
                        function distroy(){submitButton.popover('destroy')}
                        setTimeout(distroy,2000);
                    }

                    if($.isFunction(callback)) return callback(response);

                    if($('#responser').length && response.message && response.message.length)
                    {
                        $('#responser').html(response.message).addClass('red f-12px').show().delay(3000).fadeOut(100);
                    }

                    if(response.locate) 
                    {
                        return setTimeout(function(){location.href = response.locate;}, 1200);
                    }

                    return true;
                }

                /**
                 * The response.result is fail. 
                 */

                /* The result.message is just a string. */
                if($.type(response.message) == 'string')
                {
                    if($('#responser').length == 0)
                    {
                        submitButton.popover({trigger:'manual', content:response.message, placement:'right'}).popover('show');
                        submitButton.next('.popover').addClass('popover-danger');
                        function distroy(){submitButton.popover('destroy')}
                        setTimeout(distroy,2000);
                    }
                    $('#responser').html(response.message).addClass('red f-12px').show().delay(5000).fadeOut(100);
                }

                /* The result.message is just a object. */
                if($.type(response.message) == 'object')
                {
                    $.each(response.message, function(key, value)
                    {
                        /* Define the id of the error objecjt and it's label. */
                        var errorOBJ   = '#' + key;
                        var errorLabel =  key + 'Label';

                        /* Create the error message. */
                        var errorMSG = '<span id="'  + errorLabel + '" for="' + key  + '"  class="red">';
                        errorMSG += $.type(value) == 'string' ? value : value.join(';');
                        errorMSG += '</span>';

                        /* Append error message, set style and set the focus events. */
                        $('#' + errorLabel).remove(); 
                        $(errorOBJ).parent().append(errorMSG);
                        $(errorOBJ).css('margin-bottom', 0);
                        $(errorOBJ).css('border-color','#953B39')
                        $(errorOBJ).change(function()
                        {
                            $(errorOBJ).css('margin-bottom', 0);
                            $(errorOBJ).css('border-color','')
                            $('#' + errorLabel).remove(); 
                        });
                    })

                    /* Focus the first error field thus to nitify the user. */
                    var firstErrorField = $('#' +$('span.red').first().attr('for'));
                    topOffset = parseInt(firstErrorField.offset().top) - 20;   // 20px offset more for margin.

                    /* If there's the navbar-fixed-top element, minus it's height. */
                    if($('.navbar-fixed-top').size())
                    {
                        topOffset = topOffset - parseInt($('.navbar-fixed-top').height());
                    }
                    
                    /* Scroll to the error field and foucus it. */
                    $(document).scrollTop(topOffset);
                    firstErrorField.focus();
                }

                if($.isFunction(callback)) return callback(response);
            },

            /* When error occers, alert the response text, status and error. */
            error: function(jqXHR, textStatus, errorThrown)
            {
                $.enableForm(formID);
                if(textStatus == 'timeout')
                {
                    bootbox.alert(v.lang.timeout);
                    return false;
                }
                bootbox.alert(jqXHR.responseText + textStatus + errorThrown);
            }
        };

        /* Call ajaxSubmit to sumit the form. */
        form.submit(function()
        { 
            $.disableForm(formID);
            $(this).ajaxSubmit(options);
            return false;    // Prevent the submitting event of the browser.
        });
    },

    /* Switch the label and disabled attribute for the submit button in a form. */
    setSubmitButton: function(formID, action)
    {
        var submitButton = $(formID).find(':submit');

        label    = submitButton.val();
        loading  = submitButton.data('loading');
        disabled = action == 'disable';

        submitButton.attr('disabled', disabled);
        submitButton.val(loading);
        submitButton.data('loading', label);
    },

    /* Disable a form. */
    disableForm: function(formID)
    {
        $.setSubmitButton(formID, 'disable');
    },
    
    /* Enable a form. */
    enableForm: function(formID)
    {
        $.setSubmitButton(formID, 'enable');
    }
});

$.extend(
{
    /**
     * Set ajax loader.
     * 
     * Bind click event for some elements thus when click them, 
     * use $.load to load page into target.
     *
     * @param string selector
     * @param string target
     * @param funtion callback
     */
    setAjaxLoader: function(selector, target, callback)
    {
        var target = $(target);
        if(!target.size()) return false;

        $(document).on('click', selector, function()
        {
            url = $(this).attr('href');
            if(!url) url = $(this).data('rel');
            if(!url) return false;

            target.load(url, callback);

            return false;
        });
    },

    /**
     * Set ajax jsoner.
     *
     * @param string   selector
     * @param object   callback
     */
    setAjaxJSONER: function(selector, callback)
    {
        $(document).on('click', selector, function()
        {
            /* Try to get the href of current element, then try it's data-rel attribute. */
            url = $(this).attr('href');
            if(!url) url = $(this).data('rel');
            if(!url) return false;
            
            $.getJSON(url, function(response)
            {
                /* If set callback, call it. */
                if($.isFunction(callback)) return callback(response);

                /* If the response has message attribute, show it in #responser or alert it. */
                if(response.message)
                {
                    if($('#responser').length)
                    {
                        $('#responser').html(response.message);
                        $('#responser').addClass('text-info f-12px');
                        $('#responser').show().delay(3000).fadeOut(100);
                    }
                    else
                    {
                        bootbox.alert(response.message);
                    }
                }

                /* If the response has locate param, locate the browse. */
                if(response.locate) return location.href = response.locate;

                /* If target and source returned in reponse, update target with the source. */
                if(response.target && response.source)
                {
                    $(response.target).load(response.source);
                }
            });

            return false;
        });
    },

    /**
     * Set ajax deleter.
     * 
     * @param  string $selector 
     * @access public
     * @return void
     */
    setAjaxDeleter: function (selector)
    {
        $(document).on('click', selector, function()
        {
            if(confirm(v.lang.confirmDelete))
            {
                var deleter = $(this);
                deleter.text(v.lang.deleteing);

                $.getJSON(deleter.attr('href'), function(data) 
                {
                    if(data.result == 'success')
                    {
                        if(deleter.parents('#ajaxModal').size()) return $.reloadAjaxModal(1200);
                        if(data.locate) return location.href = data.locate;
                        return location.reload();
                    }
                    else
                    {
                        alert(data.message);
                    }
                });
            }
            return false;
        });
    },

    /**
     * Set reload deleter.
     * 
     * @param  string $selector 
     * @access public
     * @return void
     */
    setReloadDeleter: function (selector)
    {
        $(document).on('click', selector, function()
        {
            if(confirm(v.lang.confirmDelete))
            {
                var deleter = $(this);
                deleter.text(v.lang.deleteing);

                $.getJSON(deleter.attr('href'), function(data) 
                {
                    if(data.result == 'success')
                    {
                        var table     = $(deleter).closest('table');
                        var replaceID = table.attr('id');

                        table.wrap("<div id='tmpDiv'></div>");
                        $('#tmpDiv').load(document.location.href + ' #' + replaceID, function()
                        {   
                            $('#tmpDiv').replaceWith($('#tmpDiv').html());
                            if(typeof sortTable == 'function')
                            {   
                                sortTable(); 
                            }   
                            else
                            {   
                                $('.colored').colorize();
                                $('tfoot td').css('background', 'white').unbind('click').unbind('hover');
                            }   
                        });
                    }
                    else
                    {
                        alert(data.message);
                    }
                });
            }
            return false;
        });
    },

    /**
     * Set reload.
     * 
     * @param  string $selector 
     * @access public
     * @return void
     */
    setReload: function (selector)
    {
        $(document).on('click', selector, function()
        {
            var reload = $(this);
            $.getJSON(reload.attr('href'), function(data) 
            {
                if(data.result == 'success')
                {
                    var table     = $(reload).closest('table');
                    var replaceID = table.attr('id');

                    table.wrap("<div id='tmpDiv'></div>");
                    $('#tmpDiv').load(document.location.href + ' #' + replaceID, function()
                    {   
                        $('#tmpDiv').replaceWith($('#tmpDiv').html());
                        if(typeof sortTable == 'function')
                        {   
                            sortTable(); 
                        }   
                        else
                        {   
                            $('.colored').colorize();
                            $('tfoot td').css('background', 'white').unbind('click').unbind('hover');
                        }   
                    });
                }
                else
                {
                    alert(data.message);
                }
            });
            return false;
        });
    },

    /**
     * Add ajaxModal container if there's an <a> tag with data-toggle=modal.
     * 
     * @access public
     * @return void
     */
    setAjaxModal: function()
    {
        if($('a[data-toggle=modal]').size() == 0) return false;

        /* Addpend modal div. */
        $('<div id="ajaxModal" class="modal fade"></div>').appendTo('body');

        /* Set the data target for modal. */
        $('a[data-toggle=modal]').attr('data-target', '#ajaxModal');

        $('a[data-toggle=modal]').click(function()
        {
            var $e = $(this);
            $('#ajaxModal').load($e.attr('href'),function()
            {
                /* Set the width of modal dialog. */
                if($e.data('width'))
                {
                    var modalWidth = parseInt($e.data('width'));
                    $(this).data('width', modalWidth).find('.modal-dialog').css('width', modalWidth);
                }
            });

            /* Save the href to rel attribute thus we can save it. */
            $('#ajaxModal').attr('rel', $(this).attr('href'));
        });
    },

    /**
     * Reload ajax modal.
     *
     * @param int duration 
     * @access public
     * @return void
     */
    reloadAjaxModal: function(duration)
    {
       if(typeof(duration) == 'undefined') duration = 1000;
       setTimeout(function(){$('#ajaxModal').load($('#ajaxModal').attr('rel'), function(){$(this).find('.modal-dialog').css('width', $(this).data('width'))})}, duration);
    }
});

/**
 * Resize image's max width and max height to made it center and middle.
 *
 * @param   int   maxWidth
 * @param   int   maxHeight
 * @return void
 */
 
(function($) 
{
    jQuery.fn.resizeImage = function(maxWidth, maxHeight)
    { 
        container = $(this).parent();
        parentWidth  = parseInt(container.width());
        parentHeight = parseInt(container.height());

        if(isNaN(maxWidth)) maxWidth   = parentWidth;
        if(isNaN(maxHeight)) maxHeight = parentHeight;
        
        $(this).css('max-width',  maxWidth);
        $(this).css('max-height', maxHeight);

        return true;
    };
})(jQuery);

/**
 * Create link. 
 * 
 * @param  string $moduleName 
 * @param  string $methodName 
 * @param  string $vars 
 * @param  string $viewType 
 * @access public
 * @return string
 */
function createLink(moduleName, methodName, vars, viewType)
{
    if(!viewType) viewType = config.defaultView;
    if(vars)
    {
        vars = vars.split('&');
        for(i = 0; i < vars.length; i ++) vars[i] = vars[i].split('=');
    }
    if(config.requestType == 'PATH_INFO')
    {
        link = config.webRoot + moduleName + config.requestFix + methodName;
        if(vars)
        {
            if(config.pathType == "full")
            {
                for(i = 0; i < vars.length; i ++) link += config.requestFix + vars[i][0] + config.requestFix + vars[i][1];
            }
            else
            {
                for(i = 0; i < vars.length; i ++) link += config.requestFix + vars[i][1];
            }
        }
        link += '.' + viewType;
    }
    else
    {
        link = config.router + '?' + config.moduleVar + '=' + moduleName + '&' + config.methodVar + '=' + methodName + '&' + config.viewVar + '=' + viewType;
        if(vars) for(i = 0; i < vars.length; i ++) link += '&' + vars[i][0] + '=' + vars[i][1];
    }
    return link;
}

/**
 * Set required fields, add star class to them.
 *
 * @access public
 * @return void
 */
function setRequiredFields()
{
    if(!config.requiredFields) return false;
    requiredFields = config.requiredFields.split(',');
    for(i = 0; i < requiredFields.length; i++)
    {
        $('#' + requiredFields[i]).closest('td,th').prepend("<div class='required required-wrapper'></div>");
        var colEle = $('#' + requiredFields[i]).closest('[class*="col-"]');
        if(colEle.parent().hasClass('form-group')) colEle.addClass('required');
    }
}

/**
 * Set language.
 * 
 * @access public
 * @return void
 */
function selectLang(lang)
{
    $.cookie('lang', lang, {expires:config.cookieLife, path:config.webRoot});
    location.href = removeAnchor(location.href);
}

/**
 * Remove anchor from the url.
 * 
 * @param  string $url 
 * @access public
 * @return string
 */
function removeAnchor(url)
{
    pos = url.indexOf('#');
    if(pos > 0) return url.substring(0, pos);
    return url;
}

/**
 * Ping to keep login 
 * 
 * @access public
 * @return void
 */
function ping()
{
    $.get(createLink('misc', 'ping'));
}
needPing = true;
if(config.runMode != 'admin') needPing = false;

/**
 * Set 'go to top' button
 * 
 * @access public
 * @return void
 */
function setGo2Top()
{
    if(!$('#go2top').length) return;

    $(window).scroll(function()
    {
        var btn     = $('#go2top');
        var parent  = btn.closest('.page-container');
        var sTop    = $(window).scrollTop();

        if(sTop < 100) btn.hide(); else btn.show();

        btn.css('bottom', Math.max(60, parent.offset().top + parent.height() - sTop - $(window).height() + 60));
    }).scroll();

    $('#go2top').tooltip({container: 'body', placement: 'left'})
        .click(function(){$('body,html').animate({scrollTop:0},400); return false;});
 }

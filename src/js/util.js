/**
 * --------------------------------------------------------------------------
 * Figuration (v4.4.1): util.js
 * This is a stripped down version for only what is used with the player.
 *
 * Licensed under MIT (https://github.com/cast-org/figuration/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ($) {
    'use strict';

    // =====
    // Private util helpers
    // =====

    /* eslint-disable-next-line no-extend-native */
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    // =====
    // Mutation Helper
    // =====

    // Not available in IE 10-, need a polyfill
    var CFW_MutationObserverTest = (function () {
        return 'MutationObserver' in window ? window.MutationObserver : false;
    }());
    var CFW_mutationObserver = CFW_MutationObserverTest;

    var CFW_mutationObserved = function (records, $node) {
        if (!MutationObserver) { return; }
        var $target = $(records[0].target);
        if ($target.is($node)) { return; } // Ignore elements own mutation
        var $parent = $target.parents('[data-cfw-mutate]').first();
        $parent.triggerHandler('mutate.cfw.mutate');
    };

    $.fn.CFW_mutateTrigger = function () {
        this.find('[data-cfw-mutate]').each(function () {
            $(this).triggerHandler('mutate.cfw.mutate');
        });
        return this;
    };

    $.fn.CFW_mutationIgnore = function () {
        if (!CFW_mutationObserver) { return this; }
        this.each(function () {
            var elmObserver = $(this).data('cfw-mutationobserver');
            if (typeof elmObserver !== 'undefined') {
                elmObserver.disconnect();
            }
            $(this).removeData('cfw-mutationobserver')
                .off('mutated.cfw.mutate');
        });
        return this;
    };

    $.fn.CFW_mutationListen = function () {
        if (!CFW_mutationObserver) { return this; }

        this.CFW_mutationIgnore();

        this.each(function () {
            var $node = this;
            var elmObserver = new MutationObserver(function (records) {
                CFW_mutationObserved(records, $node);
            });
            elmObserver.observe(
                this, {
                attributes: true,
                childList: true,
                characterData: false,
                subtree: true,
                attributeFilter: [
                    'style',
                    'class'
                ]
            }
            );

            // Don't pass node so that this can force a mutation observation
            $(this).data('cfw-mutationobserver', elmObserver)
                .on('mutated.cfw.mutate', CFW_mutationObserved);
            /*
                .on('mutated.cfw.mutate', function(e) {
                    CFW_mutationObserved(e, $node);
                });
            */
        });
        return this;
    };

    // =====
    // Public Utils
    // =====

    $.fn.CFW_getID = function (prefix) {
        var $node = $(this);
        var nodeID = $node.attr('id');
        var MAX_ID = 1000000;
        if (typeof nodeID === 'undefined') {
            do {
                /* eslint-disable-next-line no-bitwise */
                nodeID = prefix + '-' + ~~(Math.random() * MAX_ID); // "~~" acts like a faster Math.floor() here
            } while (document.getElementById(nodeID));
            $node.attr('id', nodeID);
        }
        return nodeID;
    };

    $.fn.CFW_trigger = function (eventName, extraData) {
        var e = $.Event(eventName);
        if ($.isPlainObject(extraData)) {
            e = $.extend({}, e, extraData);
        }
        $(this).trigger(e);
        if (e.isDefaultPrevented()) {
            return false;
        }
        return true;
    };

    $.fn.CFW_parseData = function (name, object) {
        var parsedData = {};
        var $node = $(this);
        var data = $node.data();
        name = name.capitalize();

        for (var prop in object) {
            if (Object.prototype.hasOwnProperty.call(object, prop)) {
                var propName = prop.capitalize();
                if (typeof data['cfw' + name + propName] !== 'undefined') {
                    parsedData[prop] = data['cfw' + name + propName];
                }
            }
        }
        return parsedData;
    };

    $.CFW_controlEnable = function (element) {
        $(element)
            .removeClass('disabled')
            .removeAttr('tabindex')
            .removeAttr('disabled')
            .closest('label')
            .removeClass('disabled');
    };

    $.CFW_controlDisable = function (element) {
        var $control = $(element);

        if ($control.length && /button|fieldset|input|optgroup|option|select|textarea/i.test($control[0].tagName)) {
            $control.prop('disabled', true);
            $control
                .closest('label')
                .addClass('disabled');
        } else {
            $control.addClass('disabled').attr('tabindex', -1);
        }
    };

    $.CFW_isDisabled = function (element) {
        if (element instanceof jQuery) {
            element = element[0];
        }
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return true;
        }
        if (/^(button|input|select|textarea)$/i.test(element.nodeName)) {
            var fieldset = $(element).closest('fieldset')[0];
            if (fieldset && fieldset.disabled) {
                return true;
            }
        }
        if (element.classList.contains('disabled')) {
            return true;
        }
        if (typeof element.disabled === 'boolean') {
            return element.disabled;
        }
        return element.hasAttribute('disabled');
    };
}(jQuery));

; (function ($) {
	var defaultSetting = {
		'srcFolder': 'src/',
		'apiRoot': ''
	};
	var setting = {};

	var src = {};
	var pageDataElement = {};
	var pageElementData = {};
	var runningMonitor = {
		'currentLoading': 0
	};

	$.fn.simpleWeb = function () {
		var method = arguments[0];
		var parameter = arguments[1];
		if (publicMethods[method]) {
			method = publicMethods[method];
		} else if (typeof (method) === 'object' || !method) {
			parameter = method;
			method = publicMethods.init;
		} else {
			$.error('Method ' + method + ' does not exist.');
			return this;
		}
		method.call(this, parameter);
		return this;
	}

	var publicMethods = {
		setup: function (option) {
			setting = $.extend({}, defaultSetting, option);
		},
		init: function () {
			var page;
			var paras = privateMethods.getHrefParameters();
			if (paras.length === 0) {
				page = 'Index'
			}
			else {
				page = paras[0];
			}
			publicMethods.getHtml(page);
		},
		getHtml: function (path) {
			if (htmlSrc[path]) {

			}
			else {
				privateMethods.loadStatic(path);
			}
		}
	};

	var privateMethods = {
		getHrefParameters: function () {
			var href = $(location).attr("href");
			return href.split('?')[1].split('/');
		},
		getSrc: function (path) {
			privateMethods.loadStatic(path);
		},
		loadStatic: function (path) {
			privateMethods.startLoad();
			$.ajax({
				url: path,
				type: 'GET',
				success: function (ret) {
					privateMethods.endLoad();
				},
				error: function () {
					privateMethods.endLoad();
					$.error('URL ' + path + ' could not be load.');
				}
			})
		},
		startLoad: function () {
			runningMonitor.currentLoading++;
		},
		endLoad: function () {
			runningMonitor.currentLoading--;
		}
	};
})(jQuery);

; (function ($) {
	var defaultSetting = {
		'pageFolder': 'src/pages/',
		'pageExt': '.json',
		'apiRoot': ''
	};
	var setting = {};

	var src = {
		pages: {}
	};
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
			var paras = privateMethods.getHrefParameters();
			privateMethods.setPage(paras[0], $('body'));
		}
	};

	var privateMethods = {
		getHrefParameters: function () {
			var href = $(location).attr("href");
			var hrefs = href.split('?');
			if (hrefs.length < 2) {
				return ['Index'];
			}
			hrefs = hrefs[1].split('/');
			var paras = [];
			for (var i = 0; i < hrefs.length; i++) {
				if (hrefs[i].trim().length > 0) {
					paras.push(hrefs[i]);
				}
			}
			if (paras.length === 0) {
				return ['Index'];
			}
			return paras;
		},
		getUrlFromPath: function (path, prefix, postfix) {
			var url = prefix;
			var paths = path.split('.');
			for (var i = 0; i < paths.length; i++) {
				if (!(/^[A-Z]+$/.test(paths[i].charAt(0)))) {
					break;
				}
				url = url + paths[i].charAt(0).toLowerCase() + paths[i].substr(1);
			}
			return url + postfix;
		},
		load: function (url, type, sucMethod, errMethod) {
			privateMethods.startLoad();
			$.ajax({
				url: url,
				type: type,
				success: function (ret) {
					privateMethods.endLoad();
					sucMethod.call(null, ret);
				},
				error: function () {
					privateMethods.endLoad();
					errMethod.call();
					$.error('URL ' + url + ' could not be load.');
				}
			})
		},
		explodePage: function (json) {
			for (var i = 0; i < json.elements.length; i++) {

			}
		},//DOING
		setPage: function (path, ele) {
			if (src.pages[path]) {
				ele.text(src.pages[path].test);//REMOVE
			}
			var url = privateMethods.getUrlFromPath(path, setting.pageFolder, setting.pageExt);
			privateMethods.load(url, 'GET', function (ret) {
				src.pages[path] = ret;

				ele.text(src.pages[path].test);//REMOVE
			}, function () { });
		},//DOING
		getData: function (url) { },//TODO
		startLoad: function () {
			runningMonitor.currentLoading++;
		},//TODO
		endLoad: function () {
			runningMonitor.currentLoading--;
		}//TODO
	};
})(jQuery);

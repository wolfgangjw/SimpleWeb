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
			privateMethods.getPage(paras[0]);
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
				url = url + '/' + paths[i].charAt(0).toLowerCase() + paths[i].substr(1);
			}
			return url + postfix;
		},
		getData: function (url) { },//TODO
		getPage: function (path) {
			if (src.pages[path]) {
				return src.pages[path];
			}
			var url = privateMethods.getUrlFromPath(path, setting.pageFolder, setting.pageExt);
			privateMethods.loadStatic(url, function (ret) {
				src.pages[path] = ret;
			}, function () {
			});
		},//DOING
		getSrc: function (path) {
			if (src[path] != null) {
				return src[path];
			}
			return privateMethods.loadStatic(path);
		},//TODO
		loadStatic: function (url, sucMethod, errMethod) {
			privateMethods.startLoad();
			$.ajax({
				url: url,
				type: 'GET',
				success: function (ret) {
					sucMethod.call(null, ret);
					privateMethods.endLoad();
				},
				error: function () {
					errMethod.call();
					privateMethods.endLoad();
					$.error('URL ' + url + ' could not be load.');
				}
			})
		},//TODO
		startLoad: function () {
			runningMonitor.currentLoading++;
		},//TODO
		endLoad: function () {
			runningMonitor.currentLoading--;
		}//TODO
	};
})(jQuery);

var QueryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
}();

window.locale = { _current: 'en' };

locale.current = function(_) {
    if (!arguments.length) return locale._current;
    if (locale[_] !== undefined) locale._current = _;
    else if (locale[_.split('-')[0]]) locale._current = _.split('-')[0];
    else if (locale[_.split('_')[0]]) locale._current = _.split('_')[0];
    return locale;
};

locale.init = function() {
  loc = null;
  var windowLoc = window.location.pathname;
  for (prop in locale) {
    if (typeof(prop) == 'string' && prop.length == 2 && locale.hasOwnProperty(prop)) {
      var token = '/' + prop;
      if (windowLoc.startsWith(token + '/') || windowLoc == token) {
        loc = prop;
        break;
      }
    }
  }
  if (loc == null) {
    if (QueryString.locale !== undefined)
      loc = QueryString.locale;
    else {
      var language = window.navigator.userLanguage || window.navigator.language;
      loc = language;
    }
  }
  if (loc == null || loc == '')
    loc = 'en';
  return locale.current(loc);
}

window.t = function(s, o, loc) {
    loc = loc || locale._current;
    if (!s) return s;

    var path = s.split(".").reverse(),
        rep = locale[loc];

    while (rep !== undefined && path.length) rep = rep[path.pop()];

    if (rep !== undefined) {
        if (o) for (var k in o) rep = rep.replace('{' + k + '}', o[k]);
        return rep;
    } else {
        function missing() {
            var missing = s.replace(/_/g, " ");
            //if (typeof console !== "undefined") console.error(missing);
            return missing;
        }

        if (loc !== 'en') {
            missing();
            return t(s, o, 'en');
        }

        if (o && 'default' in o) {
            return o['default'];
        }

        if (/\s/.exec(s) || !/\./.exec(s)) {
            return s
        }

        return toTitleCase(s.split(".").pop());
    }

    function toTitleCase(s) {
        s = s || "";
        return s.replace(/_/g, " ").replace(/(^[a-z])|(\s[a-z])/g, function(s) { return s.toUpperCase(); });
    }
}

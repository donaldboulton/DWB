! function() {
  function n() {
   function n() {
    var n = o.apply(null, arguments);
    return a.push(n), n
   }

   function e(n) {
    var e = a.map(function(e) {
     return e.run(n)
    });
    return Promise.all(e)
   }

   function t() {
    a.forEach(function(n) {
     n._shell.terminate()
    }), a.length = 0
   }

   function r() {
    return a
   }

   function o(n, e) {
    e = e || [];
    var t = e.map(function(n) {
     return "self." + n.name + "=" + n.method.toString() + ";"
    });
    t = t.concat(["self.onmessage=", n.toString(), ";"]);
    var r = new Blob(t, {
      type: "text/javascript"
     }),
     o = URL.createObjectURL(r);
    return {
     _shell: function() {
      var n = new Worker(o);
      return URL.revokeObjectURL(o), n
     }(),
     run: function(n) {
      return u(this._shell, n)
     },
     terminate: function() {
      return i(this)
     }
    }
   }

   function u(n, e) {
    e = e || {}, n.postMessage(e);
    var t = new Promise(function(e, t) {
     n.onmessage = e, n.onerror = t
    });
    return t
   }

   function i(n) {
    return a.splice(a.indexOf(n), 1), n._shell.terminate()
   }
   var a = [];
   return {
    create: n,
    runAll: e,
    terminateAll: t,
    list: r
   }
  }
  "undefined" != typeof module && module.exports ? module.exports = n : window.$worker = n
 }();
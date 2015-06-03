class Router {
  constructor () {
    this._routes  = [];
    this._root    = '/';

    window.addEventListener("hashchange", () => {
      this.listen();
    }, false);

    window.addEventListener('load', function(e) {
      this.check();
    });
  }


  /*
    getFragment:
    gets the current URL fragment from browser
   */

  getFragment () {
    let frag;
    let match;

    match = window.location.href.match(/#(.*)$/);
    frag  = this._clearSlashes(match ? match[1] : '');

    return frag;
  }


  /*
    clearSlashes:
    @param {String} path : the path to be cleaned up
   */

  _clearSlashes (path) {
    return path.toString().replace(/\$/, '').replace(/^\//, '');
  }


  /*
    add: associates a regexp to a handler
    @param {String} re : a regexp defining the route
    @param {Function} handler: what to do with the route
   */

  add (re, handler, isRoot=false) {
    this._routes.push({
      re: re,
      handler: handler
    });

    if (isRoot) {
      this._root = re;
    }

    return this;
  };


  /*
    remove:
    @param {Function,String} param a selector for a route to remove
   */

  remove (param) {
    let j;
    let len;
    let ref;
    let route;

    ref = this._routes;

    for (j = 0, len = ref.length; j < len; j++) {
      route = ref[j];

      if (route.handler === param || route.re.toString() === param.toString()) {
        this._routes.splice(i, 1);
        return this;
      }
    }

    return this;
  }


  /*
    flush: reinits the Router
   */

  flush () {
    this._routes = [];
    this._root = '/';
  }


  /*
    check: applies the handler for a path fragment
    (if any)

    @param {frag} the path fragment to be checked
   */

  check (frag) {
    let fragment
    let j;
    let len;
    let match;
    let ref;
    let route;

    fragment  = frag || this.getFragment();
    ref       = this._routes;

    for (j = 0, len = ref.length; j < len; j++) {
      route = ref[j];
      match = fragment.match(route.re);

      if (match) {
        match.shift();
        route.handler.apply({}, match);
        return this;
      }
    }

    AE.log("Router: no such route " + fragment + ", redirecting at index");
    this.navigate(this._root);
  }


  /*
    listen: hashchanged event listener
      retrieves the current path and applies check on it
   */

  listen () {
    if (window.location.hash !== this.current) {
      this.current = window.location.hash;
      this.check(this.current);
    }
  }


  /*
    navigate: sets up a new hash path in the browser

    @param {String} path
   */

  navigate (path) {
    path = path || '';
    window.location.href.match(/#(.*)$/);
    window.location.href = window.location.href.replace(/#(.*)$/, '') + ("#" + path);
    return this;
  }

}

export default Router = new Router();

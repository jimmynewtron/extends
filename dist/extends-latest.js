/**
 * extends
 * Author: Darlan Alves <me@darlanalv.es>
 * Built on 2013-06-12
 */

!function(a){function b(a,b){if(Object.keys)Object.keys(b).forEach(function(c){a[c]=b[c]});else{var c;for(c in b)e.call(b,c)&&(a[c]=b[c])}return a}function c(a,b,c){return function(){var d=this._super;this._super=b[a];var e=c.apply(this,arguments);return this._super=d,e}}function d(a,h){var i,j,k=!1;h?(e.call(h,"statics")&&(k=h.statics,h.statics=!1,delete h.statics),e.call(h,"constructor")&&(j=h.constructor)):h={},j||(j=function(){return this.constructor.apply(this,arguments)});var l=function(){};l.prototype=a.prototype,l.prototype.__initialize__=!1,j.prototype=new l,j.prototype.__initialize__=!0,i=a.prototype;var m,n;for(m in h)"self"!==m&&"superclass"!==m&&(n=h[m],j.prototype[m]=typeof n===g&&typeof i[m]===g&&f.test(n)?c(m,i,n):n);return j.prototype.clone=function(){return b(new this.self,this)},k&&b(j,k),j.extend=function(a){return d(this,a)},j.superclass=j.prototype.superclass=i,j.prototype.self=j,j}!function(a){a.extend=d}("object"==typeof a&&a||this);var e={}.hasOwnProperty,f=/xyz/.test(function(){xyz()})?/\b_super\b/:/.*/,g="function";a.extend=d}("object"==typeof exports&&exports||this);
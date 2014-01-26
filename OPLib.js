/**
 * OverPoweredLibrary
 */
var oplib = (function() {
	
	/**
	 * Selection of Elements
	 * @selector Selects Elements
	 * @context Selection Context
	 */
	var oplib = function(selector, context) {
		return new oplib.fn.Init(selector, context);
	};
	
	oplib.fn = oplib.prototype = {
		constructor: oplib,
		/**
		 *Initiates the calls 
		 */
		Init: function(selector, context) {
		  
		  this.elems = oplib.fn.ElementSelection(selector, context);;
		  this.context;
		  this.length;
		  return this;  
		},
		/**
		 * Adds/Removes/Polls a set attribute
		 * @param {String} type - Set/Remove/Poll
		 * @param: {String} name - Attribute name
		 * @param: {Object} property - Attribe property
		 */
		attr: function(type, name, property) {
			//TODO
		}
	};
	oplib.fn.Init.prototype = oplib.fn;
	/**
	 * Selects Elements from selector
     * @param {Object} selector
     * @param {Object} context
	 */
	oplib.fn.ElementSelection = function(selector, context) {
	    var elems;
	    if (!context) {                    //Wurde ein Context angegeben?
	        context = window.body;         //Context auf Standart setzen;
	    }
	    if (selector instanceof Node) {    //Ist selector bereits ein DOMObject?
	        elems = selector;              //Element = Selector
	    }
	    //TODO Regexausdrücke und Abfragen hinzufügen
	    
	    return elems;
	};
	
	window.OPLib = oplib;
	window.$ = oplib;
})();
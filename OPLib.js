/**
 * OverPoweredLibrary
 */
var oplib = (function() {
	var oplib = function(selector, context) {
		return new oplib.fn.Init(selector, context);
	};
	
	oplib.fn = oplib.prototype = {
		constructor: oplib,
		Init: function(selector, context) {    //Elemente ausw�hlen
		  this.elems = oplib.fn.ElementSelection(selector, context);; //Ausgew�hlte Elemente zuweisen
		  this.context;
		  this.length;
		  return this;  
		},
		attr: function(type, name, property) {
			//TODO
		}
	};

	oplib.fn.merge = function(obj, probs) {    //Objecte zusammenf�hren
	    for (var i in probs) {                 //For-schleife f�r alle Elemente in probs
	        obj[i] = probs[i];                 //Elemente aus probs obj zuweisen
	    }
	    return obj;                            //Zusammengef�hrtes obj zur�ckgeben
	};

	oplib.fn.extend = function(obj, probs) {   //Eine Funtion oder oplib.fn erweitern
	   if (arguments.length == 1) {            //Nur ein argument angegeben? -> oplib erweitern
	       props = arguments[0];               //
	       obj = this;                         //
	   }                                       
	   return this.merge(obj, probs);          //Objecte zusammenf�hren und zur�ckgeben
	};
	
	oplib.fn.Init.prototype = oplib.fn;        //oplib.fn.Init besitzt den gleichen Prototyp wie oplib
	oplib.fn.ClassRegex = /\.\w*/;              //Regex f�r Klassen Selectoren
	oplib.fn.IdRegex = /#\w*/;                 //Regex f�r ID Selectoren
	oplib.fn.HtmlTagRegex = /<\w*>/;           //Regex f�r HTML-Tag Selectoren
	oplib.fn.PossibleSelectorsRegex = /[.#<]/;      //Regex f�r alle m�glichen Selectoren
	oplib.fn.ElementSelection = function(selector, context) {  //Selectiert die Entsprechenden Elemente
	    var elems;
	    context = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(context);
	    
	    elems = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector, context);

        console.log("Selected: " + elems + " in " + context);

	    return elems;
	};

	oplib.fn.ElementSelection.prototype.DOMObjectFromSelector = function(selector, context) {
	    var elems = [];
	    
	    if (!selector) {                       //Wurde ein selector �bergeben
	        selector = document.body;          //Standart Selector = document.body
	    }
	    
	    if (!context) {                        //Wurde ein context �bergeben
	        context = document.body;           //Standart Context = document.body
	    }
	    
	    if (selector instanceof Node) {        //Ist selector bereits ein DOMObject?
            elems.push(selector);              //Element = Selector
        }
        
        else if (selector instanceof NodeList) {
            for (var i = 0; i < selector.length; i++) {
                elems.push(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector[i]));
            }
        }
        
        else if (typeof selector === "string") {                                //Ist Selector ein String, um Regexausdr�cke anzuwenden?
           if (oplib.fn.ClassRegex.test(selector)) {                            //Enth�lt selector einen Klassenausdruck?
               var _selector = "";                                              //Variable f�r .Class Selector String
               var startPos = selector.search(oplib.fn.ClassRegex);             //Position des Klassen Selectors
               _selector = selector = selector.slice(startPos + 1, selector.length);       //Klassen Selector entfernen
               startPos = _selector.search(oplib.fn.PossibleSelectorsRegex);    //Position der M�glichen weiteren Selectoren
               if (startPos != -1) {                                            //Keine weiteren Selectoren gefunden!
                   _selector = selector.slice(startPos, selector.length);       //weitere Selectoren sichern
                   selector = selector.slice(0, startPos);                      //weitere Selectoren entfernen
               }
               else {
                   _selector = "";
               }
               console.log("Processing CLASS-selector: " + selector);
               for (var i = 0; i < context[0].getElementsByClassName(selector).length; i++) {//Elemente die auf selector passen im Context w�hlen
                   elems.push(context[0].getElementsByClassName(selector)[i]);
               }
                       
               if (_selector != "") {
                   console.log("Additional Selector spezified: " + _selector);
                   elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));       //�bereinstimmende Elemente �bernehmen
               }
           }
           else if (oplib.fn.IdRegex.test(selector)) {                          //Enth�lt selector einen IDausdruck?
               var _selector = "";                                              //Variable f�r #ID Selector String
               var startPos = selector.search(oplib.fn.IdRegex);                //Position des ID Selectors
               _selector = selector = selector.slice(startPos + 1, selector.length);       //ID Selector entfernen
               startPos = _selector.search(oplib.fn.PossibleSelectorsRegex);    //Position der M�glichen weiteren Selectoren
               if (startPos != -1) {                                            //Keine weiteren Selectoren gefunden!
                   _selector = selector.slice(startPos, selector.length);       //weitere Selectoren sichern
                   selector = selector.slice(0, startPos);                      //weitere Selectoren entfernen
               }
               else {
                   _selector = "";
               }
               console.log("Processing ID-selector: " + selector);
               elems.push(document.getElementById(selector));                   //Elemente die auf selector passen in w�hlen, kann nur im gesamten document gew�hlt werden
                       
               if (_selector != "") {
                   console.log("Additional Selector spezified: " + _selector);
                   elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));//�bereinstimmende Elemente �bernehmen
               }
           }
           else if (oplib.fn.HtmlTagRegex.test(selector)) {                     //Enth�lt selector ein HtmlTag?
              //TODO HTML TAG SELECTOR
           }
        }
    
	    //TODO Regexausdr�cke und Abfragen hinzuf�gen
	    return elems;
	};
	
	oplib.fn.extend(Object.prototype, {        //Object erweitern
	   compare: function(obj1, obj2) {         //.compare
	       if (arguments.length == 1) {        //Nur ein Argument angegeben? -> Dieses Object mit Argument vergleichen
	           obj2 = arguments[0];            //
	           obj1 = this;                    //
	       };
	       var newObj = new Object();          //Neues Object, das gleiche Elemente enth�lt
	       for (var i in obj1) {               //Forschleife mit allen Elementen von abj1
	           if (obj2[i]) {                  //Element von obj1 auch in ob2?
	               if(obj1[i] == obj2[i]) {    //Elemente von obj1 und obj2 gleich
	                   newObj[i] = obj1[i];    //Elemente newObj zuordnen
	               }
	           };
	       };
	       if(arguments.length == 1) {         //Nur ein Argument angegeben? -> Object soll sich selbs ver�ndern
	           for (var i in this) {           //Alle eigenen Elemente l�schen
	               delete this[i];             //
	               
	           }
	           for (var i in newObj) {         //Gemeinsamme Elemente hinzuf�gen
	               this[i] = newObj[i];        //
	           }
	       }
	       return newObj;                      //newObj zur�ckgeben
	   },
	   merge: oplib.fn.merge,                  //Merge f�r alle Obejects freigeben
	   extend: oplib.fn.extend                 //Extend f�r alle Objecte freigeben
	});
	
	oplib.fn.extend(Array.prototype, {         //Array erweitern
	   sameElements: function(arr1, arr2) {    //.sameElements
	       if (arguments.length == 1) {        //Nur ein Argument angegeben? -> Dieses Object mit Argument vergleichen
	           arr2 = arguments[0];            //
	           arr1 = this;                    //
	       }
	       var newArr = [];                    //Neues Array, das gleiche Elemente enth�lt
	       for (var i = 0; i < arr1.length; i++) { //Forschleife mit allen Elementen von arr1
	           for (var a = 0; a < arr2.length; a++) { //Forschleife mit allen Elementen von arr2
	               console.log(arr1[i] + " -- " + arr2[a]);
	               if (arr1[i] == arr2[a]) {   //Sind gleiche Elemente in arr1 und arr2 vorhanden
	                   newArray.push(arr1[i]); //Ja, dem neuen Array hinzuf�gen
	               }
	           }
	       }
	       if(arguments.length == 1) {         //Nur ein Argument angegeben?
	          this.splice(0, this.length);     //Alle eigenen Elemente l�schen
	          for (var i = 0; i < newArr.length; i++) {    //
	              this.push(newArr[i]);        //Neue Elemente dem eigenen Array zuweisen
	          }
	       }
	       return newArr;                      //newArr zur�ckgeben
	   }
	});
	
	if (!window.console) {                     //Debugging Console - Bugfix for IE
	    window.console = {log: function(){}} ; //Erstellt leere Funktion um IE-Crash zu verhindern
	}
	
	window.OPLib = oplib;
	window.$ = oplib;
})();
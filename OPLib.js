/**
 * OverPoweredLibrary
 */
var oplib = (function() {
    var oplib = function(selector, context) {
        return new oplib.fn.Init(selector, context);
    };

    oplib.fn = oplib.prototype = {
        constructor: oplib,
        //Elemente auswählen
        Init: function(selector, context) {
            //Ausgewählte Elemente zuweisen
            var elems = oplib.fn.ElementSelection(selector, context);
            for (var i = 0; i < elems.length; i++) {
                this[i] = elems[i];
            }
            this.length = elems.length;

            return this;
        },
        //Attribut setzen
        attr: function(name, property) {
            //Wurde ein Object mit den Attributen übergeben?
            if ( typeof name === "object") {
                for (var i in name) {
                    //Attribute setzen
                    this.each(this, function(name, prop) {
                        this.setAttribute(name, prop);
                    }, [i, name[i]]);
                }
            }
            //Es wurde ein einzelnes Attribut übergeben
            else {
                //Attribut setzen
                this.each(this, function(name, prop) {
                    this.setAttribute(name, prop);
                }, [name, property]);
            }
            return this;
        },
        //Attribut entfernen
        removeAttr: function(name) {
            //Wurde ein Object mit den Attributen übergeben?
            if ( typeof name === "object") {
                if (name.length != undefined) {
                    for (var i = 0; i < name.length; i++) {
                        //Attribute entfernen
                        this.each(this, function(name) {
                            this.removeAttribute(name);
                        }, [name[i]]);
                    }
                }
                else {
                    for (var i in name) {
                        //Attribute entfernen
                        this.each(this, function(name) {
                            this.removeAttribute(name);
                        }, [i, name[i]]);
                    }
                }

            }
            //Es wurde ein einzelnes Attribut übergeben
            else {
                //Attribut entfernen
                this.each(this, function(name) {
                    this.removeAttribute(name);
                }, [name]);
            }
            return this;
        },
        //Attribut abfragen - DEPRECATED
        getAttr: function(name) {
            //Wurde ein Object mit den Attributen übergeben?
            if ( typeof name === "object") {
                this.attributes = {};

                if (name.length != undefined) {
                    for (var i = 0; i < name.length; i++) {
                        //Attribute übergeben
                        attributes[i] = this[0].getAttribute(i);
                    }
                }
                else {
                    for (var i in name) {
                        //Attribute übergeben
                        attributes[i] = this[0].getAttribute(i);
                    }
                }
                return attributes;

            }
            //Es wurde ein einzelnes Attribut übergeben
            else {
                //Attribut übergeben
                return this[0].getAttribute(name);
            }
        },
        //Attribute - DEPRECATED
        _attr: function(type, name, property) {
            if (type == "set" || type == "add") {
                return this.setAttr(name, property);
            }
            else if (type == "remove" || type == "delete") {
                return this.removeAttr(name);
            }
            else if (type == "get") {
                return this.getAttr(name);
            }
            else {
                console.log(".attr(): unknown type!");
                return this;
            }
        },
        //Klasse hinzufügen
        addClass: function(name) {
            return this.each(this, function(name) {
                var classAttr = OPLib(this).getAttr("class");
                var regex = new RegExp(name);
                //Ist die Klasse bereits gesetzt?
                if (!regex.test(classAttr)) {
                    //1 Leerzeichen nach einer Klasse
                    var end = /\s*$/;
                    classAttr = classAttr.replace(end, " " + name);
                    OPLib(this).addAttr("class", classAttr);
                }
            }, [name]);

        },
        //Klasse entfernen
        removeClass: function(name) {
            return this.each(this, function(name) {
                var classAttr = OPLib(this).getAttr("class");
                var regex = new RegExp(name);
                //Ist die Klasse überhaupt gesetzt?
                if (regex.test(classAttr)) {
                    //1 Leerzeichen nach einer Klasse
                    var replace = new RegExp("[ ]*" + name, "g");
                    classAttr = classAttr.replace(replace, "");
                    OPLib(this).setAttr("class", classAttr);
                }
            }, [name]);
        },
        //Klasse übeprüfen / zurückgeben
        hasClass: function(name) {
            //Keine Klasse angegeben: alle Klassen zurückgeben
            if (!name) {
                return this.getAttr("class").split(" ");
            }
            //Klasse angegeben: überprüfen, ob sie vorhanden ist
            else {
                return this.getAttr("class").search(name) != -1 ? true : false;
            }
        },
        css: function(name) {
            
        }
        
    };

    //Objecte zusammenführen
    oplib.fn.merge = function(obj, probs) {
        //For-schleife für alle Elemente in probs
        for (var i in probs) {
            //Elemente aus probs obj zuweisen
            obj[i] = probs[i];

        }
        //Zusammengeführtes obj zurückgeben
        return obj;

    };

    //Eine Funtion oder oplib.fn erweitern
    oplib.fn.extend = function(obj, probs) {
        //Nur ein argument angegeben? -> oplib erweitern
        if (arguments.length == 1) {
            props = arguments[0];
            obj = this;
        }
        //Objecte zusammenführen und zurückgeben
        return this.merge(obj, probs);

    };

    //Funktion in einem bestimmten Context mit verschiedenen Argumenten ausführen
    oplib.fn.each = function(obj, fn, args) {
        //Alle Argument für die Funktion durchgehen
        if (obj.length != undefined) {
            for (var i = 0; i < obj.length; i++) {
                fn.apply(obj[i], args);
            }

        }
        else {
            for (var i in obj) {
                //Funktion mit Argumenten in verschiedenen Contexten ausführen
                fn.apply(i, args);
            }
        }
        return obj;
    };

    //oplib.fn.Init besitzt den gleichen Prototyp wie oplib
    oplib.fn.Init.prototype = oplib.fn;
    //Regex für Klassen Selectoren
    oplib.fn.ClassRegex = /\.\w*/;
    //Regex für ID Selectoren
    oplib.fn.IdRegex = /#\w*/;
    //Regex für HTML-Tag Selectoren
    oplib.fn.HtmlTagRegex = /<\w*>/;
    //Regex für alle möglichen Selectoren
    oplib.fn.PossibleSelectorsRegex = /[.#<]/;

    //Selectiert die Entsprechenden Elemente
    oplib.fn.ElementSelection = function(selector, context) {
        var elems;
        //Context zuweisen
        context = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(context);
        //Gewählte Elemente zuweisen
        elems = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector, context);
        //Ausgewählte Elemente zurückgeben
        return elems;
    };

    //Wandelt einen Selector in ein DOMObject um
    oplib.fn.ElementSelection.prototype.DOMObjectFromSelector = function(selector, context) {
        var elems = [];

        //Wurde ein selector übergeben
        if (!selector) {
            //Standart Selector = document.body
            selector = document.body;

        }

        //Wurde ein context übergeben
        if (!context) {
            //Standart Context = document.body
            context = document.body;

        }

        //Ist selector bereits ein DOMObject?
        if ( selector instanceof Node) {
            //Element = Selector
            elems.push(selector);

        }
        else if ( selector instanceof NodeList) {
            for (var i = 0; i < selector.length; i++) {
                elems.push(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector[i]));
            }
        }
        //Ist Selector ein String, um Regexausdrücke anzuwenden?
        else if ( typeof selector === "string") {
            //Enthält selector einen Klassenausdruck?
            if (oplib.fn.ClassRegex.test(selector)) {
                //Variable für .Class Selector String
                var _selector = "";
                //Position des Klassen Selectors
                var startPos = selector.search(oplib.fn.ClassRegex);
                //Klassen Selector entfernen
                _selector = selector = selector.slice(startPos + 1, selector.length);
                //Position der Möglichen weiteren Selectoren
                startPos = _selector.search(oplib.fn.PossibleSelectorsRegex);
                //Weitere Selectoren gefunden!
                if (startPos != -1) {
                    //weitere Selectoren sichern
                    _selector = selector.slice(startPos, selector.length);
                    //weitere Selectoren entfernen
                    selector = selector.slice(0, startPos);
                }
                //Keine weiteren Selectoren gefunden
                else {
                    _selector = "";
                }
                //Elemente die auf selector passen im Context wählen
                for (var i = 0; i < context[0].getElementsByClassName(selector).length; i++) {
                    elems.push(context[0].getElementsByClassName(selector)[i]);
                }

                if (_selector != "") {
                    //Übereinstimmende Elemente übernehmen
                    elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
                }
            }
            //Enthält selector einen IDausdruck?
            else if (oplib.fn.IdRegex.test(selector)) {
                //Variable für #ID Selector String
                var _selector = "";
                //Position des ID Selectors
                var startPos = selector.search(oplib.fn.IdRegex);
                //ID Selector entfernen
                _selector = selector = selector.slice(startPos + 1, selector.length);
                //Position der Möglichen weiteren Selectoren
                startPos = _selector.search(oplib.fn.PossibleSelectorsRegex);
                //Weitere Selectoren gefunden!
                if (startPos != -1) {
                    //weitere Selectoren sichern
                    _selector = selector.slice(startPos, selector.length);
                    //weitere Selectoren entfernen
                    selector = selector.slice(0, startPos);
                }
                //Keine weiteren Selectoren gefunden
                else {
                    _selector = "";
                }
                //Elemente die auf selector passen in wählen, kann nur im
                // gesamten document gewählt werden
                elems.push(document.getElementById(selector));

                if (_selector != "") {
                    //Übereinstimmende Elemente übernehmen
                    elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
                }
            }
            //Enthält selector ein HtmlTag?
            else if (oplib.fn.HtmlTagRegex.test(selector)) {
                //TODO HTML TAG SELECTOR
            }
        }

        //TODO Regexausdrücke und Abfragen hinzufügen
        return elems;
    };

    //Object erweitern
    oplib.fn.extend(Object.prototype, {
        compare: function(obj1, obj2) {
            //Nur ein Argument angegeben? -> Dieses Object mit Argument
            // vergleichen
            if (arguments.length == 1) {
                obj2 = arguments[0];
                obj1 = this;
            };
            var newObj = {};
            //Forschleife mit allen Elementen von abj1
            for (var i in obj1) {
                //Element von obj1 auch in ob2?
                if (obj2[i]) {
                    //Elemente von obj1 und obj2 gleich
                    if (obj1[i] == obj2[i]) {
                        //Elemente newObj zuordnen
                        newObj[i] = obj1[i];
                    }
                };
            };
            //Nur ein Argument angegeben? -> Object soll sich selbs verändern
            if (arguments.length == 1) {
                //Alle eigenen Elemente löschen
                for (var i in this) {
                    delete this[i];

                }
                for (var i in newObj) {//Gemeinsamme Elemente hinzufügen
                    this[i] = newObj[i];
                }
            }
            return newObj;
        },
        //Merge für alle Obejects freigeben
        merge: oplib.fn.merge,
        //Extend für alle Objecte freigeben
        extend: oplib.fn.extend
    });

    //Array erweitern
    oplib.fn.extend(Array.prototype, {
        sameElements: function(arr1, arr2) {
            //Nur ein Argument angegeben? -> Dieses Object mit Argument
            // vergleichen
            if (arguments.length == 1) {
                arr2 = arguments[0];
                arr1 = this;
            }
            var newArr = [];
            //Forschleife mit allen Elementen von arr1
            for (var i = 0; i < arr1.length; i++) {
                //Forschleife mit allen Elementen von arr2
                for (var a = 0; a < arr2.length; a++) {
                    //Sind gleiche Elemente in arr1 und arr2 vorhanden
                    if (arr1[i] == arr2[a]) {
                        //Ja, dem neuen Array hinzufügen
                        newArr.push(arr1[i]);
                    }
                }
            }
            //Nur ein Argument angegeben?
            if (arguments.length == 1) {
                //Alle eigenen Elemente löschen
                this.splice(0, this.length);
                //Neue Elemente dem eigenen Array zuweisen
                for (var i = 0; i < newArr.length; i++) {
                    //Neue Elemente dem eigenen Array zuweisen
                    this.push(newArr[i]);

                }
            }
            return newArr;
        }
    });

    //Debugging Console - Bugfix for IE
    if (!window.console) {
        window.console = {
            //Erstellt leere Funktion um IE-Crash zu verhindern
            log: function() {
            }
        };

    }

    window._OPLib = window.OPLib;
    window._$ = window.$;
    window.OPLib = oplib;
    window.$ = oplib;
})();

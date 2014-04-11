/**
 * OverPoweredLibrary
 */
var oplib = (function() {
    var oplib = function(selector, context) {
        return new oplib.fn.Init(selector, context);
    };

    oplib.fn = oplib.prototype = {
        constructor: oplib,
        //Elemente ausw�hlen
        Init: function(selector, context) {
            //Ausgew�hlte Elemente zuweisen
            var elems = oplib.fn.ElementSelection(selector, context);
            for (var i = 0; i < elems.length; i++) {
                this[i] = elems[i];
            }
            this.length = elems.length;

            return this;
        },
        //Attribut setzen
        attr: function(name, property) {
            //Wurde nur 'name' �bergeben? - Attribut zur�ckgeben
            if (arguments.length == 1) {
                if (this.length != 0) {
                    return this[0].getAttribute(name);
                }
                else {
                    return this;
                }
            }

            //Wurde ein Object mit den Attributen �bergeben?
            if ( typeof name === "object") {
                for (var i in name) {
                    //Attribute setzen
                    this.each(this, function(name, prop) {
                        this.setAttribute(name, prop);
                    }, [i, name[i]]);
                }
            }
            //Es wurde ein einzelnes Attribut �bergeben
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
            //Wurde ein Object mit den Attributen �bergeben?
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
            //Es wurde ein einzelnes Attribut �bergeben
            else {
                //Attribut entfernen
                this.each(this, function(name) {
                    this.removeAttribute(name);
                }, [name]);
            }
            return this;
        },
        //Klasse hinzuf�gen
        addClass: function(name) {
            return this.each(this, function(name) {
                var classAttr = OPLib(this).getAttr("class");
                var regex = new RegExp(name);
                //Ist die Klasse bereits gesetzt?
                if (!regex.test(classAttr)) {
                    //1 Leerzeichen nach einer Klasse
                    var end = /\s*$/;
                    classAttr = classAttr.replace(end, " " + name);
                    OPLib(this).attr("class", classAttr);
                }
            }, [name]);

        },
        //Klasse entfernen
        removeClass: function(name) {
            return this.each(this, function(name) {
                var classAttr = OPLib(this).getAttr("class");
                var regex = new RegExp(name);
                //Ist die Klasse �berhaupt gesetzt?
                if (regex.test(classAttr)) {
                    //1 Leerzeichen nach einer Klasse
                    var replace = new RegExp("[ ]*" + name, "g");
                    classAttr = classAttr.replace(replace, "");
                    OPLib(this).attr("class", classAttr);
                }
            }, [name]);
        },
        //Klasse �bepr�fen / zur�ckgeben
        hasClass: function(name) {
            //Keine Klasse angegeben: alle Klassen zur�ckgeben
            if (!name) {
                return this.getAttr("class").split(" ");
            }
            //Klasse angegeben: �berpr�fen, ob sie vorhanden ist
            else {
                return this.getAttr("class").search(name) != -1 ? true : false;
            }
        },
        //Css-Attribut hinzuf�gen/bearbeiten/auslesen
        css: function(name, value, args) {
            //Werte abschlie�end anpassen
            var finalizedExpressions = this.finalizeCssExpressions(name, value, args);
            name = finalizedExpressions[0];
            value = finalizedExpressions[1];
            //Eigenschaften als Object �bergeben
            if ( typeof name === "object") {
                //Array ohne Eigenschaften - EIGENSCHAFTEN AUSLESEN
                if (name.length != undefined) {
                    var obj = {};
                    for (var i = 0; i < name.length; i++) {
                        obj[i] = this[0]["style"][name[i]];
                    }
                    return obj;
                }
                //Object mit Eigenschaften - CSS SETZEN
                else {
                    for (var i in name) {
                        this.each(this, function(name, value) {
                            this["style"][i] = value;
                        }, [i, name[i]]);
                    }
                }

            }
            //Kein Wert �bergeben -> WERT AUSLESEN
            else if (!value) {
                return this[0]["style"][name];
            }
            //Name und Wert �bergeben -> CSS SETZEN
            else {
                return this.each(this, function(name, value) {
                    this["style"][name] = value;
                }, [name, value]);
            }
            return this;
        },
        //Css-Attribute entfernen
        removeCss: function(name) {
            //Mehrere Css Werte l�schen
            if ( typeof name === "object") {
                //Als Array angegeben
                if (name.length != undefined) {
                    for (var i = 0; i < name.length; i++) {
                        this.each(this, function(name) {
                            this["style"][name] = "";
                        }, [name[i]]);
                    }
                }
                //Als Object angegeben
                else {
                    for (var i in name) {
                        this.each(this, function(name) {
                            this["style"][name] = "";
                        }, [i]);
                    }
                }
            }
            //Nur ein Css Wert l�schen
            else {
                return this.each(this, function(name) {
                    this["style"][name] = "";
                }, [name]);
            }
            return this;
        },

        //H�ngt Elemente an die �bereinstimmenden Elemente am Ende an
        append: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    this.appendChild(elems[i]);
                }
            }, [elems]);
        },
        //H�ngt Elemente an die �bereinstimmenden Elemente am Anfang an
        prepend: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    console.log( typeof this);
                    //Gibt es bereits untergeordnete Elemente?
                    if (this.hasChildNodes()) {
                        //Node
                        if (this.childNodes && this.childNodes[0] != null) {
                            this.insertBefore(elems[i], this.childNodes[0]);
                        }
                        //NodeList
                        else if (this.item && this.item(0) != null) {
                            this.insertBefore(elems[i], this.item(0));
                        }
                    }
                    //Keine untergeordneten Element ==> .appendChild m�glich
                    else {
                        this.appendChild(elems[i]);
                    }
                }
            }, [elems]);
        },
        //H�ngt Elemente vor die �bereinstimmenden Elemente an
        before: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    console.log(elems[i]);
                    this.insertBefore(elems[i], this);

                }
            }, [elems]);
        },
        //H�ngt Elemente nach die �bereinstimmenden Elemente an
        after: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    if (this.nextElementSibling != null) {
                        this.nextSibling.parentNode.insertBefore(elems[i], this.nextSibling);
                    }
                    else {
                        this.parentNode.appendChild(elems[i]);
                    }
                }
            }, [elems]);
        },
        /*
         * F�gt dem Object untergeordnete Nodes der �bereinstimmenden Elemente
         * hinzu
         * R: Rekursive suche m�glich
         * O: Enth�lt auch eigene(s) Element(e)
         */
        children: function(R, O) {
            var children = [];

            //childNodes d�rfen nicht mehr als einmal vorkommen
            var isDouble = function(arr, elem) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == elem) {
                        return true;
                    }
                }
                return false;
            };

            //Funktion die alle untergeordneten Nodes findet
            var getChildren = function(parent, children, R) {
                for (var j = 0; j < parent.children.length; j++) {
                    if (!isDouble(children, parent.children[j])) {
                        children.push(parent.children[j]);
                        //Rekursiv?
                        if (R) {
                            if (parent.children[j].children.length != 0) {
                                children = (getChildren(parent.children[j], children, R));
                            }
                        }
                    }

                }
                return children;
            };

            //F�r alle �bereinstimmenden Elemente untergeordnete Nodes finden
            for (var i = 0; i < this.length; i++) {
                children = getChildren(this[i], children, R);
            }

            //OPLib soll nur Child Nodes enthalten - Vorherige ELemente
            //l�schen
            if (!O) {
                for (var x = 0; x < this.length; x++) {
                    delete this.x;
                }
                this.length = 0;
            }
            //OPlib hinzuf�gen
            for (var i = 0; i < children.length; i++) {

                this.push(children[i]);
            }
            return this;
        },
        /* F�gt dem Object die �bergeordnete Node der �bereinstimmenden Elemente
         * hinzu
         * R: Rekursive Suche m�glich
         * rekursionLimit: Limit f�r rekursive Suche
         * O: Enth�lt auch eigene(s) Element(e)
         */
        parents: function(R, rekursionLimit, O) {
            var Parents = [];
            var topLimit;

            if (rekursionLimit && rekursionLimit.parentNode) {
                topLimit = rekursionLimit.parentNode;
            }
            else {
                topLimit = document.body;
            }

            //Parents d�rfen nicht mehr als einmal vorkommen
            var isDouble = function(arr, elem) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == elem) {
                        return true;
                    }
                }
                return false;
            };

            //F�r alle �bereinstimmenden Elemente parentNodes (rekursiv) finden.
            var getParents = function(children, parents, R) {
                for (var i = 0; i < children.length; i++) {
                    //topLimit ist die h�chste Ebene, falls rekursiv gesucht wird
                    if (!(!children[i].parentNode || (children[i].parentNode == topLimit && R))) {
                        //Keine doppelten parentNodes.
                        if (!isDouble(parents, children[i].parentNode)) {
                            //parentNode gefunden
                            parents.push(children[i].parentNode);
                            //Rekursive Suche??
                            if (R) {
                                parents = getParents([children[i].parentNode], parents, R);
                            }
                        }
                    }

                }
                //Ergebnis der Suche zur�ckgeben
                return parents;
            };
            //Ergebnis der Suche
            Parents = getParents(this, Parents, R);

            //OPLib soll nur parentNodes enthalten - Vorherige ELemente
            //l�schen
            if (!O) {
                for (var x = 0; x < this.length; x++) {
                    delete this.x;
                }
                this.length = 0;
            }
            //Parents in OPLib speichern
            for (var i = 0; i < Parents.length; i++) {
                this.push(Parents[i]);
            }
            return this;
        },
        inner: function(html) {
            return this.each(this, function() {
                this.innerHTML = html;
            }, [html]);
        },
        find: function(options) {
            //TODO: .find()
        }
    };

    //Objecte zusammenf�hren
    oplib.fn.merge = function(obj, probs) {
        //For-schleife f�r alle Elemente in probs
        for (var i in probs) {
            //Elemente aus probs obj zuweisen
            obj[i] = probs[i];

        }
        //Zusammengef�hrtes obj zur�ckgeben
        return obj;

    };

    //Eine Funtion oder oplib.fn erweitern
    oplib.fn.extend = function(obj, probs) {
        //Nur ein argument angegeben? -> oplib erweitern
        if (arguments.length == 1) {
            props = arguments[0];
            obj = this;
        }
        //Objecte zusammenf�hren und zur�ckgeben
        return this.merge(obj, probs);

    };

    //Funktion in einem bestimmten Context mit verschiedenen Argumenten ausf�hren
    oplib.fn.each = function(obj, fn, args) {
        //Alle Argument f�r die Funktion durchgehen
        if (obj.length != undefined) {
            for (var i = 0; i < obj.length; i++) {
                fn.apply(obj[i], args);
            }

        }
        else {
            for (var i in obj) {
                //Funktion mit Argumenten in verschiedenen Contexten ausf�hren
                fn.apply(i, args);
            }
        }
        return obj;
    };

    //Array Funktionen zug�nglich machen
    oplib.fn.push = Array.prototype.push;
    oplib.fn.pop = Array.prototype.pop;

    //FIXME: Sonderzeichen!!
    
    //oplib.fn.Init besitzt den gleichen Prototyp wie oplib
    oplib.fn.Init.prototype = oplib.fn;
    //Regex f�r Klassen Selectoren
    oplib.fn.ClassRegex = /\.\w*/;
    //Regex f�r ID Selectoren
    oplib.fn.IdRegex = /#\w*/;
    //Regex f�r HTML-Strings
    oplib.fn.HtmlStringRegex = /^<[\w\s="'`�]*>.*<\/\w*>$/;
    //Regex f�r HTML-Strings, die nur ein Element enthalten
    oplib.fn.HtmlStringSingleElementRegex = /^<[\w\s="'`�]*>[^<>]*<\/\w*>$/;
    //Regex f�r HTML-Tag Selectoren
    oplib.fn.HtmlTagRegex = /<(\w|\s)*>/;
    //Regex f�r alle m�glichen Selectoren
    oplib.fn.PossibleSelectorsRegex = /[.#<]/;

    //Selectiert die Entsprechenden Elemente
    oplib.fn.ElementSelection = function(selector, context) {
        var elems;
        //Context zuweisen
        context = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(context);
        //Gew�hlte Elemente zuweisen
        elems = oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector, context);
        //Ausgew�hlte Elemente zur�ckgeben
        return elems;
    };

    //Wandelt einen Selector in ein DOMObject um
    oplib.fn.ElementSelection.prototype.DOMObjectFromSelector = function(selector, context) {
        var elems = [];

        //Wurde ein selector �bergeben
        if (!selector) {
            //Standart Selector = document.body
            selector = document.body;

        }

        //Wurde ein context �bergeben
        if (!context) {
            //Standart Context = document.body
            context = document.body;

        }

        //Ist selector bereits ein DOMObject?
        if ( selector instanceof Node) {
            //Element = Selector
            elems.push(selector);

        }
        //Ist selector eine NodeList?
        else if ( selector instanceof NodeList) {
            for (var i = 0; i < selector.length; i++) {
                elems.push(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector[i]));
            }
        }
        //Ist Selector ein String, um Regexausdr�cke anzuwenden?
        else if ( typeof selector === "string") {
            //Enth�lt selector ein HTML String
            if (oplib.fn.ElementSelection.isHtmlString(selector)) {
                elems.push(oplib.fn.createDOBObeject(selector));
            }

            //Enth�lt selector einen Klassenausdruck?
            else if (oplib.fn.ClassRegex.test(selector)) {
                //Variable f�r .Class Selector String
                var _selector = "";
                //Position des Klassen Selectors
                var startPos = selector.search(oplib.fn.ClassRegex);
                //Klassen Selector entfernen
                _selector = selector = selector.slice(startPos + 1, selector.length);
                //Position der M�glichen weiteren Selectoren
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
                //Elemente die auf selector passen im Context w�hlen
                for (var i = 0; i < context[0].getElementsByClassName(selector).length; i++) {
                    elems.push(context[0].getElementsByClassName(selector)[i]);
                }

                if (_selector != "") {
                    //�bereinstimmende Elemente �bernehmen
                    elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
                }
            }
            //Enth�lt selector einen IDausdruck?
            else if (oplib.fn.IdRegex.test(selector)) {
                //Variable f�r #ID Selector String
                var _selector = "";
                //Position des ID Selectors
                var startPos = selector.search(oplib.fn.IdRegex);
                //ID Selector entfernen
                _selector = selector = selector.slice(startPos + 1, selector.length);
                //Position der M�glichen weiteren Selectoren
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
                //Elemente die auf selector passen in w�hlen, kann nur im
                // gesamten document gew�hlt werden
                elems.push(document.getElementById(selector));

                if (_selector != "") {
                    //�bereinstimmende Elemente �bernehmen
                    elems.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
                }
            }

            //Enth�lt selector ein HtmlTag?
            else if (oplib.fn.ElementSelection.onlyTag(selector)) {
                //TODO HTML TAG SELECTOR
            }
            //Wurde kein Selector erkannt?
            else {
                var elem = document.createElement("div");
                elem.innerHTML = selector;
                elems.push(elem);
            }
        }

        return elems;
    };

    //�berpr�ft ob es sich um einen HTML-String handelt
    oplib.fn.ElementSelection.isHtmlString = function(htmlString) {
        return oplib.fn.HtmlStringRegex.test(htmlString);
    };
    
    //�berpr�ft ob der HTML-String ein einzelnes Element enth�lt.
    oplib.fn.ElementSelection.singleElement = function(htmlString) {
        return oplib.fn.HtmlStringSingleElementRegex.test(htmlString);
    };

    //�berpr�ft ob der HTML-String nur aus einem Tag besteht <tag>
    oplib.fn.ElementSelection.onlyTag = function(htmlString) {
        return oplib.fn.HtmlTagRegex.test(htmlString);
    };

    //Gibt das Tag aus einem HTML-String zur�ck
    oplib.fn.ElementSelection.tag = function(htmlString) {
        return htmlString.slice(htmlString.search(/</) + 1, htmlString.search(/(>|\s+)/));
    };

    //Gibt den Text aus einem HTML-String zur�ck
    oplib.fn.ElementSelection.text = function(htmlString) {
        //HTML-Tags entfernen
        return htmlString.replace(/<[\/\w\s="'`�]*>/g, "");
    };

    //Gibt die Attribute aus einem HTML-String zur�ck
    oplib.fn.ElementSelection.attr = function(htmlString) {
        //Attribute in einem Array speichern [{name, value}]
        var attr = [];
        htmlString = htmlString.slice(htmlString.search(/</) + 1, htmlString.search(/>/)).trim();
        //Tag entfernen
        htmlString = htmlString.replace(/\w*\s/, "");

        //Attribute einteilen
        matchedAttr = htmlString.match(/\w*\s*=\s*("|'|`|�)[\w\s]*("|'|`|�)/g);

        //Keine Attribute gefunden, leeres Array zur�ckgeben
        if (!matchedAttr) {
            return attr;
        }

        //Durch gefundene Attribute gehen, und attr[] zuweisen
        for (var i = 0; i < matchedAttr.length; i++) {
            attr.push({
                name: matchedAttr[i].slice(matchedAttr[i].search(/\w*/), matchedAttr[i].search(/\s*=/)),
                value: matchedAttr[i].slice(matchedAttr[i].search(/("|'|`|�)(\w*\s*)/) + 1, matchedAttr[i].search(/("|'|`|�)\s*$/))
            });
        }
        return attr;

    };

    //Erstellt ein DOMObject anhand eines Strings
    oplib.fn.createDOBObeject = function(text) {
        //Funktioniert nur wenn der String ein einzelnes HTML-Element enth�lt
        if (oplib.fn.ElementSelection.singleElement(text)) {
            //Tag
            var elem = document.createElement(oplib.fn.ElementSelection.tag(text));
            //Text
            elem.innerHTML = oplib.fn.ElementSelection.text(text);
            //Attribute
            var attr = oplib.fn.ElementSelection.attr(text);
            for (var i = 0; i < attr.length; i++) {
                elem.setAttribute(attr[i].name, attr[i].value);
            }
            return elem;
        }
        //Funktioniert auch mit mehreren Elementen
        else {
            //TODO: .createDOMObject - mehrere Elemente
            var elem = document.createElement("div");
            elem.innerHTML = text;
            return elem;
        }

    };

    //Css Ausdr�cke (10 -> "10px" "background-color" -> "backgroundColor")
    // entsprechend anpassen
    oplib.fn.finalizeCssExpressions = function(expression, value, args) {
        //Expression
        //Bereits ein String
        if ( typeof expression === "string") {
            //Bindestriche entfernen und folgendes Zeichen gro�schreiben
            expression = expression.replace(/-([a-z]|[A-Z])/g, function(match) {
                return match[1].toUpperCase();
            });
        }

        //Wert
        //Bereits ein String
        if ( typeof value === "string") {
            //Bindestriche entfernen und folgendes Zeichen gro�schreiben
            expression = expression.replace(/-([a-z]|[A-Z])/g, function(match) {
                return match[1].toUpperCase();
            });
        }
        else if ( typeof value === "number") {
            value = value.toString();
            //"width" -> Einheit ben�tigt
            if (expression.search(/(width|height|position|origin|size|padding|margin|spacing|gap)/i)) {
                if (!args) {
                    value += oplib.fn.defaults.cssUnit;
                }
                else {
                    value += args;
                }

            }
            //"top" -> Einheit ben�tigt
            else if (expression.search(/^(top|bottom|left|rigth|flex-?basis)/i)) {
                if (!args) {
                    value += oplib.fn.defaults.cssUnit;
                }
                else {
                    value += args;
                }
            }
        }
        return [expression, value];
    };

    //Klont Elemente, etc...
    oplib.fn.finalizeDOMManipulation = function(fn, args) {
        this.each(this, function(fn, elems) {
            var clones = oplib.fn.finalizeDOMManipulation.clone(elems);
            fn.apply(this, [clones]);
        }, [fn, args[0]]);

        //Element l�schen
        this.each(args[0], function() {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
            //Element muss in DOM eingeordnet werden
            else {
                document.body.appendChild(this);
                document.body.removeChild(this);
            }
        }, []);

        return this;

    };
    //Klont Elemente        //FIXME - EVENTS
    oplib.fn.finalizeDOMManipulation.clone = function(elems) {
        if ( typeof elems === "object") {
            var clones = [];
            for (var i = 0; i < elems.length; i++) {
                var clone = elems[i].cloneNode(true);
                if (elems[i].parentNode) {
                    //elems[i].parentNode.appendChild(clone);       //Unn�tig???
                }
                else {
                    //document.body.appendChild(clone);
                }
                clones.push(clone);
            }
            return clones;
        }
        else {
            var clone = elems.cloneNode(true);
            if (elems.parentNode) {
                //elems.parentNode.appendChild(clone);
            }
            else {
                //document.body.appendChild(clone);
            }
            return [clone];
        }
    };

    //Parses JSON Data
    oplib.fn.JSON = function(json) {
        return oplib.fn.JSON.parse(json);
    };
    oplib.fn.JSON.parse = function(json) {
        //Use native Broswser Parser
        //TODO: Own Parser
        JSON.parse(json);
    };

    //Handles Ajax-Calls
    oplib.fn.AJAX = function(url, fn, header, settings) {
        var xmlhttp = new XMLHttpRequest();
        var ajaxSettings = oplib.fn.defaults.ajaxSettings;

        //Other settings than default?
        if (settings) {
            if (settings.method) {
                ajaxSettings.method = settings.method;
            }
            if (settings.async) {
                ajaxSettings.async = settings.async;
            }
            if (settings.contentType) {
                ajaxSettings.contentType = settings.contentType;
            }
            if (settings.content) {
                ajaxSettings.content = settings.content;
            }
            if (settings.connected) {
                ajaxSettings.connected = settings.connected;
            }
            if (settings.received) {
                ajaxSettings.received = settings.received;
            }
            if (settings.processing) {
                ajaxSettings.processing = settings.processing;
            }
        }

        xmlhttp = oplib.fn.AJAX.request[ajaxSettings.method](xmlhttp, url, fn, header, ajaxSettings);
        if (ajaxSettings.async == true) {
            xmlhttp = oplib.fn.AJAX.response.async(xmlhttp, fn, ajaxSettings);
        }
        else {
            xmlhttp = oplib.fn.AJAX.response.sync(xmlhttp, fn, ajaxSettings);
        }

        return this;
    };
    oplib.fn.AJAX.request = {
        get: function(xmlhttp, url, fn, header, ajaxSettings) {
            var parsedHeader = "";
            if (header) {
                if ( typeof header === "string") {
                    if (header[0] != '?' || header[0] != '&') {
                        header = "?" + header;
                    }
                    parsedHeader = header;
                }
                else {
                    for (var i = 0; i < header.length; i++) {
                        if (parsedHeader != "?") {
                            parsedHeader += ("&" + header[i].key + "=" + header[i].value);
                        }
                        else {
                            parsedHeader += (header[i].key + "=" + header[i].value);
                        }
                    }
                }
                url += parsedHeader;
            }

            xmlhttp.open("get", url, ajaxSettings.async);
            xmlhttp.send();

            return xmlhttp;
        },
        post: function(xmlhttp, url, fn, header, ajaxSettings) {
            var parsedHeader = "";

            xmlhttp.open("post", url, ajaxSettings.async);
            xmlhttp.setRequestHeader("Content-type", ajaxSettings.contentType);
            if (header) {
                if ( typeof header === "string") {
                    if (header[0] == '?') {
                        header = header.slice(1, header.length - 1);
                    }
                    parsedHeader = header;
                }
                else {
                    for (var i = 0; i < header.length; i++) {
                        if (!parsedHeader) {
                            parsedHeader = header[i].key + "=" + header[i].value;
                        }
                        else {
                            parsedHeader += "&" + header[i].key + "=" + header[i].value;
                        }

                    }
                }

            }

            xmlhttp.send(parsedHeader);

            return xmlhttp;
        }
    };
    oplib.fn.AJAX.response = {
        async: function(xmlhttp, fn, ajaxSettings) {
            if (ajaxSettings.content == "text") {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 1) {
                        ajaxSettings.connected.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 2) {
                        ajaxSettings.received.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 3) {
                        ajaxSettings.processing.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 4) {
                        fn.apply(this, [xmlhttp.responseText, xmlhttp.readystate, xmlhttp.status]);
                    }
                };
            }
            else if (ajaxSettings.content == "xml") {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 1) {
                        ajaxSettings.connected.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 2) {
                        ajaxSettings.received.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 3) {
                        ajaxSettings.processing.apply(this, [xmlhttp.readyState]);
                    }
                    else if (xmlhttp.readyState == 4) {
                        fn.apply(this, [xmlhttp.responseXML, xmlhttp.readystate, xmlhttp.status]);
                    }
                };
            }
            else {
                console.log(ajaxSettings.content + ": is not a valid contentType");
            }

            return xmlhttp;
        },
        sync: function(xmlhttp, fn, ajaxSettings) {
            if (ajaxSettings.content == "text") {
                fn.apply(this, [xmlhttp.responseText]);
            }
            else if (ajaxSettings.content == "xml") {
                fn.apply(this, [xmlhttp.responseXML]);
            }
            else {
                console.log(ajaxSettings.content + ": is not a valid contentType");
            }

            return xmlhttp;
        }
    };
    
    //Auch �ber $.AJAX aufrufbar
    oplib.AJAX = oplib.fn.AJAX;

    //Abk�rzungen f�r events
    oplib.fn.extend(oplib.fn, {
        click: function(fn) {
            return this.events("click", fn);
        },
        dblclick: function(fn) {
            return this.events("dblclick", fn);
        },
        mouseover: function(fn) {
            return this.events("mouseover", fn);
        },
        mouseout: function(fn) {
            return this.events("mouseout", fn);
        },
        hover: function(fn_over, fn_out) {
            this.events("mouseover", fn_over);
            return this.events("mouseout", fn_out);
        },
        focus: function(fn) {
            return this.events("focus", fn);
        },
        blur: function(fn) {
            return this.events("blur", fn);
        },
        change: function(fn) {
            return this.events("change", fn);
        },
        select: function(fn) {
            return this.events("select", fn);
        },
        submit: function(fn) {
            return this.events("submit", fn);
        }
    });

    //Adds Events | Dispatches Events
    oplib.fn.events = function(type, fn) {
        if (!fn) {
            return this.each(this, function(type) {
                oplib.fn.events.dispatchEvent(type, this);
            }, [type]);
        }
        else {
            return this.each(this, function(type, fn) {
                oplib.fn.events.addEvent(type, fn, this);
            }, [type, fn]);
        }

    };

    //Removes Events
    oplib.fn.removeEvents = function(type, fn) {
        return this.each(this, function(type, fn) {
            oplib.fn.events.removeEvent(type, fn, this);
        }, [type, fn]);
    };

    //Event Klasse
    oplib.fn.extend(oplib.fn.events, {
        //Wurde der GLOBALE Handler bereits f�r dieses Event gesetzt? DARF NUR
        // EINMAL GESTZT WERDEN
        handleAttached: {},
        //Listener dem globalen handler hinzuf�gen
        addEvent: function(type, fn, elem) {
            //handleAttached �berpr�fen
            if (this.handleAttached[elem] == undefined) {
                this.handleAttached[elem] = {};
            }
            if (this.handleAttached[elem][type] == undefined) {
                this.handleAttached[elem][type] = true;
                elem.addEventListener(type, oplib.fn.handler, false);
            }
            return oplib.fn.handler.addListener(type, fn, elem);
        },
        //Listener dem globalen Handler entfernen
        removeEvent: function(type, fn, elem) {
            return oplib.fn.handler.removeListener(type, fn, elem);
        },
        //Event ausf�hren
        dispatchEvent: function(e, elem) {
            if ( typeof e === "string") {
                e = new Event(e);
            }
            return elem.dispatchEvent(e);
        }
    });

    //Verarbeitet Event-Listener
    oplib.fn.handler = function(e) {
        elem = e.target;
        type = e.type;
        //Entsprechenden Listener ausf�hren
        return oplib.fn.handler.dispatchListener(type, elem, e);

    };

    //Handler Klasse
    oplib.fn.extend(oplib.fn.handler, {
        //Aufbau: handleList.element[...].type[...].{function, text, enabled}
        handleList: {},

        //Der HandleList einen neuen Listener hinzuf�gen
        addListener: function(type, listener, elem) {
            if (this.handleList[elem] == undefined) {
                this.handleList[elem] = {};
            }
            if (this.handleList[elem][type] == undefined) {
                this.handleList[elem][type] = [];
            }
            return (this.handleList[elem][type].push({
                fn: listener,
                text: listener.toString(),
                enabled: true
            }) - 1);
        },
        //Disabled einen Listener durch setzen deaktivieren des enabled-flags
        removeListener: function(type, listener, elem) {
            if ( typeof listner === "number") {
                this.handleList[elem][type][listener]["enabled"] = false;
                return 1;
            }
            else {
                var listenerId = [];
                for (var i = 0; i < this.handleList[elem][type].length; i++) {
                    if (this.handleList[elem][type][i]["text"] == listener.toString()) {
                        listenerId.push(i);
                    }
                }
                for (var i = 0; i < listenerId.length; i++) {
                    this.handleList[elem][type][listenerId[i]]["enabled"] = false;
                }
                return listenerId;
            }
        },
        //Listeners aufrufen
        dispatchListener: function(type, elem, e) {
            for (var i = 0; i < oplib.fn.handler.handleList[elem][type].length; i++) {
                if (oplib.fn.handler.handleList[elem][type][i]["enabled"]) {
                    oplib.fn.handler.handleList[elem][type][i]["fn"].apply(this, [e]);
                }
            }
        }
    });

    //F�hrt fn aus, sobald das ausgew�hlte Element bereit/geladen ist
    //DEPRECATED: .handler als handler verwenden und auf .events() zur�ckgreifen
    oplib.fn.ready = function(fn) {
        return this.each(this, function(fn) {
            oplib.fn.ready.addHandler(this, fn);
        }, [fn]);
    };
    //Entfernt fn aus der Handler Liste des ausgew�hlten Elements.
    oplib.fn.unready = function(fn) {
        return this.each(this, function(fn) {
            oplib.fn.ready.trashHandler(this, fn);
        }, [fn]);
    };
    oplib.fn.extend(oplib.fn.ready, {
        //Globaler .ready() Handler
        handler: function(e) {
            if (oplib.fn.ready.isReadyState[e.target]) {
                oplib.fn.events.removeEvent("DOMContentLoaded", oplib.fn.ready.handler, e.target);
                oplib.fn.events.removeEvent("load", oplib.fn.ready.handler, e.target);
                return 1;
            }

            //Durch handleList gehen, abh�ngig von e.targer
            for (var i = 0; i < oplib.fn.ready.handleList[e.target].length; i++) {
                oplib.fn.ready.handleList[e.target][i].fn.apply(this, [e]);
            }
            //isReadyList[e.target] = true setzen
            oplib.fn.ready.isReadyState[e.target] = true;

            //Handler von e.target entfernen.
            oplib.fn.events.removeEvent("DOMContentLoaded", oplib.fn.ready.handler, e.target);
            oplib.fn.events.removeEvent("load", oplib.fn.ready.handler, e.target);

            return 0;
        },
        //Enth�lt funktionen, die beim readyState-Wechsel ausgef�hrt werden
        // m�ssen
        handleList: {},
        //Enth�lt, ob ein Element bereits bereit ist.
        isReadyState: {},
        //F�gt handleList[elem] die auszuf�hrende Funktion zu, etc.
        addHandler: function(elem, fn) {
            if (oplib.fn.ready.isReadyState[elem]) {
                //Element bereits geladen, funktion direkt ausf�hren
                fn.apply(this);
            }
            //DOMContentLoaded-Event verpasst?
            if (elem.readyState === "complete") {
                oplib.fn.ready.isReadyState[elem] = true;
                fn.apply(this);
            }

            if (oplib.fn.ready.handleList[elem]) {
                oplib.fn.ready.handleList[elem].push({
                    fn: fn,
                    text: fn.toString()
                });
            }
            else {
                oplib.fn.events.addEvent("DOMContentLoaded", oplib.fn.ready.handler, elem);
                oplib.fn.events.addEvent("load", oplib.fn.ready.handler, elem);
                oplib.fn.ready.handleList[elem] = [];
                return oplib.fn.ready.addHandler(elem, fn);
            }
        },
        //Entfernt die funktion von handleList[elem], etc.
        trashHandler: function(elem, fn) {
            if (handleList[elem]) {
                for (var i = 0; i < oplib.fn.ready.handleList[elem].length; i++) {
                    if (oplib.fn.ready.handleList[elem][i].text == fn.toString())
                        ;
                    delete oplib.fn.ready.handleList[elem][i];
                }
                if (oplib.fn.ready.handleList[elem].length <= 0) {
                    delete oplib.fn.ready.handleList[elem];
                    oplib.fn.events.removeEvent("DOMContentLoaded", oplib.fn.ready.handler, elem);
                    oplib.fn.events.removeEvent("load", oplib.fn.ready.handler, elem);
                }
            }
        },
    });

    //Standart Werte f�r name setzen
    oplib.fn.defaults = function(name, value) {
        oplib.fn.defaults[name] = value;
        ;
        return this;
    };
    //Standartwerte
    oplib.fn.extend(oplib.fn.defaults, {
        cssUnit: "px",
        ajaxSettings: {
            method: "get",
            async: true,
            contentType: "application/x-www-form-urlencoded",
            content: "text",
            connected: function() {
                console.log("Coining...");
            },
            received: function() {
                console.log("This is our town, SCRUB!");
            },
            processing: function() {
                console.log("Yeah, beat it!");
            }
        }
    });

    //FIXME
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
            //Nur ein Argument angegeben? -> Object soll sich selbs ver�ndern
            if (arguments.length == 1) {
                //Alle eigenen Elemente l�schen
                for (var i in this) {
                    delete this[i];

                }
                for (var i in newObj) {//Gemeinsamme Elemente hinzuf�gen
                    this[i] = newObj[i];
                }
            }
            return newObj;
        },
        //Merge f�r alle Obejects freigeben
        merge: oplib.fn.merge,
        //Extend f�r alle Objecte freigeben
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
                        //Ja, dem neuen Array hinzuf�gen
                        newArr.push(arr1[i]);
                    }
                }
            }
            //Nur ein Argument angegeben?
            if (arguments.length == 1) {
                //Alle eigenen Elemente l�schen
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

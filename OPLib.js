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

            this.op = true;

            return this;
        },
        //Attribut setzen
        attr: function(name, property) {
            //Wurde nur 'name' übergeben? - Attribut zurückgeben
            if (arguments.length == 1) {
                if (this.length != 0) {
                    return this[0].getAttribute(name);
                }
                else {
                    return this;
                }
            }

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
        //Klasse hinzufügen
        addClass: function(name) {
            return this.each(this, function(name) {
                var classAttr = OPLib(this).attr("class");
                if (!classAttr) {
                    classAttr = "";
                }
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
                var classAttr = OPLib(this).attr("class");
                if (!classAttr) {
                    classAttr = "";
                }
                var regex = new RegExp(name);
                //Ist die Klasse überhaupt gesetzt?
                if (regex.test(classAttr)) {
                    //1 Leerzeichen nach einer Klasse
                    var replace = new RegExp("[ ]*" + name, "g");
                    classAttr = classAttr.replace(replace, "");
                    OPLib(this).attr("class", classAttr);
                }
            }, [name]);
        },
        //Klasse übeprüfen / zurückgeben
        hasClass: function(name) {
            //Keine Klasse angegeben: alle Klassen zurückgeben
            if (!name) {
                return this.attr("class").split(" ");
            }
            //Klasse angegeben: überprüfen, ob sie vorhanden ist
            else {
                var classes = this.attr("class").split(" ");
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i] == name) {
                        return true;
                    }
                }
                return false;
            }
        },
        //Css-Attribut hinzufügen/bearbeiten/auslesen
        css: function(name, value, args) {
            //Werte abschließend anpassen
            var finalizedExpressions = this.finalizeCssExpressions(name, value, args);
            name = finalizedExpressions[0];
            value = finalizedExpressions[1];
            //Eigenschaften als Object übergeben
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
            //Kein Wert übergeben -> WERT AUSLESEN
            else if (!value) {
                return this[0]["style"][name];
            }
            //Name und Wert übergeben -> CSS SETZEN
            else {
                return this.each(this, function(name, value) {
                    this["style"][name] = value;
                }, [name, value]);
            }
            return this;
        },
        //Css-Attribute entfernen
        removeCss: function(name) {
            //Mehrere Css Werte löschen
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
            //Nur ein Css Wert löschen
            else {
                return this.each(this, function(name) {
                    this["style"][name] = "";
                }, [name]);
            }
            return this;
        },

        //Hängt Elemente an die übereinstimmenden Elemente am Ende an
        append: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(this, function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    this.appendChild(elems[i]);
                }
            }, [elems]);
        },
        //Hängt Elemente an die übereinstimmenden Elemente am Anfang an
        prepend: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(this, function(elems) {
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
                    //Keine untergeordneten Element ==> .appendChild möglich
                    else {
                        this.appendChild(elems[i]);
                    }
                }
            }, [elems]);
        },
        //Hängt Elemente vor die übereinstimmenden Elemente an
        before: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(this, function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    this.parentNode.insertBefore(elems[i], this);

                }
            }, [elems]);
        },
        //Hängt Elemente nach die übereinstimmenden Elemente an
        after: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(this, function(elems) {
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
        //Hängt übereinstimmende Elemente an Elemente an
        appendTo: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(elems, function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    this.appendChild(elems[i]);
                }
            }, [this]);
        },
        //Hängt übereinstimmende Elemente an die Elemente am Anfang an
        prependTo: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(elems, function(elems) {
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
                    //Keine untergeordneten Element ==> .appendChild möglich
                    else {
                        this.appendChild(elems[i]);
                    }
                }
            }, [this]);
        },
        //Hängt übereinstimmende Elemente vor Elemente an
        insertBefore: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(elems, function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    this.parentNode.insertBefore(elems[i], this);

                }
            }, [this]);
        },
        //Hängt übereinstimmende Elemente nach Elemente an
        insertAfter: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            return this.finalizeDOMManipulation(elems, function(elems) {
                for (var i = 0; i < elems.length; i++) {
                    if (this.nextElementSibling != null) {
                        this.nextSibling.parentNode.insertBefore(elems[i], this.nextSibling);
                    }
                    else {
                        this.parentNode.appendChild(elems[i]);
                    }
                }
            }, [this]);
        },
        /*
         * Fügt dem Object untergeordnete Nodes der übereinstimmenden Elemente
         * hinzu
         * R: Rekursive suche möglich
         * O: Enthält auch eigene(s) Element(e)
         */
        children: function(R, O) {
            var children = oplib.fn.ElementSelection.children(this, R);

            //OPLib soll nur Child Nodes enthalten - Vorherige ELemente
            //löschen
            if (!O) {
                for (var x = 0; x < this.length; x++) {
                    delete this[x];
                }
                this.length = 0;
            }
            //OPlib hinzufügen
            for (var i = 0; i < children.length; i++) {

                this.push(children[i]);
            }
            return this;
        },
        /* Fügt dem Object die übergeordnete Node der übereinstimmenden Elemente
         * hinzu
         * R: Rekursive Suche möglich
         * rekursionLimit: Limit für rekursive Suche
         * O: Enthält auch eigene(s) Element(e)
         */
        parents: function(R, rekursionLimit, O) {
            var Parents = oplib.fn.ElementSelection.parents(this, R, rekursionLimit);

            //OPLib soll nur parentNodes enthalten - Vorherige ELemente
            //löschen
            if (!O) {
                for (var x = 0; x < this.length; x++) {
                    delete this[x];
                }
                this.length = 0;
            }
            //Parents in OPLib speichern
            for (var i = 0; i < Parents.length; i++) {
                this.push(Parents[i]);
            }
            return this;
        },
        //Setzt .innerHTML für die ausgewählten Elemente
        inner: function(html) {
            return this.each(this, function() {
                this.innerHTML = html;
            }, [html]);
        },
        //Setzt .innerText für die ausgewählten Elemente
        text: function(text) {
            return this.each(this, function(text) {
                this.innerText = text;
            }, [text]);
        },
        //Findet alle Elemente anhand den in options angegebenen Einschränkungen
        //limitedTo: Darf nur Elemente aus limitedTo enthalten
        //O: Enthält auch eigene(s) Element(e)
        find: function(options, limitedTo, O) {
            var elems = oplib.fn.ElementSelection.find(this, options, limitedTo);
            if (!O) {
                for (var i = 0; i < this.length; i++) {
                    delete this[i];
                }
                this.length = 0;
            }

            for (var i = 0; i < elems.length; i++) {
                this.push(elems[i]);
            }

            return this;
        },
        //Läd eine Datei per AJAX in die übereinstimmenden Elemente
        load: function(url, header, options) {
            if (!options) {
                options = {};
            }
            options = oplib.fn.extend(options, {
                args: this
            });
            oplib.AJAX(url, function(text, readyState, status, elems) {
                oplib.fn.each(elems, function(text) {
                    this.innerHTML = text;
                }, [text]);
            }, header, options);
        },
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

    oplib.fn.isOPLib = function(obj) {
        if (!obj) {
            return false;
        }
        if (obj.op) {
            return true;
        }
        else {
            return false;
        }
    };

    //Array Funktionen zugänglich machen
    oplib.fn.push = Array.prototype.push;
    oplib.fn.pop = Array.prototype.pop;

    //oplib.fn.Init besitzt den gleichen Prototyp wie oplib
    oplib.fn.Init.prototype = oplib.fn;
    //Regex für Klassen Selectoren
    oplib.fn.ClassRegex = /\.\w\d*/;
    //Regex für ID Selectoren
    oplib.fn.IdRegex = /#\w\d*/;
    //Regex für HTML-Strings
    oplib.fn.HtmlStringRegex = /^\s*<[\w\d\s=:\/\.&?"'`´]*>[\w\W]*<\/[\w\s]*>\s*$/;
    //Regex für HTML-Strings, die nur ein Element enthalten
    oplib.fn.HtmlStringSingleElementRegex = /^<[\w\d\s=:\/\.&?"'`´]*>[^<>]*<\/[\w\s]*>$/;
    //Regex für HTML-Tag Selectoren
    oplib.fn.HtmlTagRegex = /<(\w|\s)*>/;
    //Regex für HTML-Tag Selectoren, um ein Tag neu zu erstellen
    oplib.fn.CreateHtmlTagRegex = /^_\w*_$/;
    //Regex für URL-Strings
    oplib.fn.UrlStringRegex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
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
    //TODO: AJAX --- .load() intergrieren.
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
        //Ist selector eine NodeList?
        else if ( selector instanceof NodeList) {
            for (var i = 0; i < selector.length; i++) {
                elems.push(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(selector[i]));
            }
        }
        //Ist Selector ein String, um Regexausdrücke anzuwenden?
        else if ( typeof selector === "string") {
            //Enthält selector ein HTML String
            if (oplib.fn.ElementSelection.isHtmlString(selector)) {
                elems.push(oplib.fn.createDOBObeject(selector));
            }
            //Enthält selector einen Url-String?
            else if (oplib.fn.ElementSelection.isUrlString(selector)) {
                var elem = document.createElement("div");
                $(elem).load(selector, "", {
                    async: false,
                    content: "text"
                });
                elems.push(elem);
            }
            //Enthält selector einen Klassenausdruck?
            else if (oplib.fn.ClassRegex.test(selector)) {
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
                    elems = oplib.fn.array.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
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
                    elems = oplib.fn.array.sameElements(oplib.fn.ElementSelection.prototype.DOMObjectFromSelector(_selector));
                }
            }

            //Enthält selector ein HtmlTag?
            else if (oplib.fn.ElementSelection.onlyTag(selector)) {
                var elements = oplib.fn.ElementSelection.find({
                    tag: oplib.fn.ElementSelection.tag
                }, oplib.fn.ElementSelection.children(context, 1));
                for (var i = 0; i < elements.length; i++) {
                    elems.push(elements[i]);
                }
            }
            //Enthält selector ein HtmlTag, das erstellt werden soll?
            else if (oplib.fn.CreateHtmlTagRegex.test(selector)) {
                var elem = document.createElement(selector.replace(/_/g, ""));
                elems.push(elem);
            }
            //Wurde kein Selector erkannt?
            else {
                var elem = document.createElement("div");
                elem.innerHTML = selector;
                elems.push(elem);
            }
        }
        else if ( typeof selector === "object") {
            if (oplib.fn.isOPLib(selector)) {
                elems = selector;
            }
        }

        return elems;
    };

    //Überprüft ob es sich um einen HTML-String handelt
    oplib.fn.ElementSelection.isHtmlString = function(htmlString) {
        return oplib.fn.HtmlStringRegex.test(htmlString);
    };

    //Überprüft, ob es sich um einen URL-String handelt
    oplib.fn.ElementSelection.isUrlString = function(urlString) {
        return oplib.fn.UrlStringRegex.test(urlString);
    };

    //Überprüft ob der HTML-String ein einzelnes Element enthält.
    oplib.fn.ElementSelection.singleElement = function(htmlString) {
        return oplib.fn.HtmlStringSingleElementRegex.test(htmlString);
    };

    //Überprüft ob der HTML-String nur aus einem Tag besteht <tag>
    oplib.fn.ElementSelection.onlyTag = function(htmlString) {
        return oplib.fn.HtmlTagRegex.test(htmlString);
    };

    //Gibt das Tag aus einem HTML-String zurück
    oplib.fn.ElementSelection.tag = function(htmlString) {
        return htmlString.slice(htmlString.search(/</) + 1, htmlString.search(/(>|\s+)/));
    };

    //Gibt den Text aus einem HTML-String zurück
    oplib.fn.ElementSelection.text = function(htmlString) {
        //HTML-Tags entfernen
        return htmlString.replace(/<[\/\w\d\s=:\/\.&?"'`´]*>/g, "");
    };

    //Gibt die Attribute aus einem HTML-String zurück
    oplib.fn.ElementSelection.attr = function(htmlString) {
        //Attribute in einem Array speichern [{name, value}]
        var attr = [];
        htmlString = htmlString.slice(htmlString.search(/</) + 1, htmlString.search(/>/)).trim();
        //Tag entfernen
        htmlString = htmlString.replace(/\w*\s/, "");

        //Attribute einteilen
        matchedAttr = htmlString.match(/\w*\s*=\s*("|'|`|´)[\w\d\s:\/\.&?]*("|'|`|´)/g);

        //Keine Attribute gefunden, leeres Array zurückgeben
        if (!matchedAttr) {
            return attr;
        }

        //Durch gefundene Attribute gehen, und attr[] zuweisen
        for (var i = 0; i < matchedAttr.length; i++) {
            attr.push({
                name: matchedAttr[i].slice(matchedAttr[i].search(/\w*/), matchedAttr[i].search(/\s*=/)),
                value: matchedAttr[i].slice(matchedAttr[i].search(/("|'|`|´)[\w\s:\/\.&?]*/) + 1, matchedAttr[i].search(/("|'|`|´)\s*$/))
            });
        }
        return attr;

    };

    /*
     * Findet untergeordnete Nodes für die Elemente
     * R: Rekursive Suche möglich
     */
    oplib.fn.ElementSelection.children = function(parents, R) {
        var children = [];

        //Funktion die alle untergeordneten Nodes findet
        var getChildren = function(parents, children, R) {
            for (var i = 0; i < parents.length; i++) {
                for (var j = 0; j < parents[i].children.length; j++) {
                    if (!oplib.fn.array.includes(children, parents[i].children[j])) {
                        children.push(parents[i].children[j]);
                        //Rekursiv?
                        if (R) {
                            if (parents[i].children[j].children.length != 0) {
                                children = getChildren([parents[i].children[j]], children, R);
                            }
                        }
                    }

                }
            }

            return children;
        };

        return getChildren(parents, children, R);
    };

    /* Findet übergeordnete Nodes für die Elemente
     * R: Rekursive Suche möglich
     * rekursionLimit: Limit für rekursive Suche
     */
    oplib.fn.ElementSelection.parents = function(children, R, rekursionLimit) {

        var Parents = [];
        var topLimit;

        if (rekursionLimit && rekursionLimit.parentNode) {
            topLimit = rekursionLimit.parentNode;
        }
        else {
            topLimit = document.body;
        }

        //Für alle übereinstimmenden Elemente parentNodes (rekursiv) finden.
        var getParents = function(children, parents, R) {
            for (var i = 0; i < children.length; i++) {
                //topLimit ist die höchste Ebene, falls rekursiv gesucht wird
                if (!(!children[i].parentNode || (children[i].parentNode == topLimit && R))) {
                    //Keine doppelten parentNodes.
                    if (!oplib.fn.array.includes(parents, children[i].parentNode)) {
                        //parentNode gefunden
                        parents.push(children[i].parentNode);
                        //Rekursive Suche??
                        if (R) {
                            parents = getParents([children[i].parentNode], parents, R);
                        }
                    }
                }

            }
            //Ergebnis der Suche zurückgeben
            return parents;
        };
        //Ergebnis der Suche
        return getParents(children, Parents, R);
    };

    /* Findet entsprechende Elemente
     * options: tag: Tags ["tag1 tag2 tag3"]
     * limitedTo: Auf diese Elemente beschränkt
     */
    oplib.fn.ElementSelection.find = function(elems, options, limitedTo) {
        var selection = [];

        if (options.tag) {
            //Mehrere Tags angegeben?
            var tags = options.tag.split(" ");
            //Elemente durchgehen
            for (var i = 0; i < elems.length; i++) {
                //Tags durchgehen
                for (var j = 0; j < tags.length; j++) {
                    var tmp = elems[i].getElementsByTagName(tags[j]);
                    //Elemente mit übereinstimmendem Tag durchgehen
                    for (var x = 0; x < tmp.length; x++) {
                        //Elemente müssen falls vorhanden in limitedTo vorkommen
                        if (!limitedTo || oplib.fn.array.includes(limitedTo, tmp[x])) {
                            //ELemente mit übereinstimmendem Tag dürfen nur
                            // einmal vorkommen
                            if (!oplib.fn.array.includes(selection, tmp[x])) {
                                selection.push(tmp[x]);
                            }
                        }

                    }
                }

            }
            delete options.tag;
            limitedTo = selection;
        }
        if (options.attr) {
            delete options.attr;
            limitedTo = selection;
        }
        if (options.className) {
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].className) {
                    var classes = elems[i].className.split(" ");
                    for (var j = 0; j < classes.length; j++) {
                        if (classes[j] == options.className) {
                            //Elemente müssen falls vorhanden in limitedTo
                            // vorkommen
                            if (!limitedTo || oplib.fn.array.includes(limitedTo, elems[i])) {
                                //ELemente mit übereinstimmender Klasse dürfen
                                // nur
                                // einmal vorkommen
                                if (!oplib.fn.array.includes(selection, elems[i])) {
                                    selection.push(elems[i]);
                                }
                            }
                        }
                    }
                }

            }
            delete options.className;
            limitedTo = selection;
        }
        for (var i in options) {
            for (var x = 0; x < elems.length; x++) {
                if (elems[x][i] && elems[x][i].indexOf(options[i]) != -1) {
                    //Elemente müssen falls vorhanden in limitedTo vorkommen
                    if (!limitedTo || oplib.fn.array.includes(limitedTo, elems[x])) {
                        //ELemente mit übereinstimmendem i dürfen nur
                        // einmal vorkommen
                        if (!oplib.fn.array.includes(selection, elems[x])) {
                            selection.push(elems[x]);
                        }
                    }
                }
            }
            delete options[i];
        }

        return selection;
    };

    //Erstellt ein DOMObject anhand eines Strings
    oplib.fn.createDOBObeject = function(text) {
        //Funktioniert nur wenn der String ein einzelnes HTML-Element enthält
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

    //Css Ausdrücke (10 -> "10px" "background-color" -> "backgroundColor")
    // entsprechend anpassen
    oplib.fn.finalizeCssExpressions = function(expression, value, args) {
        //Expression
        //Bereits ein String
        if ( typeof expression === "string") {
            //Bindestriche entfernen und folgendes Zeichen großschreiben
            expression = expression.replace(/-([a-z]|[A-Z])/g, function(match) {
                return match[1].toUpperCase();
            });
        }

        //Wert
        //Bereits ein String
        if ( typeof value === "string") {
            //Bindestriche entfernen und folgendes Zeichen großschreiben
            expression = expression.replace(/-([a-z]|[A-Z])/g, function(match) {
                return match[1].toUpperCase();
            });
        }
        else if ( typeof value === "number") {
            value = value.toString();
            //"width" -> Einheit benötigt
            if (expression.search(/(width|height|position|origin|size|padding|margin|spacing|gap)/i) != -1) {
                if (!args) {
                    value += oplib.fn.defaults.cssUnit;
                }
                else {
                    value += args;
                }
            }
            //"top" -> Einheit benötigt
            else if (expression.search(/^(top|bottom|left|rigth|flex-?basis)/i) != -1) {
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

    //Wandelt Css-Werte in verrechenbare Werte um ("10px" -> 10 "100%" [width])
    oplib.fn.floatCssValue = function(value, expression, elem) {
        //Ist das Element unsichtbar (display:none) muss der Klon davon sichtbar
        // gemacht werden
        var returns;
        var cloned = false;
        if (elem && elem.style.display == "none") {
            cloned = true;
            elem = oplib.fn.finalizeDOMManipulation.clone([elem])[0];
            //Erwartet ein Array und gibt ein Array zurück
            document.body.appendChild(elem);
            elem.style.position = "absolute";
            elem.style.left = "-9999px";
            elem.style.display = "";
        }
        if ( typeof value === "string") {
            //Wert von Expression mal value(in Prozent)
            if (/%/.test(value)) {
                if (!elem.style[expression]) {
                    switch (expression) {
                        case "offsetWidth":
                        case "width":
                            returns = elem.offsetWidth * (parseFloat(value) / 100);
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetHeight":
                        case "height":
                            returns = elem.offsetHeight * (parseFloat(value) / 100);
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetTop":
                        case "top":
                            returns = elem.offsetTop * (parseFloat(value) / 100);
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetLeft":
                        case "left":
                            returns = elem.offsetLeft * (parseFloat(value) / 100);
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        //Annehmen, dass opacity 1 ist
                        case "opacity":
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return 1.0 * (parseFloat(value) / 100);
                            break;
                        default:
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return console.log("Cant get real value of " + value + " with expression: " + expression);
                    }
                }
                else {
                    returns = parseFloat(elem.style[expression]) * (parseFloat(value) / 100);
                    if (cloned) {
                        document.body.removeChild(elem);
                    }
                    return isNaN(returns) ? 0 : returns;
                }
            }
            //Gibt die gesuchten Werte als Text zurück;
            else if (/text/.test(value)) {
                if (!elem.style[expression]) {
                    switch (expression) {
                        case "offsetWidth":
                        case "width":
                            returns = oplib.fn.finalizeCssExpressions(expression, elem.offsetWidth)[1];
                            //[1], da return = [expression, value]
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetHeight":
                        case "height":
                            returns = oplib.fn.finalizeCssExpressions(expression, elem.offsetHeight)[1];
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetTop":
                        case "top":
                            returns = oplib.fn.finalizeCssExpressions(expression, elem.offsetTop)[1];
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        case "offsetLeft":
                        case "left":
                            returns = oplib.fn.finalizeCssExpressions(expression, elem.offsetLeft)[1];
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return returns;
                            break;

                        //Annehmen, dass opacity 1 ist
                        case "opacity":
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return "1";
                            break;
                        case "display":
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return "";
                            break;
                        case "overflow":
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return "";
                            break;
                        default:
                            if (cloned) {
                                document.body.removeChild(elem);
                            }
                            return console.log("Cant get text of " + value + " with expression: " + expression);
                    }
                }
                else {
                    returns = oplib.fn.finalizeCssExpressions(expression, elem.style[expression])[1];
                    if (cloned) {
                        document.body.removeChild(elem);
                    }
                    return returns;
                }
            }
            //Gibt den Wert aus dem Style Attribut zurück, auch wen dieser keinen
            // Wert besitzt.
            else if (/real/.test(value)) {
                returns = oplib.fn.finalizeCssExpressions(expression, elem.style[expression])[1];
                if (cloned) {
                    document.body.removeChild(elem);
                }
                return returns;
            }
            else {
                returns = parseFloat(value);
                if (cloned) {
                    document.body.removeChild(elem);
                }
                return isNaN(returns) ? 0 : returns;
            }
        }
        else if ( typeof value === "number") {
            if (cloned) {
                document.body.removeChild(elem);
            }
            return value;
        }
    };

    //Klont Elemente, etc...
    oplib.fn.finalizeDOMManipulation = function(obj, fn, args) {
        this.each(obj, function(fn, elems) {
            var clones = oplib.fn.finalizeDOMManipulation.clone(elems);
            fn.apply(this, [clones]);
        }, [fn, args[0]]);

        //Element löschen
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
                    //elems[i].parentNode.appendChild(clone);       //Unnötig???
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

    //Abkürzungen für allgemeine Animationen
    oplib.fn.extend(oplib.fn, {
        hide: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    width: "hide",
                    height: "hide",
                    opacity: "hide",
                    callbacks: callbacks
                }, duration, interpolator);

            }, [duration, interpolator, callbacks]);
        },
        show: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    width: "show",
                    height: "show",
                    opacity: "show",
                    callbacks: callbacks
                }, duration, interpolator);
            }, [duration, interpolator]);

        },
        slideUp: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    height: "hide",
                    callbacks: callbacks
                }, duration, interpolator);

            }, [duration, interpolator, callbacks]);
        },
        slideDown: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    height: "show",
                    callbacks: callbacks
                }, duration, interpolator);
            }, [duration, interpolator, callbacks]);

        },
        fadeOut: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    opacity: "hide",
                    callbacks: callbacks
                }, duration, interpolator);

            }, [duration, interpolator, callbacks]);
        },
        fadeIn: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                oplib.fx([this], {
                    opacity: "show",
                    callbacks: callbacks
                }, duration, interpolator);
            }, [duration, interpolator, callbacks]);

        },
        fadeTo: function(to, duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(to, duration, interpolator, callbacks) {
                oplib.fx([this], {
                    opacity: to,
                    callbacks: callbacks
                }, duration, interpolator);
            }, [to, duration, interpolator, callbacks]);
        },
        toggle: function(duration, interpolator, callbacks) {
            if ( typeof callbacks === "function") {
                callbacks = {
                    done: callbacks
                };
            }
            return this.each(this, function(duration, interpolator, callbacks) {
                if (!this.oplib) {
                    this.oplib = {};
                }
                oplib.fx([this], {
                    width: "toggle",
                    height: "toggle",
                    opacity: "toggle",
                    callbacks: callbacks
                }, duration, interpolator);
            }, [duration, interpolator, callbacks]);
        }
    });

    /* Animiert die übereinstimmenden Elemente
     * options:
     *  width|height|position|origin|size|padding|margin|spacing|gap
     *  top|bottom|left|rigth|flex-?basis
     *  opacity
     *  duration:
     *  interpolator:
     * duration:
     *  "slow"|"normal"|"fast"|number
     * interpolator:
     *  "linear"|"accelerate"|"decelerate"
     */
    oplib.fn.anim = function(options, duration, interpolator) {
        if (!options) {
            return this;
        }

        oplib.fx(this, options, duration, interpolator);

        return this;
    };

    oplib.fn.stop = function(stopAll, finish) {
        return this.each(this, function(stopAll, finish) {
            oplib.fx.stop(this, stopAll, finish);
        }, [stopAll, finish]);
    };

    //Animiert Objekte
    oplib.fx = function(elems, options, duration, interpolator) {
        if (duration == undefined) {
            if (options.duration) {
                duration = options.duration;
                delete options.duration;
            }
            else {
                duration = "normal";
            }
        }
        if (interpolator == undefined) {
            if (options.interpolator) {
                interpolator = options.interpolator;
                delete options.interpolator;
            }
            else {
                interpolator = "linear";
            }
        }

        if (options.duration != undefined) {
            delete options.duration;
        }
        if (options.interpolator != undefined) {
            delete options.interpolator;
        }

        //Argumente interpretieren
        if (duration == "normal") {
            duration = 750;
        }
        if (duration == "fast") {
            duration = 500;
        }
        if (duration == "slow") {
            duration = 1000;
        }

        for (var i = 0; i < elems.length; i++) {
            //Wird das Element bereits aniemiert, dann als Callback "done" daran
            // anhägen
            var callbackAdded = false;

            for (var j = 0; j < oplib.fx.queue.length; j++) {
                if (oplib.fx.queue[j].elem == elems[i]) {
                    var callbackOptions = oplib.fn.extend(options, {
                        duration: duration,
                        interpolator: interpolator,
                    });
                    oplib.fx.queue[j].callbacks = oplib.fx.addCallback(oplib.fx.queue[j].callbacks, callbackOptions, "done");
                    callbackAdded = true;
                }
            }
            if (!callbackAdded) {
                oplib.fx.init(elems[i], options, duration, interpolator);
            }

        }
    };

    oplib.fn.extend(oplib.fx, {
        init: function(elem, options, duration, interpolator) {

            //Optionen interpretieren
            var cssSettings = {};
            var callbacks = {};
            var done = false;
            var optionsCount = 0;
            var optionsEqual = 0;
            for (var i in options) {
                //Auf callbacks reagieren
                if (i == "callbacks") {
                    callbacks = options[i];
                    continue;
                }
                //Status des Elements festhalten
                if (!elem.oplib) {
                    elem.oplib = {};
                }
                if (options[i] == "toggle") {
                    if (elem.style.display == "none") {
                        options[i] = "show";
                    }
                    else if (elem.style.display != "none") {
                        options[i] = "hide";
                    }
                }
                if (options[i] == "show") {
                    if (elem.style.display == "none" || elem.oplib.state != "shown") {
                        if (!elem.oplib.state) {
                            elem.oplib.oldDisplay = "";
                        }
                        if (elem.oplib.state != "showing" && elem.oplib.state != "hiding") {
                            elem.oplib.oldWidth = oplib.fn.floatCssValue("real", "width", elem);
                            elem.oplib.oldHeight = oplib.fn.floatCssValue("real", "height", elem);
                            elem.oplib.oldOpacity = oplib.fn.floatCssValue("real", "opacity", elem);
                        }
                        elem.oplib.state = "showing";

                        cssSettings[i] = {};
                        //Bug fix -- Animation startet nicht wo sie aufgehört hat
                        if (elem.oplib.state == "hidden" || elem.style.display == "none") {
                            cssSettings[i].old = oplib.fn.floatCssValue(0);
                        }
                        else {
                            cssSettings[i].old = oplib.fn.floatCssValue("100%", i, elem);
                        }
                        //Bug fix -- Animation geht nicht bis zum richtigen Ende
                        //Fix durch Herstellung der normalen Bedingungen
                        var tmpWidth = elem.style.width;
                        var tmpHeight = elem.style.height;
                        var tmpOpacity = elem.style.opacity;
                        elem.style.width = elem.oplib.oldWidth;
                        elem.style.height = elem.oplib.oldHeight;
                        elem.style.opacity = elem.oplib.oldOpacity;
                        cssSettings[i].aim = oplib.fn.floatCssValue("100%", i, elem);
                        elem.style.width = tmpWidth;
                        elem.style.height = tmpHeight;
                        elem.style.opacity = tmpOpacity;
                    }

                }
                else if (options[i] == "hide") {
                    if (elem.style.display != "none" || elem.oplib.state != "hidden") {
                        if (elem.oplib.state != "hiding" && elem.oplib.state != "showing") {
                            elem.oplib.oldWidth = oplib.fn.floatCssValue("real", "width", elem);
                            elem.oplib.oldHeight = oplib.fn.floatCssValue("real", "height", elem);
                            elem.oplib.oldOpacity = oplib.fn.floatCssValue("real", "opacity", elem);
                            elem.oplib.oldDisplay = oplib.fn.floatCssValue("real", "display", elem);
                        }
                        elem.oplib.state = "hiding";

                        cssSettings[i] = {};
                        cssSettings[i].old = oplib.fn.floatCssValue("100%", i, elem);
                        cssSettings[i].current = oplib.fn.floatCssValue("100%", i, elem);
                        cssSettings[i].aim = oplib.fn.floatCssValue(0);
                    }

                }
                else {
                    cssSettings[i] = {};
                    cssSettings[i].old = oplib.fn.floatCssValue("100%", i, elem);
                    cssSettings[i].current = oplib.fn.floatCssValue("100%", i, elem);
                    cssSettings[i].aim = oplib.fn.floatCssValue(options[i]);
                }

                //Auf gleiche Optionen untersuchen, Keine sinnlosen Animationen
                optionsCount++;
                if (!cssSettings[i] || cssSettings[i].old == cssSettings[i].aim) {
                    optionsEqual++;
                }

            }

            //Benötigte Callbacks:
            if (elem.oplib.state == "showing") {
                callbacks = oplib.fx.addCallback(callbacks, function(elem) {
                    elem.style.display = elem.oplib.oldDisplay;
                }, "OPstart");
                callbacks = oplib.fx.addCallback(callbacks, function(elem) {
                    elem.style.width = elem.oplib.oldWidth;
                    elem.style.height = elem.oplib.oldHeight;
                    elem.style.opacity = elem.oplib.oldOpacity;
                    elem.oplib.state = "shown";
                }, "OPdone");
            }
            else if (elem.oplib.state == "hiding") {
                callbacks = oplib.fx.addCallback(callbacks, function(elem) {
                    elem.style.display = "none";
                    elem.style.width = elem.oplib.oldWidth;
                    elem.style.height = elem.oplib.oldHeight;
                    elem.style.opacity = elem.oplib.oldOpacity;
                    elem.oplib.state = "hidden";
                }, "OPdone");
            }

            //Alle Optionen gleich  --> Animation ist fertig
            if (optionsEqual / optionsCount == 1) {
                done = true;
            }

            oplib.fx.queue.push({
                elem: elem,
                options: cssSettings,
                duration: duration,
                interpolator: interpolator,
                start_time: oplib.TIME.getCurrentTime(),
                callbacks: callbacks,
                done: done,
            });

            //Overflow setzen:
            if (!elem.oplib) {
                elem.oplib = {};
            }
            elem.oplib.oldOverflow = oplib.fn.floatCssValue("real", "overflow", elem);
            elem.style.overflow = "hidden";

            if (!oplib.fx.animatorRunning) {
                oplib.fx.animatorId = setTimeout(oplib.fx.animate, oplib.fn.defaults.frameTime);
                oplib.fx.animatorRunning = true;
            }
        },
        end: function(i, elem, callbacks) {
            oplib.fx.queue.splice(i, 1);

            //Overflow zurücksetzen
            elem.style.overflow = elem.oplib.oldOverflow;

            //Callbacks "OPdone" aufrufen
            callbacks = oplib.fx.callback(elem, callbacks, "OPdone");
            //Callbacks "done" aufrufen
            callbacks = oplib.fx.callback(elem, callbacks, "done");

            if (!oplib.fx.queue.length) {
                clearTimeout(oplib.fx.animatorId);
                oplib.fx.animatorRunning = false;
            }
            return oplib.fx.animatorId;
        },
        stop: function(elem, stopAll, finish) {
            for (var i = 0; i < oplib.fx.queue.length; i++) {
                //Alle anderen Animationen löschen. --- Es werden keine
                // Funktionen gelöscht
                if (oplib.fx.queue[i].elem == elem) {
                    if (stopAll) {
                        if (!oplib.fx.queue[i].callbacks) {
                            oplib.fx.queue[i].callbacks = {};
                        }
                        if (oplib.fx.queue[i].callbacks.done && toString.call(oplib.fx.queue[i].callbacks.done === "[Object array]")) {
                            for (var j = 0; j < oplib.fx.queue[i].callbacks.done.length; j++) {
                                if ( typeof oplib.fx.queue[i].callbacks.done[i] === "object") {
                                    oplib.fx.queue[i].callbacks.done[j].splice(j--, 1);
                                }
                            }
                        }
                        else if (oplib.fx.queue[i].callbacks.done && typeof oplib.fx.queue[i].callbacks.done === "object") {
                            delete oplib.fx.queue[i].callbacks.done;
                        }
                    }

                    //Die laufende Animation beenden
                    if (finish) {
                        oplib.fx.queue[i].duration = 1;
                    }

                    //Die laufende Animation stoppen
                    if (oplib.fx.queue[i].callbacks.OPdone) {
                        //Kein display:none when Animationen gestoppt werden
                        delete oplib.fx.queue[i].callbacks.OPdone;
                    }
                    oplib.fx.queue[i].done = true;
                }
            }
        },
        //Enthält zu animerende Elemente mit ihren Eigenschaften
        queue: [],
        //Wird .animate() bereits ausgeführt
        animatorRunning: false,
        //setIntervar() ID um .animator() zu stoppen
        animatorId: 0,
        //Animiert Objekte für Zeit t;
        animate: function() {
            var currentTime = oplib.TIME.getCurrentTime();
            var actualProgress;
            var animationProgress;

            var elem, options, duration, interpolator, start_time, actual_time, callbacks;

            var done = [];

            for (var i = 0; i < oplib.fx.queue.length; i++) {
                elem = oplib.fx.queue[i].elem;
                options = oplib.fx.queue[i].options;
                duration = oplib.fx.queue[i].duration;
                interpolator = oplib.fx.queue[i].interpolator;
                start_time = oplib.fx.queue[i].start_time;
                actual_time = currentTime - start_time;
                callbacks = oplib.fx.queue[i].callbacks;
                actualProgress = actual_time / duration;

                if (actualProgress > 1.0) {
                    actualProgress = 1.0;
                }
                animationProgress = oplib.fx.interpolate(interpolator, actualProgress);

                //Callbacks "OPstart" aufrufen
                callbacks = oplib.fx.callback(elem, callbacks, "OPstart");
                //Callbacks "start" aufrufen
                callbacks = oplib.fx.callback(elem, callbacks, "start");
                //Callbacks "update" aufrufen
                oplib.fx.callback(elem, callbacks, "update");

                for (var j in options) {
                    options[j].current = options[j].old + (options[j].aim - options[j].old) * animationProgress;
                    var apply = oplib.fn.finalizeCssExpressions(j, options[j].current);
                    elem.style[apply[0]] = apply[1];
                }

                if (actualProgress == 1.0 || oplib.fx.queue[i].done) {
                    done.push(i);
                }

                //Queue updaten
                oplib.fx.queue[i].callbacks = callbacks;

            }

            for (var i = 0; i < done.length; i++) {
                oplib.fx.end(done[i] - i, oplib.fx.queue[done[i] - i].elem, oplib.fx.queue[done[i] - i].callbacks);
            }

            if (oplib.fx.animatorRunning) {
                oplib.fx.animatorId = setTimeout(oplib.fx.animate, oplib.fn.defaults.frameTime);
            }
        },
        //Wendet einen interpolator auf actualProgress an
        interpolate: function(interpolator, actualProgress) {
            interpolators = {
                linear: actualProgress,
                decelerate: Math.sin(actualProgress * (Math.PI / 2)),
                accelerate: 1 - Math.sin(actualProgress * (Math.PI / 2) + (Math.PI / 2)),
            };

            if (!interpolators[interpolator]) {
                interpolator = "decelerate";
            }
            return interpolators[interpolator];
        },
        //Callbackfunktion
        callback: function(elem, callbacks, action) {
            if (!callbacks) {
                return callbacks;
            }
            if (!callbacks[action]) {
                return callbacks;
            }
            //Falls callbacks in Array-Form angegeben wurden:
            if (callbacks[action] && toString.call(callbacks[action]) === "[object Array]") {
                for (var i in callbacks[action]) {
                    if ( typeof callbacks[action][i] === "function") {
                        callbacks[action][i].apply(this, [elem]);
                        delete callbacks[action][i];
                    }
                    else if ( typeof callbacks[action][i] === "object") {
                        //Zusätzliche animationen enthalten
                        oplib.fx([elem], callbacks[action][i]);
                        delete callbacks[action][i];
                    }
                }
            }
            else if (callbacks[action] && typeof callbacks[action] === "function") {
                callbacks[action].apply(this, [elem]);
                delete callbacks[action];
            }
            else if (callbacks[action] && typeof callbacks[action] === "object") {
                //Zusätzliche animationen enthalten
                oplib.fx([elem], callbacks[action]);
                delete callbacks[action];
            }

            return callbacks;
        },
        //Fügt Elementen in oplib.fx.queue callbacks hinzu.
        addCallback: function(callbacksBase, callbacks, action) {
            if (!callbacks) {
                return;
            }

            if (!callbacksBase) {
                callbacksBase = {};
                callbacksBase[action] = [];
            }

            if (!callbacksBase[action]) {
                callbacksBase[action] = [];
            }

            if (callbacksBase[action] && toString.call(callbacksBase[action]) === "[object Array]") {
                if (toString.call(callbacks) === "[object Array]") {
                    for (var i in callbacks) {
                        callbacksBase[action].push(callbacks[i]);
                    }
                }
                else {
                    callbacksBase[action].push(callbacks);
                }
            }
            else if (callbacksBase[action]) {
                callbacksBase[action] = [callbacksBase[action]];
                if (toString.call(callbacks) === "[object Array]") {
                    for (var i in callbacks) {
                        callbacksBase[action].push(callbacks[i]);
                    }
                }
                else {
                    callbacksBase[action].push(callbacks);
                }
            }
            return callbacksBase;
        }
    });

    //Parses JSON Data
    oplib.fn.JSON = function(json) {
        return oplib.fn.JSON.parse(json);
    };
    oplib.fn.JSON.parse = function(json) {
        //Use native Broswser Parser
        //TODO: Own Parser
        return JSON.parse(json);
    };
    oplib.fn.JSON.stringify = function(obj) {
        //Use native Broswser Stringifier
        //TODO: Own Stringifier
        return JSON.stringify(obj);
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
            if (settings.async != undefined) {
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
            if (settings.args) {
                ajaxSettings.args = settings.args;
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
                        //Objecte in JSON umwandeln um AJAX-Request möglich zu
                        // machen
                        if ( typeof header[i].value === "object") {
                            header[i].value = oplib.fn.JSON.stringify(header[i].value);
                        }
                        if (!parsedHeader) {
                            parsedHeader += ("?" + header[i].key + "=" + header[i].value);
                        }
                        else {
                            parsedHeader += ("&" + header[i].key + "=" + header[i].value);
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

            if (header) {
                if ( typeof header === "string") {
                    if (header[0] == '?') {
                        header = header.slice(1, header.length - 1);
                    }
                    parsedHeader = header;
                }
                else {
                    for (var i = 0; i < header.length; i++) {
                        //Objecte in JSON umwandeln um AJAX-Request möglich zu
                        // machen
                        if ( typeof header[i].value === "object") {
                            header[i].value = oplib.fn.JSON.stringify(header[i].value);
                        }
                        if (!parsedHeader) {
                            parsedHeader = header[i].key + "=" + header[i].value;
                        }
                        else {
                            parsedHeader += ("&" + header[i].key + "=" + header[i].value);
                        }

                    }
                }

            }
            xmlhttp.open("post", url, ajaxSettings.async);
            xmlhttp.setRequestHeader("Content-type", ajaxSettings.contentType);
            xmlhttp.send(parsedHeader);

            return xmlhttp;
        }
    };
    oplib.fn.AJAX.response = {
        async: function(xmlhttp, fn, ajaxSettings) {
            if (ajaxSettings.content == "text") {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 1) {
                        ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 2) {
                        ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 3) {
                        ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 4) {
                        fn.apply(this, [xmlhttp.responseText, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
                    }
                };
            }
            else if (ajaxSettings.content == "xml") {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 1) {
                        ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 2) {
                        ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 3) {
                        ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 4) {
                        fn.apply(this, [xmlhttp.responseXML, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
                    }
                };
            }
            else if (ajaxSettings.content == "json") {
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 1) {
                        ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 2) {
                        ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 3) {
                        ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
                    }
                    else if (xmlhttp.readyState == 4) {
                        fn.apply(this, [oplib.fn.JSON(xmlhttp.responseText), xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
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
                fn.apply(this, [xmlhttp.responseText, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
            }
            else if (ajaxSettings.content == "xml") {
                fn.apply(this, [xmlhttp.responseXML, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
            }
            else if (ajaxSettings.content == "json") {
                fn.apply(this, [oplib.fn.JSON(xmlhttp.responseText), xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
            }
            else {
                console.log(ajaxSettings.content + ": is not a valid contentType");
            }

            return xmlhttp;
        }
    };

    //Auch über $.AJAX aufrufbar
    oplib.AJAX = oplib.fn.AJAX;

    //Abkürzungen für events
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
        //Wurde der GLOBALE Handler bereits für dieses Event gesetzt? DARF NUR
        // EINMAL GESTZT WERDEN
        handleAttached: {},
        //Listener dem globalen handler hinzufügen
        addEvent: function(type, fn, elem) {
            //handleAttached überprüfen
            if (this.handleAttached[type] == undefined) {
                this.handleAttached[type] = [];
            }
            for (var i = 0; i < this.handleAttached[type]; i++) {
                if (this.handleAttached[type][i]["elem"] == elem && this.handleAttached[type][i]["attached"] == true) {
                    return oplib.fn.handler.addListener(type, fn, elem);
                }
            }
            this.handleAttached[type].push({
                elem: elem,
                attached: true
            });
            elem.addEventListener(type, oplib.fn.handler, false);
            return oplib.fn.handler.addListener(type, fn, elem);

        },
        //Listener dem globalen Handler entfernen
        removeEvent: function(type, fn, elem) {
            return oplib.fn.handler.removeListener(type, fn, elem);
        },
        //Event ausführen
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
        //Entsprechenden Listener ausführen
        return oplib.fn.handler.dispatchListener(type, elem, e);

    };

    //Handler Klasse
    oplib.fn.extend(oplib.fn.handler, {
        //Aufbau: handleList.element[...].type[...].{function, text, enabled}
        handleList: {},

        //Der HandleList einen neuen Listener hinzufügen
        addListener: function(type, listener, elem) {
            if (this.handleList[type] == undefined) {
                this.handleList[type] = [];
            }
            return (this.handleList[type].push({
                elem: elem,
                fn: listener,
                text: listener.toString(),
                enabled: true
            }) - 1);
        },
        //Disabled einen Listener durch setzen deaktivieren des enabled-flags
        removeListener: function(type, listener, elem) {
            if ( typeof listner === "number") {
                this.handleList[type][listener]["enabled"] = false;
                return 1;
            }
            else {
                var listenerId = [];
                for (var i = 0; i < this.handleList[type].length; i++) {
                    if (this.handleList[type][i]["elem"] == elem && this.handleList[type][i]["text"] == listener.toString()) {
                        listenerId.push(i);
                    }
                }
                for (var i = 0; i < listenerId.length; i++) {
                    this.handleList[type][listenerId[i]]["enabled"] = false;
                }
                return listenerId;
            }
        },
        //Listeners aufrufen
        dispatchListener: function(type, elem, e) {
            for (var i = 0; i < oplib.fn.handler.handleList[type].length; i++) {
                if (oplib.fn.handler.handleList[type][i]["enabled"] && oplib.fn.handler.handleList[type][i]["elem"] == elem) {
                    oplib.fn.handler.handleList[type][i]["fn"].apply(this, [e]);
                }
            }
        }
    });

    //Führt fn aus, sobald das ausgewählte Element bereit/geladen ist
    //DEPRECATED: .handler als handler verwenden und auf .events() zurückgreifen
    oplib.fn.ready = function(fn) {
        return this.each(this, function(fn) {
            oplib.fn.ready.addHandler(this, fn);
        }, [fn]);
    };
    //Entfernt fn aus der Handler Liste des ausgewählten Elements.
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

            //Durch handleList gehen, abhängig von e.targer
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
        //Enthält funktionen, die beim readyState-Wechsel ausgeführt werden
        // müssen
        handleList: {},
        //Enthält, ob ein Element bereits bereit ist.
        isReadyState: {},
        //Fügt handleList[elem] die auszuführende Funktion zu, etc.
        addHandler: function(elem, fn) {
            if (oplib.fn.ready.isReadyState[elem]) {
                //Element bereits geladen, funktion direkt ausführen
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

    //Tooltips
    //TODO: Clear Queue for Elem -- ANIMATIONS .stop()
    //TODO: Dont fade when mouse is over the Tooltip
    oplib.fn.Tooltip = function(selector, context) {
        var elems = oplib.fn.ElementSelection(selector, context);
        return this.finalizeDOMManipulation(this, function(elems) {
            for (var i = 0; i < elems.length; i++) {
                this.parentNode.appendChild(elems[i]);
            }
            oplib.fx(elems, {
                opacity: "hide"
            }, 0);
            oplib.fn.events.addEvent("mouseover", function(e) {
                oplib.fx.stop(elems[0], 1, 0);
                oplib.fx(elems, {
                    height: "show",
                    opacity: "show"
                }, "fast");
            }, this);
            oplib.fn.events.addEvent("mouseout", function(e) {
                oplib.fx.stop(elems[0], 1, 0);
                oplib.fx(elems, {
                    height: "hide",
                    opacity: "hide"
                }, "fast");
            }, this);
            oplib.fn.events.addEvent("mousemove", function(e) {
                for (var i = 0; i < elems.length; i++) {
                    elems[i].style.position = "absolute";
                    elems[i].style.left = oplib.fn.finalizeCssExpressions("left", e.pageX + 5)[1];
                    elems[i].style.top = oplib.fn.finalizeCssExpressions("top", e.pageY + 5)[1];
                }
            }, this);
        }, [elems]);
    };

    //Funktionen die mit Arrays arbeiten
    oplib.array = oplib.fn.array = {
        includes: function(arr, elem) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == elem) {
                    return true;
                }
            }
            return false;
        },
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
            return newArr;
        }
    };

    //Funktionen die mit Objects arbeiten
    oplib.object = oplib.fn.object = {
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
    };

    //Funktionen für die Zeit
    oplib.TIME = oplib.fn.TIME = {
        getCurrentTime: function() {
            return new Date().getTime();
        }
    };

    //Standart Werte für name setzen
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
            },
            args: [],
        },
        frameTime: 5
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

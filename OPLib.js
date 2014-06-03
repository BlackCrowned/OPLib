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
                        this.nextElementSibling.parentNode.insertBefore(elems[i], this.nextElementSibling);
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
                        this.nextElementSibling.parentNode.insertBefore(elems[i], this.nextElementSibling);
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
        /* Fügt dem Object die Geschwister/Nachbarnodes der übereinstimmenden
         * Elemente hinzu
         * N: Nur Nachbaren auswählen
         * O: Enthält auch eigene(s) Element(e)
         */
        siblings: function(N, O) {
            var Siblings = oplib.fn.ElementSelection.siblings(this, N);

            //OPLib soll nur siblings enthalten - Vorherige ELemente löschen
            if (!O) {
                for (var x = 0; x < this.length; x++) {
                    delete this[x];
                }
                this.length = 0;
            }
            //Siblings in OPLib speichern
            for (var i = 0; i < Siblings.length; i++) {
                this.push(Siblings[i]);
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
        find: function(selector, O) {
            var elems = oplib.fn.ElementSelection.find(this, selector);
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
        //Gibt Clones der ausgewählten Element zurück
        clone: function() {
            var clones = oplib.fn.finalizeDOMManipulation.clone(this);
            for (var i = 0; i < this.length; i++) {
                this[i] = clones[i];
            }
            return this;
        },
        //Ersetzt die ausgewähöten Elemente mit einem neuen Element
        replace: function(selector, context) {
            var elems = oplib.fn.ElementSelection(selector, context);
            var replaced = oplib.fn.ElementSelection.replace(elems, this);
            for (var i = 0; i < this.length; i++) {
                delete this[i];
                this.length = 0;
            }
            for (var i = 0; i < replaced.length; i++) {
                this.push(replaced[i]);
            }
            return this;
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
    //EscapeChar - Regex
    oplib.fn.EscapeCharRegex = /\\/;
    //Text - Regex
    oplib.fn.TextRegex = /\w/;
    //Universal - Regex
    oplib.fn.UniversalRegex = /\*/;
    //ID - Regex
    oplib.fn.IdRegex = /#/;
    //Klassen - Regex
    oplib.fn.ClassRegex = /\./;
    //Child - Regex
    oplib.fn.ChildRegex = />/;
    //Descendant - Regex
    oplib.fn.DescendantRegex = /\s/;
    //Neighbour - Regex
    oplib.fn.NeighbourRegex = /\+/;
    //Sibling - Regex
    oplib.fn.SiblingRegex = /~/;
    //Url - Regex
    oplib.fn.UrlRegex = /url:/;
    //Html - Regex
    oplib.fn.HtmlRegex = /^\s*<[\w\d\s=\-;:\/\.&?"'`´]*>[\w\W]*<\/[\w\s]*>\s*$/;
    //Html - Single Element - Regex
    oplib.fn.HtmlSingleElementRegex = /^<[\w\d\s=\-;:\/\.&?"'`´]*>[^<>]*<\/[\w\s]*>$/;
    //Html - Tag - Regex
    oplib.fn.HtmlTagRegex = /<(\w|\s)*>/;
    //Attribut - Start - Regex
    oplib.fn.AttributeStartRegex = /\[/;
    //Attribut - End - Regex
    oplib.fn.AttributeEndRegex = /\]/;

    //Selectiert die Entsprechenden Elemente
    oplib.fn.ElementSelection = function(selector, context) {
        var elems;
        //Context zuweisen
        context = oplib.fn.ElementSelection.DOMObjectFromSelector(context);
        //Gewählte Elemente zuweisen
        elems = oplib.fn.ElementSelection.DOMObjectFromSelector(selector, context);
        //Ausgewählte Elemente zurückgeben
        return elems;
    };

    //Wandelt einen Selector in ein DOMObject um
    oplib.fn.ElementSelection.DOMObjectFromSelector = function(selector, context) {
        var selectors = [];

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

        selectors = oplib.fn.ElementSelection.DOMObjectFromSelector.ParseSelector(selector);

        return oplib.fn.ElementSelection.DOMObjectFromParsedSelector(selectors, context);

    };

    //Parst den Selector
    oplib.fn.ElementSelection.DOMObjectFromSelector.ParseSelector = function(selector) {
        var parsedSelectors = [];
        //[{type, data}]

        //Wurde ein selector übergeben
        if (!selector) {
            //Standart Selector = document.body
            selector = document.body;
        }

        //Ist selector bereits ein DOMObject?
        if ( selector instanceof Node) {
            //Element = Selector
            parsedSelectors.push({
                type: "element",
                data: selector
            });

        }
        //Ist selector eine NodeList?
        else if ( selector instanceof NodeList) {
            for (var i = 0; i < selector.length; i++) {
                parsedSelectors.push({
                    type: "element",
                    data: selector[i]
                });
            }
        }
        //Ist Selector ein String, um Regexausdrücke anzuwenden?
        else if ( typeof selector === "string") {
            //Url angegeben. Keine weiteren Selektoren erwartet
            if (oplib.fn.ElementSelection.isUrl(selector)) {
                selector = selector.replace(oplib.fn.UrlRegex, "");
                parsedSelectors.push({
                    type: "url",
                    data: selector
                });
            }
            //Html angegeben, keine weiteren Selektoren erwartet
            else if (oplib.fn.ElementSelection.isHtml(selector)) {
                parsedSelectors.push({
                    type: "html",
                    data: selector
                });
            }
            //Durch selector loopen und in einzelne Selektoren unterteilen
            else {
                var selector_type = "no selector";
                var selector_start = 0;
                var selector_end = -1;

                for (var i = 0; i < selector.length; i++) {
                    selector_end = i;
                    if (oplib.fn.EscapeCharRegex.test(selector[i])) {
                        //Remove escape char
                        selector = oplib.string.splice(selector, i, 1);
                        //Skip escaped char
                        continue;
                    }
                    if (oplib.fn.TextRegex.test(selector[i])) {
                        //Es darf kein anderer Selektor ausgewählt sein
                        //bzw. nur Kombinationsselektoren
                        if (selector_type == "no selector") {
                            selector_type = "tag";
                            selector_start = i;
                        }
                        //Nach Kombinationsselektoren Kombinationsselektoren auch
                        // parsen
                        if (selector_type == "children" || selector_type == "descendants" || selector_type == "neighbours" || selector_type == "siblings") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                            selector_type = "tag";
                            selector_start = i;
                        }
                    }
                    if (oplib.fn.UniversalRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "universal";
                        selector_start = i + 1;
                    }
                    if (oplib.fn.IdRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "id";
                        selector_start = i + 1;
                    }
                    if (oplib.fn.ClassRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "class";
                        selector_start = i + 1;
                    }
                    if (oplib.fn.AttributeStartRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "attribute";
                        selector_start = i + 1;
                        var name = "";
                        var prefix = "";
                        var equals = false;
                        var value = "";
                        var type = "name";
                        while (!oplib.fn.AttributeEndRegex.test(selector[i])) {
                            i++;
                            selector_end = i;
                            //Prefix ~, |, ^. $, *
                            if (/(~|\||\^|\$|\*)/.test(selector[i])) {
                                //Attribut Name
                                if (selector_type == "attribute") {
                                    name = selector.slice(selector_start, selector_end);
                                }
                                selector_type = "no selector";
                                prefix = selector[i];
                                type = "value";
                            }
                            //Gleich
                            if (/=/.test(selector[i])) {
                                //Attribut Name
                                if (selector_type == "attribute") {
                                    name = selector.slice(selector_start, selector_end);
                                }
                                selector_type = "attribute";
                                selector_start = i + 1;
                                equals = true;
                                type = "value";
                            }
                        }
                        //Attribut Name
                        if (selector_type == "attribute" && type == "name") {
                            name = selector.slice(selector_start, selector_end);
                        }
                        //Attribut Wert
                        else if (selector_type == "attribute" && type == "value") {
                            value = selector.slice(selector_start, selector_end);
                        }
                        //Selektor verarbeiten
                        selector_end++;
                        if (selector_start != selector_end && selector_type == "attribute") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: {
                                    name: name,
                                    prefix: prefix,
                                    equals: equals,
                                    value: value
                                }
                            });
                        }
                        selector_type = "no selector";
                    }
                    if (oplib.fn.DescendantRegex.test(selector[i])) {
                        //Lehrzeichen am Ende/Anfang ignorieren
                        if (selector[i + 1] != undefined && selector[i - 1] != undefined) {
                            //Vor kombinationsselektoren ignorieren + Keine
                            // mehrfachen Leerzeichen
                            if (!(oplib.fn.DescendantRegex.test(selector[i + 1]) || oplib.fn.ChildRegex.test(selector[i + 1]) || oplib.fn.NeighbourRegex.test(selector[i + 1]) || oplib.fn.SiblingRegex.test(selector[i + 1]))) {
                                //Nach kombinationsselektoren ignorieren
                                if (selector_type != "children" && selector_type != "descendants" && selector_type != "neighbours" && selector_type != "siblings") {
                                    //Vorherige Selectoren
                                    if (selector_type != "no selector") {
                                        parsedSelectors.push({
                                            type: selector_type,
                                            data: selector.slice(selector_start, selector_end)
                                        });
                                    }
                                    //Leerzeichen entfernen
                                    selector = oplib.string.splice(selector, i--, 1);
                                    selector_type = "descendants";
                                    selector_start = i + 1;
                                    continue;
                                }
                                else {
                                    //Zu viele Leerzeichen entfernen
                                    selector = oplib.string.splice(selector, i--, 1);
                                    continue;
                                }
                            }
                            else {
                                //Zu viele Leerzeichen entfernen
                                selector = oplib.string.splice(selector, i--, 1);
                                continue;
                            }
                        }
                        else {
                            //Zu viele Leerzeichen entfernen
                            selector = oplib.string.splice(selector, i--, 1);
                            continue;
                        }
                    }
                    if (oplib.fn.ChildRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        //FIXME: Keine Leerzeichen in Selektor data beinhalten
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "children";
                        selector_start = i;
                    }
                    if (oplib.fn.NeighbourRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        //FIXME: Keine Leerzeichen in Selektor data beinhalten
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "neighbours";
                        selector_start = i;
                    }
                    if (oplib.fn.SiblingRegex.test(selector[i])) {
                        //Vorherige Selectoren
                        //FIXME: Keine Leerzeichen in Selektor data beinhalten
                        if (selector_type != "no selector") {
                            parsedSelectors.push({
                                type: selector_type,
                                data: selector.slice(selector_start, selector_end)
                            });
                        }
                        selector_type = "siblings";
                        selector_start = i;
                    }
                }
                //Übrige Selektoren verarbeiten
                selector_end++;
                if (selector_type != "no selector") {
                    parsedSelectors.push({
                        type: selector_type,
                        data: selector.slice(selector_start, selector_end)
                    });
                }
            }

        }
        else if ( typeof selector === "object") {
            if (oplib.fn.isOPLib(selector)) {
                parsedSelectors.push({
                    type: "OPLib",
                    data: selector
                });
            }
        }

        return parsedSelectors;

    };

    //Wandelt geparste Selektoren in DOMObjecte um
    oplib.fn.ElementSelection.DOMObjectFromParsedSelector = function(selectors, context) {
        //Muss im context vorkommen.
        var elems = [];
        var useable;
        var dontCheck = false;
        if (!context || !context.length) {
            useable = [];
            dontCheck = true;
        }
        else {
            useable = oplib.fn.ElementSelection.children(context, 1);
            for (var i = 0; i < context.length; i++) {
                useable.push(context[i]);
            }
        }

        //Selectoren auswerten
        for (var i = 0; i < selectors.length; i++) {
            switch (selectors[i].type) {
                case "element":
                    if (!dontCheck && oplib.array.includes(useable, selectors[i].data) != -1) {
                        var matched = selectors[i].data;
                        useable = [];
                        useable.push(matched);
                        elems.push(matched);
                    }
                    else if (dontCheck) {
                        var matched = selectors[i].data;
                        useable = [];
                        useable.push(matched);
                        elems.push(matched);
                    }

                    break;
                case "universal":
                    var matched = useable;
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "tag":
                    var matched;
                    if (!dontCheck) {
                        matched = useable = oplib.array.sameElements(oplib.fn.ElementSelection.find.tag(selectors[i].data), useable);
                    }
                    else {
                        matched = useable = oplib.fn.ElementSelection.find.tag(selectors[i].data);
                    }
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "id":
                    if (!dontCheck && oplib.array.includes(useable, oplib.fn.ElementSelection.find.id(selectors[i].data)) != -1) {
                        var matched = oplib.fn.ElementSelection.find.id(selectors[i].data);
                        useable = [];
                        useable.push(matched);
                        elems.push(matched);
                    }
                    else if (dontCheck) {
                        var matched = oplib.fn.ElementSelection.find.id(selectors[i].data);
                        useable = [];
                        useable.push(matched);
                        elems.push(matched);
                    }
                    break;
                case "class":
                    var matched;
                    if (!dontCheck) {
                        matched = useable = oplib.array.sameElements(oplib.fn.ElementSelection.find.className(selectors[i].data), useable);
                    }
                    else {
                        matched = useable = oplib.fn.ElementSelection.find.className(selectors[i].data);
                    }
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "attribute":
                    var matched = [];
                    if (selectors[i].data.equals) {
                        switch (selectors[i].data.prefix) {
                            //Kein Prefix
                            case "":
                                for (var j = 0; j < useable.length; j++) {
                                    if (useable[j].getAttribute(selectors[i].data.name) == selectors[i].data.value) {
                                        matched.push(useable[j]);
                                        elems.push(useable[j]);
                                    }
                                }
                                break;
                            case "~":
                                for (var j = 0; j < useable.length; j++) {
                                    var attr = useable[j].getAttribute(selectors[i].data.name);
                                    attr = attr ? attr.split(" ") : [];
                                    for (var x = 0; x < attr.length; x++) {
                                        if (attr[x] == selectors[i].data.value) {
                                            matched.push(useable[j]);
                                            elems.push(useable[j]);
                                            break;
                                        }
                                    }
                                }
                                break;
                            case "|":
                                for (var j = 0; j < useable.length; j++) {
                                    var regexp = new RegExp("^" + oplib.regexp.quote(selectors[i].data.value));
                                    if (regexp.test(useable[j].getAttribute(selectors[i].data.name))) {
                                        matched.push(useable[j]);
                                        elems.push(useable[j]);
                                    }
                                }
                                break;
                            case "^":
                                for (var j = 0; j < useable.length; j++) {
                                    var regexp = new RegExp("^" + oplib.regexp.quote(selectors[i].data.value));
                                    if (regexp.test(useable[j].getAttribute(selectors[i].data.name))) {
                                        matched.push(useable[j]);
                                        elems.push(useable[j]);
                                    }
                                }
                                break;
                            case "$":
                                for (var j = 0; j < useable.length; j++) {
                                    var regexp = new RegExp(oplib.regexp.quote(selectors[i].data.value) + "$");
                                    if (regexp.test(useable[j].getAttribute(selectors[i].data.name))) {
                                        matched.push(useable[j]);
                                        elems.push(useable[j]);
                                    }
                                }
                                break;
                            case "*":
                                for (var j = 0; j < useable.length; j++) {
                                    var regexp = new RegExp(oplib.regexp.quote(selectors[i].data.value));
                                    if (regexp.test(useable[j].getAttribute(selectors[i].data.name))) {
                                        matched.push(useable[j]);
                                        elems.push(useable[j]);
                                    }
                                }
                                break;
                        }
                    }
                    else {
                        for (var j = 0; j < useable.length; j++) {
                            if (useable[j].getAttribute(selectors[i].data.name)) {
                                matched.push(useable[j]);
                                elems.push(useable[j]);
                            }
                        }
                    }
                    useable = matched;
                    break;
                case "descendants":
                    var matched = useable = oplib.fn.ElementSelection.children(useable, 1);
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "children":
                    var matched = useable = oplib.fn.ElementSelection.children(useable, 0);
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "neighbours":
                    var matched = useable = oplib.fn.ElementSelection.siblings(useable, 1);
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "siblings":
                    var matched = useable = oplib.fn.ElementSelection.siblings(useable, 0);
                    for (var j = 0; j < matched.length; j++) {
                        elems.push(matched[j]);
                    }
                    break;
                case "url":
                    var elem = document.createElement("div");
                    oplib.AJAX(selectors[i].data, function(text) {
                        elem.innerHTML = text;
                    }, "", {
                        async: false,
                        content: "text",
                    });
                    useable = [];
                    useable.push(elem);
                    elems.push(elem);
                    break;
                case "html":
                    var matched = oplib.fn.createDOMObject(selectors[i].data);
                    useable = [];
                    useable.push(matched);
                    elems.push(matched);
                    break;
                case "OPLib":
                    useable = [];
                    for (var j = 0; j < selectors[i].data.length; j++) {
                        useable.push(selectors[i].data[j]);
                        elems.push(selectors[i].data[j]);
                    }
                    break;
                default:
                    console.log("Couldn't analyze parsed Selector:");
                    console.log(selectors[i]);
            }
        }

        //Elemente müssen in useable vorkommen
        elems = oplib.array.sameElements(elems, useable);

        //Elemente dürfen nur einmal vorkommen
        elems = oplib.array.unique(elems);

        return elems;
    };

    //Überprüft ob es sich um HTML handelt
    oplib.fn.ElementSelection.isHtml = function(html) {
        return oplib.fn.HtmlRegex.test(html);
    };

    //Überprüft ob es sich um eine URL handelt
    oplib.fn.ElementSelection.isUrl = function(url) {
        return oplib.fn.UrlRegex.test(url);
    };

    //Namespace oplib.fn.ElementSelection.html festlegen
    oplib.fn.ElementSelection.html = {};

    //Überprüft ob der HTML-String ein einzelnes Element enthält.
    oplib.fn.ElementSelection.html.singleElement = function(htmlString) {
        return oplib.fn.HtmlSingleElementRegex.test(htmlString);
    };

    //Überprüft ob der HTML-String nur aus einem Tag besteht <tag>
    oplib.fn.ElementSelection.html.onlyTag = function(htmlString) {
        return oplib.fn.HtmlTagRegex.test(htmlString);
    };

    //Gibt das Tag aus einem HTML-String zurück
    oplib.fn.ElementSelection.html.tag = function(htmlString) {
        return htmlString.slice(htmlString.search(/</) + 1, htmlString.search(/(>|\s+)/));
    };

    //Gibt den Text aus einem HTML-String zurück
    oplib.fn.ElementSelection.html.text = function(htmlString) {
        //HTML-Tags entfernen
        return htmlString.replace(/<[\/\w\d\s=:\/\.&?"'`´]*>/g, "");
    };

    //Gibt die Attribute aus einem HTML-String zurück
    oplib.fn.ElementSelection.html.attr = function(htmlString) {
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

        //Erwartet ein Array;
        if ( parents instanceof Node) {
            parents = [parents];
        }

        //Funktion die alle untergeordneten Nodes findet
        var getChildren = function(parents, children, R) {
            for (var i = 0; i < parents.length; i++) {
                for (var j = 0; j < parents[i].children.length; j++) {
                    if (oplib.fn.array.includes(children, parents[i].children[j]) == -1) {
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

        //Erwartet ein Array
        if ( children instanceof Node) {
            children = [children];
        }

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
                    if (oplib.fn.array.includes(parents, children[i].parentNode) == -1) {
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

    /* Findet gleichgeordnete Nodes für die Elemente
     * N: Nur Nachbaren einschließen
     */
    oplib.fn.ElementSelection.siblings = function(elems, N) {
        //Erwartet ein Array
        if ( elems instanceof Node) {
            elems = [elems];
        }
        //Alle Siblings gefordert
        if (!N) {
            var parents = oplib.fn.ElementSelection.parents(elems);
            var siblings = oplib.fn.ElementSelection.children(parents, 0);
            for (var i = 0; i < elems.length; i++) {
                if (oplib.array.includes(siblings, elems[i]) != -1) {
                    siblings.splice(oplib.array.includes(siblings, elems[i]), 1);
                }
            }
            return siblings;
        }
        //Nur Nachbaren gefordert
        else {
            var neighbours = [];
            for (var i = 0; i < elems.length; i++) {
                if (elems[i].nextElementSibling != null) {
                    neighbours.push(elems[i].nextElementSibling);
                }
                if (elems[i].previousElementSibling != null) {
                    neighbours.push(elems[i].previousElementSibling);
                }
            }
            return neighbours;
        }

    };

    //Tauscht Elemente mit anderen Elementen aus
    oplib.fn.ElementSelection.replace = function(newElems, oldElems) {
        //Erwartet ein Array
        if ( oldElems instanceof Node) {
            oldElems = [oldElems];
        }
        if ( newElems instanceof Node) {
            newElems = [newElems];
        }
        for (var i = 0; i < oldElems.length; i++) {
            for (var j = 0; j < newElems.length; j++) {
                //Benötigt .parentNode
                if (!oldElems[i].parentNode) {
                    document.body.appendChild(oldElems[i]);
                    oldElems[i] = oldElems[i].parentNode.replaceChild(newElems[j], oldElems[i]);
                    document.body.removeChild(oldElems[i]);
                }
                else {
                    oldElems[i] = oldElems[i].parentNode.replaceChild(newElems[j], oldElems[i]);
                }
            }
        }
        return oldElems;
    };

    /* Findet entsprechende Elemente
     * selector: Selectors
     */
    oplib.fn.ElementSelection.find = function(elems, selector) {
        return oplib.fn.ElementSelection(selector, elems);
    };

    //Findet das Element mit dem angebenen ID
    oplib.fn.ElementSelection.find.id = function(id) {
        return document.getElementById(id);
    };

    //Findet die Elemente mit den angebenen Klassennamen
    oplib.fn.ElementSelection.find.className = function(className) {
        return document.getElementsByClassName(className);
    };

    //Findet Elemente mit dem angebenen Tag
    oplib.fn.ElementSelection.find.tag = function(tag) {
        return document.getElementsByTagName(tag);
    };

    //Erstellt ein DOMObject anhand eines Strings
    oplib.fn.createDOMObject = function(text) {
        //Funktioniert nur wenn der String ein einzelnes HTML-Element enthält
        if (oplib.fn.ElementSelection.html.singleElement(text)) {
            //Tag
            var elem = document.createElement(oplib.fn.ElementSelection.html.tag(text));
            //Text
            elem.innerHTML = oplib.fn.ElementSelection.html.text(text);
            //Attribute
            var attr = oplib.fn.ElementSelection.html.attr(text);
            for (var i = 0; i < attr.length; i++) {
                elem.setAttribute(attr[i].name, attr[i].value);
            }
            return elem;
        }
        //Funktioniert auch mit mehreren Elementen
        else {
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
    //Klont Elemente
    oplib.fn.finalizeDOMManipulation.clone = function(elems) {
        if ( typeof elems === "object") {
            var clones = [];
            for (var i = 0; i < elems.length; i++) {
                var clone = elems[i].cloneNode(true);
                oplib.fn.events.copyEvents(clone, elems[i]);
                clones.push(clone);
            }
            return clones;
        }
        else {
            var clone = elems.cloneNode(true);
            oplib.fn.events.copyEvents(clone, elems);
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
        return JSON.parse(json);
    };
    oplib.fn.JSON.stringify = function(obj) {
        //Use native Broswser Stringifier
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
                    for (var i in header) {
                        //Objecte in JSON umwandeln um AJAX-Request möglich zu
                        // machen
                        if ( typeof header[i] === "object") {
                            header[i] = oplib.fn.JSON.stringify(header[i]);
                        }
                        if (!parsedHeader) {
                            parsedHeader += ("?" + i + "=" + header[i]);
                        }
                        else {
                            parsedHeader += ("&" + i + "=" + header[i]);
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
                    for (var i in header) {
                        //Objecte in JSON umwandeln um AJAX-Request möglich zu
                        // machen
                        if ( typeof header[i] === "object") {
                            header[i] = oplib.fn.JSON.stringify(header[i]);
                        }
                        if (!parsedHeader) {
                            parsedHeader = i + "=" + header[i];
                        }
                        else {
                            parsedHeader += ("&" + i + "=" + header[i]);
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
        //Events kopieren
        copyEvents: function(copyTo, copyFrom) {
            for (var type in oplib.fn.handler.handleList) {
                if (oplib.fn.handler.handleList[type]) {
                    for (var i = 0; i < oplib.fn.handler.handleList[type].length; i++) {
                        if (oplib.fn.handler.handleList[type][i] && oplib.fn.handler.handleList[type][i].elem == copyFrom) {
                            oplib.fn.events.addEvent(type, oplib.fn.handler.handleList[type][i].fn, copyTo);
                        }
                    }
                }
            }
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
    oplib.fn.ready = function(fn) {
        return this.each(this, function(fn) {
            if (oplib.fn.ready.isReadyState[this]) {
                //Element bereits geladen, funktion direkt ausführen
                fn.apply();
            }
            //DOMContentLoaded-Event verpasst?
            else if (oplib.fn.ready.readyState === "complete") {
                oplib.fn.ready.isReadyState[this] = true;
                fn.apply();
            }
            else {
                oplib.fn.events.addEvent("DOMContentLoaded", oplib.fn.ready.handler, this);
                oplib.fn.events.addEvent("load", oplib.fn.ready.handler, this);
                oplib.fn.events.addEvent("OPready", fn, this);
            }
        }, [fn]);
    };
    //Entfernt fn aus der Handler Liste des ausgewählten Elements.
    oplib.fn.unready = function(fn) {
        return this.each(this, function(fn) {
            oplib.fn.events.removeEvent("OPready", fn, this);
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
            oplib.fn.events.dispatchEvent("OPready", e.target);

            //isReadyList[e.target] = true setzen
            oplib.fn.ready.isReadyState[e.target] = true;

            //Handler von e.target entfernen.
            oplib.fn.events.removeEvent("DOMContentLoaded", oplib.fn.ready.handler, e.target);
            oplib.fn.events.removeEvent("load", oplib.fn.ready.handler, e.target);

            return 0;
        },
        //Enthält, ob ein Element bereits bereit ist.
        isReadyState: {},
        //Fügt handleList[elem] die auszuführende Funktion zu, etc.
    });

    //Tooltips
    oplib.fn.Tooltip = function(selector, context) {
        var elems = oplib.fn.ElementSelection(selector, context);
        return this.finalizeDOMManipulation(this, function(elems) {
            for (var i = 0; i < elems.length; i++) {
                if (this.parentNode) {
                    this.parentNode.appendChild(elems[i]);
                }
                else {
                    document.body.appendChild(elems[i]);
                }
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
                    return i;
                }
            }
            return -1;
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
        },
        unique: function(arr) {
            var new_arr = [];
            for (var i = 0; i < arr.length; i++) {
                if (new_arr.indexOf(arr[i]) == -1) {
                    new_arr.push(arr[i]);
                }
            }
            return new_arr;
        },
    };

    oplib.string = oplib.fn.string = {
        splice: function(str, index, count, insert) {
            if (!count) {
                count = 1;
            }
            if (!insert) {
                insert = "";
            }
            return str.slice(0, index) + insert + str.slice(index + count);
        },
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

    //Funktionen die mit RegExp arbeiten
    oplib.regexp = oplib.fn.regexp = {
        quote: function(str) {
            return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        }
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
            },
            received: function() {
            },
            processing: function() {
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

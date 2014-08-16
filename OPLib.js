/**
 * OverPoweredLibrary
 */
var oplib = (function() {
	var oplib = function(selector, context) {
		return new oplib.fn.Init(selector, context);
	};

	oplib.fn = oplib.prototype = {
		constructor : oplib,
		//Elemente auswählen
		Init : function(selector, context) {
			//Ausgewählte Elemente zuweisen
			var elems = oplib.ElementSelection(selector, context);
			for (var i = 0; i < elems.length; i++) {
				this[i] = elems[i];
			}
			this.length = elems.length;

			this.op = true;

			this.selector = selector;
			this.context = context;

			return this;
		},
		//Attribut setzen
		attr : function(name, property) {
			//Wurde nur 'name' übergeben? - Attribut zurückgeben
			if (arguments.length == 1 && typeof name !== "object") {
				if (this.length != 0) {
					return this[0][name] || this[0].getAttribute(name);
				} else {
					return this;
				}
			}

			//Wurde ein Object mit den Attributen übergeben?
			if ( typeof name === "object") {
				for (var i in name) {
					//Attribute setzen
					this.each(function(name, prop) {
						this[name] = prop;
						this.setAttribute(name, prop);
					}, [i, name[i]]);
				}
			}
			//Es wurde ein einzelnes Attribut übergeben
			else {
				//Attribut setzen
				this.each(function(name, prop) {
					this[name] = prop;
					this.setAttribute(name, prop);
				}, [name, property]);
			}
			return this;
		},
		//Attribut entfernen
		removeAttr : function(name) {
			//Wurde ein Object mit den Attributen übergeben?
			if ( typeof name === "object") {
				if (name.length != undefined) {
					for (var i = 0; i < name.length; i++) {
						//Attribute entfernen
						this.each(function(name) {
							this[name] = "";
							this.removeAttribute(name);
						}, [name[i]]);
					}
				} else {
					for (var i in name) {
						//Attribute entfernen
						this.each(function(name) {
							this[name] = "";
							this.removeAttribute(name);
						}, [i, name[i]]);
					}
				}

			}
			//Es wurde ein einzelnes Attribut übergeben
			else {
				//Attribut entfernen
				this.each(function(name) {
					this[name] = "";
					this.removeAttribute(name);
				}, [name]);
			}
			return this;
		},
		//Klasse hinzufügen
		addClass : function(name) {
			return this.each(function(name) {
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
		removeClass : function(name) {
			return this.each(function(name) {
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
		hasClass : function(name) {
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
		css : function(name, value, args) {
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
						this.each(function(name, value) {
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
				return this.each(function(name, value) {
					this["style"][name] = value;
				}, [name, value]);
			}
			return this;
		},
		//Css-Attribute entfernen
		removeCss : function(name) {
			//Mehrere Css Werte löschen
			if ( typeof name === "object") {
				//Als Array angegeben
				if (name.length != undefined) {
					for (var i = 0; i < name.length; i++) {
						this.each(function(name) {
							this["style"][name] = "";
						}, [name[i]]);
					}
				}
				//Als Object angegeben
				else {
					for (var i in name) {
						this.each(function(name) {
							this["style"][name] = "";
						}, [i]);
					}
				}
			}
			//Nur ein Css Wert löschen
			else {
				return this.each(function(name) {
					this["style"][name] = "";
				}, [name]);
			}
			return this;
		},

		//Hängt Elemente an die übereinstimmenden Elemente am Ende an
		append : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(this, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					this.appendChild(elems[i]);
				}
				return this;
			}, [elems]);
		},
		//Hängt Elemente an die übereinstimmenden Elemente am Anfang an
		prepend : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(this, function(elems) {
				for (var i = 0; i < elems.length; i++) {
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
				return this;
			}, [elems]);
		},
		//Hängt Elemente vor die übereinstimmenden Elemente an
		before : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(this, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					this.parentNode.insertBefore(elems[i], this);
				}
				return this;
			}, [elems]);
		},
		//Hängt Elemente nach die übereinstimmenden Elemente an
		after : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(this, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					if (this.nextElementSibling != null) {
						this.nextElementSibling.parentNode.insertBefore(elems[i], this.nextElementSibling);
					} else {
						this.parentNode.appendChild(elems[i]);
					}
				}
				return this;
			}, [elems]);
		},
		//Hängt übereinstimmende Elemente an Elemente an
		appendTo : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(elems, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					elems[i] = this.appendChild(elems[i]);
				}
				return elems;
			}, [this]);
		},
		//Hängt übereinstimmende Elemente an die Elemente am Anfang an
		prependTo : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(elems, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					//Gibt es bereits untergeordnete Elemente?
					if (this.hasChildNodes()) {
						//Node
						if (this.childNodes && this.childNodes[0] != null) {
							elems[i] = this.insertBefore(elems[i], this.childNodes[0]);
						}
						//NodeList
						else if (this.item && this.item(0) != null) {
							elems[i] = this.insertBefore(elems[i], this.item(0));
						}
					}
					//Keine untergeordneten Element ==> .appendChild möglich
					else {
						elems[i] = this.appendChild(elems[i]);
					}
				}
				return elems;
			}, [this]);
		},
		//Hängt übereinstimmende Elemente vor Elemente an
		insertBefore : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(elems, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					elems[i] = this.parentNode.insertBefore(elems[i], this);
				}
				return elems;
			}, [this]);
		},
		//Hängt übereinstimmende Elemente nach Elemente an
		insertAfter : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			return this.finalizeDOMManipulation(elems, function(elems) {
				for (var i = 0; i < elems.length; i++) {
					if (this.nextElementSibling != null) {
						elems[i] = this.nextElementSibling.parentNode.insertBefore(elems[i], this.nextElementSibling);
					} else {
						elems[i] = this.parentNode.appendChild(elems[i]);
					}
				}
				return elems;
			}, [this]);
		},
		/*
		 * Fügt dem Object untergeordnete Nodes der übereinstimmenden Elemente
		 * hinzu
		 * R: Rekursive suche möglich
		 * O: Enthält auch eigene(s) Element(e)
		 */
		children : function(R, O) {
			var children = oplib.ElementSelection.children(this, R);

			//OPLib soll nur Child Nodes enthalten - Vorherige ELemente
			//löschen
			if (!O) {
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
		parents : function(R, rekursionLimit, O) {
			var Parents = oplib.ElementSelection.parents(this, R, rekursionLimit);

			//OPLib soll nur parentNodes enthalten - Vorherige ELemente
			//löschen
			if (!O) {
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
		siblings : function(N, O) {
			var Siblings = oplib.ElementSelection.siblings(this, N);

			//OPLib soll nur siblings enthalten - Vorherige ELemente löschen
			if (!O) {
				this.length = 0;
			}
			//Siblings in OPLib speichern
			for (var i = 0; i < Siblings.length; i++) {
				this.push(Siblings[i]);
			}
			return this;
		},
		//Setzt .innerHTML für die ausgewählten Elemente
		html : function(html) {
			return this.each(function() {
				this.innerHTML = html;
			}, [html]);
		},
		//Setzt .innerText für die ausgewählten Elemente
		text : function(text) {
			return this.each(function(text) {
				this.textContent = text;
			}, [text]);
		},
		//Findet alle Elemente anhand den in options angegebenen Einschränkungen
		//limitedTo: Darf nur Elemente aus limitedTo enthalten
		//O: Enthält auch eigene(s) Element(e)
		find : function(selector, O) {
			var elems = oplib.ElementSelection.find(this, selector);
			if (!O) {
				this.length = 0;
			}

			for (var i = 0; i < elems.length; i++) {
				this.push(elems[i]);
			}
			return this;
		},
		//Läd eine Datei per AJAX in die übereinstimmenden Elemente
		load : function(url, header, options) {
			if (!options) {
				options = {};
			}
			oplib.extend(options, {
				args : this
			});
			oplib.AJAX(url, function(text, readyState, status, elems) {
				oplib.each(elems, function(text) {
					this.innerHTML = text;
				}, [text]);
			}, header, options);
		},
		//Gibt Clones der ausgewählten Element zurück
		clone : function() {
			var clones = oplib.fn.finalizeDOMManipulation.clone(this);
			for (var i = 0; i < this.length; i++) {
				this[i] = clones[i];
			}
			return this;
		},
		//Ersetzt die ausgewähöten Elemente mit einem neuen Element
		replace : function(selector, context) {
			var elems = oplib.ElementSelection(selector, context);
			var replaced = oplib.ElementSelection.replace(elems, this);

			this.length = 0;

			for (var i = 0; i < replaced.length; i++) {
				this.push(replaced[i]);
			}
			return this;
		},
		//Gibt an ob die Elemente gehovert sind
		isHover : function(selector, context) {
			return oplib.ElementSelection.isHover(this);
		},
		getComputedStyle : function(expression, styles) {
			return oplib.getComputedStyle(expression, this[0], styles);
		},
		getDefaultComputedStyle : function(expression, styles) {
			return oplib.getDefaultComputedStyle(expression, this[0], styles);
		},
	};

	//Objecte zusammenführen
	oplib.merge = function(arr1, arr2) {
		//For-schleife für alle Elemente in arr2
		if (!arr1 || !arr2) {
			return arr1 || arr2 || [];
		}
		for (var i = 0; i < arr2.length; i++) {
			arr1.push(arr2[i]);
		}
		//Zusammengeführtes Array zurückgeben
		return arr1;

	};

	//Eine Funtion oder oplib.fn erweitern
	oplib.extend = function(obj, props) {
		//Objecte zusammenführen und zurückgeben
		for (var a = 1; a <= arguments.length; a++) {
			for (var i in arguments[a]) {
				if (arguments[a][i] == undefined) {
					continue;
				}
				obj[i] = arguments[a][i];
			}

		}
		return obj;
	};

	//Funktion in einem bestimmten Context mit verschiedenen Argumenten ausführen
	oplib.each = function(obj, fn, args) {
		//Alle Argument für die Funktion durchgehen
		if (obj.length != undefined) {
			for (var i = 0; i < obj.length; i++) {
				fn.apply(obj[i], args);
			}

		} else {
			for (var i in obj) {
				//Funktion mit Argumenten in verschiedenen Contexten ausführen
				fn.apply(i, args);
			}
		}
		return obj;
	};

	oplib.fn.each = function(fn, args) {
		return oplib.each(this, fn, args);
	};

	//Erstellt CamelCase
	oplib.camelCase = function(text) {
		text = text.replace(/-([a-z]|[A-Z])/g, function(match) {
			return match[1].toUpperCase();
		});
		text = text.replace(/ ([a-z]|[A-Z])/g, function(match) {
			return match[1].toUpperCase();
		});
		text = text.replace(/ /g, "");
		return text;
	};

	//Array Funktionen zugänglich machen
	oplib.fn.concat = Array.prototype.concat;
	oplib.fn.join = Array.prototype.join;
	oplib.fn.pop = Array.prototype.pop;
	oplib.fn.push = Array.prototype.push;
	oplib.fn.reverse = Array.prototype.reverse;
	oplib.fn.shift = Array.prototype.shift;
	oplib.fn.slice = Array.prototype.slice;
	oplib.fn.splice = Array.prototype.splice;
	oplib.fn.sort = Array.prototype.sort;
	oplib.fn.unshift = Array.prototype.unshift;

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
	oplib.fn.HtmlRegex = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>/;
	//Html - Single Element - Regex
	oplib.fn.HtmlSingleElementRegex = /^<[\w\d\s=\-;:\/\.%&?"'`´]*>[^<>]*<\/[\w\s]*>$/;
	//Html - Tag - Regex
	oplib.fn.HtmlTagRegex = /<(\w|\s)*>/;
	//Attribut - Start - Regex
	oplib.fn.AttributeStartRegex = /\[/;
	//Attribut - End - Regex
	oplib.fn.AttributeEndRegex = /\]/;

	//Selectiert die entsprechenden Elemente
	oplib.ElementSelection = function(selector, context) {
		var elems;
		//Context zuweisen //FIX #27 - Wenn kein Context angegeben sind alle
		// Elemente auswählbar
		if (context) {
			context = oplib.ElementSelection.DOMObjectFromSelector(context);
		}
		//Gewählte Elemente zuweisen
		elems = oplib.ElementSelection.DOMObjectFromSelector(selector, context);
		//Ausgewählte Elemente zurückgeben
		return elems;
	};

	//Wandelt einen Selector in ein DOMObject um
	oplib.ElementSelection.DOMObjectFromSelector = function(selector, context) {
		var selectors = [];

		//Wurde ein selector übergeben
		if (!selector) {
			//Standart Selector = document.body
			selector = document.body;

		}

		//Wurde ein context übergeben //FIX #27 - Wenn kein Context angegeben
		// sind alle Elemente auswählbar

		selectors = oplib.ElementSelection.DOMObjectFromSelector.ParseSelector(selector);

		return oplib.ElementSelection.DOMObjectFromParsedSelector(selectors, context);

	};

	//Parst den Selector
	oplib.ElementSelection.DOMObjectFromSelector.ParseSelector = function(selector) {
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
				type : "element",
				data : selector
			});

		}
		//Ist selector eine NodeList?
		else if ( selector instanceof NodeList) {
			for (var i = 0; i < selector.length; i++) {
				parsedSelectors.push({
					type : "element",
					data : selector[i]
				});
			}
		}
		//Ist Selector ein String, um Regexausdrücke anzuwenden?
		else if ( typeof selector === "string") {
			//Url angegeben. Keine weiteren Selektoren erwartet
			if (oplib.isUrl(selector)) {
				selector = selector.replace(oplib.fn.UrlRegex, "");
				parsedSelectors.push({
					type : "url",
					data : selector
				});
			}
			//Html angegeben, keine weiteren Selektoren erwartet
			else if (oplib.isHtml(selector)) {
				parsedSelectors.push({
					type : "html",
					data : selector
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
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
							});
							selector_type = "tag";
							selector_start = i;
						}
					}
					if (oplib.fn.UniversalRegex.test(selector[i])) {
						//Vorherige Selectoren
						if (selector_type != "no selector") {
							parsedSelectors.push({
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
							});
						}
						selector_type = "universal";
						selector_start = i + 1;
					}
					if (oplib.fn.IdRegex.test(selector[i])) {
						//Vorherige Selectoren
						if (selector_type != "no selector") {
							parsedSelectors.push({
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
							});
						}
						selector_type = "id";
						selector_start = i + 1;
					}
					if (oplib.fn.ClassRegex.test(selector[i])) {
						//Vorherige Selectoren
						if (selector_type != "no selector") {
							parsedSelectors.push({
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
							});
						}
						selector_type = "class";
						selector_start = i + 1;
					}
					if (oplib.fn.AttributeStartRegex.test(selector[i])) {
						//Vorherige Selectoren
						if (selector_type != "no selector") {
							parsedSelectors.push({
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
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
							if (/(~|\||\^|\$|\*|!)/.test(selector[i])) {
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
								type : selector_type,
								data : {
									name : name,
									prefix : prefix,
									equals : equals,
									value : value
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
											type : selector_type,
											data : selector.slice(selector_start, selector_end)
										});
									}
									//Leerzeichen entfernen
									selector = oplib.string.splice(selector, i--, 1);
									selector_type = "descendants";
									selector_start = i + 1;
									continue;
								} else {
									//Zu viele Leerzeichen entfernen
									selector = oplib.string.splice(selector, i--, 1);
									continue;
								}
							} else {
								//Zu viele Leerzeichen entfernen
								selector = oplib.string.splice(selector, i--, 1);
								continue;
							}
						} else {
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
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
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
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
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
								type : selector_type,
								data : selector.slice(selector_start, selector_end)
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
						type : selector_type,
						data : selector.slice(selector_start, selector_end)
					});
				}
			}

		} else if ( typeof selector === "object") {
			if (oplib.isOPLib(selector)) {
				parsedSelectors.push({
					type : "OPLib",
					data : selector
				});
			}
			if (selector === window) {
				parsedSelectors.push({
					type : "window",
					data : selector
				});
			}
		}
		return parsedSelectors;
	};

	//Wandelt geparste Selektoren in DOMObjecte um
	oplib.ElementSelection.DOMObjectFromParsedSelector = function(selectors, context) {
		//Muss im context vorkommen.
		var elems = [];
		var useable;
		var dontCheck = false;
		if (!context || !context.length) {
			useable = [];
			dontCheck = true;
		} else {
			useable = oplib.ElementSelection.children(context, 1);
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
					} else if (dontCheck) {
						var matched = selectors[i].data;
						useable = [];
						useable.push(matched);
						elems.push(matched);
						dontCheck = false;
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
						matched = useable = oplib.array.sameElements(oplib.ElementSelection.find.tag(selectors[i].data), useable);
					} else {
						matched = useable = oplib.ElementSelection.find.tag(selectors[i].data);
						dontCheck = false;
					}
					for (var j = 0; j < matched.length; j++) {
						elems.push(matched[j]);
					}
					break;
				case "id":
					if (!dontCheck && oplib.array.includes(useable, oplib.ElementSelection.find.id(selectors[i].data)) != -1) {
						var matched = oplib.ElementSelection.find.id(selectors[i].data);
						useable = [];
						useable.push(matched);
						elems.push(matched);
					} else if (dontCheck) {
						var matched = oplib.ElementSelection.find.id(selectors[i].data);
						useable = [];
						useable.push(matched);
						elems.push(matched);
						dontCheck = false;
					}
					break;
				case "class":
					var matched;
					if (!dontCheck) {
						matched = useable = oplib.array.sameElements(oplib.ElementSelection.find.className(selectors[i].data), useable);
					} else {
						matched = useable = oplib.ElementSelection.find.className(selectors[i].data);
						dontCheck = false;
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
							case "!":
								for (var j = 0; j < useable.length; j++) {
									if (useable[j].getAttribute(selectors[i].data.name) != selectors[i].data.value) {
										matched.push(useable[j]);
										elems.push(useable[j]);
									}
								}
								break;
						}
					} else {
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
					var matched = useable = oplib.ElementSelection.children(useable, 1);
					for (var j = 0; j < matched.length; j++) {
						elems.push(matched[j]);
					}
					break;
				case "children":
					var matched = useable = oplib.ElementSelection.children(useable, 0);
					for (var j = 0; j < matched.length; j++) {
						elems.push(matched[j]);
					}
					break;
				case "neighbours":
					var matched = useable = oplib.ElementSelection.siblings(useable, 1);
					for (var j = 0; j < matched.length; j++) {
						elems.push(matched[j]);
					}
					break;
				case "siblings":
					var matched = useable = oplib.ElementSelection.siblings(useable, 0);
					for (var j = 0; j < matched.length; j++) {
						elems.push(matched[j]);
					}
					break;
				case "url":
					var elem = document.createElement("div");
					oplib.AJAX(selectors[i].data, function(text) {
						elem.innerHTML = text;
					}, "", {
						async : false,
						content : "text",
					});
					useable = [];
					useable.push(elem);
					elems.push(elem);
					break;
				case "html":
					var dom = oplib.fn.createDOMObject(selectors[i].data);

					useable = [];

					for (var j = 0; j < dom.length; j++) {
						elems.push(dom[j]);
						useable.push(dom[j]);
					}

					// var matched = oplib.fn.createDOMObject(selectors[i].data);
					// useable = [];
					// useable.push(matched);
					// elems.push(matched);
					break;
				case "OPLib":
					useable = [];
					for (var j = 0; j < selectors[i].data.length; j++) {
						useable.push(selectors[i].data[j]);
						elems.push(selectors[i].data[j]);
					}
					break;
				case "window":
					useable = [selectors[i].data];
					elems = [selectors[i].data];
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

	/*
	 * Findet untergeordnete Nodes für die Elemente
	 * R: Rekursive Suche möglich
	 */
	oplib.ElementSelection.children = function(parents, R) {
		var children = [];

		//Erwartet ein Array;
		if ( parents instanceof Node) {
			parents = [parents];
		}

		//Funktion die alle untergeordneten Nodes findet
		var getChildren = function(parents, children, R) {
			for (var i = 0; i < parents.length; i++) {
				if (!parents[i].children) {
					continue;
				}
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
	oplib.ElementSelection.parents = function(children, R, rekursionLimit) {

		var Parents = [];
		var topLimit;

		//Erwartet ein Array
		if ( children instanceof Node) {
			children = [children];
		}

		if (rekursionLimit && rekursionLimit.parentNode) {
			topLimit = rekursionLimit.parentNode;
		} else {
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
	oplib.ElementSelection.siblings = function(elems, N) {
		//Erwartet ein Array
		if ( elems instanceof Node) {
			elems = [elems];
		}
		//Alle Siblings gefordert
		if (!N) {
			var parents = oplib.ElementSelection.parents(elems);
			var siblings = oplib.ElementSelection.children(parents, 0);
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
	oplib.ElementSelection.replace = function(newElems, oldElems) {
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
				} else {
					oldElems[i] = oldElems[i].parentNode.replaceChild(newElems[j], oldElems[i]);
				}
			}
		}
		return oldElems;
	};

	//Überprüft ob das Element gehovert ist
	oplib.ElementSelection.isHover = function(elems) {
		//Globaler Handler schon gesetzt?
		if (!oplib.modules.isHover) {
			oplib.fn.events.addEvent("mouseover", function(e) {
				var elem = e.target;
				while (elem) {
					if (!elem.oplib) {
						elem.oplib = {};
					}
					if (!elem.oplib.events) {
						elem.oplib.events = {};
					}

					elem.oplib.events.isHover = true;
					elem = elem.parentNode;
				}
			}, window);
			oplib.fn.events.addEvent("mouseout", function(e) {
				var elem = e.target;
				while (elem) {
					if (!elem.oplib) {
						elem.oplib = {};
					}
					if (!elem.oplib.events) {
						elem.oplib.events = {};
					}

					elem.oplib.events.isHover = false;
					elem = elem.parentNode;
				}
			}, window);
			oplib.modules.isHover = true;
		}

		if (!elems) {
			return false;
		}

		if ( elems instanceof Node) {
			if (!elems.oplib) {
				elems.oplib = {};
			}
			if (!elems.oplib.events) {
				elems.oplib.events = {};
			}
			if (elems.oplib.events.isHover) {
				return true;
			} else {
				return false;
			}
		} else {
			var matched = [];
			for (var i = 0; i < elems.length; i++) {
				if (!elems[i].oplib) {
					elems[i].oplib = {};
				}
				if (!elems[i].oplib.events) {
					elems[i].oplib.events = {};
				}
				if (elems[i].oplib.events.isHover) {
					matched.push(elems[i]);
				}
			}
			return matched;
		}

	};

	/* Findet entsprechende Elemente
	 * selector: Selectors
	 */
	oplib.ElementSelection.find = function(elems, selector) {
		return oplib.ElementSelection(selector, elems);
	};

	//Findet das Element mit dem angebenen ID
	oplib.ElementSelection.find.id = function(id) {
		return document.getElementById(id);
	};

	//Findet die Elemente mit den angebenen Klassennamen
	oplib.ElementSelection.find.className = function(className) {
		return document.getElementsByClassName(className);
	};

	//Findet Elemente mit dem angebenen Tag
	oplib.ElementSelection.find.tag = function(tag) {
		return document.getElementsByTagName(tag);
	};

	//Überprüft ob es sich um ein OPObject Handelt
	oplib.isOPLib = function(obj) {
		if (!obj) {
			return false;
		}
		if (obj.op) {
			return true;
		} else {
			return false;
		}
	};

	//Überprüft ob es sich um HTML handelt
	oplib.isHtml = function(html) {
		return oplib.fn.HtmlRegex.test(html);
	};

	//Überprüft ob es sich um eine URL handelt
	oplib.isUrl = function(url) {
		return oplib.fn.UrlRegex.test(url);
	};

	//Überprüft ob das Element gehovert ist
	oplib.isHover = oplib.ElementSelection.isHover;

	//Gibt den errechneten Wert des Css-Ausdrucks zurück
	oplib.getComputedStyle = function(expression, elem, styles) {
		var clone = oplib.fn.finalizeDOMManipulation.clone([elem])[0];
		var value;
		oplib.extend(clone.style, styles);
		document.body.appendChild(clone);
		value = window.getComputedStyle(clone)[expression];
		document.body.removeChild(clone);
		return value;
	};

	//Gibt den Standartwert des errechneten Wert des Css-Ausdrucks zurück
	oplib.getDefaultComputedStyle = function(expression, elem, styles) {
		var clone = oplib.fn.finalizeDOMManipulation.clone([elem])[0];
		var value;
		clone.style.cssText = "";
		oplib.extend(clone.style, styles);
		document.body.appendChild(clone);
		value = window.getComputedStyle(clone)[expression];
		document.body.removeChild(clone);
		return value;
	};

	//Erstellt ein DOMObject anhand eines Strings
	oplib.fn.createDOMObject = function(text) {
		//HTML als XML Parsen
		var dom = oplib.DOM(text, "text/html");
		var nodes = dom.getElementsByTagName("body")[0].children;
		var elems = [];
		for (var i = 0; i < nodes.length; i++) {
			var elem = document.createElement(nodes[i].tagName);
			var attributes = nodes[i].attributes;
			for (var j = 0; j < attributes.length; j++) {
				elem.setAttribute(attributes[j].name, attributes[j].value);
			}
			elem.innerHTML = nodes[i].innerHTML;
			elems.push(elem);
		}
		return elems;
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
			expression = oplib.camelCase(expression);
		} else if ( typeof value === "number") {
			value = value.toString();
			//"width" -> Einheit benötigt
			if (expression.search(/(width|height|position|origin|size|padding|margin|spacing|gap)/i) != -1) {
				if (!args) {
					value += oplib.defaults.get("cssUnit");
				} else {
					value += args;
				}
			}
			//"top" -> Einheit benötigt
			else if (expression.search(/^(top|bottom|left|rigth|flex-?basis)/i) != -1) {
				if (!args) {
					value += oplib.defaults.get("cssUnit");
				} else {
					value += args;
				}
			}
		}
		return [expression, value];
	};

	//Wandelt Css-Werte in verrechenbare Werte um ("10px" -> 10 "100%" [width])
	oplib.fn.floatCssValue = function(value) {
		return parseFloat(value);
	};

	//Ermittelt die Einheit eines Css-Wertes
	oplib.fn.getCssUnit = function(value) {
		var unit = "";
		if ( typeof value === "string") {
			if (value.search(/[\d\.]/g) == -1) {
				unit = oplib.defaults.get("cssUnit");
			} else {
				unit = value.replace(/[\d\.]/g, "");
			}

		}
		return unit.toLowerCase();
	};

	//Setzt die Einheit eines Css-Wertes
	oplib.fn.setCssUnit = function(value, unit) {
		//Alte Einheit entfernen
		value = value.replace(oplib.fn.getCssUnit(value), "");
		//Neue Einheit anfügen
		return value += unit;
	};

	//Konvertiert Einheiten eines Css-Wertes
	oplib.fn.convertCssUnit = function(value, unit, expression, elem) {
		var oldUnit = oplib.fn.getCssUnit(value);
		var valueInPx;
		var conversionFactor;
		//In Pixel umrechnen
		if (oldUnit == "px") {
			conversionFactor = 1;
		} else if (oldUnit == "%") {
			conversionFactor = oplib.fn.floatCssValue(oplib.getComputedStyle(expression, elem.parentNode || document.body)) / 100;
		} else {
			conversionFactor = oplib.defaults.get("cssConversions", oldUnit + "ToPx");
		}
		valueInPx = oplib.fn.floatCssValue(value) * conversionFactor;
		//In neue Einheit umrechnen
		if (unit == "%") {
			conversionFactor = 100 / oplib.fn.floatCssValue(oplib.getComputedStyle(expression, elem.parentNode || document.body));
		} else if (unit == "px") {
			conversionFactor = 1;
		} else {
			conversionFactor = oplib.defaults.get("cssConversions", oplib.camelCase("px-to-" + unit));
		}
		return (valueInPx * conversionFactor).toString() + unit;
	};

	//Klont Elemente, etc...
	oplib.fn.finalizeDOMManipulation = function(obj, fn, args) {
		var returns = [];
		if (obj.length <= 1) {
			oplib.each(obj, function(fn, elems) {
				returns.push(fn.apply(this, [elems]));
			}, [fn, args[0]]);
		} else {
			oplib.each(obj, function(fn, elems) {
				var clones = oplib.fn.finalizeDOMManipulation.clone(elems);
				returns.push(fn.apply(this, [clones]));
			}, [fn, args[0]]);

			//Element löschen
			oplib.each(args[0], function() {
				if (this.parentNode) {
					this.parentNode.removeChild(this);
				}
				//Element muss in DOM eingeordnet werden
				else {
					document.body.appendChild(this);
					document.body.removeChild(this);
				}
			}, []);
		}

		//Alte Elemente entfernen und durch neue ersetzen
		this.length = 0;
		for (var i = 0; i < returns.length; i++) {
			//Falls returns[i] ein Array (.appendTo,...) ist, das Array
			// durchgehen
			if (toString.call(returns[i]) === "[object Array]") {
				for (var j = 0; j < returns[i].length; j++) {
					this.push(returns[i][j]);
				}
			} else {
				this.push(returns[i]);
			}
		}

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
		} else {
			var clone = elems.cloneNode(true);
			oplib.fn.events.copyEvents(clone, elems);
			return [clone];
		}
	};

	//Abkürzungen für allgemeine Animationen
	oplib.extend(oplib.fn, {
		hide : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					width : "hide",
					height : "hide",
					opacity : "hide",
					margin : "hide",
					padding : "hide",
				}, duration, interpolator, callbacks, scope);

			}, [duration, interpolator, callbacks, scope || this]);
		},
		show : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					width : "show",
					height : "show",
					opacity : "show",
					margin : "show",
					padding : "show",
				}, duration, interpolator, callbacks, scope);
			}, [duration, interpolator, callbacks, scope || this]);

		},
		slideUp : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					height : "hide",
					marginTop : "hide",
					paddingTop : "hide",
					marginBottom : "hide",
					paddingBottom : "hide",
				}, duration, interpolator, callbacks, scope);

			}, [duration, interpolator, callbacks, scope || this]);
		},
		slideDown : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					height : "show",
					marginTop : "show",
					paddingTop : "show",
					marginBottom : "show",
					paddingBottom : "show",
				}, duration, interpolator, callbacks, scope);
			}, [duration, interpolator, callbacks, scope || this]);

		},
		slideLeft : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					width : "hide",
					marginRight : "hide",
					paddingRight : "hide",
					marginLeft : "hide",
					paddingLeft : "hide",
				}, duration, interpolator, callbacks, scope);

			}, [duration, interpolator, callbacks, scope || this]);
		},
		slideRight : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					width : "show",
					marginRight : "show",
					paddingRight : "show",
					marginLeft : "show",
					paddingLeft : "show",
				}, duration, interpolator, callbacks, scope);
			}, [duration, interpolator, callbacks, scope || this]);

		},
		fadeOut : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					opacity : "hide",
				}, duration, interpolator, callbacks, scope);

			}, [duration, interpolator, callbacks, scope || this]);
		},
		fadeIn : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					opacity : "show",
				}, duration, interpolator, callbacks, scope);
			}, [duration, interpolator, callbacks, scope || this]);

		},
		fadeTo : function(to, duration, interpolator, callbacks, scope) {
			return this.each(function(to, duration, interpolator, callbacks, scope) {
				oplib.fx([this], {
					opacity : to,
				}, duration, interpolator, callbacks, scope);
			}, [to, duration, interpolator, callbacks, scope || this]);
		},
		toggle : function(duration, interpolator, callbacks, scope) {
			return this.each(function(duration, interpolator, callbacks, scope) {
				if (!this.oplib) {
					this.oplib = {};
				}
				oplib.fx([this], {
					width : "toggle",
					height : "toggle",
					opacity : "toggle",
					margin : "toggle",
					padding : "toggle",
				}, duration, interpolator, callbacks, scope);
			}, [duration, interpolator, callbacks, scope || this]);
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
	 *  "linear"|"accelerate"|"decelerate|acceleratedecelerate"
	 * callbacks:
	 *  function|{done: function}|{done: object}
	 * scope:
	 *  Scope
	 */
	oplib.fn.anim = function(options, duration, interpolator, callbacks, scope) {
		if (!options) {
			return this;
		}

		oplib.fx(this, options, duration, interpolator, callbacks, scope);

		return this;
	};

	oplib.fn.stop = function(stopAll, finish) {
		return this.each(function(stopAll, finish) {
			oplib.fx.stop(this, stopAll, finish);
		}, [stopAll, finish]);
	};

	//Animiert Objekte
	oplib.fx = function(elems, options, duration, interpolator, callbacks, scope) {
		if (duration == undefined) {
			if (options.duration) {
				duration = options.duration;
				delete options.duration;
			} else {
				duration = oplib.defaults.get("animationSettings", "duration");
			}
		}
		if (!interpolator) {
			if (options.interpolator) {
				interpolator = options.interpolator;
				delete options.interpolator;
			} else {
				interpolator = oplib.defaults.get("animationSettings", "interpolator");
			}
		}
		if (!callbacks) {
			if (options.callbacks) {
				callbacks = options.callbacks;
				delete options.callbacks;
			} else {
				callbacks = oplib.defaults.get("animationSettings", "callbacks");
			}
		}
		if (!scope) {
			if (options.scope) {
				scope = options.scope;
				delete options.scope;
			} else if (oplib.isOPLib(elems)) {
				scope = elems;
			} else {
				scope = oplib.defaults.get("animationSettings", "scope");
			}
		}

		if (options.duration != undefined) {
			delete options.duration;
		}
		if (options.interpolator != undefined) {
			delete options.interpolator;
		}
		if (options.callbacks != undefined) {
			delete options.callbacks;
		}
		if (options.scope != undefined) {
			delete options.scope;
		}

		//Argumente interpretieren
		if (duration == "normal") {
			duration = oplib.defaults.get("animationSettings", "normal");
		}
		if (duration == "fast") {
			duration = oplib.defaults.get("animationSettings", "fast");
		}
		if (duration == "slow") {
			duration = oplib.defaults.get("animationSettings", "slow");
		}

		//Firefox hat Probleme mit padding/margin #42
		if (options.padding) {
			options.paddingTop = options.padding;
			options.paddingBottom = options.padding;
			options.paddingLeft = options.padding;
			options.paddingRight = options.padding;
			delete options.padding;
		}
		if (options.margin) {
			options.marginTop = options.margin;
			options.marginBottom = options.margin;
			options.marginLeft = options.margin;
			options.marginRight = options.margin;
			delete options.margin;
		}

		for (var i = 0; i < elems.length; i++) {
			//Wird das Element bereits aniemiert, dann als Callback "done" daran
			// anhägen
			var callbackAdded = false;

			for (var j = 0; j < oplib.fx.queue.length; j++) {
				if (oplib.fx.queue[j].elem == elems[i]) {
					var callbackOptions = oplib.extend(options, {
						duration : duration,
						interpolator : interpolator,
						callbacks : callbacks,
						scope : scope,
					});
					oplib.fx.queue[j].callbacks = oplib.fx.addCallback(oplib.fx.queue[j].callbacks, callbackOptions, "done");
					callbackAdded = true;
				}
			}
			if (!callbackAdded) {
				oplib.fx.init(elems[i], options, duration, interpolator, callbacks, scope);
			}

		}
	};

	oplib.extend(oplib.fx, {
		init : function(elem, options, duration, interpolator, callbacks, scope) {

			//Optionen interpretieren
			var cssSettings = {};
			var callbacks = callbacks || {};
			var done = false;
			var optionsCount = 0;
			var optionsEqual = 0;
			for (var i in options) {
				//Auf callbacks reagieren
				if (i == "callbacks") {
					callbacks = options[i];
					continue;
				}
				//Auf interpolator reagieren
				if (i == "interpolator") {
					interpolator = options[i];
					continue;
				}
				//Auf scope reagieren
				if (i == "scope") {
					scope = options[i];
					continue;
				}
				//Status des Elements festhalten
				if (!elem.oplib) {
					elem.oplib = {};
				}
				if (!elem.oplib.stylesChanged) {
					elem.oplib.stylesChanged = [];
				}
				if (options[i] == "toggle") {
					if (elem.style.display == "none") {
						options[i] = "show";
					} else if (elem.style.display != "none") {
						options[i] = "hide";
					}
				}
				if (options[i] == "show") {
					if (elem.style.display == "none" || elem.oplib.state != "shown") {
						if (!elem.oplib.state) {
							if (elem.style.display == "none") {
								elem.oplib.oldDisplay = oplib.getComputedStyle("display", elem, {
									display : ""
								});
								if (elem.oplib.oldDisplay == oplib.getDefaultComputedStyle("display", elem)) {
									elem.oplib.oldDisplay = "";
								}
							} else {
								elem.oplib.oldDisplay = oplib.getComputedStyle("display", elem);
							}

							elem.oplib.oldStyle = {};
						}
						elem.oplib.stylesChanged.push(i);
						elem.oplib.state = "showing";

						cssSettings[i] = {};
						//Annehmen, dass das Element ganz versteckt ist
						if (elem.style.display == "none") {
							cssSettings[i].old = 0;
						}
						//Ansonsten Wert direkt berechnen
						else {
							cssSettings[i].old = oplib.fn.floatCssValue(oplib.getComputedStyle(i, elem));
						}
						var styles = oplib.extend({}, elem.oplib.oldStyle);
						styles.display = elem.oplib.oldDisplay;
						cssSettings[i].aim = oplib.fn.floatCssValue(oplib.getDefaultComputedStyle(i, elem, styles));
					}

				} else if (options[i] == "hide") {
					if (elem.style.display != "none" || elem.oplib.state != "hidden") {
						if (elem.oplib.state != "hiding" && elem.oplib.state != "showing") {
							elem.oplib.oldStyle = oplib.extend({}, elem.style);
							elem.oplib.oldDisplay = elem.style.display;
						}
						elem.oplib.stylesChanged.push(i);
						elem.oplib.state = "hiding";

						cssSettings[i] = {};
						cssSettings[i].old = oplib.fn.floatCssValue(oplib.getComputedStyle(i, elem));
						cssSettings[i].current = oplib.fn.floatCssValue(oplib.getComputedStyle(i, elem));
						cssSettings[i].aim = 0;
					}

				} else {
					cssSettings[i] = {};
					cssSettings[i].unit = oplib.fn.getCssUnit(options[i]);

					cssSettings[i].old = oplib.fn.floatCssValue(oplib.fn.convertCssUnit(oplib.getComputedStyle(i, elem), cssSettings[i].unit, i, elem));
					cssSettings[i].current = oplib.fn.floatCssValue(oplib.fn.convertCssUnit(oplib.getComputedStyle(i, elem), cssSettings[i].unit, i, elem));
					cssSettings[i].aim = oplib.fn.floatCssValue(oplib.fn.convertCssUnit(options[i], cssSettings[i].unit, i, elem));

					//Make sure to apply all style changes afterwards #30
					elem.oplib.aim = {};
					elem.oplib.unit = {};
					elem.oplib.aim[i] = cssSettings[i].aim;
					elem.oplib.unit[i] = cssSettings[i].unit;
				}

				//Auf gleiche Optionen untersuchen, Keine sinnlosen Animationen
				optionsCount++;
				if (!cssSettings[i] || cssSettings[i].old == cssSettings[i].aim) {
					optionsEqual++;
				}

			}

			//Annehmen, dass Callbacks "done" gemeint ist
			if ( typeof callbacks === "function") {
				callbacks = {
					done : callbacks
				};
			}
			//Benötigte Callbacks:
			if (elem.oplib.state == "showing") {
				callbacks = oplib.fx.addCallback(callbacks, function(elem) {
					elem.style.display = elem.oplib.oldDisplay;
				}, "OPstart");
				callbacks = oplib.fx.addCallback(callbacks, function(elem) {
					for (var i = 0; i < elem.oplib.stylesChanged.length; i++) {
						elem.style[elem.oplib.stylesChanged[i]] = elem.oplib.oldStyle[elem.oplib.stylesChanged[i]];
					}
					elem.oplib.stylesChanged.length = 0;
					elem.style.overflow = elem.oplib.oldOverflow;
					elem.oplib.state = "shown";
				}, "OPdone");
			} else if (elem.oplib.state == "hiding") {
				callbacks = oplib.fx.addCallback(callbacks, function(elem) {
					for (var i = 0; i < elem.oplib.stylesChanged.length; i++) {
						elem.style[elem.oplib.stylesChanged[i]] = elem.oplib.oldStyle[elem.oplib.stylesChanged[i]];
					}
					elem.oplib.stylesChanged.length = 0;
					elem.style.display = "none";
					elem.style.overflow = elem.oplib.oldOverflow;
					elem.oplib.state = "hidden";
				}, "OPdone");
			}
			//Make sure to apply all changes afterwards #30
			callbacks = oplib.fx.addCallback(callbacks, function(elem) {
				for (var i in elem.oplib.aim) {
					elem.style[i] = elem.oplib.aim[i] + elem.oplib.unit[i];
				}
			}, "OPdone");

			//Alle Optionen gleich  --> Animation ist fertig
			if (optionsEqual / optionsCount == 1) {
				done = true;
			}

			oplib.fx.queue.push({
				elem : elem,
				options : cssSettings,
				duration : duration,
				interpolator : interpolator,
				start_time : oplib.TIME.getCurrentTime(),
				callbacks : callbacks,
				scope : scope,
				done : done,
			});

			//Overflow setzen:
			if (!elem.oplib) {
				elem.oplib = {};
			}
			elem.oplib.oldOverflow = elem.style.overflow;
			elem.style.overflow = "hidden";

			if (!oplib.fx.animatorRunning) {
				oplib.fx.animatorId = setTimeout(oplib.fx.animate, oplib.defaults.get("animationSettings", "frameTime"));
				oplib.fx.animatorRunning = true;
			}
		},
		end : function(i, elem, callbacks, scope) {
			oplib.fx.queue.splice(i, 1);

			//Overflow zurücksetzen
			elem.style.overflow = elem.oplib.oldOverflow;

			//Callbacks "OPdone" aufrufen
			callbacks = oplib.fx.callback(elem, callbacks, "OPdone", scope);
			//Callbacks "done" aufrufen
			callbacks = oplib.fx.callback(elem, callbacks, "done", scope);

			if (!oplib.fx.queue.length) {
				clearTimeout(oplib.fx.animatorId);
				oplib.fx.animatorRunning = false;
			}
			return oplib.fx.animatorId;
		},
		stop : function(elem, stopAll, finish) {
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
								if ( typeof oplib.fx.queue[i].callbacks.done[j] === "object") {
									oplib.fx.queue[i].callbacks.done.splice(j--, 1);
								}
							}
						} else if (oplib.fx.queue[i].callbacks.done && typeof oplib.fx.queue[i].callbacks.done === "object") {
							delete oplib.fx.queue[i].callbacks.done;
						}
					}

					//Die laufende Animation beenden
					if (finish) {
						oplib.fx.queue[i].duration = 1;
					}

					//Die laufende Animation stoppen
					if (!finish && oplib.fx.queue[i].callbacks.OPdone) {
						//Kein display:none when Animationen gestoppt werden
						delete oplib.fx.queue[i].callbacks.OPdone;
					}
					oplib.fx.queue[i].done = true;
				}
			}
		},
		//Enthält zu animerende Elemente mit ihren Eigenschaften
		queue : [],
		//Wird .animate() bereits ausgeführt
		animatorRunning : false,
		//setIntervar() ID um .animator() zu stoppen
		animatorId : 0,
		//Animiert Objekte für Zeit t;
		animate : function() {
			var currentTime = oplib.TIME.getCurrentTime();
			var actualProgress;
			var animationProgress;

			var elem, options, duration, interpolator, start_time, actual_time, callbacks, scope;

			var done = [];

			for (var i = 0; i < oplib.fx.queue.length; i++) {
				elem = oplib.fx.queue[i].elem;
				options = oplib.fx.queue[i].options;
				duration = oplib.fx.queue[i].duration;
				interpolator = oplib.fx.queue[i].interpolator;
				start_time = oplib.fx.queue[i].start_time;
				actual_time = currentTime - start_time;
				callbacks = oplib.fx.queue[i].callbacks;
				scope = oplib.fx.queue[i].scope;
				actualProgress = actual_time / duration;

				if (actualProgress > 1.0) {
					actualProgress = 1.0;
				}
				animationProgress = oplib.fx.interpolate(interpolator, actualProgress);

				//Callbacks "OPstart" aufrufen
				callbacks = oplib.fx.callback(elem, callbacks, "OPstart", scope);
				//Callbacks "start" aufrufen
				callbacks = oplib.fx.callback(elem, callbacks, "start", scope);
				//Callbacks "update" aufrufen
				oplib.fx.callback(elem, callbacks, "update", scope);

				for (var j in options) {
					options[j].current = options[j].old + (options[j].aim - options[j].old) * animationProgress;
					var apply = oplib.fn.finalizeCssExpressions(j, options[j].current, options[j].unit);
					elem.style[apply[0]] = apply[1];
				}

				if (actualProgress == 1.0 || oplib.fx.queue[i].done) {
					done.push(i);
				}

				//Queue updaten
				oplib.fx.queue[i].callbacks = callbacks;

			}

			for (var i = 0; i < done.length; i++) {
				oplib.fx.end(done[i] - i, oplib.fx.queue[done[i] - i].elem, oplib.fx.queue[done[i] - i].callbacks, oplib.fx.queue[done[i] - i].scope);
			}

			if (oplib.fx.animatorRunning) {
				oplib.fx.animatorId = setTimeout(oplib.fx.animate, oplib.defaults.get("animationSettings", "frameTime"));
			}
		},
		//Wendet einen interpolator auf actualProgress an
		interpolate : function(interpolator, actualProgress) {
			interpolators = {
				linear : actualProgress,
				decelerate : Math.sin(actualProgress * (Math.PI / 2)),
				accelerate : 1 - Math.cos(actualProgress * (Math.PI / 2)),
				//acceleratedecelerate: Math.sin(actualProgress*actualProgress *
				// (Math.PI / 2)),
				acceleratedecelerate : Math.sin(actualProgress * (Math.PI / 2)) * Math.sin(actualProgress * (Math.PI / 2)),
			};

			if (!interpolators[interpolator]) {
				interpolator = oplib.defaults.get("animationSettings", "interpolator");
			}
			return interpolators[interpolator];
		},
		//Callbackfunktion
		callback : function(elem, callbacks, action, scope) {
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
						callbacks[action][i].apply(scope, [elem]);
						delete callbacks[action][i];
					} else if ( typeof callbacks[action][i] === "object") {
						//Zusätzliche animationen enthalten
						oplib.fx([elem], callbacks[action][i]);
						delete callbacks[action][i];
					}
				}
			} else if (callbacks[action] && typeof callbacks[action] === "function") {
				callbacks[action].apply(scope, [elem]);
				delete callbacks[action];
			} else if (callbacks[action] && typeof callbacks[action] === "object") {
				//Zusätzliche animationen enthalten
				oplib.fx([elem], callbacks[action]);
				delete callbacks[action];
			}

			return callbacks;
		},
		//Fügt Elementen in oplib.fx.queue callbacks hinzu.
		addCallback : function(callbacksBase, callbacks, action) {
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
				} else {
					callbacksBase[action].push(callbacks);
				}
			} else if (callbacksBase[action]) {
				callbacksBase[action] = [callbacksBase[action]];
				if (toString.call(callbacks) === "[object Array]") {
					for (var i in callbacks) {
						callbacksBase[action].push(callbacks[i]);
					}
				} else {
					callbacksBase[action].push(callbacks);
				}
			}
			return callbacksBase;
		}
	});

	//Parses JSON Data
	oplib.JSON = function(json) {
		return oplib.JSON.parse(json);
	};
	oplib.JSON.parse = function(json) {
		//Use native Broswser Parser
		return JSON.parse(json);
	};
	oplib.JSON.stringify = function(obj) {
		//Use native Broswser Stringifier
		return JSON.stringify(obj);
	};

	//Parses DOM
	oplib.DOM = function(dom, mimetype) {
		return oplib.DOM.parse(dom, mimetype);
	};
	oplib.DOM.parse = function(dom, mimetype) {
		if (!mimetype) {
			//XML annehmen
			mimetype = "text/xml";
		}
		var parser = new DOMParser();
		return parser.parseFromString(dom, mimetype);
	};

	//Handles Ajax-Calls
	oplib.AJAX = function(url, fn, header, settings) {
		var xmlhttp = new XMLHttpRequest();
		var ajaxSettings = oplib.defaults.get("ajaxSettings");

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

		xmlhttp = oplib.AJAX.request[ajaxSettings.method](xmlhttp, url, fn, header, ajaxSettings);
		if (ajaxSettings.async == true) {
			xmlhttp = oplib.AJAX.response.async(xmlhttp, fn, ajaxSettings);
		} else {
			xmlhttp = oplib.AJAX.response.sync(xmlhttp, fn, ajaxSettings);
		}

		return this;
	};
	oplib.AJAX.request = {
		get : function(xmlhttp, url, fn, header, ajaxSettings) {
			var parsedHeader = "";
			if (header) {
				if ( typeof header === "string") {
					if (header[0] != '?' || header[0] != '&') {
						header = "?" + header;
					}
					parsedHeader = header;
				} else {
					for (var i in header) {
						//Objecte in JSON umwandeln um AJAX-Request möglich zu
						// machen
						if ( typeof header[i] === "object") {
							header[i] = oplib.JSON.stringify(header[i]);
						}
						if (!parsedHeader) {
							parsedHeader += ("?" + i + "=" + header[i]);
						} else {
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
		post : function(xmlhttp, url, fn, header, ajaxSettings) {
			var parsedHeader = "";

			if (header) {
				if ( typeof header === "string") {
					if (header[0] == '?') {
						header = header.slice(1, header.length - 1);
					}
					parsedHeader = header;
				} else {
					for (var i in header) {
						//Objecte in JSON umwandeln um AJAX-Request möglich zu
						// machen
						if ( typeof header[i] === "object") {
							header[i] = oplib.JSON.stringify(header[i]);
						}
						if (!parsedHeader) {
							parsedHeader = i + "=" + header[i];
						} else {
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
	oplib.AJAX.response = {
		async : function(xmlhttp, fn, ajaxSettings) {
			if (ajaxSettings.content == "text") {
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 1) {
						ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 2) {
						ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 3) {
						ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 4) {
						fn.apply(this, [xmlhttp.responseText, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
					}
				};
			} else if (ajaxSettings.content == "xml") {
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 1) {
						ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 2) {
						ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 3) {
						ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 4) {
						fn.apply(this, [xmlhttp.responseXML, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
					}
				};
			} else if (ajaxSettings.content == "json") {
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 1) {
						ajaxSettings.connected.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 2) {
						ajaxSettings.received.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 3) {
						ajaxSettings.processing.apply(this, [xmlhttp.readyState, ajaxSettings.args]);
					} else if (xmlhttp.readyState == 4) {
						fn.apply(this, [oplib.JSON(xmlhttp.responseText), xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
					}
				};
			} else {
				console.log(ajaxSettings.content + ": is not a valid contentType");
			}

			return xmlhttp;
		},
		sync : function(xmlhttp, fn, ajaxSettings) {
			if (ajaxSettings.content == "text") {
				fn.apply(this, [xmlhttp.responseText, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
			} else if (ajaxSettings.content == "xml") {
				fn.apply(this, [xmlhttp.responseXML, xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
			} else if (ajaxSettings.content == "json") {
				fn.apply(this, [oplib.JSON(xmlhttp.responseText), xmlhttp.readystate, xmlhttp.status, ajaxSettings.args]);
			} else {
				console.log(ajaxSettings.content + ": is not a valid contentType");
			}

			return xmlhttp;
		}
	};

	//Abkürzungen für events
	oplib.extend(oplib.fn, {
		click : function(fn) {
			return this.events("click", fn);
		},
		dblclick : function(fn) {
			return this.events("dblclick", fn);
		},
		mouseover : function(fn) {
			return this.events("mouseover", fn);
		},
		mouseout : function(fn) {
			return this.events("mouseout", fn);
		},
		hover : function(fn_over, fn_out) {
			this.events("mouseover", fn_over);
			return this.events("mouseout", fn_out);
		},
		focus : function(fn) {
			return this.events("focus", fn);
		},
		blur : function(fn) {
			return this.events("blur", fn);
		},
		change : function(fn) {
			return this.events("change", fn);
		},
		select : function(fn) {
			return this.events("select", fn);
		},
		submit : function(fn) {
			return this.events("submit", fn);
		}
	});

	//Adds Events | Dispatches Events
	oplib.fn.events = function(type, fn, args) {
		if (!fn) {
			return this.each(function(type) {
				oplib.fn.events.dispatchEvent(type, this);
			}, [type]);
		} else {
			return this.each(function(type, fn) {
				oplib.fn.events.addEvent(type, fn, this, args);
			}, [type, fn, args]);
		}

	};

	//Removes Events
	oplib.fn.removeEvents = function(type, fn) {
		return this.each(function(type, fn) {
			oplib.fn.events.removeEvent(type, fn, this);
		}, [type, fn]);
	};

	//Event Klasse
	oplib.extend(oplib.fn.events, {
		//Wurde der GLOBALE Handler bereits für dieses Event gesetzt? DARF NUR
		// EINMAL GESTZT WERDEN
		handleAttached : {},
		//Listener dem globalen handler hinzufügen
		addEvent : function(type, fn, elem, args) {
			//handleAttached überprüfen
			if (this.handleAttached[type] == undefined) {
				this.handleAttached[type] = [];
			}
			for (var i = 0; i < this.handleAttached[type]; i++) {
				if (this.handleAttached[type][i]["elem"] == elem && this.handleAttached[type][i]["attached"] == true) {
					return oplib.fn.handler.addListener(type, fn, elem, args);
				}
			}
			this.handleAttached[type].push({
				elem : elem,
				attached : true
			});
			elem.addEventListener(type, oplib.fn.handler, false);
			return oplib.fn.handler.addListener(type, fn, elem, args);

		},
		//Listener dem globalen Handler entfernen
		removeEvent : function(type, fn, elem) {
			return oplib.fn.handler.removeListener(type, fn, elem);
		},
		//Events kopieren
		copyEvents : function(copyTo, copyFrom) {
			for (var type in oplib.fn.handler.handleList) {
				if (oplib.fn.handler.handleList[type]) {
					for (var i = 0; i < oplib.fn.handler.handleList[type].length; i++) {
						if (oplib.fn.handler.handleList[type][i] && oplib.fn.handler.handleList[type][i].elem == copyFrom) {
							oplib.fn.events.addEvent(type, oplib.fn.handler.handleList[type][i].fn, copyTo, oplib.fn.handler.handleList[type][i].args);
						}
					}
				}
			}
		},
		//Event ausführen
		dispatchEvent : function(e, elem) {
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
	oplib.extend(oplib.fn.handler, {
		//Aufbau: handleList.element[...].type[...].{function, text, enabled}
		handleList : {},

		//Der HandleList einen neuen Listener hinzufügen
		addListener : function(type, listener, elem, args) {
			if (this.handleList[type] == undefined) {
				this.handleList[type] = [];
			}
			return (this.handleList[type].push({
				elem : elem,
				fn : listener,
				text : listener.toString(),
				args : args,
				enabled : true
			}) - 1);
		},
		//Disabled einen Listener durch setzen deaktivieren des enabled-flags
		removeListener : function(type, listener, elem) {
			if (!elem) {
				elem = listener;
			}
			if ( typeof listner === "number") {
				this.handleList[type][listener]["enabled"] = false;
				return 1;
			} else {
				var listenerId = [];
				if (listener != undefined) {
					for (var i = 0; i < this.handleList[type].length; i++) {
						if (this.handleList[type][i]["elem"] == elem && this.handleList[type][i]["text"] == listener.toString()) {
							listenerId.push(i);
						}
					}
				} else {
					for (var i = 0; i < this.handleList[type].length; i++) {
						if (this.handleList[type][i]["elem"] == elem) {
							listenerId.push(i);
						}
					}
				}
				for (var i = 0; i < listenerId.length; i++) {
					this.handleList[type][listenerId[i]]["enabled"] = false;
				}
				return listenerId;
			}
		},
		//Listeners aufrufen
		dispatchListener : function(type, elem, e) {
			for (var i = 0; i < oplib.fn.handler.handleList[type].length; i++) {
				var enabled = oplib.fn.handler.handleList[type][i]["enabled"];
				var elementMatch = oplib.fn.handler.handleList[type][i]["elem"] == e.currentTarget;
				var windowMatch = oplib.fn.handler.handleList[type][i]["elem"] == window;
				if (enabled && (elementMatch || windowMatch)) {
					oplib.fn.handler.handleList[type][i]["fn"].apply(e.currentTarget, oplib.merge([e], oplib.fn.handler.handleList[type][i]["args"]));
					if (!elem.oplib) {
						elem.oplib = {};
					}
					if (!elem.oplib.events) {
						elem.oplib.events = {};
					}
					if (!elem.oplib.events.queue) {
						elem.oplib.events.queue = [];
					}
					elem.oplib.events.queue.push(type);
					elem.oplib.events.lastEvent = type;
				}
			}

		}
	});

	//Führt fn aus, sobald das ausgewählte Element bereit/geladen ist
	oplib.fn.ready = function(fn) {
		return this.each(function(fn) {
			if (oplib.fn.ready.isReadyState[this]) {
				//Element bereits geladen, funktion direkt ausführen
				fn.apply();
			}
			//DOMContentLoaded-Event verpasst?
			else if (oplib.fn.ready.readyState === "complete") {
				oplib.fn.ready.isReadyState[this] = true;
				fn.apply();
			} else {
				oplib.fn.events.addEvent("DOMContentLoaded", oplib.fn.ready.handler, this);
				oplib.fn.events.addEvent("load", oplib.fn.ready.handler, this);
				oplib.fn.events.addEvent("OPready", fn, this);
			}
		}, [fn]);
	};
	//Entfernt fn aus der Handler Liste des ausgewählten Elements.
	oplib.fn.unready = function(fn) {
		return this.each(function(fn) {
			oplib.fn.events.removeEvent("OPready", fn, this);
		}, [fn]);
	};
	oplib.extend(oplib.fn.ready, {
		//Globaler .ready() Handler
		handler : function(e) {
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
		isReadyState : {},
		//Fügt handleList[elem] die auszuführende Funktion zu, etc.
	});

	//Tooltips
	oplib.fn.Tooltip = function(selector, context, options) {
		if (!options) {
			options = {};
		}
		options.showDelay = options.showDelay || oplib.defaults.get("tooltipSettings", "showDelay");
		options.hideDelay = options.hideDelay || oplib.defaults.get("tooltipSettings", "hideDelay");
		options.delayUpdateTime = options.delayUpdateTime || oplib.defaults.get("tooltipSettings", "delayUpdateTime");
		options.xDistance = options.xDistance || oplib.defaults.get("tooltipSettings", "xDistance");
		options.yDistance = options.yDistance || oplib.defaults.get("tooltipSettings", "yDistance");
		options.dontHideWhileHoveringTooltip = options.dontHideWhileHoveringTooltip || oplib.defaults.get("tooltipSettings", "dontHideWhileHoveringTooltip");
		options.showAnimation = options.showAnimation || oplib.defaults.get("tooltipSettings", "showAnimation");
		options.hideAnimation = options.hideAnimation || oplib.defaults.get("tooltipSettings", "hideAnimation");
		options.showSpeed = options.showSpeed || oplib.defaults.get("tooltipSettings", "showSpeed");
		options.hideSpeed = options.hideSpeed || oplib.defaults.get("tooltipSettings", "hideSpeed");
		options.showInterpolator = options.showInterpolator || oplib.defaults.get("tooltipSettings", "showInterpolator");
		options.hideInterpolator = options.hideInterpolator || oplib.defaults.get("tooltipSettings", "hideInterpolator");
		options.showCallbacks = options.showCallbacks || oplib.defaults.get("tooltipSettings", "showCallbacks");
		options.hideCallbacks = options.hideCallbacks || oplib.defaults.get("tooltipSettings", "hideCallbacks");
		options.showTimeout = [];
		options.hideTimeout = [];

		var elems = oplib.ElementSelection(selector, context);
		return this.finalizeDOMManipulation(this, function(elems) {
			function showTooltips(options, self, delay) {
				//Muss ununterbrochen gehovert sein
				if (oplib.isHover(self)) {
					delay -= options.delayUpdateTime;
					if (delay <= 0) {
						for (var i = 0; i < elems.length; i++) {
							oplib.fx.stop(elems[i], 1, 0);
							oplib.fx([elems[i]], options.showAnimation, options.showSpeed, options.showInterpolator, options.showCallbacks, elems[i]);
						}
					} else {
						setTimeout(showTooltips, options.delayUpdateTime, options, self, delay);
					}
				}
			};
			function hideTooltips(options, self, delay) {
				//Darf nicht wieder gehovert werden
				if (!oplib.isHover(self)) {
					if (!options.dontHideWhileHoveringTooltip || oplib.isHover(elems).length == 0) {
						delay -= options.delayUpdateTime;
						if (delay <= 0) {
							for (var i = 0; i < elems.length; i++) {
								oplib.fx.stop(elems[i], 1, 0);
								oplib.fx([elems[i]], options.hideAnimation, options.hideSpeed, options.hideInterpolator, options.hideCallbacks, elems[i]);
							}
						} else {
							setTimeout(hideTooltips, options.delayUpdateTime, options, self, delay);
						}
					} else {
						setTimeout(hideTooltips, options.delayUpdateTime, options, self, options.hideDelay);
					}
				}
			};
			function moveTooltips(e, options, self) {
				for (var i = 0; i < elems.length; i++) {
					elems[i].style.position = "absolute";
					var width = oplib.fn.floatCssValue(oplib.getComputedStyle("width", elems[i]));
					var height = oplib.fn.floatCssValue(oplib.getComputedStyle("height", elems[i]));
					var left = e.pageX + options.xDistance;
					var top = e.pageY + options.yDistance;
					if (left + width >= window.innerWidth + window.pageXOffset) {
						left = e.pageX - options.xDistance - width;
					}
					if (top + height >= window.innerHeight + window.pageYOffset) {
						top = e.pageY - options.yDistance - height;
					}
					elems[i].style.left = oplib.fn.finalizeCssExpressions("left", left)[1];
					elems[i].style.top = oplib.fn.finalizeCssExpressions("top", top)[1];
				}
			};

			for (var i = 0; i < elems.length; i++) {
				if (this.parentNode) {
					elems[i] = this.parentNode.appendChild(elems[i]);
				} else {
					elems[i] = document.body.appendChild(elems[i]);
				}
			}
			oplib.fx(elems, {
				opacity : "hide"
			}, 0);
			oplib.fn.events.addEvent("mouseover", function(e) {
				showTooltips(options, this, options.showDelay);
			}, this);
			oplib.fn.events.addEvent("mouseout", function(e) {
				hideTooltips(options, this, options.hideDelay);
			}, this);
			oplib.fn.events.addEvent("mousemove", function(e) {
				moveTooltips(e, options, this);
			}, this);

			return this;
		}, [elems]);
	};

	oplib.fn.Form = function(data) {
		/* data:
		 * {
		 * 	fieldset: {id, fieldset, label, legend, after, before, first, last, br, attr, events, actions, state},
		 *  label: {id, html, fieldset, label, after, before, first, last, br, attr, events, actions, state},
		 * 	legend: {id, html, fieldset, after, before, first, last, br, attr, events, actions, state},
		 *  input: {id, html, type, fieldset, label, after, before, first, last, br, attr, events, actions, state},
		 * }
		 *
		 * actions:
		 * {
		 * 	OPLib-Function: Arguments
		 * }
		 *
		 * state: shown|hidden|enabled|disabled
		 */

		if (!data) {
			return this;
		}

		return this.each(function(data) {
			//TODO: ADD DEFAULTS
			var options = ["fieldset", "label", "legend", "input"];
			if (!this.oplib) {
				this.oplib = {};
			}
			if (!this.oplib.Form) {
				this.oplib.Form = {};
			}
			if (!this.oplib.Form.data) {
				this.oplib.Form.data = {};
			}

			for (var j = 0; j < options.length; j++) {
				type = options[j];
				if (data[type]) {
					if (toString.call(data[type]) != "[object Array]") {
						data[type] = [data[type]];
					}
					for (var i = 0; i < data[type].length; i++) {
						oplib.fn.Form.changeData(type, data[type][i].id, data[type][i], this);
					}
				}
			}
			oplib.fn.Form.updateData(this);
			console.log(this.oplib.Form);

		}, [data]);

	};

	oplib.fn.Form.updateData = function(elem) {
		//Falls kein vorausgehendes Element angegeben ist. Position #1 annehmen;
		var data = elem.oplib.Form.data;
		var options = ["fieldset", "label", "legend", "input"];
		var nodeOrder = elem.oplib.Form.nodeOrder = [];

		for (var j = 0; j < options.length; j++) {
			type = options[j];
			if (data[type]) {
				for (var i = 0; i < data[type].length; i++) {
					var nodeData = data[type][i];
					var node = oplib.fn.Form.updateData.createElement(type, nodeData, elem);
					if (nodeData.update) {
						//Eventuell noch auf alte actions-achten
						oplib.extend(nodeData, nodeData.update);
					}
					elem.oplib.Form.nodeOrder.push({
						node : node,
						nodeData : nodeData,
						nodeType : type,
						children : [],
						parent : elem,
					});
				}
			}
		}
		/*
		 * [
		 * {id: ID, type: String, children: Array}
		 * ]
		 */
		var ordered = oplib.merge([], nodeOrder);
		for (var i = 0; i < nodeOrder.length; i++) {
			var containers = ["fieldset"];
			var nodeData = nodeOrder[i].nodeData;
			var nodeType = nodeOrder[i].nodeType;
			var node = nodeOrder[i].node;
			//Order Elements
			for (var j = 0; j < containers.length; j++) {
				var type = containers[j];
				if (nodeData[type]) {
					oplib.fn.Form.updateData.orderElems(nodeData, nodeType, node, ordered, type, nodeData[type]);
				}
				if (nodeData["label"]) {
					var label = oplib.fn.Form.updateData.orderElems.getElems(ordered, "", nodeData.label);
					label.nodeData.before = nodeData.id;
				}
				if (nodeData["legend"]) {
					var legend = oplib.fn.Form.updateData.orderElems.getElems(ordered, "", nodeData.legend);
					legend.nodeData.first = true;
				}
				if (nodeData["br"] && typeof nodeData["br"] !== "object") {
					nodeData["br"] = {
						id : "__OPLibFormBr" + oplib.ID.getUniqueRandomId(),
						fieldset : nodeData.fieldset,
						after : nodeData.id,
						created : true,
					};
					elem.oplib.Form.nodeOrder.push({
						node : oplib.fn.Form.updateData.createElement("br", nodeData["br"], elem),
						nodeData : nodeData["br"],
						nodeType : "br",
						children : [],
						parent : elem,
					});
				} else if (nodeData["br"]) {
					nodeData["br"].after = nodeData.id;
					elem.oplib.Form.nodeOrder.push({
						node : oplib.fn.Form.updateData.createElement("br", nodeData["br"], elem),
						nodeData : nodeData["br"],
						nodeType : "br",
						children : [],
						parent : elem,
					});
				}

			}
			//Apply type
			if (nodeType == "input" && nodeData.type != undefined) {
				oplib.fn.Form.type(nodeData.id, nodeData.type, elem);
				nodeData.type = undefined;
			}
			//Apply Attributes
			if (nodeData.attr != undefined) {
				oplib.fn.Form.attr(nodeData.id, nodeData.attr, elem);
				nodeData.attr = undefined;
			}
			//Apply html
			if (nodeData.html != undefined) {
				oplib.fn.Form.html(nodeData.id, nodeData.html, elem);
				nodeData.html = undefined;
			}
			//Set State
			if (nodeData.state != undefined) {
				oplib.fn.Form.state(nodeData.id, nodeData.state, elem);
				nodeData.state = undefined;
			}
			//Apply Events
			if (nodeData.events != undefined && typeof nodeData.events === "object") {
				oplib.fn.Form.events(nodeData.id, nodeData.events, elem);
				nodeData.events = undefined;
			}
			//Apply Actions
			if (nodeData.actions != undefined && typeof nodeData.actions === "object") {
				oplib.fn.Form.actions(nodeData.id, nodeData.actions, elem);
				nodeData.actions = undefined;
			}
			nodeData.created = false;
		}
		for (var i = 0; i < nodeOrder.length; i++) {
			var nodeData = nodeOrder[i].nodeData;
			var nodeType = nodeOrder[i].nodeType;
			var node = nodeOrder[i].node;
			if (nodeData.before) {
				var node = oplib.fn.Form.updateData.orderElems.getElems(ordered, nodeType, nodeData.id);
				var before = oplib.fn.Form.updateData.orderElems.getElems(ordered, "", nodeData.before);
				var parent = oplib.fn.Form.updateData.orderElems.getElems(ordered, node.nodeType, node.parent);
				var indexOfNode = parent.children.indexOf(node);
				var indexOfBefore = parent.children.indexOf(before);
				//Element entfernen
				parent.children.splice(indexOfNode, 1);
				//Elemente neu einsortieren
				if (indexOfNode < indexOfBefore) {
					indexOfBefore--;
				}
				if (indexOfBefore <= 0) {
					parent.children.unshift(node);
				} else {
					parent.children.splice(indexOfBefore, 0, node);
				}
			}
			if (nodeData.after) {
				var node = oplib.fn.Form.updateData.orderElems.getElems(ordered, nodeType, nodeData.id);
				var after = oplib.fn.Form.updateData.orderElems.getElems(ordered, "", nodeData.after);
				var parent = oplib.fn.Form.updateData.orderElems.getElems(ordered, node.nodeType, node.parent);
				var indexOfNode = parent.children.indexOf(node);
				var indexOfAfter = parent.children.indexOf(after);
				//Element entfernen
				parent.children.splice(indexOfNode, 1);
				//Elemente neu einsortieren
				if (indexOfNode < indexOfAfter) {
					indexOfAfter--;
				}
				if (indexOfAfter < -1) {
					parent.children.push(node);
				} else if (indexOfAfter == -1) {
					parent.children.splice(indexOfAfter + 2, 0, node);
				} else {
					parent.children.splice(indexOfAfter + 1, 0, node);
				}
			}
			if (nodeData.first) {
				var node = oplib.fn.Form.updateData.orderElems.getElems(ordered, nodeType, nodeData.id);
				var parent = oplib.fn.Form.updateData.orderElems.getElems(ordered, node.nodeType, node.parent);
				var indexOfNode = parent.children.indexOf(node);
				//Element entfernen
				parent.children.splice(indexOfNode, 1);
				//Element an den Anfang setzen
				parent.children.unshift(node);
			}
			if (nodeData.last) {
				var node = oplib.fn.Form.updateData.orderElems.getElems(ordered, nodeType, nodeData.id);
				var parent = oplib.fn.Form.updateData.orderElems.getElems(ordered, node.nodeType, node.parent);
				var indexOfNode = parent.children.indexOf(node);
				//Element entfernen
				parent.children.splice(indexOfNode, 1);
				//Element an das Ende setzen
				parent.children.push(node);
			}
		}
		elem.oplib.Form.nodeOrder = ordered;
		oplib.fn.Form.updateData.insertElem(ordered);
	};

	oplib.fn.Form.updateData.createElement = function(type, nodeData, elem) {
		var node;
		if (nodeData.created == true) {
			switch(type) {
				case "fieldset":
				case "label":
				case "legend":
				case "br":
				case "input":
					node = document.createElement(type);
					$(node).addClass("OPForm" + type + nodeData.id);
					break;
				default:
					console.log(".Form.updateData.createElement: Unknown Type: " + type);
			}
			nodeData.created = 2;
		} else {
			switch(type) {
				case "fieldset":
				case "label":
				case "legend":
				case "br":
				case "input":
					node = $(elem).find(" .OPForm" + type + nodeData.id)[0];
					break;
				default:
					console.log(".Form.updateData.createElement: Unknown Type: " + type);
			}
		}
		return node;
	};

	oplib.fn.Form.updateData.insertElem = function(nodeOrder) {
		//Root
		if (toString.call(nodeOrder) == "[object Array]" && nodeOrder.length) {
			for (var i = 0; i < nodeOrder.length; i++) {
				if (!nodeOrder[i].remove) {
					oplib.fn.Form.updateData.insertElem(nodeOrder[i]);
					$(nodeOrder[i].parent).append(nodeOrder[i].node);
				}
			}

		}
		//Children
		else if (toString.call(nodeOrder.children) == "[object Array]" && nodeOrder.children.length) {
			for (var i = 0; i < nodeOrder.children.length; i++) {
				if (!nodeOrder.children[i].remove) {
					oplib.fn.Form.updateData.insertElem(nodeOrder.children[i]);
					$(nodeOrder.children[i].parent).append(nodeOrder.children[i].node);
				}
			}
		}
		return false;
	};
	//DEPRECATED in updateData einfügen
	oplib.fn.Form.updateData.orderElems = function(nodeData, nodeType, node, nodeOrder, pType, pId) {
		var parent = oplib.fn.Form.updateData.orderElems.getElems(nodeOrder, pType, pId);
		var children = oplib.fn.Form.updateData.orderElems.getElems(nodeOrder, nodeType, nodeData.id);
		//Kind existiert bereits. Knoten verschieben
		if (children) {
			parent.children.push(oplib.extend({}, children, {
				parent : parent.node
			}));
			children.remove = true;
		} else {
			parent.children.push({
				node : node,
				nodeData : nodeData,
				nodeType : nodeType,
				children : [],
				parent : parent.node,
			});
		}
	};
	//DEPRECATED 'pType' wird nicht benötigt
	oplib.fn.Form.updateData.orderElems.getElems = function(nodeOrder, pType, pId) {
		//Root
		if (toString.call(nodeOrder) == "[object Array]" && nodeOrder.length) {
			for (var i = 0; i < nodeOrder.length; i++) {
				var parent = oplib.fn.Form.updateData.orderElems.getElems(nodeOrder[i], pType, pId);
				if (parent) {
					return parent;
				}
			}
		}
		//Parent
		else if (nodeOrder.children && toString.call(nodeOrder.children) == "[object Array]" && nodeOrder.children.length) {
			for (var i = 0; i < nodeOrder.children.length; i++) {
				var parent = oplib.fn.Form.updateData.orderElems.getElems(nodeOrder.children[i], pType, pId);
				if (parent) {
					return parent;
				}
			}
		}
		//Ende der Rekursion
		//NodeData *muss* vorhanden sein!
		if (!nodeOrder.nodeData) {
			return false;
		}
		//IDs stimmen überein
		if (nodeOrder.nodeData.id && nodeOrder.nodeData.id == pId && !nodeOrder.removed) {
			return nodeOrder;
		}
		//Nodes stimmen überein
		else if (nodeOrder.node && nodeOrder.node == pId && !nodeOrder.removed) {
			return nodeOrder;
		}
		//Nichts stimmt überein
		else {
			return false;
		}
	};

	oplib.fn.Form.each = function(id, args, fn, elems) {
		if (id == undefined || args == undefined || fn == undefined || elems == undefined) {
			return false;
		}
		if (toString.call(elems) !== "[object Array]") {
			elems = [elems];
		}
		return oplib.each(elems, function(id, args, fn) {
			if (toString.call(id) == "[object Array]") {
				oplib.each(id, function(args, fn, that) {
					var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(that.oplib.Form.nodeOrder, "", this);
					if (nodeOrderElem == false) {
						return;
					} else {
						fn.apply(nodeOrderElem, args);
					}
				}, [args, fn, this]);
			} else {
				var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(this.oplib.Form.nodeOrder, "", id);
				if (nodeOrderElem == false) {
					return;
				} else {
					fn.apply(nodeOrderElem, args);
				}
			}
		}, [id, args, fn]);
	};

	oplib.fn.Form.type = function(id, type, elems) {
		return oplib.fn.Form.each(id, [type], function(type) {
			$(this.node).attr("type", type);
		}, elems);
	};
	
	oplib.fn.Form.attr = function(id, attr, elems) {
		return oplib.fn.Form.each(id, [attr], function(attr) {
			$(this.node).attr(attr);
		}, elems);
	};
	
	oplib.fn.Form.html = function(id, html, elems) {
		return oplib.fn.Form.each(id, [html], function(html) {
			$(this.node).html(html);
		}, elems);
	};
	
	oplib.fn.Form.state = function(id, state, elems) {
		return oplib.fn.Form.each(id, [state], function(state) {
			switch (state) {
				case "shown":
					if (this.nodeData.created) {
						OPLib(this.node).show(0);
					} else {
						OPLib(this.node).show();
					}
					break;
				case "hidden":
					if (this.nodeData.created) {
						OPLib(this.node).hide(0);
					} else {
						OPLib(this.node).hide();
					}
					break;
				case "enabled":
					OPLib(this.node).removeAttr("disabled");
					break;
				case "disabled":
					OPLib(this.node).attr("disabled", "disabled");
					break;
				default:
					console.log(".Form: State [" + state + "] not recognized.");
			}
		}, elems);
	};

	oplib.fn.Form.events = function(id, events, elems) {
		return oplib.fn.Form.each(id, [events], function(events) {
			for (var e in events) {
				if (toString.call(events[e]) !== "[object Array]") {
					events[e] = [events[e]];
				}
				for (var z = 0; z < events[e].length; z++) {
					if ( typeof events[e][z] === "object") {

					} else {
						$(this.node).events(e, events[e][z]);
					}
				}
			}
		}, elems);
	};

	oplib.fn.Form.actions = function(id, actions, elems) {
		return oplib.fn.Form.each(id, [actions], function(actions) {
			for (var a in actions) {
				if (oplib.fn[a]) {
					oplib.fn[a].apply(OPLib(this.node), [actions[a]]);
				}
			}
		}, elems);
	};

	oplib.fn.FormActions = function(id, actions) {
		return this.each(function() {
			if (toString.call(id) === "[object Array]") {
				oplib.each(id, function(action, that) {
					var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(that.oplib.Form.nodeOrder, "", this);
					for (var a in action) {
						if (oplib.fn[a]) {
							oplib.fn[a].apply(OPLib(nodeOrderElem.node), action[a]);
						}
					}
				}, [action, this]);
			} else {
				var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(this.oplib.Form.nodeOrder, "", id);
				for (var a in action) {
					if (oplib.fn[a]) {
						oplib.fn[a].apply(OPLib(nodeOrderElem.node), action[a]);
					}
				}
			}
		}, [id, action]);
	};

	oplib.fn.FormState = function(id, state) {
		return this.each(function(id, state) {
			if (toString.call(id) === "[object Array]") {
				oplib.each(id, function(state, that) {
					var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(that.oplib.Form.nodeOrder, "", this);
					switch (state) {
						case "shown":
							if (nodeOrderElem.nodeData.created) {
								OPLib(nodeOrderElem.node).show(0);
							} else {
								OPLib(nodeOrderElem.node).show();
							}
							break;
						case "hidden":
							if (nodeOrderElem.nodeData.created) {
								OPLib(nodeOrderElem.node).hide(0);
							} else {
								OPLib(nodeOrderElem.node).hide();
							}
							break;
						case "enabled":
							OPLib(nodeOrderElem.node).removeAttr("disabled");
							break;
						case "disabled":
							OPLib(nodeOrderElem.node).attr("disabled", "disabled");
							break;
						default:
							console.log(".Form: State [" + state + "] not recognized.");
					}
				}, [state, this]);
			} else {
				var nodeOrderElem = oplib.fn.Form.updateData.orderElems.getElems(this.oplib.Form.nodeOrder, "", id);
				switch (state) {
					case "shown":
						if (nodeOrderElem.nodeData.created) {
							OPLib(nodeOrderElem.node).show(0);
						} else {
							OPLib(nodeOrderElem.node).show();
						}
						break;
					case "hidden":
						if (nodeOrderElem.nodeData.created) {
							OPLib(nodeOrderElem.node).hide(0);
						} else {
							OPLib(nodeOrderElem.node).hide();
						}
						break;
					case "enabled":
						OPLib(nodeOrderElem.node).removeAttr("disabled");
						break;
					case "disabled":
						OPLib(nodeOrderElem.node).attr("disabled", "disabled");
						break;
					default:
						console.log(".Form: State [" + state + "] not recognized.");
				}
			}
		}, [id, state]);
	};

	oplib.fn.Form.addData = function(type, data, elem) {
		if (!elem.oplib.Form.data[type]) {
			elem.oplib.data[type] = [];
		}
		oplib.extend(data, {
			created : true
		});
		elem.oplib.Form.data[type].push(data);
		return false;
	};

	oplib.fn.Form.changeData = function(type, id, data, elem) {
		if (!elem.oplib.Form.data[type]) {
			elem.oplib.Form.data[type] = [];
		}
		for (var i = 0; i < elem.oplib.Form.data[type].length; i++) {
			if (elem.oplib.Form.data[type][i].id == id) {
				elem.oplib.Form.data[type][i].update = data;
				return true;
			}
		}
		return oplib.fn.Form.addData(type, data, elem);
	};

	oplib.fn.Form.hasData = function(type, id, elem) {
		if (!elem.oplib.Form.data[type]) {
			return false;
		}
		for (var i = 0; i < elem.oplib.Form.data[type]; i++) {
			if (elem.oplib.Form.data[type][i].id == id) {
				return true;
			}
		}
		return false;
	};

	//Funktionen die mit Arrays arbeiten
	oplib.array = oplib.fn.array = {
		includes : function(arr, elem) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == elem) {
					return i;
				}
			}
			return -1;
		},
		sameElements : function(arr1, arr2) {
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
		unique : function(arr) {
			var new_arr = [];
			for (var i = 0; i < arr.length; i++) {
				if (new_arr.indexOf(arr[i]) == -1) {
					new_arr.push(arr[i]);
				}
			}
			return new_arr;
		},
		peek : function(arr) {
			return arr[arr.length - 1];
		}
	};

	oplib.string = oplib.fn.string = {
		splice : function(str, index, count, insert) {
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
		compare : function(obj1, obj2) {
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
	};

	//Funktionen die mit RegExp arbeiten
	oplib.regexp = {
		quote : function(str) {
			return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
		}
	};

	//Funktionen für die Zeit
	oplib.TIME = {
		getCurrentTime : function() {
			return new Date().getTime();
		}
	};

	//Funktionen für IDs
	oplib.ID = {
		uid : 0,
		urid : 0,
		getUniqueId : function() {
			return ++this.uid;
		},
		getUniqueRandomId : function() {
			return oplib.TIME.getCurrentTime() + "_" + ++this.urid;
		}
	};

	//Standart Werte für name setzen
	oplib.defaults = function(group, name, value) {
		//Keine Gruppe ausgewählt
		if (!value) {
			oplib.defaults[group] = name;
		} else {
			if (!oplib.defaults[group]) {
				oplib.defaults[group] = {};
			}
			oplib.defaults[group][name] = value;
		}
		return this;
	};
	//Standartwerte
	oplib.extend(oplib.defaults, {
		//Gibt Default-Werte zurück
		get : function(group, name) {
			if (!name) {
				if ( typeof oplib.defaults[group] === "object") {
					return Object.create(oplib.defaults[group]);
				}
				return oplib.defaults[group];
			} else {
				if ( typeof oplib.defaults[group][name] === "object") {
					return Object.create(oplib.defaults[group][name]);
				}
				return oplib.defaults[group][name];
			}
		},
		cssUnit : "px",
		cssConversions : {
			pxToPt : 0.75,
			pxToPc : 1 / 16,
			pxToIn : 1 / 96,
			pxToCm : 1 / 96 * 2.54,
			pxToMm : 1 / 96 * 25.4,
			pxToEm : 1 / 16,
			pxToEx : 2 / 16,

			ptToPx : 1 / 0.75,
			pcToPx : 16,
			inToPx : 96,
			cmToPx : 96 / 2.54,
			mmToPx : 96 / 25.4,
			emToPx : 16,
			exToPx : 16 / 2,
		},
		animationSettings : {
			frameTime : 16,
			duration : "normal",
			interpolator : "acceleratedecelerate",
			callbacks : {},
			scope : window,
			slow : 1000,
			normal : 750,
			fast : 500,
		},
		ajaxSettings : {
			method : "get",
			async : true,
			contentType : "application/x-www-form-urlencoded",
			content : "text",
			connected : function() {
			},
			received : function() {
			},
			processing : function() {
			},
			args : [],
		},
		tooltipSettings : {
			showDelay : 0,
			hideDelay : 0,
			delayUpdateTime : 16,
			xDistance : 5,
			yDistance : 5,
			dontHideWhileHoveringTooltip : false,
			showAnimation : {
				height : "show",
				opacity : "show",
			},
			hideAnimation : {
				height : "hide",
				opacity : "hide",
			},
			showSpeed : "fast",
			hideSpeed : "fast",
			showInterpolator : "decelerate",
			hideInterpolator : "accelerate",
			showCallbacks : function() {
			},
			hideCallbacks : function() {
			},
		},
	});

	//Module, die nicht sofort initialisiert werden
	oplib.modules = {
		isHover : false,
	};

	//Debugging Console - Bugfix for IE
	if (!window.console) {
		window.console = {
			//Erstellt leere Funktion um IE-Crash zu verhindern
			log : function() {
			}
		};

	}

	//Nötige Module aktivieren
	oplib.ElementSelection.isHover();

	window._OPLib = window.OPLib;
	window._$ = window.$;
	window.OPLib = oplib;
	window.$ = oplib;
})();

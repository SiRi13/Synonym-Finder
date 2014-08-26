/**
 * @author Tobias Barwig
 * Code Implementation copyright by Tobias Barwig
 * Date: 25. August 2014
 * Speial Thanks goes to www.openthesaurus.de for their big databse and very good API
 * 
 * Comments in code are in german.
 */

$(document).ready(function(){
    $("#sendButton").click(function(){

        // Eingabe mit immer gleicher Syntax: Erster Buchstabe groß, Rest klein
        var inputForRequest = $("input[name=inputForRequest]").val().charAt(0).toUpperCase() + $("input[name=inputForRequest]").val().substring(1,$("input[name=inputForRequest]").val().length).toLowerCase();
        
        // Bei leerem Textfeld keine Anfrage senden
        if(inputForRequest != "")
        {
            executeRequest(inputForRequest);
        }
        
        function executeRequest(request)
        {
            // Searchstring URl für die Anfrage
            var url = "https://www.openthesaurus.de/synonyme/search?q="+ request +"&format=application/json&callback=?&similar=true";
            
            // JSON-Objekt holen, Daten verarbeiten und für Benutzer ausgeben       
            $.getJSON(url, function(data, status) {

                $("#requestedString").html(""); // Etwaige vorherige Ausgaben löschen    
                $("#answer").html(""); // Etwaige vorherige Ausgaben löschen
                $(".simTerms").html(""); // Etwaige vorherige Ausgaben löschen
                
                var synsets = data.synsets; // JSON-Objekt
                for(var i = 0; i < synsets.length; i++) // Über alle Synset Arrays drüber laufen
                {
                    if(i > 0)
                    {
                        $("#answer").append("<br>");
                    }
                    
                    var terms = synsets[i].terms; // JSON-Objekt
                    for(var j = 0; j < terms.length; j++) // Über alle Terms Arrays drüber laufen.
                    {
                        
                       // Einzelner term. Erstes & Letztes Zeichen (Anfuerhungsstriche) entfernt. Für folgende if-Abfrage sowie Ausgabe nötig!
                       var t = JSON.stringify(terms[j].term).substr(1,JSON.stringify(terms[j].term.length)); 
                       var level; // Level Attribut vorhanden?
                       

                        if (i == 0 && j == 0)
                        {
                            $("#requestedString").append("Synonyme für '<i><b>" + $("input[name=inputForRequest]").val() + "'</i></b>:<br>");
                        }

                       // Pruefen ob Eingabe in den gelieferten terms (in allen möglichen Schreibweisen). Falls ja, nicht anzeigen!
                       if(!(t == request || t == request.toUpperCase() || t == request.toLowerCase()))
                       {

                           $("#answer").append(t); // Jeden einzelnen term in <body> ausgeben                           

                           if($("#levelCheckBox").is(":checked"))
                           {
                               // Level Attribut vorhanden? Wenn ja, an den Term ranhängen.                          
                               if(terms[j].level)
                               {
                                   level = JSON.stringify(terms[j].level).substr(1,JSON.stringify(terms[j].level.length));
                                   $("#answer").append(" (" + level + ")");
                               }
                           } 
                           
                           if(j != terms.length-1)
                           {
                               $("#answer").append(", ");
                           }                             
                       }
                   }
                }

                // Similiar Terms = Aehnliche Begriffe zur Eingabe
                var similarTerms = data.similarterms;  // JASON-Objekt
                                
                $("#simTermsHead").html("<br>Ähnliche Begriffe:<br>");
               
               // Falls Similar Terms vorhanden
                if(similarTerms != undefined)
                {                    
                    // Alle Similar Terms durchgehen und ausgeben
                    for(var i = 0; i < similarTerms.length; i++)
                    {
                        var simTerm = JSON.stringify(similarTerms[i].term).substr(1,JSON.stringify(similarTerms[i].term.length));
                        $(".simTerms").append("<a class=\"term\" id=\"term" + i + "\">" + simTerm + "</a><br>");
                    }
                    
                    // Maximal 5 Similar Terms, bei Klick wird neuer Request mit dem Term gestartet 
                    {                             
                        $("#term" + 0).click(function() {
                            $("#input1").val($("#term" + 0).html());
                            $("#sendButton").click();
                        });
                        $("#term" + 1).click(function() {
                            $("#input1").val($("#term" + 1).html());
                            $("#sendButton").click();
                        });
                        $("#term" + 2).click(function() {
                            $("#input1").val($("#term" + 2).html());
                            $("#sendButton").click();
                        });                    
                        $("#term" + 3).click(function() {
                            $("#input1").val($("#term" + 3).html());
                            $("#sendButton").click();
                        });
                        $("#term" + 4).click(function() {
                            $("#input1").val($("#term" + 4).html());
                            $("#sendButton").click();
                        }); 
                    }                                     
                }
                else
                {
                    $(".simTerms").append("<i>Keine ähnlichen Begriffe gefunden</i>");
                }
                
            });
        }
    }); 
    
    // Für Return im Eingabefeld
    $("#input1").keydown(function(event){
        if(event.keyCode == 13){
            $("#sendButton").click();
        }
    });
    
    // Für Level Checkbox. ACHTUNG: Bei jedem Klick neue Anfrage an API!! (API limits 60 requests/min)
    $("#levelCheckBox").click(function(){
        if($("#levelCheckBox").is(":checked") && $("input[name=inputForRequest]").val() != "")
        {
            $("#sendButton").click();
        }
        else if(!($("#levelCheckBox").is(":checked")) && $("input[name=inputForRequest]").val() != "")
        {
            $("#sendButton").click();
        }
    });
});
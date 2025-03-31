//Appeler le fichier JSON 
fetch("../zenbnb.json")
    .then(function(response){
        if (!response.ok) {
        throw new Error("Erreur : le fichier JSON n’a pas pu être chargé.");
        }
        return response.json();
    })
    .then(function(data){
        let AnnounceNotesContainer = document.getElementById("announce-notes");
        let rep = "../";
        for (i = 0; i < data.listings.length; i++){
            let divAnnounceNotes = document.createElement("div");
            let announce = data.listings[i];
            //console.log(announce.title);
            //contenu de l'offre
            let htmlAnnounce = "<h3>" + announce.title + "</h3>";
            htmlAnnounce += "<p>" + announce.description + "</p>";
            htmlAnnounce += "<p><strong>Ville :</strong> " + announce.city + "</p>";
            htmlAnnounce += "<p><strong>Capacité :</strong> " + announce.guest_capacity + " personne(s)</p>";
            htmlAnnounce += "<p><strong>Prix :</strong> " + announce.price_per_night + " € / nuit</p>";
            htmlAnnounce += "<img src='"  + rep + announce.image + "'/>";
            htmlAnnounce += "<p><strong>Avis clients :</strong> " + announce.rating + "</p>";
            //ajoute le contenu de l'offre dans une div
            if (announce.rating > 4){
                divAnnounceNotes.innerHTML = htmlAnnounce;
                AnnounceNotesContainer.appendChild(divAnnounceNotes);
            }
        }
    })
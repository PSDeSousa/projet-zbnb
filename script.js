//Appeler le fichier JSON 
fetch("zenbnb.json")
    .then(function(response){
        if (!response.ok) {
        throw new Error("Erreur : le fichier JSON n’a pas pu être chargé.");
        }
        return response.json();
    })
    .then(function(data){
        let AnnounceContainer = document.getElementById("announce");
        let AnnounceCarouselContainer = document.getElementById("slide");
        for (i = 0; i < data.listings.length; i++){
            let divAnnounceHome = document.createElement("div");
            let divAnnounceHomeCarousel = document.createElement("div");
            divAnnounceHome.classList.add("card");
            divAnnounceHomeCarousel.classList.add("card");
            let announce = data.listings[i];
            let host ="";
            let wifi ="";
            //console.log(announce.title);
            //contenu de l'offre
            if (announce.superhost){
                host = " ⭐"
            }
            if (announce.wifi){
                wifi = "Wifi : ✅"
            }else{
                wifi = "Wifi : ❌"
            }
            if (announce.rating >= 4.5){
                divAnnounceHome.classList.add("top-rating");
            }else if (announce.rating <= 3.5){
                divAnnounceHome.classList.add("flop-rating");
            }
            let htmlAnnounce = "<img src='" + announce.image + "'/>";
            htmlAnnounce += "<div class='column'>";
            htmlAnnounce += "<div class='block'>";
            htmlAnnounce += "<h3>" + announce.title + host + "</h3>";
            htmlAnnounce += "<p class='city'>" + announce.city + "</p>";
            htmlAnnounce += "<p>" + announce.description + "</p>";
            htmlAnnounce += "</div>";
            htmlAnnounce += "<p>" + wifi + "</p>";
            htmlAnnounce += "</div>";
            htmlAnnounce += "<div class='column'>";
            htmlAnnounce += "<div class='block'>";
            htmlAnnounce += "<div class='line'>";
            htmlAnnounce += "<div class='part'>";
            for (let j = 0; j < announce.tags.length; j++){
                htmlAnnounce += "<p class='tag'>" + announce.tags[j] + "</p>";
            };
            htmlAnnounce += "</div>";
            htmlAnnounce += "<p><strong>" + announce.rating + "</strong></p>";
            htmlAnnounce += "</div>";
            htmlAnnounce += "</div>";
            htmlAnnounce += "<div class='block'>";
            htmlAnnounce += "<p><strong>" + announce.price_per_night + "</strong> € / nuit</p>";
            htmlAnnounce += "<p>" + announce.guest_capacity + " personne(s)</p>";
            htmlAnnounce += "<button class='primary-button' onclick='ouvrPage()'><p>Reserver</p></button>";
            htmlAnnounce += "</div>";
            //ajoute le contenu de l'offre dans une div
            if (announce.visible){
                divAnnounceHome.innerHTML = htmlAnnounce;
                AnnounceContainer.appendChild(divAnnounceHome);
            }
        }
    })



function ouvrPage(){
    let page = modalReservation;
    if (page.classList.contains("d-none")){
        page.classList.remove("d-none");
        page.classList.add("d-block");
    }
}

function fermPage(){
    let page = modalReservation;
    if (page.classList.contains("d-block")){
            page.classList.remove("d-block");
            page.classList.add("d-none");
        }
}

//bouton fermer formulaire
document.getElementById("closeReservation").addEventListener("click", function(){
    fermPage();
})

//bouton reset formulaire
document.getElementById("resetReservation").addEventListener("click", function(){
    localStorage.clear()
    form.reset();
})


// Formulaire de réservation (modal)


//Local storage :
// Affiche les données sauvegardées au chargement de la page pour vérifier 
document.addEventListener("DOMContentLoaded", function () {
    let savedName = localStorage.getItem("fullname");
    let savedAdress = localStorage.getItem("adress");
    let savedEmail = localStorage.getItem("email");
    let savedPhone = localStorage.getItem("phone");
    let savedTypeLogement = localStorage.getItem("typeLogement");
    let savedNbConvive = localStorage.getItem("nbConvive");
    let savedDateArr = localStorage.getItem("dateArr");
    let savedDateDep = localStorage.getItem("dateDep");
    if (savedName) {
        document.getElementById("fullname").value = savedName;
    }
    if (savedAdress) {
        document.getElementById("adress").value = savedAdress;
    }
    if (savedEmail) {
        document.getElementById("email").value = savedEmail;
    }
    if (savedPhone) {
        document.getElementById("phone").value = savedPhone;
    }
    if (savedTypeLogement) {
        document.getElementById("typeLogement").value = savedTypeLogement;
        typeLogement = document.getElementById("typeLogement").value;
        toggle(typeLogement === "maison",optionMsn);
        toggle(typeLogement === "appartement",optionApt);
    }
    if (savedDateArr) {
        document.getElementById("dateArr").value = savedDateArr;
    }
    if (savedDateDep) {
        document.getElementById("dateDep").value = savedDateDep;
    }
    if (savedNbConvive) {
        document.getElementById("nbConvive").value = savedNbConvive;
    }
    });




const modalReservation = document.getElementById("modalReservation");
const form = document.getElementById("form");
//Emplacement erreur dans html
//const resultError = document.getElementById("result");
//Regex
const emailRegex = /^[^@\s]+@[^@\s]+.[^@\s]+$/;
const phoneRegex = /^[0-9\s-/]{10,14}$/;

//Formulaire affichage erreur :
function showError(fieldId, message) {
    let span = document.getElementById(fieldId + "Error");
    if (span) {
    span.textContent = message;
    console.log(message);
    formError = true;
    }
}
function initError(fieldId) {
    document.getElementById(fieldId + "Error").innerHTML = "";
    }


//Déclarations formulaire
let summary = document.getElementById("summary");
let diet = document.getElementById("diet");
let typeLogement = document.getElementById("typeLogement").value;
let lgtOption = "";
let petitDej = document.getElementById("petitDej").checked;
console.log("logement : " + typeLogement);

//Tableau des tarifs
const tarifs= 
    {
        chauffeur: 11,
        petitDej: 15,
        guide: 20,
        msnPiscine: 500,    
        msnJardin: 400,
        aptBalcon: 300,
        aptAscenseur: 200
    }        

let prixTotal = 0;
// 1 jour en milisecondes
const oneDay = 24 * 60 * 60 * 1000;

let formError = false;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    //Initialisation
    formError = false;
    prixTotal = 0
    summary.innerHTML = "";
    let fullname = document.getElementById("fullname").value.trim();
    initError("fullname");
    if(fullname.length < 2 || fullname.length > 50){
        showError("fullname","Prénom invalide (doit avoir entre 2 et 50 caractères)");
    }else{
        // Sauvegarde dans le localStorage
        localStorage.setItem("fullname", fullname);
    }
    let adress = document.getElementById("adress").value.trim();

    initError("adress");
    if(adress.length < 5 || adress.length > 100){
        showError("adress","Adresse invalide (doit avoir entre 5 et 100 caractères)");
        }else{
        localStorage.setItem("adress", adress);
        }
    let email = document.getElementById("email").value.trim();

    initError("email");
    if(!emailRegex.test(email)){
        showError("email", "Format d'adresse email invalide");
        }else{
            localStorage.setItem("email", email);
        }
    let phone = document.getElementById("phone").value.trim();
    //Vérification des données renseignées
    initError("phone");
    if(!phoneRegex.test(phone)){
        showError("phone","Format de numéro de téléphone invalide");
        }else{
            localStorage.setItem("phone", phone);
        }
    typeLogement = document.getElementById("typeLogement").value;
    initError("typeLogement");
    if((typeLogement != "maison") && (typeLogement != "appartement")){
        showError("typeLogement","le choix du type de logement est nécessaire");
    }else{
        localStorage.setItem("typeLogement", typeLogement);
    }
    initError("optionMsn");
    if((!msnPiscine) && (!msnJardin) && (typeLogement === "maison")){
        showError("optionMsn","merci de choisir au moins une option");
    }else{
        lgtOption = ""
        let msnPiscine = document.getElementById("msnPiscine").checked;
        if (msnPiscine){
            lgtOption += " _une belle Piscine"
        }
        let msnJardin = document.getElementById("msnJardin").checked;
        if (msnJardin){
            lgtOption += " _un joli Jardin"
        }
    }
    initError("optionApt");
    if((!aptBalcon) && (!aptAscenseur) && (typeLogement === "appartement")){
        showError("optionApt","merci de choisir au moins une option");
    }else{
        lgtOption = ""
        let aptBalcon = document.getElementById("aptBalcon").checked;
        if (aptBalcon){
            lgtOption += " _un balcon pour prendre un café";
        }
        let aptAscenseur = document.getElementById("aptAscenseur").checked;
        if (aptAscenseur){
            lgtOption += " _un ascenseur bien pratique";
        }
    }
    initError("nbConvive");
    let nbConvive = parseInt(document.getElementById("nbConvive").value);
    if(nbConvive < 1 || nbConvive > 10){
        showError("nbConvive","le nombre de convives doit être entre 1 et 10");
    }else{
        localStorage.setItem("nbConvive", nbConvive);
    }
    var today = new Date();
    var start = new Date(document.getElementById("dateArr").value);
    initError("dateArr");
    if (start < today) {
        showError("dateArr", "La date d'arrivée doit être supérieur ou égale à la date du jour");
        }else{
            localStorage.setItem("dateArr", document.getElementById("dateArr").value);
        }
    var end = new Date(document.getElementById("dateDep").value);
    initError("dateDep");
    if (end <= start) {
    showError("dateDep", "La date de départ doit être après l'arrivée");
    }else{
        localStorage.setItem("dateDep", document.getElementById("dateDep").value);
    }
    let chauffeur = document.getElementById("chauffeur").checked;
    let guide = document.getElementById("guide").checked;
    petitDej = document.getElementById("petitDej").checked;
    let noRegime = document.getElementById("noRegime").checked;
    let vegan = document.getElementById("vegan").checked;
    let halal = document.getElementById("halal").checked;
    initError("diet");
    if((!noRegime) && (!vegan) && (!halal) && (petitDej)){
        showError("diet","merci de choisir au moins un régime alimentaire");
    }
    //Calcul du prix :
    const nights = Math.round((end - start) / oneDay);

    if (chauffeur){
        prixTotal = prixTotal + tarifs.chauffeur * nights;
    }
    if (petitDej){
        prixTotal = prixTotal + tarifs.petitDej * nights * nbConvive;
    }
    if (guide){
        prixTotal = prixTotal + tarifs.guide;
    }
    if (aptBalcon){
        prixTotal = prixTotal + tarifs.aptBalcon * nights;
    }
    if (msnJardin){
        prixTotal = prixTotal + tarifs.msnJardin * nights;
    }
    if (msnJardin){
        prixTotal = prixTotal + tarifs.msnJardin * nights;
    }
    if (msnPiscine){
        prixTotal = prixTotal + tarifs.msnPiscine * nights;
    }
    console.log(formError);
    //Affichage summuary
    if (!formError){
        console.log("après");
        let contenu = "<h3>Votre réservation :</h3>";
        contenu += "<p> Réservation pour " + nights + " nuit(s) et " + nbConvive + " convive(s)</p>"
        contenu += "<p> dans un(e) magnifique " + typeLogement + " equipé(e) avec " + lgtOption + "</p>";
        contenu += "<p>Pour un prix total de : " + prixTotal + " Euros</p>";
        summary.innerHTML = contenu;
        summary.style.backgroundColor= ("#d4edda");
    }

})


//Fonction toggle
function toggle(tOption,tForm){
    if(tOption){
        tForm.style.display = "block";
    }else{
        tForm.style.display = "none";
    }
}


//Scrute le bouton typeLogement du formulaire
document.getElementById("typeLogement").addEventListener("change", function(){
    typeLogement = document.getElementById("typeLogement").value;
    toggle(typeLogement === "maison",optionMsn);
    toggle(typeLogement === "appartement",optionApt);
})

//Scrute le bouton petitDej du formulaire
document.getElementById("petitDej").addEventListener("change", function(){
    petitDej = document.getElementById("petitDej").checked;
    toggle(petitDej,diet);
})





    /*
    // tableau images
const tabImage = [
    {source : "assets/images/illustrations/naruto-enfant.jpg", alt : '"image de Naruto enfant"', index : 1},
    {source : "assets/images/illustrations/naruto-shippuden.jpg", alt : '"image de Naruto ado"', index : 2},
    {source : "assets/images/illustrations/naruto-boruto.jpg", alt : '"image de Naruto adulte"', index : 3},
    {source : "assets/images/illustrations/scene-boruto.jpg", alt : '"image de Boruto"', index : 4},
]
let slide = document.querySelector(".slide");
let back = document.querySelector(".back-btn");
let forward = document.querySelector(".forward-btn");
//variable index
let vIndex = 1;
function afficheImage(nIndex){
    slide.innerHTML = "<img src=" + tabImage[nIndex - 1].source + " alt=" + tabImage[nIndex - 1].alt + ">"
}
// affiche la première image au chargement
afficheImage(1);
// affiche image précédente au click
back.addEventListener("click",function(){
    if (vIndex === 1){
        vIndex = tabImage.length;
    }else{
        vIndex = vIndex - 1; 
    }
    afficheImage(vIndex);
});
// affiche image suivante au click
forward.addEventListener("click",function(){
    if (vIndex === tabImage.length){
        vIndex = 1;
    }else{
        vIndex = vIndex + 1;
    }
    afficheImage(vIndex);
});
*/
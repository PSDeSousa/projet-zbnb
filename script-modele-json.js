
// === Chargement d'un fichier JSON et affichage des catégories + produits ===

// fetch() est une fonction JavaScript intégrée
// Elle permet de demander un fichier à un serveur (comme aller chercher un fichier dans un dossier)
// Ici, on demande le fichier "products.json"
fetch("products.json")
  .then(function(response) {
    // La fonction 'then' s'exécute quand le fichier est trouvé
    // response contient toutes les informations de la réponse

    // .ok est une propriété qui dit si la réponse est bonne (fichier trouvé, pas d'erreur)
    if (!response.ok) {
      // Si la réponse n'est pas bonne, on arrête tout et on affiche une erreur
      throw new Error("Erreur : le fichier JSON n’a pas pu être chargé.");
    }

    // Si tout va bien, on transforme le fichier JSON (qui est du texte brut)
    // en objet JavaScript (facile à utiliser dans le code)
    return response.json(); // Cette ligne est obligatoire pour lire le contenu
  })

  // Une fois que les données JSON sont prêtes
  .then(function(data) {
    // 'data' contient maintenant toutes les informations du fichier JSON
    // On peut accéder à data.categories et data.products

    // === AFFICHAGE DES CATÉGORIES ===

    // On récupère l'endroit dans le HTML où on veut afficher les catégories
    // Il s'agit d'une <div> avec l'id "category-list"
    let categoryContainer = document.getElementById("category-list");

    // On parcourt chaque élément de la liste des catégories
    for (let i = 0; i < data.categories.length; i++) {
      // À chaque tour, on prend une catégorie
      let categorie = data.categories[i]; // exemple : { id: 1, name: "Informatique" }

      // On crée un paragraphe HTML pour afficher le nom de la catégorie
      let p = document.createElement("p"); // <p></p>
      p.textContent = categorie.name; // On écrit le nom à l'intérieur

      // On ajoute ce paragraphe dans la page
      categoryContainer.appendChild(p);
    }

    // === AFFICHAGE DES PRODUITS ===

    // On récupère l'endroit dans le HTML où on veut afficher les produits
    let productContainer = document.getElementById("product-list");

    // On parcourt chaque produit dans la liste
    for (let j = 0; j < data.products.length; j++) {
      let product = data.products[j]; // un seul produit

      // Chaque produit a un numéro de catégorie (ex : categoryId = 1)
      // On veut retrouver le nom de la catégorie correspondante
      let categoryName = "";

      // On parcourt les catégories pour trouver celle avec le bon ID
      for (let k = 0; k < data.categories.length; k++) {
        if (data.categories[k].id === product.categoryId) {
          categoryName = data.categories[k].name;
        }
      }

      // On crée un bloc HTML pour ce produit
      let div = document.createElement("div"); // <div></div>

      // On prépare le contenu du produit avec son nom, sa description, etc.
      let html = "<h2>" + product.name + "</h2>";
      html += "<p class='toto'><strong>Stock :</strong> " + product.stock + " unités</p>";
      html += "<p><strong>Description :</strong> " + product.description + "</p>";
      html += "<p><strong>Catégorie :</strong> " + categoryName + "</p>";
      html += "<p><strong>Prix :</strong> " + product.price + " €</p>";
      html += "<img src=' " + product.images + " '/>";

      // On met ce contenu dans le <div>
      div.innerHTML = html;

      // Et on l'ajoute dans la page
      productContainer.appendChild(div);
    }
  })

  // Si quelque chose ne fonctionne pas (erreur de chargement, etc.)
  .catch(function(error) {
    // On affiche l'erreur dans la console du navigateur (F12 > Console)
    console.error("Erreur : " + error.message);
  });
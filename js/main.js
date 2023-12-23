// [TPv2] Point 6 et 7

// Langue du site
let langue = document.documentElement.lang;
// Ou encore : let langue = document.querySelector('html').lang;

// Gestion du tri et filtre de produits
let selectFiltreOuTri = document.querySelector('.controle form');
if(selectFiltreOuTri) {
  selectFiltreOuTri.addEventListener('change', function(evt) {
    fetch("async/teeshirts.async.php?filtre=" 
      + this.filtre.value
      + "&tri="
      + this.tri.value
    ).then(afficherProduits);
  });
}

function afficherProduits(rep) {
  rep.json().then(function(res) {
    let conteneurProduits = document.querySelector("main.page-teeshirts article.principal");
    let gabaritProduit = document.getElementById("gabarit-produit");
    conteneurProduits.innerHTML = "";
    for(let prod of res) {
      let cloneProd = gabaritProduit.content.cloneNode(true);
      cloneProd.firstElementChild.dataset.pid = prod.id;
      cloneProd.querySelector('.ventes').innerHTML = prod.ventes;
      cloneProd.querySelector('img').src += prod.image;
      cloneProd.querySelector('img').alt = prod.nom;
      cloneProd.querySelector('.nom').innerHTML = prod.nom;
      cloneProd.querySelector('.montant').innerHTML = prod.prix;
      conteneurProduits.appendChild(cloneProd);
    }
  });
}


/******** Gestion du panier d'achats *********/

/***** Fonctions générales *****/
/*  
  [TPv34] Point 2 : utilisez la valeur du paramètre detailPanier dans la fonction 
  qui suit pour mettre à jour l'interface utilisateur (sommaire dans l'entête, 
  sommaire dans la page panier, badge, et message de panier vide).
*/
/**
 * Gère la mise à jour de l'affichage de l'interface utilisateur après les actions
 * asynchrones sur le panier (les sommaires, le badge, le message de panier vide).
 * 
 * @param {Array} detailPanier : Tableau numérique contenant des tableaux 
 *                               associatifs représentant chacun un article dans
 *                               le panier.
 */
function gererAffichageActionsPanier(detailPanier) {
  // Vérifiez la console pour comprendre la variable detailPanier !
  let prix;//pour le prix d'un article
  let quantite;//pour la quantité d'un article
  let id;//pour l'id d'un article
  let sousTotalArticle;//pour le prix total d'un article
  let valeurSousTotalPanier = 0;//la valeur de départ du panier
  let articlesDansPanier = [];//une array pour définir le prix total du panier
  for (let i = 0; i < detailPanier.length; i++) {//pour calculer le prix total du panier
    quantite = detailPanier[i]["qte"];
    prix = detailPanier[i]["prix"];
    id = detailPanier[i]["id"];
    articlesDansPanier.push(id);
    sousTotalArticle = document.getElementById("soustotal" + id);
    let valeurSousTotalArticle = prix * quantite;
    valeurSousTotalArticle = valeurSousTotalArticle.toFixed(2);
    sousTotalArticle.innerHTML = valeurSousTotalArticle;
    valeurSousTotalPanier += Number(valeurSousTotalArticle);
  }
  //les documents.getElementById sont pour actualiser le badge du panier
  document.getElementById("sous-total-panier").innerHTML = valeurSousTotalPanier.toFixed(2);
  document.getElementById("sous-total-badge").innerHTML = valeurSousTotalPanier.toFixed(2);
  document.querySelector("div.badge-panier").innerHTML = articlesDansPanier.length;

  let articlePanier = document.querySelector("div.liste-panier").firstChild;
  while (articlePanier) {//pour la suppression d'articles
    if(articlePanier.nodeName == "ARTICLE") {
        if (articlesDansPanier.includes(articlePanier.dataset.aid)) {
          
        } else {
          articlePanier.remove();
        }
    }
    articlePanier = articlePanier.nextSibling;
  }
}

/***** AJOUTER *****/
// Saisir le conteneur de tous les produits.
let conteneurProduits = document.querySelector(".liste-produits");

// Écouter le clic sur ce conteneur.
if(conteneurProduits) {
  conteneurProduits.addEventListener('click', gererRequeteAjoutPanier);
}

/**
 * Gère la requête HTTP asynchrone pour ajouter un produit au panier.
 * @param {Event} evt : objet événement généré par le DOM. 
 */
function gererRequeteAjoutPanier(evt) {
  // On saisit la cible directe du clic.
  let cibleClic = evt.target;
  // S'il s'agit d'un élément ayant la classe "btn-ajouter"
  if(cibleClic.classList.contains("btn-ajouter")) {
    // On accède à la valeur de l'attribut data- contenant l'identifiant du produit.
    let pid = cibleClic.closest("div.produit").dataset.pid;
    // Et on émet une requête HTTP asynchrone avec l'API Fetch.
    fetch("async/panier.async.php?action=ajouter&pid=" + pid).then(gererReponseAjoutPanier);
  }
}

/**
 * Décode la réponse JSON et appelle la fonction qui gère l'affichage.
 * @param {Object} reponse : objet réponse de la requête HTTP asynchrone. 
 */
function gererReponseAjoutPanier(reponse) {
  reponse.json().then(gererAffichageActionsPanier);
}

/***** FIN - AJOUTER *****/

/***** MODIFIER *****/
// Saisir le conteneur de tous les articles.
let conteneurPanier = document.querySelector(".liste-panier");

// Écouter le clic sur ce conteneur.
if(conteneurPanier) {
  conteneurPanier.addEventListener('click', gererRequeteModifierPanier);
}
/*
  [TPv34] Point 4 : Code requis pour modifier la quantité d'un article.
*/
function gererRequeteModifierPanier(evt) {
  // On saisit la cible directe du clic.
  let cibleClic = evt.target;

  // S'il s'agit d'un élément ayant la classe "btn-modifier"
  if (cibleClic.classList.contains("btn-modifier")) {
    let aid = cibleClic.closest("article.item-panier").dataset.aid;

    let valeurQte = cibleClic.closest("span.valeur-qte");
    let qte = valeurQte.getElementsByTagName("input")[0].value;
    
    fetch("async/panier.async.php?action=modifier&aid=" + aid + "&qte=" + qte).then(gererReponseModifierPanier);

  } else if (cibleClic.classList.contains("btn-supprimer")) {
    let aid = cibleClic.closest("article.item-panier").dataset.aid;

    fetch("async/panier.async.php?action=supprimer&aid=" + aid).then(gererReponseSupprimerArticle);
  }
}

/**
 * Décode la réponse JSON et appelle la fonction qui gère l'affichage.
 * @param {Object} reponse : objet réponse de la requête HTTP asynchrone. 
 */
function gererReponseModifierPanier(reponse) {
  reponse.json().then(gererAffichageActionsPanier);
}

/*
  [TPv34] Point 5 : Code requis pour supprimer un article du panier.
*/

function gererReponseSupprimerArticle(reponse) {
  //console.log(reponse);
  reponse.json().then(gererAffichageActionsPanier);
}
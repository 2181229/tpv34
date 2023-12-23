<?php
  $page = "panier";
  include('commun/entete.com.php');
?>
<main class="page-panier">
  <article class="amorce">
    <h1><?= $_["titrePage"]; ?></h1>
  </article>
  <article class="principal">
    <div class="liste-panier">
      <!-- 
        [TPv34] Point 3 : utilisez la variable $detailPanier pour générer 
        dynamiquement le contenu du panier.
      -->
      <!-- Gabarit d'un article dans le panier -->

      <?php
        foreach ($detailPanier as &$valeur) {
          $sousTotal = $valeur["qte"] * $valeur["prix"];
          $sousTotal = number_format($sousTotal, 2);
      ?>

      <article class="item-panier" data-aid="<?= $valeur["id"]; ?>">
        <div class="image-nom">
          <div class="image">
            <img src="images/produits/teeshirts/<?= $valeur["image"]; ?>" alt="<?= $valeur["nom"]; ?>">
          </div>
          <div class="nom"><?= $valeur["nom"]; ?></div>
          <button class="btn-supprimer material-icons" title="Cliquez pour supprimer cet article du panier">delete</button>
        </div>
        <div class="qte-prix">
          <div class="prix">
            <span class="etiquette-prix">Prix : </span> 
            <span class="valeur-prix montant montant-fr"><?= $valeur["prix"]; ?></span>
          </div>
          <div class="quantite">
            <span class="etiquette-qte">Quantité : </span> 
            <span class="valeur-qte">
              <input type="number" name="quantite" value="<?= $valeur["qte"]; ?>" min="0" max="9">
              <button class="btn-modifier material-icons" title="Cliquez pour mettre à jour la quantité pour cet article">update</button>
            </span>
          </div>
          <div class="total-article">
            <span class="etiquette-soustotal">Sous-total : </span>
            <span class="valeur-soustotal montant montant-fr" id="soustotal<?= $valeur["id"]; ?>"><?= $sousTotal; ?></span>
          </div>
        </div>
      </article>

      <?php
        }
      ?>

    </div>
    <div class="sommaire-panier">
      <span class="nb-articles">(<?= $_["nbArticles"]; ?> <span class="nombre"><?= nbArticlesPanier($detailPanier); ?></span>)</span>
      <span class="sous-total" id="sous-total-panier">
        <?= $_["sousTotal"]; ?> 
        <span class="montant montant-fr"><?= sousTotalPanier($detailPanier); ?></span>
      </span>
      <span class="btn-commander"><?= $_["btnCommander"]; ?></span>
    </div>
  </article>
</main>
<?php include('commun/pied2page.com.php'); ?>
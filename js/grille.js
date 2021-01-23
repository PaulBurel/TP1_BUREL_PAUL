/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  tabCookiesCliquees = [];
  tabCookies = [];
  nbCookiesDifferents = 6;

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies();
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    // Permet de parcourir les <div> de la grille HTML
    let caseDivs = document.querySelectorAll("#grille div");

    // On parcours ensuite tous les éléments avec forEach
    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.nbColonnes);
      let colonne = index % this.nbColonnes;
      let img = this.tabCookies[ligne][colonne].htmlImage;
      // On ajoute l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);

      img.onclick = (evt) => {
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieCliquee = this.tabCookies[l][c];
        cookieCliquee.selectionnee();

        // Si le tableau est vide, on ajoute le cookie cliquéé au tableau 
        if (this.tabCookiesCliquees.length === 0) {
          this.tabCookiesCliquees.push(cookieCliquee);
          // Si le tableau contient déjà un coookie, on ajoute le cookie et on regarde si le swap est possible 
        } else if (this.tabCookiesCliquees.length === 1) {
          this.tabCookiesCliquees.push(cookieCliquee);
          // Si le swapp est possible, on swap les cookies
          if (this.swapPossible()) {
            this.swapCookies();
          }

          this.resetCookiCliquee();
        }
      };

      img.ondragstart = (evt) => {
        let imgClickee = evt.target;
        let l = imgClickee.dataset.ligne;
        let c = imgClickee.dataset.colonne;
        let cookieDragguee = this.tabCookies[l][c];

        this.tabCookiesCliquees = [];
        this.tabCookiesCliquees.push(cookieDragguee);
        cookieDragguee.selectionnee();
      };

      img.ondragover = (evt) => {
        return false;
      };

      img.ondragenter = (evt) => {
        let img = evt.target;
        // on ajoute la classe CSS grilleDragOver
        img.classList.add("grilleDragOver");
      };

      img.ondragleave = (evt) => {
        let img = evt.target;
        // on enlève la classe CSS grilleDragOver
        img.classList.remove("grilleDragOver");
      };

      img.ondrop = (evt) => {
        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieSurZoneDeDrop = this.tabCookies[l][c];

        this.tabCookiesCliquees.push(cookieSurZoneDeDrop);

        if (this.swapPossible()) {
          this.swapCookies();
        } 
        this.resetCookiCliquee();
        imgDrop.classList.remove("grilleDragOver");
      };
    });
  }

  // Fonction désélectionnant les cookies et vidant le tableau tabCookiesCliquees
  resetCookiCliquee() {
    this.tabCookiesCliquees[0].deselectionnee();
    this.tabCookiesCliquees[1].deselectionnee();
    this.tabCookiesCliquees = [];
  }

  // Fonction permetttant de vérifier si deux cookies peuvent être échangés
  swapPossible() {
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];
    return Cookie.distance(cookie1, cookie2) === 1;
  }

  // Fonction permettant d'échanger deux cookies
  swapCookies() {
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];

    let tmpType = cookie1.type;
    let tmpImgSrc = cookie1.htmlImage.src;

    cookie1.type = cookie2.type;
    cookie1.htmlImage.src = cookie2.htmlImage.src;

    cookie2.type = tmpType;
    cookie2.htmlImage.src = tmpImgSrc;

    // On fait appel à la fonction detecteTousLesAlignements lors du swap
    this.detecteTousLesAlignements();
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */

  remplirTableauDeCookies() {
    this.tabCookies = create2DArray(9);

    // On fait une boucle afin de réaliser une grille sans alignement
    do {
      for (let l = 0; l < this.nbLignes; l++) {
        for (let c = 0; c < this.nbColonnes; c++) {
          let type = Math.floor(Math.random() * this.nbCookiesDifferents);
          this.tabCookies[l][c] = new Cookie(type, l, c);
        }
      }
    } while (this.detecteTousLesAlignements());
  }

  // Fonction permettant de détecter les allignements dans toute la grille
  detecteTousLesAlignements() {
    this.nbAlignements = 0;

    // pour chaque ligne on va appeler detecteAlignementLigne et idem pour chaque colonne
    for (let l = 0; l < this.nbLignes; l++) {
      this.detecteAlignementLigne(l);
    }

    for (let c = 0; c < this.nbColonnes; c++) {
      this.detecteAlignementColonne(c);
    }

    return this.nbAlignements !== 0;
  }

  // Fonction permettant de détecter les allignment dans une ligne
  detecteAlignementLigne(ligne) {
    let ligneGrille = this.tabCookies[ligne];
    for (let l = 0; l <= this.nbColonnes - 3; l++) {
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 2];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // On supprime les cookies
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();
        this.nbAlignements++;
      }
    }
  }

  // Fonction permettant de détecter les allignment dans une colonne
  detecteAlignementColonne(colonne) {
    for (let ligne = 0; ligne <= this.nbLignes - 3; ligne++) {
      let cookie1 = this.tabCookies[ligne][colonne];
      let cookie2 = this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 2][colonne];

      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        // On supprime les cookies
        cookie1.supprimer();
        cookie2.supprimer();
        cookie3.supprimer();
        this.nbAlignements++;
      }
    }
  }

  /* Les fonction detecteAlignementLigneGraph et detecteAlignementColonneGraph reprennent le meme principe 
  que les fonctions permettant de détecter l'lignement sauf qu'à la place de supprimer les cookie elle les selectionne  */
  detecterMatch3Lignes(ligne) {
    let ligneGrille = this.tabCookies[ligne];
    for (let l = 2; l <= this.nbColonnes - 4; l++) {
      let cookie1 = ligneGrille[l];
      let cookie2 = ligneGrille[l + 1];
      let cookie3 = ligneGrille[l + 3];
      let cookie4 = ligneGrille[l - 2];
      
      // On regarde une case apres le groupe de deux cookies identiques si le cookie est du meme type, si oui on le selectionne
      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();
      }
      // On fait de meme mais pour la case d'avant
      else if (cookie1.type === cookie2.type && cookie1.type === cookie4.type) {
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie4.selectionnee();

      }
    }
  }

  detecterMatch3Colonnes(colonne) {
    for (let ligne = 2; ligne <= this.nbLignes - 4; ligne++) {
      let cookie1 = this.tabCookies[ligne][colonne];
      let cookie2 = this.tabCookies[ligne + 1][colonne];
      let cookie3 = this.tabCookies[ligne + 3][colonne];
      let cookie4 = this.tabCookies[ligne - 2][colonne];

      // On regarde une case apres le groupe de deux cookies identiques si le cookie est du meme type, si oui on le selectionne
      if (cookie1.type === cookie2.type && cookie1.type === cookie3.type) {
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie3.selectionnee();
      }
      // On fait de meme mais pour la case d'avant
      else if (cookie1.type === cookie2.type && cookie1.type === cookie4.type) {
        cookie1.selectionnee();
        cookie2.selectionnee();
        cookie4.selectionnee();
      }
    }
  }
  
  // Fonction permettant de vérifier si des groupes possibles se toruvent dans la grille 
  detecterToutLesMatch3() {
    for (let l = 0; l < this.nbLignes; l++) {
      this.detecterMatch3Lignes(l);
    }
    for (let c = 0; c < this.nbColonnes; c++) {
      this.detecterMatch3Colonnes(c);
    }
  }


}

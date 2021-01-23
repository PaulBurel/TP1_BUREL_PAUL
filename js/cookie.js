class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    // A FAIRE
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    // On crée l'élément html img
    this.htmlImage = document.createElement("img"); 
    // La source de img sera choisi dans le tableau urlsImagesNormales
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type]; 
    this.htmlImage.width = 80;
    this.htmlImage.height = 80;
    // On stock la ligne et la colonne dans l'objet img
    this.htmlImage.dataset.ligne = ligne;
    this.htmlImage.dataset.colonne = colonne;
    // on rajoute la classe CSS
    this.htmlImage.classList.add("cookies");
    //Statut du cookie, 1 il ne doit pas etre supprimer à il doit l'etre
    this.statut = 0;  
  }

  selectionnee() {
    // On change l'image et la classe CSS
    this.htmlImage.classList.add("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  deselectionnee() {
    // On change l'image et la classe CSS
    this.htmlImage.classList.remove("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }

  supprimer() {
    this.htmlImage.classList.add("cookie-cachee");
  }

  annulerASupprimer() {
    this.htmlImage.classList.remove("cookie-cachee");
  }

  isASupprimer() {
    return this.htmlImage.classList.contains("cookie-cachee");
  }

  
  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }
}

const tabella = document.createElement('table');
tabella.className = 'scacchiera-reale';

const celleRiferimento = []; 
const matriceSpecchio = [];

let matriceTipi;

function CreaScacchiera() {
    let comparatore;
    
    
    
    // VARIABILE DI STATO: ricorda quale cella e quale pedina sono attive in questo momento
    let cellaAttiva = null; 
    const celleAttive = [];

    tabella.style.borderCollapse = 'collapse';
    tabella.style.position = "absolute";

    const larghezzaScacchiera = 416; 
    const altezzaScacchiera = 416;
    tabella.style.left = (window.innerWidth / 2 - larghezzaScacchiera / 2) + "px";
    tabella.style.top = (window.innerHeight / 2 - altezzaScacchiera / 2) + "px";

    const tbody = document.createElement('tbody');

    for (let i = 0; i < 8; i++) {
        const rigaElemento = document.createElement('tr');
        const rigaLogica = [];
        
        const rigaCelleDOM = []; 
        
        matriceSpecchio.push(rigaLogica);
        celleRiferimento.push(rigaCelleDOM);

        comparatore = (i % 2 === 0) ? 1 : 0;

        for (let j = 0; j < 8; j++) {
            const cella = document.createElement('td');
            cella.className = 'box';
            rigaLogica.push("-");
            rigaCelleDOM.push(cella);

            const cerchio = document.createElement('div');
            cerchio.className = 'indicatore';
            cella.appendChild(cerchio);

            // Calcoliamo e salviamo il colore originale per poterlo ripristinare dopo
            const coloreOriginale = (j % 2 === comparatore) ? "rgb(112, 52, 28)" : "rgb(250, 250, 209)";
            cella.style.backgroundColor = coloreOriginale;
            cella.dataset.coloreBase = coloreOriginale; // Salviamo il dato nell'HTML
            

            cella.addEventListener("click", function() {
                if(matriceTipi[i][j] == "pedone bianco" || matriceTipi[i][j] == "pedone nero") {
                    // 1. Se clicco la cella che è GIÀ attiva, la deseleziono e mi fermo
                    if (cellaAttiva && cellaAttiva.elemento === this) {
                        this.style.backgroundColor = this.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva = null; // Svuoto la memoria
                        return;
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k]) {
                            this.style.backgroundColor = this.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }

                    // 2. Se c'è un'altra cella attiva (sto cliccando su una nuova), la spengo
                    if (cellaAttiva) {
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                    }

                    // 3. Accendo la nuova cella cliccata
                    this.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                    
                    let pedinaTrovata = null;
                    if (i > 0) {
                        if(matriceTipi[i - 1][j] != "vuoto") return;
                        const cellaDavanti = celleRiferimento[i - 1][j];
                        pedinaTrovata = cellaDavanti.querySelector('.indicatore');
                        if (pedinaTrovata) {
                            pedinaTrovata.style.opacity = "1";
                        }
                    }

                    // 4. Aggiorno la memoria con i dati della nuova cella attiva
                    cellaAttiva = {
                        elemento: this,
                        pedinaDavanti: pedinaTrovata
                    };
                } else if(matriceTipi[i][j] == "torre bianco" || matriceTipi[i][j] == "torre nero") {
                    console.log(celleAttive.length);

                    if (cellaAttiva) {
                        this.style.backgroundColor = this.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        cellaAttiva = null; // Svuoto la memoria
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k] && celleAttive[k].elemento === this) {
                            this.style.backgroundColor = this.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                            if(k == celleAttive.length -1) return;
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }
                    
                    const spaziTrovati = [];
                    celleAttive.length = 0;
                    if (i > 0) {
                        let cellaDavanti;
                        let pezzoAlleato = false;
                        for(let k=6;k>0;k--) {
                            cellaDavanti = celleRiferimento[k][j];

                            const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "alfiere", "cavallo", "torre", "pedone"];
                            if(matriceTipi[i][j] == "torre bianco") {
                                
                                for(let l=0;l<pezzi.length;l++) {
                                    console.log(matriceTipi[k][j] + " " + pezzi[l] + " bianco")
                                    if(matriceTipi[k][j] == pezzi[l] + " bianco") pezzoAlleato = true;
                                }
                            } else {
                                for(let l=0;l<pezzi.length;l++) {
                                    if(matriceTipi[k][j] == pezzi[l] + " nero") pezzoAlleato = true;
                                }
                            }

                            if(!pezzoAlleato) {
                                spaziTrovati[k] = cellaDavanti.querySelector('.indicatore');

                                if (spaziTrovati[k]) {
                                    spaziTrovati[k].style.opacity = "1";
                                }

                                celleAttive.push({
                                    elemento: this,
                                    pedinaDavanti: spaziTrovati[k]
                                }) 
                                if(matriceTipi[k][j] != "vuoto") {
                                    cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                    cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                    return;
                                }
                            }
  
                        }  
                    }

                    
                }
                
            });

            rigaElemento.appendChild(cella);
        }
        tbody.appendChild(rigaElemento);
    }

    tabella.appendChild(tbody);
    document.body.appendChild(tabella);
    return matriceSpecchio;
}

function riempiScacchiera() {
    let i, j;
    matriceTipi = structuredClone(matriceSpecchio);
    const primaFilaNera = ["torre", "cavallo", "alfiere", "regina", "re", "alfiere", "cavallo", "torre"];
    for (j = 0; j < 8; j++) {
        matriceTipi[0][j] = primaFilaNera[j] + " nero";
        const pezzo = document.createElement('img');

        pezzo.className = 'pezzo';
        pezzo.src = "anonimo.png";
        celleRiferimento[0][j].appendChild(pezzo); 
    }

    // Riga 1: pedoni neri
    for (j = 0; j < 8; j++) {
        matriceTipi[1][j] = "pedone nero";
        const pezzo = document.createElement('img');

        pezzo.className = 'pezzo';
        pezzo.src = "anonimo.png";
        celleRiferimento[1][j].appendChild(pezzo);

    }

    // Righe 2-5: vuoto
    for (i = 2; i < 6; i++) {
        for (j = 0; j < 8; j++) {
            matriceTipi[i][j] = "vuoto";
        }
    }

    // Riga 6: pedoni bianchi
    for (j = 0; j < 8; j++) {
        matriceTipi[6][j] = "pedone bianco";
        const pezzo = document.createElement('img');

        pezzo.className = 'pezzo';
        pezzo.src = "anonimo.png";
        celleRiferimento[6][j].appendChild(pezzo);
    }

    // Riga 7: pezzi bianchi (ultima fila)
    const primaFilaBianca = ["torre", "cavallo", "alfiere", "regina", "re", "alfiere", "cavallo", "torre"];
    for (j = 0; j < 8; j++) {
        matriceTipi[7][j] = primaFilaBianca[j] + " bianco";
        const pezzo = document.createElement('img');

        pezzo.className = 'pezzo';
        pezzo.src = "anonimo.png";
        celleRiferimento[7][j].appendChild(pezzo);
    }
    
    
    /* for(i = 0; i < 8; i++) {
        for(j = 0; j < 8; j++) {
            console.log(matriceTipi[i][j]);
        }
    } */
}

function creaIndici() {
    const tabellaIndici = document.createElement('table');
    tabellaIndici.className = 'tabella-indici';
    const lettera = [" ", "A","B","C","D","E","F","G","H"];
    tabellaIndici.style.borderCollapse = 'collapse';
    tabellaIndici.style.position = "absolute";

    const offset = 52; 
    tabellaIndici.style.left = (window.innerWidth / 2 - 416 / 2 - offset) + "px";
    tabellaIndici.style.top = (window.innerHeight / 2 - 416 / 2) + "px";

    const tbody = document.createElement('tbody');
    for (let i = 0; i < 9; i++) {
        const rigaElemento = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cella = document.createElement('td');
            cella.className = 'box';
            cella.style.border = "1px solid transparent";
            cella.style.fontSize = "20px";
            cella.style.color = "white";
            if(j === 0 && i !== 8) cella.innerHTML = i+1;
            else if(i === 8) cella.innerHTML = lettera[j];
            rigaElemento.appendChild(cella);
        }
        tbody.appendChild(rigaElemento);
    }
    tabellaIndici.appendChild(tbody);
    document.body.appendChild(tabellaIndici);
}

CreaScacchiera();
riempiScacchiera();
creaIndici();
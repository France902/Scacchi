let tabella = document.createElement('table');
tabella.className = 'scacchiera-reale';

let celleRiferimento = []; 
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
            rigaLogica.push("vuoto");
            rigaCelleDOM.push(cella);

            const cerchio = document.createElement('div');
            cerchio.className = 'indicatore';
            cella.appendChild(cerchio);

            // Calcoliamo e salviamo il colore originale per poterlo ripristinare dopo
            const coloreOriginale = (j % 2 === comparatore) ? "rgb(112, 52, 28)" : "rgb(250, 250, 209)";
            cella.style.backgroundColor = coloreOriginale;
            cella.dataset.coloreBase = coloreOriginale; // Salviamo il dato nell'HTML

            function azionePedone(object) {
                if (cellaAttiva && cellaAttiva.elemento === object) {
                        object.style.backgroundColor = object.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva = null; // Svuoto la memoria
                        return;
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k]) {
                            object.style.backgroundColor = object.dataset.coloreBase;
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
                    object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 

                    const spaziTrovati = [];
                    celleAttive.length = 0;

                     let cellaDavanti;
                        let pezzoAlleato = false;
                        for(let k=0;k<1;k++) {
                            let tipoCorrente;
                            if(matriceTipi[i][j] == "pedone bianco") {
                                cellaDavanti = celleRiferimento[i - 1] ? celleRiferimento[i - 1][j] : undefined;
                                tipoCorrente = matriceTipi[i - 1][j];
                            } else {
                                cellaDavanti = celleRiferimento[i + 1] ? celleRiferimento[i + 1][j] : undefined;
                                tipoCorrente = matriceTipi[i + 1][j];
                            }
                            if(cellaDavanti !== undefined) {
                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(matriceTipi[i][j] == "pedone bianco") {
                                pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                } else {
                                    pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                }

                        

                                if(!pezzoAlleato) {
                                    if(matriceTipi[i][j] == "pedone bianco") {
                                        creaIndicatore(spaziTrovati, cellaDavanti, i - 1, object);
                                        celleAttive.push({
                                            elemento: object,
                                            pedinaDavanti: spaziTrovati[i - 1],
                                            posY: i - 1,
                                            posX: j
                                        }) 
                                        if(matriceTipi[i - 1][j] != "vuoto") {
                                            cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                            cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                            break;
                                        }
                                    } else {
                                        creaIndicatore(spaziTrovati, cellaDavanti, i + 1, object);
                                        celleAttive.push({
                                            elemento: object,
                                            pedinaDavanti: spaziTrovati[i + 1],
                                            posY: i + 1,
                                            posX: j
                                        }) 
                                        if(matriceTipi[i + 1][j] != "vuoto") {
                                            cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                            cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                            break;
                                        }
                                    }
                                    
                                } else break;
                            }

                        }
            }

            function azioneTorre(object, condRegina = false) {
                if (cellaAttiva) {
                        object.style.backgroundColor = object.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        cellaAttiva = null; // Svuoto la memoria
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k] && celleAttive[k].elemento === object) {
                            object.style.backgroundColor = object.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                            if(k == celleAttive.length -1) {
                                celleAttive.length = 0;
                                return;
                            }
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }

                    object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                    
                    const spaziTrovati = [];
                    celleAttive.length = 0;

                        let cellaDavanti;
                        let pezzoAlleato = false;
                        for(let k=i-1;k>=0;k--) {
                            cellaDavanti = celleRiferimento[k] ? celleRiferimento[k][j] : undefined;
                            if(cellaDavanti != undefined) {
                                let tipoCorrente = matriceTipi[k][j];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "torre bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                    
                            

                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: k,
                                        posX: j
                                    }) 
                                    if(matriceTipi[k][j] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                } else break;
                            }

                            
  
                        }  

                        pezzoAlleato = false;

                        for(let k=j+1;k<8;k++) {
                            cellaDavanti = celleRiferimento[i] ? celleRiferimento[i][k] : undefined;
                            if(cellaDavanti != undefined) {
                                let tipoCorrente = matriceTipi[i][k];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "torre bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                


                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i,
                                        posX: k
                                    }) 
                                    if(matriceTipi[i][k] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                    else break;
                            }

                           
                        }

                        pezzoAlleato = false;

                        for(let k=j-1;k>=0;k--) {
                            cellaDavanti = celleRiferimento[i] ? celleRiferimento[i][k] : undefined;
                            if(cellaDavanti !== undefined) {
                                let tipoCorrente = matriceTipi[i][k];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "torre bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                


                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i,
                                        posX: k
                                    }) 
                                    if(matriceTipi[i][k] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                    else break;
                            }

                            
                        }

                        pezzoAlleato = false;

                        for(let k=i+1;k<8;k++) {
                            cellaDavanti = celleRiferimento[k] ? celleRiferimento[k][j] : undefined;
                            if(cellaDavanti !== undefined) {
                                let tipoCorrente = matriceTipi[k][j];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "torre bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                    
                            

                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object); 
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: k,
                                        posX: j
                                    }) 
                                    if(matriceTipi[k][j] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                } else break;
                            }

                            
  
                        }  



            }

            function azioneAlfiere(object, condRegina = false) {
                const spaziTrovati = [];
                if(!condRegina) {
                    if (cellaAttiva) {
                        object.style.backgroundColor = object.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        cellaAttiva = null; // Svuoto la memoria
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k] && celleAttive[k].elemento === object) {
                            object.style.backgroundColor = object.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                            if(k == celleAttive.length -1) {
                                celleAttive.length = 0;
                                return;
                            }
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }
                    
                    
                    celleAttive.length = 0;
                }

                
                object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                
                if(condRegina) {
                    object.style.backgroundColor = object.dataset.coloreBase;

                    for(let k=0;k<celleAttive.length;k++) {
                            if (celleAttive[k] && celleAttive[k].elemento === object) {
                            object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                                
                            }
                        }
                }

                if(celleAttive.length == 0 && condRegina) return;
                
                    
                        let cellaDavanti;
                        let pezzoAlleato = false;
                        for(let k=1;k<8;k++) {
                            cellaDavanti = celleRiferimento[i - k] ? celleRiferimento[i - k][j - k] : undefined;
                            if(cellaDavanti != undefined) {
                                let tipoCorrente = matriceTipi[i - k][j - k];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "alfiere bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 
                                    

                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i - k,
                                        posX: j - k,
                                    }) 
                                    if(matriceTipi[i - k][j - k] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                else break;
                            }

                            
                        }  

                        

                        pezzoAlleato = false;

                        for(let k=1;k<8;k++) {
                            cellaDavanti = celleRiferimento[i - k] ? celleRiferimento[i - k][j + k] : undefined;
                            if(cellaDavanti !== undefined) {
                                let tipoCorrente = matriceTipi[i - k][j + k];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "alfiere bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i - k,
                                        posX: j + k,
                                    }) 
                                    if(matriceTipi[i - k][j + k] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                else break;
                            }

                            
                        }  

                        pezzoAlleato = false;

                        for(let k=-1;k>-8;k--) {
                            cellaDavanti = celleRiferimento[i - k] ? celleRiferimento[i - k][j + k] : undefined;
                            if(cellaDavanti !== undefined) {
                                let tipoCorrente = matriceTipi[i - k][j + k];

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "alfiere bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    } 

                                    


                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i - k,
                                        posX: j + k,
                                    }) 
                                    if(matriceTipi[i - k][j + k] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                    else break;
                            }

                            
                        }  

                        pezzoAlleato = false;
                        

                        for(let k=1;k<8;k++) {
                            cellaDavanti = celleRiferimento[i + k] ? celleRiferimento[i + k][(j + k)] : undefined;
                            if(cellaDavanti !== undefined) {
                                let tipoCorrente = matriceTipi[i + k][(j + k)];
                            

                                const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                                if(!condRegina) {
                                    if(matriceTipi[i][j] == "alfiere bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                    } else {
                                        pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                    }
                                } else {
                                    if(matriceTipi[i][j] == "regina bianco") {
                                        pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                                        } else {
                                            pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                                        }
                                    }
                                    
                                    
                                    
                                if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: i + k,
                                        posX: j + k,
                                    }) 
                                    if(matriceTipi[i + k][(j + k)] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                        break;
                                    }
                                }
                                else break;
                            }
  
                        }  

                        
            }

            function azioneRegina(object) {
                azioneTorre(object, true);
                azioneAlfiere(object, true);
            }

            function azioneCavallo(object) {
                const spaziTrovati = [];
                if (cellaAttiva) {
                        object.style.backgroundColor = object.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        cellaAttiva = null; // Svuoto la memoria
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k] && celleAttive[k].elemento === object) {
                            object.style.backgroundColor = object.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                            if(k == celleAttive.length -1) {
                                celleAttive.length = 0;
                                return;
                            }
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }

                    object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                    
                    celleAttive.length = 0;
                    
                    let cellaDavanti;
                    let pezzoAlleato = false;

                    for(let k=0;k<8;k++) {
                        let tipoCorrente;
                        let currentI, currentJ;
                        if(k == 0) {
                            currentI = i - 2;
                            currentJ = j + 1;
                        } 
                        if(k == 1) {
                            currentI = i - 2;
                            currentJ = j - 1;
                        }
                        if(k == 2) {
                            currentI = i + 2;
                            currentJ = j + 1;
                        }
                        if(k == 3) {
                            currentI = i + 2;
                            currentJ = j - 1;
                        }
                        if(k == 4) {
                            currentI = i - 1;
                            currentJ = j + 2;
                        } 
                        if(k == 5) {
                            currentI = i + 1;
                            currentJ = j + 2;
                        }
                        if(k == 6) {
                            currentI = i - 1;
                            currentJ = j - 2;
                        }
                        if(k == 7) {
                            currentI = i + 1;
                            currentJ = j - 2;
                        }

                        cellaDavanti = celleRiferimento[currentI] ? celleRiferimento[currentI][currentJ] : undefined;
                        if(cellaDavanti != undefined) {
                            tipoCorrente = matriceTipi[currentI][currentJ];

                            const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                            console.log(matriceTipi[i][j])
                            if(matriceTipi[i][j] == "cavallo bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                            } else {
                                pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                            }

                            if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: currentI,
                                        posX: currentJ,
                                    }) 
                                    if(matriceTipi[currentI][(currentJ)] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                    }
                                }

                        }
                        
                    }
                    

            }

            function azioneRe(object) {
                const spaziTrovati = [];
                if (cellaAttiva) {
                        object.style.backgroundColor = object.dataset.coloreBase;
                        if (cellaAttiva.pedinaDavanti) {
                            cellaAttiva.pedinaDavanti.style.opacity = "0";
                        }
                        cellaAttiva.elemento.style.backgroundColor = cellaAttiva.elemento.dataset.coloreBase;
                        cellaAttiva = null; // Svuoto la memoria
                    }

                    for(let k=0;k<celleAttive.length;k++) {
                        if (celleAttive[k] && celleAttive[k].elemento === object) {
                            object.style.backgroundColor = object.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                            celleAttive[k] = null;
                            if(k == celleAttive.length -1) {
                                celleAttive.length = 0;
                                return;
                            }
                        }

                        if (celleAttive[k]) {
                            celleAttive[k].elemento.style.backgroundColor = celleAttive[k].elemento.dataset.coloreBase;
                            if (celleAttive[k].pedinaDavanti) {
                                celleAttive[k].pedinaDavanti.style.opacity = "0";
                            }
                        }
                    }

                    object.style.backgroundColor = "rgba(255, 255, 0, 0.3)"; 
                    
                    celleAttive.length = 0;
                    
                    let cellaDavanti;
                    let pezzoAlleato = false;

                    for(let k=0;k<8;k++) {
                        let tipoCorrente;
                        let currentI, currentJ;
                        if(k == 0) {
                            currentI = i - 1;
                            currentJ = j - 1;
                        } 
                        if(k == 1) {
                            currentI = i - 1;
                            currentJ = j;
                        }
                        if(k == 2) {
                            currentI = i - 1;
                            currentJ = j + 1;
                        }
                        if(k == 3) {
                            currentI = i;
                            currentJ = j + 1;
                        }
                        if(k == 4) {
                            currentI = i + 1;
                            currentJ = j + 1;
                        } 
                        if(k == 5) {
                            currentI = i + 1;
                            currentJ = j;
                        }
                        if(k == 6) {
                            currentI = i + 1;
                            currentJ = j - 1;
                        }
                        if(k == 7) {
                            currentI = i;
                            currentJ = j - 1;
                        }

                        cellaDavanti = celleRiferimento[currentI] ? celleRiferimento[currentI][currentJ] : undefined;
                        if(cellaDavanti != undefined) {
                            tipoCorrente = matriceTipi[currentI][currentJ];

                            const pezzi = ["torre", "cavallo", "alfiere", "regina", "re", "pedone"];
                            if(matriceTipi[i][j] == "re bianco") {
                                    pezzoAlleato = controllaBianco(pezzi, tipoCorrente);
                            } else {
                                pezzoAlleato = controllaNero(pezzi, tipoCorrente);
                            }

                            if(!pezzoAlleato) {
                                    creaIndicatore(spaziTrovati, cellaDavanti, k, object);
                                    celleAttive.push({
                                        elemento: object,
                                        pedinaDavanti: spaziTrovati[k],
                                        posY: currentI,
                                        posX: currentJ,
                                    }) 
                                    if(matriceTipi[currentI][(currentJ)] != "vuoto") {
                                        cellaDavanti.querySelector('.indicatore').style.marginTop = "0px";
                                        cellaDavanti.querySelector('.indicatore').style.marginLeft = "0px";
                                    }
                                }

                        }
                        
                    }

            }

            function controllaBianco(pezzi, tipoCorrente) {
                for(let l=0;l<pezzi.length;l++) {
                    if(tipoCorrente == pezzi[l] + " bianco") return true;
                }
                return false;
            }

            function controllaNero(pezzi, tipoCorrente) {
                for(let l=0;l<pezzi.length;l++) {
                    if(tipoCorrente == pezzi[l] + " nero") return true;
                }
                return false;
            }

            function creaIndicatore(spaziTrovati, cellaDavanti, k, object) {
                spaziTrovati[k] = cellaDavanti.querySelector('.indicatore');
                                
                if (spaziTrovati[k]) {
                    spaziTrovati[k].style.opacity = "1";
                }

            }

            

            cella.addEventListener("click", function() {
                for(let k=0;k<celleAttive.length;k++) {
                    if(celleAttive[k].posY == i && celleAttive[k].posX == j) {
                        spostaPezzo(oldY, oldX, k); 
                        return;
                    }
                }

                tipoPedina = matriceTipi[i][j];
                if(tipoPedina == "pedone bianco" || tipoPedina == "pedone nero") {
                    oldY = i; oldX = j;
                    azionePedone(this);
                } else if(tipoPedina == "torre bianco" || tipoPedina == "torre nero") {
                    oldY = i; oldX = j;
                    azioneTorre(this);     
                } else if(tipoPedina == "alfiere bianco" || tipoPedina == "alfiere nero") {
                    oldY = i; oldX = j;
                    azioneAlfiere(this);
                } else if(tipoPedina == "regina bianco" || tipoPedina == "regina nero") {
                    oldY = i; oldX = j;
                    azioneRegina(this);
                } else if(tipoPedina == "cavallo bianco" || tipoPedina == "cavallo nero") {
                    oldY = i; oldX = j;
                    azioneCavallo(this);
                } else if(tipoPedina == "re bianco" || tipoPedina == "re nero") {
                    oldY = i; oldX = j;
                    azioneRe(this);
                }
                
            });

            function spostaPezzo(oldY, oldX, indice) {
                matriceTipi[celleAttive[indice].posY][celleAttive[indice].posX] = tipoPedina;
                matriceTipi[oldY][oldX] = "vuoto";
                
                let app = celleRiferimento[oldY][oldX]
                celleRiferimento[oldY][oldX] = celleRiferimento[celleAttive[indice].posY][celleAttive[indice].posX];
                celleRiferimento[celleAttive[indice].posY][celleAttive[indice].posX] = app;
                

                const vecchiaTabella = document.querySelector('.scacchiera-reale');

                if (vecchiaTabella) {
                    vecchiaTabella.remove();
                }

                tabella = document.createElement('table');
                tabella.className = 'scacchiera-reale';
                

                celleRiferimento = [];
                CreaScacchiera();
                ricaricaScacchiera();

            }

            rigaElemento.appendChild(cella);
        }
        tbody.appendChild(rigaElemento);
    }
    

    tabella.appendChild(tbody);
    document.body.appendChild(tabella);
}

let oldY, oldX, tipoPedina;

function riempiScacchiera() {
    let i, j;
    matriceTipi = structuredClone(matriceSpecchio);
    const immaginiPezziNeri = {
        "torre nero": "Torre_Nera.png",
        "cavallo nero": "Cavallo_Nero.png",
        "alfiere nero": "Alfiere_Nero.png",
        "regina nero": "Regina_Nera.png",
        "re nero": "Re_Nero.png"
    };

    const primaFilaNeri = ["torre", "cavallo", "alfiere", "regina", "re", "alfiere", "cavallo", "torre"];

    for (let j = 0; j < 8; j++) {
        const nomePezzo = primaFilaNeri[j] + " nero";
        matriceTipi[0][j] = nomePezzo;

        const pezzo = document.createElement('img');
        pezzo.className = 'pezzo';
        
        // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
        pezzo.src = immaginiPezziNeri[nomePezzo]; 
        
        pezzo.style.width = "30px"; 
        pezzo.style.height = "auto";
        celleRiferimento[0][j].appendChild(pezzo);
    }

    // Riga 1: pedoni neri
    for (j = 0; j < 8; j++) {
        matriceTipi[1][j] = "pedone nero";
        const pezzo = document.createElement('img');

        pezzo.className = 'pezzo';
        pezzo.src = "Pedone_Nero.png";
        pezzo.style.width = "30px"; 
        pezzo.style.height = "auto";
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
            pezzo.src = "pedone_bianco.png";
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[6][j].appendChild(pezzo);           
        
    }

    // Riga 7: pezzi bianchi (ultima fila)
    const immaginiPezziBianchi = {
        "torre bianco": "torre_bianco.png",
        "cavallo bianco": "cavallo_bianco.png",
        "alfiere bianco": "alfiere_bianco.png",
        "regina bianco": "regina_bianco.png",
        "re bianco": "re_bianco.png"
    };

    const primaFilaBianca = ["torre", "cavallo", "alfiere", "regina", "re", "alfiere", "cavallo", "torre"];

    for (let j = 0; j < 8; j++) {
            const nomePezzo = primaFilaBianca[j] + " bianco";
            matriceTipi[7][j] = nomePezzo;

            const pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[7][j].appendChild(pezzo);
        
    }

    let nomePezzo = primaFilaBianca[3] + " bianco";
            matriceTipi[4][3] = nomePezzo;

            let pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[4][3].appendChild(pezzo);

    nomePezzo = primaFilaBianca[2] + " bianco";
            matriceTipi[5][2] = nomePezzo;

            pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[5][2].appendChild(pezzo);

    nomePezzo = primaFilaBianca[0] + " bianco";
            matriceTipi[3][5] = nomePezzo;

            pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[3][5].appendChild(pezzo);

    nomePezzo = primaFilaBianca[1] + " bianco";
            matriceTipi[5][3] = nomePezzo;

            pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[5][3].appendChild(pezzo);
    nomePezzo = primaFilaBianca[4] + " bianco";
            matriceTipi[5][4] = nomePezzo;

            pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            
            // 2. Recupera l'immagine corretta dalla mappa usando il nomePezzo
            pezzo.src = immaginiPezziBianchi[nomePezzo]; 
            
            pezzo.style.width = "30px"; 
            pezzo.style.height = "auto";
            celleRiferimento[5][4].appendChild(pezzo);
    
    
     /*for(i = 0; i < 8; i++) {
        for(j = 0; j < 8; j++) {
            console.log(matriceTipi[i][j]);
        }
    } */
}

function ricaricaScacchiera() {

    const immaginiPezzi = {
        "torre nero":    "Torre_Nera.png",
        "cavallo nero":  "Cavallo_Nero.png",
        "alfiere nero":  "Alfiere_Nero.png",
        "regina nero":   "Regina_Nera.png",
        "re nero":       "Re_Nero.png",
        "pedone nero":   "Pedone_Nero.png",
        "torre bianco":  "torre_bianco.png",
        "cavallo bianco":"cavallo_bianco.png",
        "alfiere bianco":"alfiere_bianco.png",
        "regina bianco": "regina_bianco.png",
        "re bianco":     "re_bianco.png",
        "pedone bianco": "pedone_bianco.png"
    };

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const tipo = matriceTipi[i][j];

            if (tipo === "vuoto" || !immaginiPezzi[tipo]) continue;

            const pezzo = document.createElement('img');
            pezzo.className = 'pezzo';
            pezzo.src = immaginiPezzi[tipo];
            pezzo.style.width = "30px";
            pezzo.style.height = "auto";
            celleRiferimento[i][j].appendChild(pezzo);
        }
    }
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
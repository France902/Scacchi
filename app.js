const tabella = document.createElement('table');

function CreaScacchiera() {
    let comparatore;
    const matriceSpecchio = [];

    tabella.style.borderCollapse = 'collapse';
    tabella.style.position = "absolute";
    tabella.style.left = "267px"; 
    tabella.style.top = "25px";
    
    const tbody = document.createElement('tbody');

    for (let i = 0; i < 8; i++) {
        const rigaElemento = document.createElement('tr');
        rigaElemento.className = 'BoxGroup';

        if(i % 2 == 0) comparatore = 1;
        else comparatore = 0;
        
        const rigaLogica = [];

        for (let j = 0; j < 8; j++) {
            const cella = document.createElement('td');
            cella.className = 'box';

            cella.addEventListener("click", function(e) {
                console.log(`Hai cliccato la cella in posizione: Riga ${i}, Colonna ${j}`);
                
                this.style.backgroundColor = "yellow"; 
                
                matriceSpecchio[i][j] = "X"; 
                console.table(matriceSpecchio);
            });

            if(j % 2 == comparatore) cella.style.backgroundColor = "rgb(112, 52, 28)";
            else cella.style.backgroundColor = "rgb(250, 250, 209)";
            
            rigaElemento.appendChild(cella);

            rigaLogica.push("-");
        }
        
        // Aggiungiamo la riga logica alla matrice specchio
        matriceSpecchio.push(rigaLogica);
        tbody.appendChild(rigaElemento);
    }

    tabella.appendChild(tbody);
    document.body.appendChild(tabella);

    return matriceSpecchio;
}

function creaIndici() {
    const tabellaIndici = document.createElement('table');

    const lettera = [" ", "A","B","C","D","E","F","G","H"];

    tabellaIndici.style.borderCollapse = 'collapse';
    tabellaIndici.style.position = "absolute";
    tabellaIndici.style.left = "215px"; 
    tabellaIndici.style.top = "25px";

    const tbody = document.createElement('tbody');

    for (let i = 0; i < 9; i++) {
        const rigaElemento = document.createElement('tr');
        rigaElemento.className = 'BoxGroup';


        for (let j = 0; j < 9; j++) {
            const cella = document.createElement('td');
            cella.className = 'box';
            cella.style.border = "1px solid transparent";
            cella.style.fontSize = "20px";
            cella.style.color = "white";
            

            if(j == 0 && i != 8) cella.innerHTML = i+1;
            else if(i == 8)  cella.innerHTML = lettera[j];
            
            rigaElemento.appendChild(cella);
        }
        
        tbody.appendChild(rigaElemento);
    }

    tabellaIndici.appendChild(tbody);
    document.body.appendChild(tabellaIndici);
}

const scacchieraLogica = CreaScacchiera();
creaIndici();

console.table(scacchieraLogica);
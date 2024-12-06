window.onload = () => {
    // const data = {
    //     'Alba': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Arad': { Lidl: 2, Kaufland: 3, Auchan: 1},
    //     'Arges': { Lidl: 2, Kaufland: 3, Auchan: 1},
    //     'Bacau': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Bihor': { Lidl: 2, Kaufland: 3, Auchan: 1},
    //     'Bistrita-Nasaud': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Botosani': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Braila': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Brasov': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Bucuresti': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Buzau': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Caras-Severin': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Calarasi': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Cluj': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Constanta': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Covasna': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Dambovita': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Dolj': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Galati': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Giurgiu': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Gorj': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Harghita': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Hunedoara': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Ialomita': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Iasi': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Ilfov': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Maramures': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Mehedinti': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Mures': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Neamt': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Olt': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Prahova': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Salaj': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Satu-Mare': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Sibiu': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Suceava': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Teleorman': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Timis': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Tulcea': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Valcea': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Vaslui': { Lidl: 2, Kaufland: 3, Auchan: 1 },
    //     'Vrancea': { Lidl: 2, Kaufland: 3, Auchan: 1 }
    // };

    const data = {};

    async function loadExcelFile(fileUrl) {
        try {
            const response = await fetch(fileUrl); 
            const arrayBuffer = await response.arrayBuffer(); 
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; 
            const sheet = workbook.Sheets[sheetName];  

            const jsonData = XLSX.utils.sheet_to_json(sheet);

            
            jsonData.forEach(row => {
                const county = row['County']; 
                if (county) {
                    
                    data[county] = {
                        Lidl: row['Lidl'] || 0,       
                        Kaufland: row['Kaufland'] || 0, 
                        Auchan: row['Auchan'] || 0,     
                        misc: row['misc'] || 0          
                    };
                }
            });

            console.log(data);
        } catch (error) {
            console.error("Error loading or processing Excel file:", error);
        }
    }

    document.querySelectorAll('.allPaths').forEach(path => {
        path.addEventListener('mouseover', (event) => {
            const countyName = path.getAttribute('name');
            const countyData = data[countyName];

            document.querySelector('.popup-title').textContent = countyName;

            const shopInfo = Object.entries(countyData)
                .map(([shop, count]) => `<tr><td>${shop}</td><td>${count}</td></tr>`)
                .join('');
            const tableBody = document.querySelector('.map-tooltip table tbody');
            tableBody.innerHTML = shopInfo;
            const popup = document.querySelector('.popup-container');
            popup.style.display = 'block';
            popup.style.left = `${event.pageX + 10}px`;
            popup.style.top = `${event.pageY + 10}px`;
        });

        path.addEventListener('mouseout', () => {
            document.querySelector('.popup-container').style.display = 'none';
        });
    });
};

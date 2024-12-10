window.onload = () => {

    function createLabels() {
        const circles = document.querySelectorAll('circle[id^="RO"]');

        circles.forEach(circle => {
            const id = circle.id.substring(2);

            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.textContent = id;

            label.setAttribute("x", circle.getAttribute("cx"));
            label.setAttribute("y", parseFloat(circle.getAttribute("cy")) + 15);
            label.setAttribute("text-anchor", "middle");

            circle.parentNode.appendChild(label);
        });
    }

    createLabels();

    const data = {};

    async function loadExcelFile(fileUrl) {

        try {
            console.log("Fetching file from URL:", fileUrl);
            const response = await fetch(fileUrl);
            console.log("Response status:", response.status);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet);
            console.log("Parsed JSON data:", jsonData);

            jsonData.forEach(row => {
                const county = row['County'];
                if (county) {
                    data[county] = {
                        Lidl: row['Lidl'] || 0,
                        Kaufland: row['Kaufland'] || 0,
                        Auchan: row['Auchan'] || 0,
                        misc: row['misc'] || 0
                    };
                };
            });

            console.log("Processed data:", data);
        } catch (error) {
            console.error("Error loading or processing Excel file:", error);
        }
    };

    const fileUrl = "https://raw.githubusercontent.com/MitrachePatricia/MAP-NTX/main/sources/data.xlsx";
    loadExcelFile(fileUrl);
    //generateLabels();

    document.querySelectorAll('.allPaths').forEach(path => {
        path.addEventListener('mouseover', () => {
            const countyName = path.getAttribute('name');
            const countyData = data[countyName];
            document.querySelector('.popup-title').textContent = countyName;

            const shopInfo = Object.entries(countyData)
                .map(([shop, count]) => `<tr><td>${shop}</td><td style="color: white;">----</td><td style="text-align: center;">${count}</td></tr>`)
                .join('');
            const tableBody = document.querySelector('.map-tooltip table tbody');
            tableBody.innerHTML = shopInfo;

            const popup = document.querySelector('.popup-container');
            popup.style.display = 'block';
            popup.style.left = `100px`;
            popup.style.top = `100px`;

        });

        path.addEventListener('mouseout', () => {
            // document.querySelector('.popup-container').style.display = 'none';
        });
    });


};

window.onload = () => {

    function createLabels() {
        const circles = document.querySelectorAll('circle[id^="RO"]');

        circles.forEach(circle => {
            const id = circle.id.substring(2);

            if(id!="B"){
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.textContent = id;

            label.setAttribute("x", circle.getAttribute("cx"));
            label.setAttribute("y", parseFloat(circle.getAttribute("cy")) + 15);
            label.setAttribute("text-anchor", "middle");

            circle.parentNode.appendChild(label);}
        });
    }

    function createPins() {
        const labelPoints = document.getElementById('label_points');
        const circles = labelPoints.querySelectorAll('circle');

        circles.forEach(circle => {
            if(circle.id=="ROIS"){
            const cx = parseFloat(circle.getAttribute('cx'));
            const cy = parseFloat(circle.getAttribute('cy'));
                const pin = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                pin.setAttribute('x', cx + 10);
                pin.setAttribute('y', cy);
                pin.setAttribute('width', 30);
                pin.setAttribute('height', 30);
                pin.setAttribute('href', 'sources/pin.png');

                labelPoints.appendChild(pin);
                const pin2 = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                pin2.setAttribute('x', cx - 30);
                pin2.setAttribute('y', cy - 35);
                pin2.setAttribute('width', 30);
                pin2.setAttribute('height', 30);
                pin2.setAttribute('href', 'sources/pin.png');

                labelPoints.appendChild(pin2);
            } else if (circle.id=="RODJ" || circle.id=="ROB" || circle.id=="ROTM" || circle.id=="ROBV" || circle.id=="ROCJ"){
                
                    const cx = parseFloat(circle.getAttribute('cx'));
                    const cy = parseFloat(circle.getAttribute('cy'));
                        const pin = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                        pin.setAttribute('x', cx - 10);
                        pin.setAttribute('y', cy - 35);
                        pin.setAttribute('width', 30);
                        pin.setAttribute('height', 30);
                        pin.setAttribute('href', 'sources/pin.png');
        
                        labelPoints.appendChild(pin);
                }
            
        });
    }

    createLabels();
    createPins();

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
            popup.style.left = `10px`;
            popup.style.top = `10px`;

        });

        path.addEventListener('click', () => {
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
            popup.style.left = `10px`;
            popup.style.top = `10px`;
        });


        path.addEventListener('mouseout', () => {
            // document.querySelector('.popup-container').style.display = 'none';
        });
    });


};

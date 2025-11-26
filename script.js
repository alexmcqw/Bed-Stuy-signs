// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            document.getElementById(targetTab).classList.add('active');

            // Initialize visualizations when tab becomes active
            if (targetTab === 'map') {
                initMap();
            } else if (targetTab === 'timeline') {
                initTimeline();
            } else if (targetTab === 'background') {
                initRegressionAnalysis();
            }
        });
    });

    // Initialize charts
    initRevenueChart();
    initWeeklyChart();
});

// Revenue Chart
function initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Actual Revenue',
                    data: [45000, 52000, 48000, 68000, 62000, 75000],
                    borderColor: '#334155',
                    backgroundColor: 'rgba(51, 65, 85, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Target Revenue',
                    data: [50000, 50000, 55000, 55000, 60000, 60000],
                    borderColor: '#94a3b8',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#475569',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#334155',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#64748b'
                    },
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    }
                }
            }
        }
    });
}

// Weekly Chart for One Block in History
function initWeeklyChart() {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Daily Revenue',
                data: [42000, 45000, 85000, 48000, 52000, 55000, 38000],
                backgroundColor: function(context) {
                    if (context.dataIndex === 2) {
                        return '#334155'; // Highlight Wednesday
                    }
                    return '#94a3b8';
                },
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#334155',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#64748b'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#64748b',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(226, 232, 240, 0.5)'
                    }
                }
            }
        }
    });
}

// Map Visualization
function initMap() {
    const mapContainer = document.getElementById('map-visualization');
    if (!mapContainer || mapContainer.dataset.initialized === 'true') return;

    // Clear any existing content
    mapContainer.innerHTML = '';
    mapContainer.dataset.initialized = 'true';

    // Create SVG for Brooklyn outline (simplified)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 800 600');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

    // Simplified Brooklyn outline (polygon approximation)
    const brooklynPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    brooklynPath.setAttribute('d', 'M 100 100 L 700 80 L 750 200 L 720 400 L 600 550 L 200 520 L 80 350 Z');
    brooklynPath.setAttribute('fill', '#ffffff');
    brooklynPath.setAttribute('stroke', '#cbd5e1');
    brooklynPath.setAttribute('stroke-width', '2');
    svg.appendChild(brooklynPath);

    mapContainer.appendChild(svg);

    // Generate 300 random pinpoints
    const traditionalCount = 150;
    const modernCount = 150;
    let traditionalPlaced = 0;
    let modernPlaced = 0;

    // Function to check if point is within Brooklyn bounds (simplified)
    function isInBrooklyn(x, y) {
        // Simple bounding box check
        return x > 100 && x < 700 && y > 80 && y < 520;
    }

    // Generate traditional pins
    while (traditionalPlaced < traditionalCount) {
        const x = Math.random() * 600 + 100;
        const y = Math.random() * 440 + 80;
        
        if (isInBrooklyn(x, y)) {
            const pin = document.createElement('div');
            pin.className = 'map-pin traditional';
            pin.style.left = (x / 800 * 100) + '%';
            pin.style.top = (y / 600 * 100) + '%';
            pin.title = 'Traditional Typography Storefront';
            mapContainer.appendChild(pin);
            traditionalPlaced++;
        }
    }

    // Generate modern pins
    while (modernPlaced < modernCount) {
        const x = Math.random() * 600 + 100;
        const y = Math.random() * 440 + 80;
        
        if (isInBrooklyn(x, y)) {
            const pin = document.createElement('div');
            pin.className = 'map-pin modern';
            pin.style.left = (x / 800 * 100) + '%';
            pin.style.top = (y / 600 * 100) + '%';
            pin.title = 'Modern Typography Storefront';
            mapContainer.appendChild(pin);
            modernPlaced++;
        }
    }

    // Update legend counts
    document.getElementById('traditional-count').textContent = traditionalCount;
    document.getElementById('modern-count').textContent = modernCount;
}

// Timeline Visualization
function initTimeline() {
    const timelineContainer = document.getElementById('timeline-visualization');
    if (!timelineContainer || timelineContainer.dataset.initialized === 'true') return;

    timelineContainer.innerHTML = '';
    timelineContainer.dataset.initialized = 'true';

    // Generate 100 stores with random data
    const stores = [];
    const storeTypes = [
        { name: 'Bodega', type: 'traditional' },
        { name: 'Barbershop', type: 'traditional' },
        { name: 'Coffee Shop', type: 'modern' },
        { name: 'Yoga Studio', type: 'modern' },
        { name: 'Restaurant', type: 'traditional' },
        { name: 'Boutique', type: 'modern' },
        { name: 'Hardware Store', type: 'traditional' },
        { name: 'Cafe', type: 'modern' }
    ];

    for (let i = 0; i < 100; i++) {
        const storeType = storeTypes[Math.floor(Math.random() * storeTypes.length)];
        const startYear = 2000 + Math.floor(Math.random() * 20);
        const duration = Math.floor(Math.random() * 15) + 1;
        const endYear = Math.min(startYear + duration, 2024);
        const isOpen = endYear === 2024 && Math.random() > 0.3;

        stores.push({
            name: `${storeType.name} ${i + 1}`,
            type: storeType.type,
            startYear: startYear,
            endYear: endYear,
            isOpen: isOpen
        });
    }

    // Sort by start year
    stores.sort((a, b) => a.startYear - b.startYear);

    // Create timeline
    stores.forEach(store => {
        const item = document.createElement('div');
        item.className = 'timeline-item';

        // Store name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'timeline-store-name';
        nameDiv.textContent = store.name;
        item.appendChild(nameDiv);

        // Timeline line container
        const lineContainer = document.createElement('div');
        lineContainer.className = 'timeline-line-container';

        // Calculate positions (2000-2024 = 24 years)
        const startPercent = ((store.startYear - 2000) / 24) * 100;
        const endPercent = ((store.endYear - 2000) / 24) * 100;
        const width = endPercent - startPercent;

        // Line
        const line = document.createElement('div');
        line.className = `timeline-line ${store.type}`;
        line.style.left = startPercent + '%';
        line.style.width = width + '%';
        lineContainer.appendChild(line);

        // Start dot
        const startDot = document.createElement('div');
        startDot.className = `timeline-dot start ${store.isOpen && store.endYear === 2024 ? 'open' : 'closed'}`;
        startDot.style.left = startPercent + '%';
        lineContainer.appendChild(startDot);

        // End dot
        const endDot = document.createElement('div');
        endDot.className = `timeline-dot end ${store.isOpen ? 'open' : 'closed'}`;
        endDot.style.left = endPercent + '%';
        lineContainer.appendChild(endDot);

        item.appendChild(lineContainer);

        // Years display
        const yearsDiv = document.createElement('div');
        yearsDiv.className = 'timeline-years';
        yearsDiv.innerHTML = `
            <span>${store.startYear}</span>
            <span>${store.endYear}</span>
        `;
        item.appendChild(yearsDiv);

        // Hover tooltip
        item.title = `${store.name}: ${store.startYear}-${store.endYear} (${store.isOpen ? 'Open' : 'Closed'})`;

        timelineContainer.appendChild(item);
    });

    // Add year labels at the top
    const yearLabels = document.createElement('div');
    yearLabels.style.display = 'flex';
    yearLabels.style.justifyContent = 'space-between';
    yearLabels.style.padding = '0 150px 0 150px';
    yearLabels.style.marginBottom = '1rem';
    yearLabels.style.fontSize = '0.75rem';
    yearLabels.style.color = '#64748b';

    for (let year = 2000; year <= 2024; year += 4) {
        const label = document.createElement('span');
        label.textContent = year;
        yearLabels.appendChild(label);
    }

    timelineContainer.insertBefore(yearLabels, timelineContainer.firstChild);
}

// Regression Analysis with Multiple Visualizations
async function initRegressionAnalysis() {
    const resultsContainer = document.getElementById('regression-results');
    if (!resultsContainer) return;

    // Check if already loaded
    if (resultsContainer.querySelector('.regression-content')) {
        return;
    }

    try {
        // Load CSV data
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Failed to load CSV data');
        }

        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false
        });

        // Process data for regression
        const data = parsed.data.filter(row => {
            const status = (row['Status_simplified'] || '').toLowerCase();
            const predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
            return (status === 'new' || status === 'closed') && predictedClass;
        });

        // Create contingency table
        const contingency = {
            'old-school': { 'closed': 0, 'new': 0 },
            'new-school': { 'closed': 0, 'new': 0 }
        };

        data.forEach(row => {
            const status = (row['Status_simplified'] || '').toLowerCase();
            let predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
            const isOldSchool = predictedClass.toLowerCase().includes('old-school');
            const typography = isOldSchool ? 'old-school' : 'new-school';
            
            if (status === 'closed' || status === 'new') {
                contingency[typography][status]++;
            }
        });

        // Calculate statistics
        const oldSchoolClosed = contingency['old-school']['closed'];
        const oldSchoolNew = contingency['old-school']['new'];
        const newSchoolClosed = contingency['new-school']['closed'];
        const newSchoolNew = contingency['new-school']['new'];

        const totalOldSchool = oldSchoolClosed + oldSchoolNew;
        const totalNewSchool = newSchoolClosed + newSchoolNew;
        const totalClosed = oldSchoolClosed + newSchoolClosed;
        const totalNew = oldSchoolNew + newSchoolNew;
        const total = totalOldSchool + totalNewSchool;

        // Calculate proportions
        const oldSchoolClosedPct = totalOldSchool > 0 ? (oldSchoolClosed / totalOldSchool * 100).toFixed(1) : 0;
        const oldSchoolNewPct = totalOldSchool > 0 ? (oldSchoolNew / totalOldSchool * 100).toFixed(1) : 0;
        const newSchoolClosedPct = totalNewSchool > 0 ? (newSchoolClosed / totalNewSchool * 100).toFixed(1) : 0;
        const newSchoolNewPct = totalNewSchool > 0 ? (newSchoolNew / totalNewSchool * 100).toFixed(1) : 0;

        // Calculate odds ratio
        const oddsOldSchoolClosed = oldSchoolNew > 0 ? oldSchoolClosed / oldSchoolNew : 0;
        const oddsNewSchoolClosed = newSchoolNew > 0 ? newSchoolClosed / newSchoolNew : 0;
        const oddsRatio = (oddsOldSchoolClosed > 0 && oddsNewSchoolClosed > 0) 
            ? (oddsOldSchoolClosed / oddsNewSchoolClosed).toFixed(2) 
            : 'N/A';

        // Chi-square test
        const expectedOldSchoolClosed = (totalOldSchool * totalClosed) / total;
        const expectedOldSchoolNew = (totalOldSchool * totalNew) / total;
        const expectedNewSchoolClosed = (totalNewSchool * totalClosed) / total;
        const expectedNewSchoolNew = (totalNewSchool * totalNew) / total;

        const chiSquare = (
            Math.pow(oldSchoolClosed - expectedOldSchoolClosed, 2) / expectedOldSchoolClosed +
            Math.pow(oldSchoolNew - expectedOldSchoolNew, 2) / expectedOldSchoolNew +
            Math.pow(newSchoolClosed - expectedNewSchoolClosed, 2) / expectedNewSchoolClosed +
            Math.pow(newSchoolNew - expectedNewSchoolNew, 2) / expectedNewSchoolNew
        ).toFixed(3);

        // Create results HTML
        resultsContainer.innerHTML = `
            <div class="regression-content">
                <h3>Contingency Table</h3>
                <div class="regression-table-container">
                    <table class="regression-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Closed</th>
                                <th>New</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Old-school</strong></td>
                                <td>${oldSchoolClosed} (${oldSchoolClosedPct}%)</td>
                                <td>${oldSchoolNew} (${oldSchoolNewPct}%)</td>
                                <td>${totalOldSchool}</td>
                            </tr>
                            <tr>
                                <td><strong>New-school</strong></td>
                                <td>${newSchoolClosed} (${newSchoolClosedPct}%)</td>
                                <td>${newSchoolNew} (${newSchoolNewPct}%)</td>
                                <td>${totalNewSchool}</td>
                            </tr>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td>${totalClosed}</td>
                                <td>${totalNew}</td>
                                <td>${total}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Key Findings</h3>
                <div class="regression-stats">
                    <div class="stat-card">
                        <h4>Odds Ratio</h4>
                        <p class="stat-value">${oddsRatio}</p>
                        <p class="stat-explanation">Old-school businesses are ${oddsRatio !== 'N/A' ? oddsRatio + 'x' : 'significantly'} more likely to be closed than new-school businesses.</p>
                    </div>
                    <div class="stat-card">
                        <h4>Chi-Square</h4>
                        <p class="stat-value">${chiSquare}</p>
                        <p class="stat-explanation">Test statistic for independence between status and typography class.</p>
                    </div>
                </div>

                <h3>Visualizations</h3>
                <div class="visualization-grid">
                    <div class="viz-container">
                        <h4>Count Comparison</h4>
                        <canvas id="regressionChart"></canvas>
                    </div>
                    <div class="viz-container">
                        <h4>Proportional Distribution</h4>
                        <canvas id="stackedChart"></canvas>
                    </div>
                    <div class="viz-container">
                        <h4>Heatmap</h4>
                        <canvas id="heatmapChart"></canvas>
                    </div>
                    <div class="viz-container">
                        <h4>Flow Diagram</h4>
                        <div id="flowDiagram"></div>
                    </div>
                </div>
            </div>
        `;

        // Create count comparison chart (bar chart)
        const ctx1 = document.getElementById('regressionChart');
        if (ctx1 && typeof Chart !== 'undefined') {
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Closed', 'New'],
                    datasets: [
                        {
                            label: 'Old-school',
                            data: [oldSchoolClosed, oldSchoolNew],
                            backgroundColor: '#8B6F47',
                            borderColor: '#5A4A2F',
                            borderWidth: 1
                        },
                        {
                            label: 'New-school',
                            data: [newSchoolClosed, newSchoolNew],
                            backgroundColor: '#E91E63',
                            borderColor: '#B71C1C',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: Math.ceil(Math.max(totalClosed, totalNew) / 10)
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
        }

        // Create proportional stacked bar chart
        const ctx2 = document.getElementById('stackedChart');
        if (ctx2 && typeof Chart !== 'undefined') {
            // Calculate percentages within each status category
            const closedOldSchoolPct = totalClosed > 0 ? (oldSchoolClosed / totalClosed * 100).toFixed(1) : 0;
            const closedNewSchoolPct = totalClosed > 0 ? (newSchoolClosed / totalClosed * 100).toFixed(1) : 0;
            const newOldSchoolPct = totalNew > 0 ? (oldSchoolNew / totalNew * 100).toFixed(1) : 0;
            const newNewSchoolPct = totalNew > 0 ? (newSchoolNew / totalNew * 100).toFixed(1) : 0;

            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Closed', 'New'],
                    datasets: [
                        {
                            label: 'Old-school',
                            data: [parseFloat(closedOldSchoolPct), parseFloat(newOldSchoolPct)],
                            backgroundColor: '#8B6F47',
                            borderColor: '#5A4A2F',
                            borderWidth: 1
                        },
                        {
                            label: 'New-school',
                            data: [parseFloat(closedNewSchoolPct), parseFloat(newNewSchoolPct)],
                            backgroundColor: '#E91E63',
                            borderColor: '#B71C1C',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: {
                            stacked: true
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Create heatmap using Chart.js
        const ctx3 = document.getElementById('heatmapChart');
        if (ctx3 && typeof Chart !== 'undefined') {
            // Calculate normalized values for heatmap intensity
            const maxValue = Math.max(oldSchoolClosed, oldSchoolNew, newSchoolClosed, newSchoolNew);
            const normalize = (val) => (val / maxValue) * 100;

            new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: ['Closed', 'New'],
                    datasets: [
                        {
                            label: 'Old-school',
                            data: [normalize(oldSchoolClosed), normalize(oldSchoolNew)],
                            backgroundColor: function(context) {
                                const value = context.parsed.y;
                                const intensity = Math.min(value / 100, 1);
                                return `rgba(139, 111, 71, ${0.3 + intensity * 0.7})`;
                            },
                            borderColor: '#5A4A2F',
                            borderWidth: 2
                        },
                        {
                            label: 'New-school',
                            data: [normalize(newSchoolClosed), normalize(newSchoolNew)],
                            backgroundColor: function(context) {
                                const value = context.parsed.y;
                                const intensity = Math.min(value / 100, 1);
                                return `rgba(233, 30, 99, ${0.3 + intensity * 0.7})`;
                            },
                            borderColor: '#B71C1C',
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return Math.round((value / 100) * maxValue);
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const normalized = context.parsed.y;
                                    const actual = Math.round((normalized / 100) * maxValue);
                                    return context.dataset.label + ': ' + actual + ' businesses';
                                }
                            }
                        }
                    }
                }
            });
        }

        // Create flow diagram (Sankey-like visualization)
        const flowContainer = document.getElementById('flowDiagram');
        if (flowContainer) {
            const totalWidth = 400;
            const totalHeight = 200;
            const nodeWidth = 80;
            const gap = 40;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '200');
            svg.setAttribute('viewBox', '0 0 500 200');
            svg.style.maxWidth = '100%';

            // Calculate proportions for flow widths
            const oldSchoolClosedFlow = (oldSchoolClosed / total) * 100;
            const oldSchoolNewFlow = (oldSchoolNew / total) * 100;
            const newSchoolClosedFlow = (newSchoolClosed / total) * 100;
            const newSchoolNewFlow = (newSchoolNew / total) * 100;

            // Left nodes (Status)
            const leftY1 = 50;
            const leftY2 = 150;
            const leftX = 10;

            // Right nodes (Typography)
            const rightY1 = 50;
            const rightY2 = 150;
            const rightX = 410;

            // Draw flows
            // Closed to Old-school
            const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path1.setAttribute('d', `M ${leftX + nodeWidth} ${leftY1} C ${leftX + nodeWidth + gap} ${leftY1}, ${rightX - gap} ${rightY1}, ${rightX} ${rightY1}`);
            path1.setAttribute('stroke', '#8B6F47');
            path1.setAttribute('stroke-width', Math.max(2, oldSchoolClosedFlow * 2));
            path1.setAttribute('fill', 'none');
            path1.setAttribute('opacity', '0.6');
            svg.appendChild(path1);

            // Closed to New-school
            const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path2.setAttribute('d', `M ${leftX + nodeWidth} ${leftY1} C ${leftX + nodeWidth + gap} ${leftY1 + 20}, ${rightX - gap} ${rightY2 - 20}, ${rightX} ${rightY2}`);
            path2.setAttribute('stroke', '#E91E63');
            path2.setAttribute('stroke-width', Math.max(2, newSchoolClosedFlow * 2));
            path2.setAttribute('fill', 'none');
            path2.setAttribute('opacity', '0.6');
            svg.appendChild(path2);

            // New to Old-school
            const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path3.setAttribute('d', `M ${leftX + nodeWidth} ${leftY2} C ${leftX + nodeWidth + gap} ${leftY2 - 20}, ${rightX - gap} ${rightY1 + 20}, ${rightX} ${rightY1}`);
            path3.setAttribute('stroke', '#8B6F47');
            path3.setAttribute('stroke-width', Math.max(2, oldSchoolNewFlow * 2));
            path3.setAttribute('fill', 'none');
            path3.setAttribute('opacity', '0.6');
            svg.appendChild(path3);

            // New to New-school
            const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path4.setAttribute('d', `M ${leftX + nodeWidth} ${leftY2} C ${leftX + nodeWidth + gap} ${leftY2}, ${rightX - gap} ${rightY2}, ${rightX} ${rightY2}`);
            path4.setAttribute('stroke', '#E91E63');
            path4.setAttribute('stroke-width', Math.max(2, newSchoolNewFlow * 2));
            path4.setAttribute('fill', 'none');
            path4.setAttribute('opacity', '0.6');
            svg.appendChild(path4);

            // Left nodes (Status)
            const leftNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            leftNode1.setAttribute('x', leftX);
            leftNode1.setAttribute('y', leftY1 - 15);
            leftNode1.setAttribute('width', nodeWidth);
            leftNode1.setAttribute('height', 30);
            leftNode1.setAttribute('fill', '#ef4444');
            leftNode1.setAttribute('rx', '4');
            svg.appendChild(leftNode1);

            const leftNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            leftNode2.setAttribute('x', leftX);
            leftNode2.setAttribute('y', leftY2 - 15);
            leftNode2.setAttribute('width', nodeWidth);
            leftNode2.setAttribute('height', 30);
            leftNode2.setAttribute('fill', '#10b981');
            leftNode2.setAttribute('rx', '4');
            svg.appendChild(leftNode2);

            // Right nodes (Typography)
            const rightNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rightNode1.setAttribute('x', rightX);
            rightNode1.setAttribute('y', rightY1 - 15);
            rightNode1.setAttribute('width', nodeWidth);
            rightNode1.setAttribute('height', 30);
            rightNode1.setAttribute('fill', '#8B6F47');
            rightNode1.setAttribute('rx', '4');
            svg.appendChild(rightNode1);

            const rightNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rightNode2.setAttribute('x', rightX);
            rightNode2.setAttribute('y', rightY2 - 15);
            rightNode2.setAttribute('width', nodeWidth);
            rightNode2.setAttribute('height', 30);
            rightNode2.setAttribute('fill', '#E91E63');
            rightNode2.setAttribute('rx', '4');
            svg.appendChild(rightNode2);

            // Labels
            const leftLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            leftLabel1.setAttribute('x', leftX + nodeWidth / 2);
            leftLabel1.setAttribute('y', leftY1);
            leftLabel1.setAttribute('text-anchor', 'middle');
            leftLabel1.setAttribute('fill', 'white');
            leftLabel1.setAttribute('font-size', '12');
            leftLabel1.setAttribute('font-weight', 'bold');
            leftLabel1.textContent = 'Closed';
            svg.appendChild(leftLabel1);

            const leftLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            leftLabel2.setAttribute('x', leftX + nodeWidth / 2);
            leftLabel2.setAttribute('y', leftY2);
            leftLabel2.setAttribute('text-anchor', 'middle');
            leftLabel2.setAttribute('fill', 'white');
            leftLabel2.setAttribute('font-size', '12');
            leftLabel2.setAttribute('font-weight', 'bold');
            leftLabel2.textContent = 'New';
            svg.appendChild(leftLabel2);

            const rightLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            rightLabel1.setAttribute('x', rightX + nodeWidth / 2);
            rightLabel1.setAttribute('y', rightY1);
            rightLabel1.setAttribute('text-anchor', 'middle');
            rightLabel1.setAttribute('fill', 'white');
            rightLabel1.setAttribute('font-size', '12');
            rightLabel1.setAttribute('font-weight', 'bold');
            rightLabel1.textContent = 'Old-school';
            svg.appendChild(rightLabel1);

            const rightLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            rightLabel2.setAttribute('x', rightX + nodeWidth / 2);
            rightLabel2.setAttribute('y', rightY2);
            rightLabel2.setAttribute('text-anchor', 'middle');
            rightLabel2.setAttribute('fill', 'white');
            rightLabel2.setAttribute('font-size', '12');
            rightLabel2.setAttribute('font-weight', 'bold');
            rightLabel2.textContent = 'New-school';
            svg.appendChild(rightLabel2);

            flowContainer.appendChild(svg);
        }
    } catch (error) {
        console.error('Error performing regression analysis:', error);
        resultsContainer.innerHTML = `
            <div class="regression-error">
                <p>Error loading regression analysis: ${error.message}</p>
            </div>
        `;
    }
}


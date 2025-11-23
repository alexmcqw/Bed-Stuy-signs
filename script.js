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


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
                // Small delay to ensure tab panel is visible before initializing map
                setTimeout(() => {
                    initMap();
                }, 100);
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
    
    // Initialize map if map tab is active by default
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'map') {
        setTimeout(() => {
            initMap();
        }, 300);
    }
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

// Map Visualization with Leaflet
let map = null;
let markers = null;

function initMap() {
    const mapContainer = document.getElementById('map-visualization');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        mapContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Error: Leaflet map library failed to load. Please refresh the page.</p>';
        return;
    }

    // Initialize map if not already done
    if (!map) {
        // Clear any existing content (remove dummy SVG if present)
        mapContainer.innerHTML = '';
        
        try {
            // Center on Bedford-Stuyvesant, Brooklyn
            map = L.map('map-visualization').setView([40.686, -73.944], 13);
        } catch (error) {
            console.error('Error creating map:', error);
            return;
        }
    }

    // Always ensure CartoDB tiles are used (remove old tiles if present)
    try {
        // Remove any existing tile layers
        map.eachLayer(function(layer) {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });

        // Add CartoDB Positron tiles (light grey, matches signmap style)
        const cartoTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a> contributors',
            maxZoom: 19,
            subdomains: 'abcd'
        });
        cartoTiles.addTo(map);
        console.log('CartoDB Positron tiles added to map');

        // Create marker layer group if it doesn't exist
        if (!markers) {
            markers = L.layerGroup().addTo(map);
        }
        
        console.log('Leaflet map initialized successfully');
        
        // Invalidate size to ensure proper rendering
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 200);
    } catch (error) {
        console.error('Error setting up map tiles:', error);
        if (mapContainer) {
            mapContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Error loading map tiles. Please check the console for details.</p>';
        }
        return;
    }

    if (map) {
        // If map already exists, just invalidate size and reload data
        setTimeout(() => {
            if (map) {
                map.invalidateSize();
            }
        }, 100);
    }

    // Load CSV data
    loadCSVData();
}

async function loadCSVData() {
    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Failed to load CSV data');
        }

        const csvText = await response.text();
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false  // Keep as strings to preserve values
        });

        if (parsed.errors.length > 0) {
            console.warn('CSV parsing errors:', parsed.errors);
        }

        // Debug: Check first few rows with photos
        console.log('CSV parsed. Total rows:', parsed.data.length);
        if (parsed.data.length > 0) {
            const sampleRow = parsed.data.find(r => r['Photo_URL'] && r['Photo_URL'].trim());
            if (sampleRow) {
                console.log('Sample row keys with "Predicted":', Object.keys(sampleRow).filter(k => k.includes('Predicted')));
                console.log('Sample row Predicted Class value:', sampleRow['Predicted Class']);
            }
        }

        createMarkers(parsed.data);
    } catch (error) {
        console.error('Error loading CSV:', error);
        const mapContainer = document.getElementById('map-visualization');
        if (mapContainer) {
            mapContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Error loading map data. Please ensure data.csv is available.</p>';
        }
    }
}

function createMarkers(rows) {
    if (!markers) return;

    // Clear existing markers
    markers.clearLayers();

    let oldSchoolCount = 0;
    let newSchoolCount = 0;
    let totalCount = 0;

    rows.forEach(row => {
        try {
            // Get coordinates
            const lat = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lat']);
            const lng = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lon']);

            // Skip if coordinates are invalid
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                return;
            }

            // Get photo URL and skip if no image
            const photoUrl = row['Photo_URL'] || '';
            if (!photoUrl || photoUrl.trim() === '') {
                return; // Skip markers without images
            }

            // Get prediction data
            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            
            // Convert to string and trim
            predictedClass = String(predictedClass || '').trim();
            
            // Remove leading numeral (0 or 1) and space from Predicted Class
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');  // Match one or more spaces after 0/1
            }
            
            const status = row['Status_simplified'] || '';
            const name = row['LiveXYZSeptember132025_XYTableToPoint_name'] || row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] || 'Unknown';
            const address = row['LiveXYZSeptember132025_XYTableToPoint_address'] || '';
            const postcode = row['LiveXYZSeptember132025_XYTableToPoint_postcode'] || '';
            const category = row['LiveXYZSeptember132025_XYTableToPoint_subcategoriesPrimary_name'] || 
                            row['LiveXYZSeptember132025_XYTableToPoint_categoriesPrimary_name'] || '';

            // Determine if Old-school or New-school
            const isOldSchool = predictedClass.includes('Old-school');

            // Create custom icon based on typography class
            const iconColor = isOldSchool ? '#8B6F47' : '#E91E63'; // Brown for old-school, pink for new-school
            
            // Determine border color based on status
            let borderColor = 'white'; // Default
            if (status && status.toLowerCase() === 'closed') {
                // Remove white border for closed (use same color as background)
                borderColor = iconColor;
            } else if (status && status.toLowerCase() === 'new') {
                // Use darker version of pin color for new status
                borderColor = isOldSchool ? '#5A4A2F' : '#B71C1C'; // Darker brown or darker pink
            }
            
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${iconColor}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid ${borderColor}; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            });

            // Create marker
            const marker = L.marker([lat, lng], { icon: icon });

            // Create popup content
            let popupContent = '<div class="popup-content">';
            popupContent += `<h3>${name}</h3>`;
            
            // Add storefront image thumbnail
            if (photoUrl) {
                popupContent += `<div class="popup-image-container"><img src="${photoUrl}" alt="${name}" class="popup-thumbnail" onerror="this.style.display='none'"></div>`;
            }
            
            if (address) {
                popupContent += `<p class="address"><strong>Address:</strong> ${address}`;
                if (postcode) {
                    popupContent += `, ${postcode}`;
                }
                popupContent += '</p>';
            }

            if (category) {
                popupContent += `<p><strong>Category:</strong> ${category}</p>`;
            }

            if (status) {
                popupContent += `<p><strong>Status:</strong> ${status}</p>`;
            }

            popupContent += `<p><strong>Predicted Class:</strong> ${predictedClass || 'N/A'}</p>`;

            popupContent += '</div>';

            // Bind popup with auto-positioning options
            const popup = L.popup({
                autoPan: true,
                autoPanPadding: [50, 50],
                autoPanPaddingTopLeft: [50, 50],
                autoPanPaddingBottomRight: [50, 50],
                closeOnClick: false,
                autoClose: true,  // Only allow one popup at a time
                maxWidth: 300
            }).setContent(popupContent);

            marker.bindPopup(popup);

            // Add event listener to adjust popup position based on viewport
            marker.on('popupopen', function() {
                setTimeout(() => {
                    const openPopup = marker.getPopup();
                    if (openPopup && openPopup.isOpen()) {
                        const popupElement = openPopup.getElement();
                        if (!popupElement) return;
                        
                        const markerLatLng = marker.getLatLng();
                        const mapPixelPoint = map.latLngToContainerPoint(markerLatLng);
                        const mapSize = map.getSize();
                        
                        // Get actual popup dimensions
                        const popupRect = popupElement.getBoundingClientRect();
                        const mapRect = map.getContainer().getBoundingClientRect();
                        const popupWidth = popupRect.width;
                        const popupHeight = popupRect.height;
                        
                        // Calculate available space in each direction
                        const spaceAbove = mapPixelPoint.y;
                        const spaceBelow = mapSize.y - mapPixelPoint.y;
                        const spaceLeft = mapPixelPoint.x;
                        const spaceRight = mapSize.x - mapPixelPoint.x;
                        
                        // Determine best popup direction
                        let direction = 'top'; // Default
                        if (spaceAbove < popupHeight + 20 && spaceBelow > popupHeight + 20) {
                            direction = 'bottom';
                        } else if (spaceAbove < popupHeight + 20 && spaceBelow < popupHeight + 20) {
                            // Not enough space above or below, try sides
                            if (spaceRight > popupWidth + 20) {
                                direction = 'right';
                            } else if (spaceLeft > popupWidth + 20) {
                                direction = 'left';
                            } else if (spaceBelow > spaceAbove) {
                                direction = 'bottom';
                            }
                        }
                        
                        // Update popup direction by manipulating classes
                        const wrapper = popupElement.querySelector('.leaflet-popup-content-wrapper');
                        const tip = popupElement.querySelector('.leaflet-popup-tip');
                        
                        if (wrapper && tip) {
                            // Remove all direction classes
                            ['top', 'bottom', 'left', 'right'].forEach(dir => {
                                wrapper.classList.remove(`leaflet-popup-${dir}`);
                                tip.classList.remove(`leaflet-popup-tip-${dir}`);
                            });
                            
                            // Add new direction classes
                            wrapper.classList.add(`leaflet-popup-${direction}`);
                            tip.classList.add(`leaflet-popup-tip-${direction}`);
                            
                            // Force update popup position
                            openPopup.update();
                        }
                    }
                }, 50);
            });

            markers.addLayer(marker);

            // Update counts
            totalCount++;
            if (isOldSchool) {
                oldSchoolCount++;
            } else {
                newSchoolCount++;
            }
        } catch (error) {
            console.error('Error creating marker for row:', row, error);
        }
    });

    // Update stats
    document.getElementById('total-markers').textContent = totalCount;
    document.getElementById('old-school-count').textContent = oldSchoolCount;
    document.getElementById('new-school-count').textContent = newSchoolCount;
    document.getElementById('traditional-count').textContent = oldSchoolCount;
    document.getElementById('modern-count').textContent = newSchoolCount;

    // Fit map to markers if we have any
    if (totalCount > 0 && markers.getLayers().length > 0) {
        const group = new L.featureGroup(markers.getLayers());
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Timeline Visualization
async function initTimeline() {
    const timelineContainer = document.getElementById('timeline-visualization');
    if (!timelineContainer || timelineContainer.dataset.initialized === 'true') return;

    timelineContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">Loading timeline data...</div>';
    timelineContainer.dataset.initialized = 'true';

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

        // Helper function to parse date (handles both ISO format and MM/DD/YYYY)
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr.trim() === '') return null;
            try {
                // Try ISO format first
                let date = new Date(dateStr);
                if (!isNaN(date.getTime())) return date;
                
                // Try MM/DD/YYYY format
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                    date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                    if (!isNaN(date.getTime())) return date;
                }
                return null;
            } catch {
                return null;
            }
        };

        // Get all storefronts with their data
        const businesses = [];
        const now = new Date();
        
        // Determine date range for timeline (find min and max dates)
        let minDate = null;
        let maxDate = now;

        parsed.data.forEach(row => {
            const isStorefront = row['LiveXYZSeptember132025_XYTableToPoint_isStorefront'];
            if (isStorefront !== 'true' && isStorefront !== 'TRUE') return;

            // Get predicted class (old-school vs new-school)
            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            predictedClass = String(predictedClass || '').trim();
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');
            }
            const isOldSchool = predictedClass.toLowerCase().includes('old-school');
            
            // Skip if no predicted class
            if (!predictedClass) return;
            
            const placeStatus = row['LiveXYZSeptember132025_XYTableToPoint_placeStatus'] || row['Status_simplified'] || '';
            const isClosed = placeStatus.toLowerCase() === 'closed' || 
                           placeStatus.toLowerCase() === 'permanently closed' || 
                           placeStatus.toLowerCase() === 'temporarily closed';
            
            // Get start date (placeCreationDate_short or undefined)
            const startDateStr = row['placeCreationDate_short'] || 
                                row['LiveXYZSeptember132025_XYTableToPoint_placeCreationDate'] ||
                                row['placeCreationDate'];
            const startDate = parseDate(startDateStr);
            
            // Get end date (validityTime_end for closed, undefined for new/operating)
            let endDate = null;
            if (isClosed) {
                const endDateStr = row['LiveXYZSeptember132025_XYTableToPoint_validityTime_end'];
                endDate = parseDate(endDateStr);
            }

            if (!startDate && !endDate) return; // Skip if no dates at all

            const name = row['LiveXYZSeptember132025_XYTableToPoint_name'] || 
                        row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] || 
                        'Unknown';

            // Determine actual dates
            const actualStartDate = startDate || new Date(0);
            const actualEndDate = endDate || now;

            // Event date: end date for closed businesses, start date for new/operating businesses
            const eventDate = isClosed ? (endDate || actualEndDate) : (startDate || actualStartDate);

            // Update min/max for timeline range
            if (startDate && (!minDate || startDate < minDate)) {
                minDate = startDate;
            }
            if (endDate && endDate > maxDate) {
                maxDate = endDate;
            }

            businesses.push({
                name: name,
                isOldSchool: isOldSchool,
                startDate: actualStartDate,
                endDate: actualEndDate,
                startYear: actualStartDate.getFullYear(),
                endYear: actualEndDate.getFullYear(),
                isOpen: !endDate,
                eventDate: eventDate,
                isClosed: isClosed
            });
        });

        if (businesses.length === 0) {
            timelineContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No storefront timeline data available</div>';
            return;
        }

        // Set timeline range (use minDate or default to 2000)
        const timelineStartYear = minDate ? minDate.getFullYear() : 2000;
        const timelineEndYear = maxDate.getFullYear();
        const timelineYears = timelineEndYear - timelineStartYear;

        // Sort businesses by event date (end date for closed, start date for new)
        businesses.sort((a, b) => {
            // Compare event dates
            const dateA = a.eventDate.getTime();
            const dateB = b.eventDate.getTime();
            return dateA - dateB;
        });

        // Wait for Observable Plot to be available
        const waitForPlot = () => {
            if (window.Plot) {
                createObservablePlotTimeline();
            } else {
                setTimeout(waitForPlot, 100);
            }
        };

        const createObservablePlotTimeline = () => {
            // Clear container
            timelineContainer.innerHTML = '';

            // Prepare data for Observable Plot
            // Create a unique index for each business to use as y-axis
            const plotData = businesses.map((business, index) => ({
                name: business.name,
                y: businesses.length - index - 1, // Reverse order so first business is at top
                x1: business.startDate,
                x2: business.endDate,
                fill: business.isOldSchool ? '#8B6F47' : '#E91E63',
                isOldSchool: business.isOldSchool,
                isClosed: business.isClosed,
                startYear: business.startYear,
                endYear: business.endYear
            }));

            // Create the plot
            const plot = window.Plot.plot({
                marginLeft: 200, // Space for business names
                marginTop: 60, // Space for year labels
                height: Math.max(400, businesses.length * 20), // Dynamic height based on number of businesses
                x: {
                    type: "time",
                    domain: [minDate || new Date(timelineStartYear, 0, 1), maxDate],
                    grid: true,
                    label: null,
                    ticks: timelineEndYear - timelineStartYear,
                    tickFormat: (d) => {
                        const year = new Date(d).getFullYear();
                        return year % Math.max(1, Math.floor((timelineEndYear - timelineStartYear) / 6)) === 0 ? year : '';
                    }
                },
                y: {
                    domain: plotData.map(d => d.y),
                    label: null,
                    tickFormat: () => '' // Hide y-axis ticks
                },
                marks: [
                    // Horizontal bars for each business - make them thinner and more transparent
                    window.Plot.rectY(plotData, {
                        x1: "x1",
                        x2: "x2",
                        y: "y",
                        fill: (d) => window.Plot.opacity(d.fill, 0.3), // Make bars semi-transparent
                        stroke: "fill",
                        strokeWidth: 1.5,
                        title: (d) => `${d.name}: ${d.startYear}-${d.endYear} (${d.isClosed ? 'Closed' : 'Open'}) - ${d.isOldSchool ? 'Old-school' : 'New-school'}`,
                        height: 8 // Make bars thinner
                    }),
                    // Business names on the left
                    window.Plot.text(plotData, {
                        x: minDate || new Date(timelineStartYear, 0, 1),
                        y: "y",
                        text: "name",
                        dx: -10,
                        textAnchor: "end",
                        fontSize: 11,
                        fill: "#475569"
                    }),
                    // Start dots for new businesses only - make them more prominent
                    window.Plot.dot(plotData.filter(d => !d.isClosed), {
                        x: "x1",
                        y: "y",
                        fill: "fill",
                        stroke: "#fff",
                        strokeWidth: 1.5,
                        r: 5
                    }),
                    // End dots for closed businesses only - make them more prominent
                    window.Plot.dot(plotData.filter(d => d.isClosed), {
                        x: "x2",
                        y: "y",
                        fill: "fill",
                        stroke: "#fff",
                        strokeWidth: 1.5,
                        r: 5
                    })
                ]
            });

            timelineContainer.appendChild(plot);
        };

        waitForPlot();
    } catch (error) {
        console.error('Error loading timeline data:', error);
        timelineContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: #ef4444;">Error loading timeline data: ${error.message}</div>`;
    }
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


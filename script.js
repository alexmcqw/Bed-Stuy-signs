// Annotation Helper Function
// side: 'left' or 'right' - which side of the image the label should be on
// targetX, targetY: position in the image where the arrow should point (percentages)
// labelY: vertical position of the label (percentage)
// showArrow: optional boolean to show/hide the arrow (default: true)
function addAnnotation(containerId, label, side, targetX, targetY, labelY, showArrow = true) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Only create SVG defs if arrows are needed
    if (showArrow) {
        // Ensure shared SVG defs exists in container (create once per container)
        let sharedSvg = container.querySelector('svg.annotation-defs');
        if (!sharedSvg) {
            sharedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            sharedSvg.className = 'annotation-defs';
            sharedSvg.style.position = 'absolute';
            sharedSvg.style.top = '0';
            sharedSvg.style.left = '0';
            sharedSvg.style.width = '100%';
            sharedSvg.style.height = '100%';
            sharedSvg.style.pointerEvents = 'none';
            sharedSvg.style.zIndex = '1';
            
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            const markerId = `arrowhead-${containerId}`;
            marker.setAttribute('id', markerId);
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '10');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '3');
            marker.setAttribute('orient', 'auto');
            const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            polygon.setAttribute('points', '0 0, 10 3, 0 6');
            polygon.setAttribute('fill', '#1e293b');
            marker.appendChild(polygon);
            defs.appendChild(marker);
            sharedSvg.appendChild(defs);
            container.appendChild(sharedSvg);
        }
    }

    const annotation = document.createElement('div');
    annotation.className = 'annotation';
    annotation.classList.add(`annotation-${side}`);
    
    // Position label on the side
    if (side === 'left') {
        annotation.style.left = '-15%'; // Position to the left of the image
        annotation.style.textAlign = 'right';
    } else {
        annotation.style.left = '115%'; // Position to the right of the image
        annotation.style.textAlign = 'left';
    }
    annotation.style.top = `${labelY}%`;
    annotation.style.transform = 'translateY(-50%)'; // Center vertically on labelY
    
    // Create label
    const labelEl = document.createElement('div');
    labelEl.className = 'annotation-label';
    labelEl.textContent = label;
    annotation.appendChild(labelEl);
    
    // Create arrow SVG only if showArrow is true
    if (showArrow) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '2';
        
        const markerId = `arrowhead-${containerId}`;
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        // Arrow starts from label position and points to target in image
        let arrowStartX, arrowStartY;
        if (side === 'left') {
            arrowStartX = 0; // Start at left edge of image
        } else {
            arrowStartX = 100; // Start at right edge of image
        }
        arrowStartY = labelY; // Same vertical position as label
        
        arrow.setAttribute('x1', `${arrowStartX}%`);
        arrow.setAttribute('y1', `${arrowStartY}%`);
        arrow.setAttribute('x2', `${targetX}%`);
        arrow.setAttribute('y2', `${targetY}%`);
        arrow.setAttribute('stroke', '#1e293b');
        arrow.setAttribute('stroke-width', '2');
        arrow.setAttribute('marker-end', `url(#${markerId})`);
        
        svg.appendChild(arrow);
        annotation.appendChild(svg);
    }
    
    container.appendChild(annotation);
}

// Initialize annotations when page loads
// Updated: 2024-12-07
function initAnnotations() {
    // Format: addAnnotation(containerId, label, side, targetX%, targetY%, labelY%, showArrow)
    // After creating annotations, update their horizontal positions if needed

    // Annotations for first image (storefront2.jpg) - no arrows
    addAnnotation('annotations1', 'Large, clear signage', 'left', 50, 15, 23, false);
    document.querySelectorAll('#annotations1 .annotation')[0].style.left = '70%';
    addAnnotation('annotations1', 'Vinyl & plastic materiality', 'right', 45, 10, 72, false);
    document.querySelectorAll('#annotations1 .annotation')[1].style.left = '61%';
    addAnnotation('annotations1', 'Colorful imagery', 'left', 48, 54, 42, false);
    document.querySelectorAll('#annotations1 .annotation')[2].style.left = '6%';
    addAnnotation('annotations1', 'Wordy list of offerings', 'left', 50, 50, 53, false);
    document.querySelectorAll('#annotations1 .annotation')[3].style.left = '32%';

    // Annotations for second image (storefront1.jpeg) - no arrows
    addAnnotation('annotations2', 'Minimal text', 'right', 45, 30, 57, false);
    document.querySelectorAll('#annotations2 .annotation')[0].style.left = '76%';
    addAnnotation('annotations2', 'Restrained use of color', 'left', 50, 55, 25, false);
    document.querySelectorAll('#annotations2 .annotation')[1].style.left = '7%';
    addAnnotation('annotations2', 'Glassy materiality', 'right', 20, 80, 37, false);
    document.querySelectorAll('#annotations2 .annotation')[2].style.left = '60%';
    addAnnotation('annotations2', 'Vague naming/offerings', 'left', 20, 65, 58, false);
    document.querySelectorAll('#annotations2 .annotation')[3].style.left = '15%';
}

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
                initStackedAreaChart();
                initTimeline();
            } else if (targetTab === 'background') {
                initRegressionAnalysis();
                initSankeyDiagram();
            } else if (targetTab === 'comparison') {
                initComparisonVisualization();
            }
        });
    });

    // Initialize charts
    initRevenueChart();
    
    // Initialize annotations
    initAnnotations();
    
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

        // Get headers for column AE lookup
        const headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
        createMarkers(parsed.data, headers);
    } catch (error) {
        console.error('Error loading CSV:', error);
        const mapContainer = document.getElementById('map-visualization');
        if (mapContainer) {
            mapContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Error loading map data. Please ensure data.csv is available.</p>';
        }
    }
}

function createMarkers(rows, headers) {
    if (!markers) return;

    // Clear existing markers
    markers.clearLayers();

    let oldSchoolCount = 0;
    let newSchoolCount = 0;
    let totalCount = 0;

    // Get column AE (index 30) - image link column
    const columnAE = headers && headers[30] ? headers[30] : null;

    // First, group rows by coordinates
    const coordinateGroups = new Map();

    rows.forEach(row => {
        try {
            // Get coordinates
            const lat = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lat']);
            const lng = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lon']);

            // Skip if coordinates are invalid
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
                return;
            }

            // Get photo URL from column AE, fallback to Photo_URL
            const photoUrl = (columnAE && row[columnAE]) ? row[columnAE] : (row['Photo_URL'] || '');
            if (!photoUrl || photoUrl.trim() === '') {
                return; // Skip markers without images
            }

            // Create a key from the coordinates (rounded to 6 decimal places)
            const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            
            if (!coordinateGroups.has(coordKey)) {
                coordinateGroups.set(coordKey, {
                    lat: lat,
                    lng: lng,
                    rows: []
                });
            }
            coordinateGroups.get(coordKey).rows.push(row);
        } catch (error) {
            console.error('Error processing row:', row, error);
        }
    });

    // Now create markers for each coordinate group
    coordinateGroups.forEach((group, coordKey) => {
        try {
            const { lat, lng, rows: rowsAtLocation } = group;
            const locationCount = rowsAtLocation.length;
            
            // Calculate marker size based on count
            // Base size: 10px, add 2px for each additional row (max 20px)
            const baseSize = 10;
            const sizeIncrement = 2;
            const maxSize = 20;
            const markerSize = Math.min(baseSize + (locationCount - 1) * sizeIncrement, maxSize);
            const iconAnchor = markerSize / 2;

            // Process all rows at this location to determine marker appearance
            let oldSchoolCountAtLocation = 0;
            let newSchoolCountAtLocation = 0;
            const businesses = [];

            rowsAtLocation.forEach(row => {
                // Get prediction data
                let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
                
                // Convert to string and trim
                predictedClass = String(predictedClass || '').trim();
                
                // Remove leading numeral (0 or 1) and space from Predicted Class
                if (predictedClass) {
                    predictedClass = predictedClass.replace(/^[01]\s+/, '');
                }
                
                const status = row['Status_simplified'] || '';
                const name = row['LiveXYZSeptember132025_XYTableToPoint_name'] || row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] || 'Unknown';
                const address = row['LiveXYZSeptember132025_XYTableToPoint_address'] || '';
                const postcode = row['LiveXYZSeptember132025_XYTableToPoint_postcode'] || '';
                const category = row['LiveXYZSeptember132025_XYTableToPoint_subcategoriesPrimary_name'] || 
                                row['LiveXYZSeptember132025_XYTableToPoint_categoriesPrimary_name'] || '';
                const photoUrl = row['Photo_URL'] || '';
                const placeCreationDate = row['placeCreationDate_short'] || row['placeCreationDate'] || '';

                // Determine if Old-school or New-school
                const isOldSchool = predictedClass.includes('Old-school');
                if (isOldSchool) {
                    oldSchoolCountAtLocation++;
                } else {
                    newSchoolCountAtLocation++;
                }

                businesses.push({
                    name,
                    address,
                    postcode,
                    category,
                    status,
                    predictedClass,
                    photoUrl,
                    isOldSchool,
                    placeCreationDate
                });
            });

            // Sort businesses by placeCreationDate (oldest to newest, left to right)
            businesses.sort((a, b) => {
                const dateA = a.placeCreationDate ? new Date(a.placeCreationDate) : new Date(0);
                const dateB = b.placeCreationDate ? new Date(b.placeCreationDate) : new Date(0);
                return dateA - dateB; // Ascending order (oldest first)
            });

            // Calculate proportions for pie chart
            const totalCountAtLocation = oldSchoolCountAtLocation + newSchoolCountAtLocation;
            const oldSchoolProportion = oldSchoolCountAtLocation / totalCountAtLocation;
            const newSchoolProportion = newSchoolCountAtLocation / totalCountAtLocation;
            
            // Colors
            const oldSchoolColor = '#8B6F47'; // Brown
            const newSchoolColor = '#E91E63'; // Pink
            const center = markerSize / 2;
            
            // No borders on any markers
            const borderWidth = 0;
            
            // Calculate radius: no border, just small margin
            const radius = (markerSize - 2) / 2;
            
            // Create SVG pie chart
            let svgPaths = '';
            
            if (oldSchoolCountAtLocation === 0) {
                // All new-school
                svgPaths = `<circle cx="${center}" cy="${center}" r="${radius}" fill="${newSchoolColor}"/>`;
            } else if (newSchoolCountAtLocation === 0) {
                // All old-school
                svgPaths = `<circle cx="${center}" cy="${center}" r="${radius}" fill="${oldSchoolColor}"/>`;
            } else {
                // Mixed: create pie slices
                // Start from top (270 degrees in SVG, but we'll use 0 degrees = right, then go clockwise)
                // SVG angles: 0 = right, 90 = bottom, 180 = left, 270 = top
                // We'll start from top (-90 degrees in standard math, which is 270 in SVG)
                const startAngle = -90; // Start from top
                const oldSchoolAngle = oldSchoolProportion * 360;
                const newSchoolAngle = newSchoolProportion * 360;
                
                // Convert to radians for calculations
                const toRad = (deg) => (deg * Math.PI) / 180;
                
                // Old-school slice (starts from top, goes clockwise)
                const oldSchoolStartAngle = startAngle;
                const oldSchoolEndAngle = startAngle + oldSchoolAngle;
                
                const oldSchoolStartX = center + radius * Math.cos(toRad(oldSchoolStartAngle));
                const oldSchoolStartY = center + radius * Math.sin(toRad(oldSchoolStartAngle));
                const oldSchoolEndX = center + radius * Math.cos(toRad(oldSchoolEndAngle));
                const oldSchoolEndY = center + radius * Math.sin(toRad(oldSchoolEndAngle));
                
                // Large arc flag: 1 if angle > 180, 0 otherwise
                const oldSchoolLargeArc = oldSchoolAngle > 180 ? 1 : 0;
                
                svgPaths += `<path d="M ${center} ${center} L ${oldSchoolStartX} ${oldSchoolStartY} A ${radius} ${radius} 0 ${oldSchoolLargeArc} 1 ${oldSchoolEndX} ${oldSchoolEndY} Z" fill="${oldSchoolColor}"/>`;
                
                // New-school slice (continues from old-school end)
                const newSchoolStartAngle = oldSchoolEndAngle;
                const newSchoolEndAngle = startAngle + 360; // Full circle back to start
                
                const newSchoolStartX = center + radius * Math.cos(toRad(newSchoolStartAngle));
                const newSchoolStartY = center + radius * Math.sin(toRad(newSchoolStartAngle));
                const newSchoolEndX = center + radius * Math.cos(toRad(newSchoolEndAngle));
                const newSchoolEndY = center + radius * Math.sin(toRad(newSchoolEndAngle));
                
                const newSchoolLargeArc = newSchoolAngle > 180 ? 1 : 0;
                
                svgPaths += `<path d="M ${center} ${center} L ${newSchoolStartX} ${newSchoolStartY} A ${radius} ${radius} 0 ${newSchoolLargeArc} 1 ${newSchoolEndX} ${newSchoolEndY} Z" fill="${newSchoolColor}"/>`;
            }
            
            // Only add border circle if borderWidth > 0
            const borderCircle = borderWidth > 0 
                ? `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>`
                : '';
            
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<svg width="${markerSize}" height="${markerSize}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                    ${svgPaths}
                    ${borderCircle}
                </svg>`,
                iconSize: [markerSize, markerSize],
                iconAnchor: [iconAnchor, iconAnchor]
            });

            // Create marker
            const marker = L.marker([lat, lng], { icon: icon });

            // Create popup content showing all businesses at this location
            let popupContent = '<div class="popup-content">';
            
            if (locationCount > 1) {
                popupContent += `<h3>${locationCount} Businesses at This Location</h3>`;
            } else {
                popupContent += `<h3>${businesses[0].name}</h3>`;
            }
            
            // Show address from first business (they should all be the same)
            if (businesses[0].address) {
                popupContent += `<p class="address"><strong>Address:</strong> ${businesses[0].address}`;
                if (businesses[0].postcode) {
                    popupContent += `, ${businesses[0].postcode}`;
                }
                popupContent += '</p>';
            }

            // List all businesses
            if (locationCount > 1) {
                // Horizontal layout for multiple businesses
                popupContent += '<div class="popup-businesses-horizontal">';
                businesses.forEach((business, idx) => {
                    popupContent += `<div class="popup-business-item" style="margin-left: ${idx > 0 ? '10px' : '0'}; padding-left: ${idx > 0 ? '10px' : '0'}; border-left: ${idx > 0 ? '1px solid #e2e8f0' : 'none'};">
                        <h4 style="margin: 0 0 8px 0; font-size: 0.9rem;">${business.name}</h4>`;
                    
                    // Add storefront image thumbnail
                    if (business.photoUrl) {
                        popupContent += `<div class="popup-image-container"><img src="${business.photoUrl}" alt="${business.name}" class="popup-thumbnail" onerror="this.style.display='none'"></div>`;
                    }

                    if (business.category) {
                        popupContent += `<p style="font-size: 0.85rem; margin: 4px 0;"><strong>Category:</strong> ${business.category}</p>`;
                    }

                    if (business.status) {
                        popupContent += `<p style="font-size: 0.85rem; margin: 4px 0;"><strong>Status:</strong> ${business.status}</p>`;
                    }

                    popupContent += `<p style="font-size: 0.85rem; margin: 4px 0;"><strong>Predicted Class:</strong> ${business.predictedClass || 'N/A'}</p>`;
                    
                    popupContent += '</div>';
                });
                popupContent += '</div>';
            } else {
                // Single business - vertical layout
                const business = businesses[0];
                
                // Add storefront image thumbnail
                if (business.photoUrl) {
                    popupContent += `<div class="popup-image-container"><img src="${business.photoUrl}" alt="${business.name}" class="popup-thumbnail" onerror="this.style.display='none'"></div>`;
                }

                if (business.category) {
                    popupContent += `<p><strong>Category:</strong> ${business.category}</p>`;
                }

                if (business.status) {
                    popupContent += `<p><strong>Status:</strong> ${business.status}</p>`;
                }

                popupContent += `<p><strong>Predicted Class:</strong> ${business.predictedClass || 'N/A'}</p>`;
            }

            popupContent += '</div>';

            // Bind popup with auto-positioning options
            // Use larger maxWidth for multiple businesses to accommodate horizontal layout
            const popupMaxWidth = locationCount > 1 ? 600 : 300;
            const popup = L.popup({
                autoPan: true,
                autoPanPadding: [50, 50],
                autoPanPaddingTopLeft: [50, 50],
                autoPanPaddingBottomRight: [50, 50],
                closeOnClick: false,
                autoClose: true,  // Only allow one popup at a time
                maxWidth: popupMaxWidth
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

            // Update counts (count all businesses, not just markers)
            totalCount += locationCount;
            oldSchoolCount += oldSchoolCountAtLocation;
            newSchoolCount += newSchoolCountAtLocation;
        } catch (error) {
            console.error('Error creating marker for location:', coordKey, error);
        }
    });

    // Update stats
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
            const statusLower = placeStatus.toLowerCase();
            const isClosed = statusLower === 'closed' || 
                           statusLower === 'permanently closed' || 
                           statusLower === 'temporarily closed';
            const isPermanentlyClosed = statusLower === 'permanently closed';
            const isOperating = statusLower === 'operating';
            
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

            // Get photo URL (column AE)
            const headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
            const columnAE = headers[30]; // Column AE is the 31st column (0-indexed: 30)
            const photoUrl = row[columnAE] || row['Photo_URL'] || '';

            // Skip if no image link
            if (!photoUrl || photoUrl.trim() === '') {
                return;
            }

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
                isClosed: isClosed,
                isPermanentlyClosed: isPermanentlyClosed,
                isOperating: isOperating,
                placeStatus: placeStatus,
                photoUrl: photoUrl
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
            const timelineStart = minDate || new Date(timelineStartYear, 0, 1);
            const timelineEnd = maxDate;
            
            // Create a unique index for each business to use as y-axis
            const plotData = businesses.map((business, index) => {
                // Convert hex to rgba with transparency
                const baseColor = business.isOldSchool ? '#8B6F47' : '#E91E63';
                const r = parseInt(baseColor.slice(1, 3), 16);
                const g = parseInt(baseColor.slice(3, 5), 16);
                const b = parseInt(baseColor.slice(5, 7), 16);
                const fillTransparent = `rgba(${r}, ${g}, ${b}, 0.3)`;
                
                // Ensure dates are valid Date objects
                const startDate = business.startDate instanceof Date ? business.startDate : new Date(business.startDate);
                const endDate = business.endDate instanceof Date ? business.endDate : new Date(business.endDate);
                
                return {
                    name: business.name,
                    y: businesses.length - index - 1, // Reverse order so first business is at top
                    x1: startDate,
                    x2: endDate,
                    stroke: baseColor,
                    fill: baseColor,
                    fillTransparent: fillTransparent,
                    isOldSchool: business.isOldSchool,
                    isClosed: business.isClosed,
                    isPermanentlyClosed: business.isPermanentlyClosed,
                    isOperating: business.isOperating,
                    startYear: business.startYear,
                    endYear: business.endYear,
                    photoUrl: business.photoUrl,
                    index: index // Store original index for reference
                };
            });
            
            // Create extension lines data (only for operating businesses)
            const extensionLines = businesses.map((business, index) => {
                const baseColor = business.isOldSchool ? '#8B6F47' : '#E91E63';
                const y = businesses.length - index - 1;
                
                // For operating: extend from startDate to right edge
                if (business.isOperating && business.startDate) {
                    const startDate = business.startDate instanceof Date ? business.startDate : new Date(business.startDate);
                    return {
                        y: y,
                        x1: startDate,
                        x2: timelineEnd,
                        stroke: baseColor,
                        fill: baseColor,
                        isExtension: true
                    };
                }
                return null;
            }).filter(d => d !== null);

            // Debug: log data to verify
            console.log('Plot data sample:', plotData.slice(0, 3));
            console.log('Extension lines:', extensionLines.length);
            
            // Create the plot
            const plot = window.Plot.plot({
                width: timelineContainer.offsetWidth || 1200, // Use full container width
                marginLeft: 200, // Space for business names
                marginTop: 60, // Space for year labels
                marginRight: 0, // No right margin to use full width
                height: Math.max(400, businesses.length * 10), // Dynamic height based on number of businesses
                x: {
                    type: "time",
                    domain: [minDate || new Date(timelineStartYear, 0, 1), maxDate],
                    grid: true,
                    label: null,
                    axis: "top",
                    ticks: timelineEndYear - timelineStartYear,
                    tickFormat: (d) => {
                        const year = new Date(d).getFullYear();
                        if (year % Math.max(1, Math.floor((timelineEndYear - timelineStartYear) / 6)) === 0) {
                            return String(year); // Remove commas by using String() instead of locale formatting
                        }
                        return '';
                    }
                },
                y: {
                    domain: plotData.map(d => d.y),
                    label: null,
                    tickFormat: () => '' // Hide y-axis ticks
                },
                marks: [
                    // Extension lines (dashed) for permanently closed (left) and operating (right)
                    ...(extensionLines.length > 0 ? [window.Plot.link(extensionLines, {
                        x1: "x1",
                        x2: "x2",
                        y1: "y",
                        y2: "y",
                        stroke: "stroke",
                        strokeWidth: 2,
                        strokeDasharray: "6,4",
                        opacity: 0.6
                    })] : []),
                    // Main horizontal lines for each business
                    window.Plot.link(plotData, {
                        x1: "x1",
                        x2: "x2",
                        y1: "y",
                        y2: "y",
                        stroke: "stroke",
                        strokeWidth: 3,
                        title: (d) => `${d.name}: ${d.startYear}-${d.endYear} (${d.isClosed ? 'Closed' : 'Open'}) - ${d.isOldSchool ? 'Old-school' : 'New-school'}`
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

            // Wrap plot in a scrollable container for sticky x-axis
            const plotWrapper = document.createElement('div');
            plotWrapper.className = 'timeline-plot-wrapper';
            plotWrapper.style.cssText = 'position: relative; overflow-y: auto; max-height: 800px;';
            plotWrapper.appendChild(plot);
            timelineContainer.appendChild(plotWrapper);
            
            // Make x-axis sticky after plot is rendered
            setTimeout(() => {
                const svg = plotWrapper.querySelector('svg');
                if (svg) {
                    // Find the x-axis group - look for groups with text elements that look like years
                    const allGroups = Array.from(svg.querySelectorAll('g'));
                    let xAxisGroup = null;
                    
                    // Try to find x-axis by looking for groups with year-like text
                    for (const g of allGroups) {
                        const texts = g.querySelectorAll('text');
                        let hasYearText = false;
                        texts.forEach(text => {
                            const textContent = text.textContent || '';
                            // Check if text looks like a year (4 digits, or year-like format)
                            if (/^\d{4}$/.test(textContent.trim()) || textContent.includes('2000') || textContent.includes('202')) {
                                hasYearText = true;
                            }
                        });
                        
                        if (hasYearText) {
                            const transform = g.getAttribute('transform') || '';
                            const match = transform.match(/translate\([^,]+,\s*([\d.]+)\)/);
                            if (match) {
                                const yPos = parseFloat(match[1]);
                                // X-axis should be near the top
                                if (yPos >= 40 && yPos <= 100) {
                                    xAxisGroup = g;
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Fallback: find by position if year text method didn't work
                    if (!xAxisGroup) {
                        xAxisGroup = allGroups.find(g => {
                            const transform = g.getAttribute('transform') || '';
                            const match = transform.match(/translate\([^,]+,\s*([\d.]+)\)/);
                            if (match) {
                                const yPos = parseFloat(match[1]);
                                return yPos >= 50 && yPos <= 80;
                            }
                            return false;
                        });
                    }
                    
                    if (xAxisGroup) {
                        // Extract x-axis position
                        const transform = xAxisGroup.getAttribute('transform') || '';
                        const yMatch = transform.match(/translate\([^,]+,\s*([\d.]+)\)/);
                        const xAxisY = yMatch ? parseFloat(yMatch[1]) : 60;
                        const svgWidth = parseFloat(svg.getAttribute('width') || '1200');
                        const svgHeight = parseFloat(svg.getAttribute('height') || '400');
                        
                        // Create a sticky header div that will show the x-axis
                        const stickyHeader = document.createElement('div');
                        stickyHeader.className = 'timeline-sticky-x-axis';
                        stickyHeader.style.cssText = `
                            position: sticky;
                            top: 0;
                            z-index: 100;
                            background-color: #f8fafc;
                            padding: 0;
                            margin: 0;
                            height: ${xAxisY + 25}px;
                            overflow: hidden;
                            border-bottom: 1px solid #e2e8f0;
                        `;
                        
                        // Clone the x-axis into a new SVG for the sticky header
                        const stickySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        stickySvg.setAttribute('width', svgWidth);
                        stickySvg.setAttribute('height', (xAxisY + 25).toString());
                        stickySvg.setAttribute('viewBox', `0 0 ${svgWidth} ${xAxisY + 25}`);
                        stickySvg.style.cssText = 'display: block; width: 100%; height: 100%;';
                        
                        // Clone the entire x-axis group
                        const clonedGroup = xAxisGroup.cloneNode(true);
                        // Keep the original transform
                        stickySvg.appendChild(clonedGroup);
                        stickyHeader.appendChild(stickySvg);
                        
                        // Insert the sticky header at the top of the wrapper, before the plot
                        plotWrapper.insertBefore(stickyHeader, plotWrapper.firstChild);
                        
                        // Also make the original x-axis group have a higher z-index for visibility
                        xAxisGroup.style.pointerEvents = 'none';
                    }
                    
                    // Add tooltips to dots by matching both x and y coordinates
                    const allCircles = Array.from(svg.querySelectorAll('circle'));
                    const marginTop = 60; // Match the marginTop from plot config
                    const marginLeft = 200; // Match the marginLeft from plot config
                    
                    // Get the plot dimensions to calculate scales
                    const plotHeight = parseFloat(svg.getAttribute('height') || '400');
                    const plotWidth = parseFloat(svg.getAttribute('width') || '1200');
                    const chartHeight = plotHeight - marginTop;
                    const chartWidth = plotWidth - marginLeft;
                    
                    // Get y domain (range of y values)
                    const yDomain = plotData.map(d => d.y);
                    const yMin = Math.min(...yDomain);
                    const yMax = Math.max(...yDomain);
                    const yRange = yMax - yMin || 1; // Avoid division by zero
                    
                    // Get x domain (date range)
                    const xMin = timelineStart.getTime();
                    const xMax = timelineEnd.getTime();
                    const xRange = xMax - xMin || 1;
                    
                    allCircles.forEach(circle => {
                        const fill = circle.getAttribute('fill');
                        // Only process dots with our business colors
                        if (fill === '#8B6F47' || fill === '#E91E63' || 
                            fill === 'rgb(139, 111, 71)' || fill === 'rgb(233, 30, 99)') {
                            
                            const circleX = parseFloat(circle.getAttribute('cx') || '0');
                            const circleY = parseFloat(circle.getAttribute('cy') || '0');
                            
                            // Convert circle coordinates back to data coordinates
                            // Observable Plot scales: y is inverted (top is max, bottom is min)
                            const normalizedY = (circleY - marginTop) / chartHeight;
                            const dataY = yMax - (normalizedY * yRange);
                            
                            // Convert x coordinate to date
                            const normalizedX = (circleX - marginLeft) / chartWidth;
                            const dataX = xMin + (normalizedX * xRange);
                            const circleDate = new Date(dataX);
                            
                            // Match dot to business by both y-coordinate and date
                            let matchingBusiness = null;
                            let minDistance = Infinity;
                            
                            plotData.forEach(plotItem => {
                                // Check if y coordinates match (within tolerance)
                                const yDistance = Math.abs(dataY - plotItem.y);
                                
                                // Check if date matches (for start dots, check x1; for end dots, check x2)
                                const plotItemX1 = plotItem.x1.getTime();
                                const plotItemX2 = plotItem.x2.getTime();
                                const dateDistance1 = Math.abs(circleDate.getTime() - plotItemX1);
                                const dateDistance2 = Math.abs(circleDate.getTime() - plotItemX2);
                                const dateDistance = Math.min(dateDistance1, dateDistance2);
                                
                                // Combined distance (prioritize y match, but also check date)
                                const combinedDistance = yDistance * 10 + dateDistance / (1000 * 60 * 60 * 24); // Normalize date to days
                                
                                if (yDistance < 1 && dateDistance < 30 * 24 * 60 * 60 * 1000 && combinedDistance < minDistance) {
                                    minDistance = combinedDistance;
                                    matchingBusiness = businesses[plotItem.index];
                                }
                            });
                            
                            if (matchingBusiness) {
                                // Create tooltip
                                const tooltip = document.createElement('div');
                                tooltip.className = 'timeline-dot-tooltip';
                                
                                let tooltipContent = `<strong>${matchingBusiness.name}</strong>`;
                                if (matchingBusiness.photoUrl && matchingBusiness.photoUrl.trim()) {
                                    tooltipContent += `<br><img src="${matchingBusiness.photoUrl}" alt="${matchingBusiness.name}" style="max-width: 200px; max-height: 120px; margin-top: 8px; border-radius: 4px; display: block;" onerror="this.style.display='none'">`;
                                }
                                
                                tooltip.innerHTML = tooltipContent;
                                document.body.appendChild(tooltip);
                                
                                // Add hover events
                                circle.addEventListener('mouseenter', () => {
                                    tooltip.style.display = 'block';
                                    const rect = circle.getBoundingClientRect();
                                    // Position tooltip closer to the dot (5px instead of 10px), vertically centered
                                    tooltip.style.left = (rect.right + 5) + 'px';
                                    tooltip.style.top = (rect.top + rect.height / 2 - tooltip.offsetHeight / 2) + 'px';
                                    
                                    // Adjust if tooltip goes off screen to the right
                                    const maxLeft = window.innerWidth - tooltip.offsetWidth - 10;
                                    if (parseFloat(tooltip.style.left) > maxLeft) {
                                        // Position to the left of the dot instead
                                        tooltip.style.left = (rect.left - tooltip.offsetWidth - 10) + 'px';
                                    }
                                    
                                    // Adjust if tooltip goes off screen to the left
                                    if (parseFloat(tooltip.style.left) < 10) {
                                        tooltip.style.left = '10px';
                                    }
                                    
                                    // Adjust if tooltip goes off screen vertically
                                    if (parseFloat(tooltip.style.top) < 10) {
                                        tooltip.style.top = '10px';
                                    }
                                    const maxTop = window.innerHeight - tooltip.offsetHeight - 10;
                                    if (parseFloat(tooltip.style.top) > maxTop) {
                                        tooltip.style.top = maxTop + 'px';
                                    }
                                });
                                
                                circle.addEventListener('mouseleave', () => {
                                    tooltip.style.display = 'none';
                                });
                                
                                circle.style.cursor = 'pointer';
                            }
                        }
                    });
                }
            }, 200);
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

// Old-school v. New-school Comparison Visualization
async function initComparisonVisualization() {
    const container = document.getElementById('comparison-visualization');
    if (!container) return;

    try {
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

        // Get all column names to find columns
        const headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
        const columnD = headers[3]; // Column D is the 4th column (0-indexed: 3) - Business name
        const columnE = headers[4]; // Column E is the 5th column (0-indexed: 4) - Category
        const columnAE = headers[30]; // Column AE is the 31st column (0-indexed: 30) - Images
        const columnBM = headers[64]; // Column BM is the 65th column (0-indexed: 64) - Status
        const columnBP = headers[67]; // Column BP is the 68th column (0-indexed: 67) - Old-school confidence
        const columnBQ = headers[68]; // Column BQ is the 69th column (0-indexed: 68) - New-school confidence

        console.log('Column D (name):', columnD);
        console.log('Column E (category):', columnE);
        console.log('Column AE (images):', columnAE);
        console.log('Column BM (status):', columnBM);
        console.log('Column BP (old-school confidence):', columnBP);
        console.log('Column BQ (new-school confidence):', columnBQ);

        // Filter and process data
        const imageData = parsed.data
            .filter(row => {
                const imageUrl = row[columnAE] || row['Photo_URL'] || '';
                const predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
                // Filter out entries without photos or predicted class
                const hasValidPhoto = imageUrl && imageUrl.trim() && imageUrl.trim().length > 0;
                const hasValidClass = predictedClass && predictedClass.length > 0;
                return hasValidPhoto && hasValidClass;
            })
            .map(row => {
                const imageUrl = (row[columnAE] || row['Photo_URL'] || '').trim();
                let predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
                const isOldSchool = predictedClass.toLowerCase().includes('old-school');
                
                // Get confidence from appropriate column (BP for old-school, BQ for new-school)
                let confidence = 0;
                const confidenceCol = isOldSchool ? columnBP : columnBQ;
                if (confidenceCol && row[confidenceCol]) {
                    const confStr = String(row[confidenceCol]).trim();
                    // Try parsing as percentage (e.g., "95%") or decimal (e.g., "0.95")
                    if (confStr.includes('%')) {
                        confidence = parseFloat(confStr.replace('%', '')) || 0;
                    } else {
                        const confNum = parseFloat(confStr);
                        confidence = confNum > 1 ? confNum : confNum * 100; // Convert decimal to percentage if needed
                    }
                }
                
                // Get business details for tooltip
                const businessName = row[columnD] || 'Unknown';
                const category = row[columnE] || 'Unknown';
                const status = row[columnBM] || 'Unknown';
                
                return {
                    imageUrl: imageUrl,
                    predictedClass,
                    isOldSchool,
                    confidence: confidence || 0, // Default to 0 if not found
                    businessName: businessName.trim(),
                    category: category.trim(),
                    status: status.trim()
                };
            })
            .filter(item => {
                // Only include items with valid confidence values AND valid image URLs
                return item.confidence > 0 && item.imageUrl && item.imageUrl.length > 0;
            })

        // Group by decile (0-9%, 10-19%, 20-29%, ..., 90-99%, 100%)
        const groupByConfidence = (items) => {
            const groups = {};
            items.forEach(item => {
                const confidence = Math.round(item.confidence);
                let confidenceLevel;
                
                // Special case for 100%
                if (confidence === 100) {
                    confidenceLevel = 100;
                } else {
                    // Group into deciles: 0-9, 10-19, 20-29, ..., 90-99
                    const decile = Math.floor(confidence / 10) * 10;
                    confidenceLevel = decile;
                }
                
                if (!groups[confidenceLevel]) {
                    groups[confidenceLevel] = [];
                }
                groups[confidenceLevel].push(item);
            });
            return groups;
        };

        const oldSchoolGroups = groupByConfidence(imageData.filter(d => d.isOldSchool));
        const newSchoolGroups = groupByConfidence(imageData.filter(d => !d.isOldSchool));

        // Get all confidence levels, sorted descending
        const allConfidenceLevels = [...new Set([
            ...Object.keys(oldSchoolGroups).map(Number),
            ...Object.keys(newSchoolGroups).map(Number)
        ])].sort((a, b) => b - a);

        // Create visualization structure
        container.innerHTML = `
            <div class="comparison-legend" style="margin-bottom: 2rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 30px; height: 20px; background: rgb(139, 111, 71); border-radius: 4px;"></span>
                        <span>Old-school Style (new business)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 30px; height: 20px; background: rgb(210, 180, 140); border-radius: 4px;"></span>
                        <span>Old-school Style (closed)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 30px; height: 20px; background: rgb(233, 30, 99); border-radius: 4px;"></span>
                        <span>New-school Style (new business)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="display: inline-block; width: 30px; height: 20px; background: rgb(248, 215, 218); border-radius: 4px;"></span>
                        <span>New-school Style (closed)</span>
                    </div>
                </div>
            </div>
            <div class="comparison-container">
                <div class="comparison-column old-school-column">
                    <h3>Old-school</h3>
                    <div class="comparison-images" id="old-school-images"></div>
                </div>
                <div class="comparison-column new-school-column">
                    <h3>New-school</h3>
                    <div class="comparison-images" id="new-school-images"></div>
                </div>
            </div>
        `;

        const oldSchoolContainer = document.getElementById('old-school-images');
        const newSchoolContainer = document.getElementById('new-school-images');

        // Track total items processed for progressive sizing
        let oldSchoolItemCount = 0;
        let newSchoolItemCount = 0;

        // Function to get size class based on item count
        const getSizeClass = (itemCount) => {
            const hundred = Math.floor(itemCount / 100);
            if (hundred === 0) return 'size-normal';
            if (hundred === 1) return 'size-small';
            if (hundred === 2) return 'size-smaller';
            return 'size-smallest';
        };

        // Render each confidence level as a block
        allConfidenceLevels.forEach(confidenceLevel => {
            const oldSchoolItems = oldSchoolGroups[confidenceLevel] || [];
            const newSchoolItems = newSchoolGroups[confidenceLevel] || [];

            // Format confidence level label for deciles
            const formatConfidenceLabel = (level) => {
                if (level === 100) {
                    return '100%';
                } else {
                    return `${level}-${level + 9}%`;
                }
            };

            // Create confidence level header for old-school
            if (oldSchoolItems.length > 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'confidence-level-header';
                headerDiv.textContent = formatConfidenceLabel(confidenceLevel);
                oldSchoolContainer.appendChild(headerDiv);
            }

            // Create confidence level header for new-school
            if (newSchoolItems.length > 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'confidence-level-header';
                headerDiv.textContent = formatConfidenceLabel(confidenceLevel);
                newSchoolContainer.appendChild(headerDiv);
            }

            // Create image grid for this confidence level
            const maxItems = Math.max(oldSchoolItems.length, newSchoolItems.length);
            const itemsPerRow = 4; // Number of images per row

            // Render old-school images in grid
            if (oldSchoolItems.length > 0) {
                const gridDiv = document.createElement('div');
                gridDiv.className = 'confidence-level-grid';
                
                oldSchoolItems.forEach(item => {
                const bgColor = getOldSchoolGradientColor(item.status);
                const imgDiv = document.createElement('div');
                const sizeClass = getSizeClass(oldSchoolItemCount);
                imgDiv.className = `comparison-image-item ${sizeClass}`;
                imgDiv.style.backgroundColor = bgColor;
                    
                    oldSchoolItemCount++;
                    
                    const img = document.createElement('img');
                    img.setAttribute('data-src', item.imageUrl); // Use data-src for lazy loading
                    img.alt = 'Old-school storefront';
                    img.loading = 'lazy';
                    img.onerror = function() {
                        this.style.display = 'none';
                        this.parentElement.innerHTML = '<div class="image-error">Image unavailable</div>';
                    };
                    // Set src when image is near viewport (Intersection Observer will handle this)
                    imgDiv.appendChild(img);
                    
                    // Use Intersection Observer for better lazy loading control
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.getAttribute('data-src');
                                observer.unobserve(img);
                            }
                        });
                    }, {
                        rootMargin: '50px' // Start loading 50px before entering viewport
                    });
                    observer.observe(img);
                    
                    const tooltip = document.createElement('div');
                    tooltip.className = 'comparison-tooltip';
                    
                    // Add larger thumbnail to tooltip for all items
                    const tooltipImage = `<div class="tooltip-image"><img src="${item.imageUrl}" alt="Storefront preview" loading="lazy"></div>`;
                    
                    tooltip.innerHTML = `
                        <div class="tooltip-content">
                            ${tooltipImage}
                            <div class="tooltip-row"><strong>Name:</strong> ${item.businessName}</div>
                            <div class="tooltip-row"><strong>Category:</strong> ${item.category}</div>
                            <div class="tooltip-row"><strong>Status:</strong> ${item.status}</div>
                        </div>
                    `;
                    imgDiv.appendChild(tooltip);
                    gridDiv.appendChild(imgDiv);
                });
                
                oldSchoolContainer.appendChild(gridDiv);
            }

            // Render new-school images in grid
            if (newSchoolItems.length > 0) {
                const gridDiv = document.createElement('div');
                gridDiv.className = 'confidence-level-grid';
                
                newSchoolItems.forEach(item => {
                const bgColor = getNewSchoolGradientColor(item.status);
                const imgDiv = document.createElement('div');
                const sizeClass = getSizeClass(newSchoolItemCount);
                imgDiv.className = `comparison-image-item ${sizeClass}`;
                imgDiv.style.backgroundColor = bgColor;
                    
                    newSchoolItemCount++;
                    
                    const img = document.createElement('img');
                    img.setAttribute('data-src', item.imageUrl); // Use data-src for lazy loading
                    img.alt = 'New-school storefront';
                    img.loading = 'lazy';
                    img.onerror = function() {
                        this.style.display = 'none';
                        this.parentElement.innerHTML = '<div class="image-error">Image unavailable</div>';
                    };
                    // Set src when image is near viewport (Intersection Observer will handle this)
                    imgDiv.appendChild(img);
                    
                    // Use Intersection Observer for better lazy loading control
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.getAttribute('data-src');
                                observer.unobserve(img);
                            }
                        });
                    }, {
                        rootMargin: '50px' // Start loading 50px before entering viewport
                    });
                    observer.observe(img);
                    
                    const tooltip = document.createElement('div');
                    tooltip.className = 'comparison-tooltip';
                    
                    // Add larger thumbnail to tooltip for all items
                    const tooltipImage = `<div class="tooltip-image"><img src="${item.imageUrl}" alt="Storefront preview" loading="lazy"></div>`;
                    
                    tooltip.innerHTML = `
                        <div class="tooltip-content">
                            ${tooltipImage}
                            <div class="tooltip-row"><strong>Name:</strong> ${item.businessName}</div>
                            <div class="tooltip-row"><strong>Category:</strong> ${item.category}</div>
                            <div class="tooltip-row"><strong>Status:</strong> ${item.status}</div>
                        </div>
                    `;
                    imgDiv.appendChild(tooltip);
                    
                    gridDiv.appendChild(imgDiv);
                });
                
                newSchoolContainer.appendChild(gridDiv);
            }
        });

    } catch (error) {
        console.error('Error loading comparison visualization:', error);
        container.innerHTML = `
            <div class="comparison-error">
                <p>Error loading comparison data: ${error.message}</p>
            </div>
        `;
    }
}

// Helper function to get old-school gradient color (dark-brown to lightest brown)
function getOldSchoolGradientColor(status) {
    // Status-based: operating = darker brown, closed = fainter brown
    // Dark brown: #8B6F47 (RGB: 139, 111, 71)
    // Light brown: #D2B48C (RGB: 210, 180, 140)
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'operating' || statusLower === 'new') {
        return 'rgb(139, 111, 71)'; // Darker brown for operating
    } else {
        return 'rgb(210, 180, 140)'; // Fainter brown for closed
    }
}

// Helper function to get new-school gradient color based on status
function getNewSchoolGradientColor(status) {
    // Status-based: operating = darker pink, closed = fainter pink
    // Dark pink: #E91E63 (RGB: 233, 30, 99)
    // Light pink: #F8D7DA (RGB: 248, 215, 218)
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'operating' || statusLower === 'new') {
        return 'rgb(233, 30, 99)'; // Darker pink for operating
    } else {
        return 'rgb(248, 215, 218)'; // Fainter pink for closed
    }
}

// Sankey Diagram for Turnover Flow
async function initSankeyDiagram() {
    console.log('initSankeyDiagram called - version with 5 phases');
    const sankeyContainer = document.getElementById('sankey-diagram');
    if (!sankeyContainer || sankeyContainer.dataset.initialized === 'true') return;

    sankeyContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">Loading turnover flow diagram...</div>';
    sankeyContainer.dataset.initialized = 'true';

    try {
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

        // Get column F (address) - column F is the 6th column (0-indexed: 5)
        const headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
        const columnF = headers[5]; // Column F is the 6th column (0-indexed: 5) - Address

        // Group rows by coordinates
        const coordinateGroups = new Map();
        const coordinateAddresses = new Map(); // Store address for each coordinate group
        
        parsed.data.forEach(row => {
            const lat = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lat']);
            const lng = parseFloat(row['LiveXYZSeptember132025_XYTableToPoint_entrances_main_lon']);
            const photoUrl = row['Photo_URL'] || '';

            // Skip if coordinates are invalid or no image
            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0 || !photoUrl || photoUrl.trim() === '') {
                return;
            }

            const coordKey = `${lat.toFixed(6)},${lng.toFixed(6)}`;
            
            if (!coordinateGroups.has(coordKey)) {
                coordinateGroups.set(coordKey, []);
            }

            // Store address for this coordinate (use first non-empty address found)
            const address = row[columnF] || row['address'] || row['Address'] || '';
            if (address && address.trim() && !coordinateAddresses.has(coordKey)) {
                coordinateAddresses.set(coordKey, address.trim());
            }

            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            predictedClass = String(predictedClass || '').trim();
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');
            }

            const placeCreationDate = row['placeCreationDate_short'] || row['placeCreationDate'] || '';
            const isOldSchool = predictedClass.includes('Old-school');
            
            // Get business name
            const businessName = row['LiveXYZSeptember132025_XYTableToPoint_name'] || 
                                row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] ||
                                row['name'] || 
                                row['resolvedName'] || 
                                'Unknown';

            coordinateGroups.get(coordKey).push({
                placeCreationDate,
                isOldSchool,
                predictedClass,
                businessName: businessName.trim()
            });
        });

        // Filter to only groups with multiple businesses
        const multiBusinessGroups = Array.from(coordinateGroups.entries())
            .filter(([_, businesses]) => businesses.length > 1)
            .sort(([_, a], [__, b]) => b.length - a.length) // Sort by number of businesses (descending)
            .slice(0, 50); // Limit to top 50 locations for readability

        if (multiBusinessGroups.length === 0) {
            sankeyContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No data available for Sankey diagram.</div>';
            return;
        }

        // Sort businesses at each location by date to determine phase order
        multiBusinessGroups.forEach(([_, businesses]) => {
            businesses.sort((a, b) => {
                const dateA = new Date(a.placeCreationDate || 0);
                const dateB = new Date(b.placeCreationDate || 0);
                return dateA - dateB;
            });
        });

        // Build parallel sets structure
        // Define 5 phases
        const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];
        
        // Collect addresses and their businesses
        const addressData = [];
        const addressBusinessMap = new Map(); // Map address to businesses in each phase
        
        multiBusinessGroups.forEach(([coordKey, businesses], locationIdx) => {
            const address = coordinateAddresses.get(coordKey) || `Location ${locationIdx + 1}`;
            
            // Determine dominant typography (based on first business or majority)
            const firstBusiness = businesses[0];
            const oldSchoolCount = businesses.filter(b => b.isOldSchool).length;
            const isOldSchoolDominant = oldSchoolCount >= businesses.length / 2;
            const dominantIsOldSchool = firstBusiness ? firstBusiness.isOldSchool : isOldSchoolDominant;
            
            // Track which phases this address has businesses in
            const phaseBusinesses = phases.map(() => ({ oldSchool: [], newSchool: [] }));
            
            businesses.forEach((business, businessOrder) => {
                const phaseNumber = businessOrder; // 0-indexed phase (0-4)
                
                // Only process phases 1-5
                if (phaseNumber < 5) {
                    const businessData = {
                        locationIdx: locationIdx,
                        address: address,
                        phaseNumber: phaseNumber,
                        isOldSchool: business.isOldSchool,
                        businessOrder: businessOrder,
                        businessName: business.businessName || 'Unknown'
                    };
                    
                    // Add to appropriate phase group
                    if (business.isOldSchool) {
                        phaseBusinesses[phaseNumber].oldSchool.push(businessData);
                    } else {
                        phaseBusinesses[phaseNumber].newSchool.push(businessData);
                    }
                }
            });
            
            addressData.push({
                address: address,
                locationIdx: locationIdx,
                isOldSchool: dominantIsOldSchool,
                phaseBusinesses: phaseBusinesses,
                businessCount: businesses.length
            });
            
            addressBusinessMap.set(address, phaseBusinesses);
        });
        
        // Organize addresses by old-school (top) / new-school (bottom)
        const addressGroups = {
            oldSchool: addressData.filter(a => a.isOldSchool),
            newSchool: addressData.filter(a => !a.isOldSchool)
        };
        
        // For each phase, collect businesses and organize by old-school (top) / new-school (bottom)
        const phaseBusinesses = phases.map(() => ({ oldSchool: [], newSchool: [] }));
        
        addressData.forEach(addressInfo => {
            addressInfo.phaseBusinesses.forEach((phaseData, phaseIdx) => {
                phaseBusinesses[phaseIdx].oldSchool.push(...phaseData.oldSchool);
                phaseBusinesses[phaseIdx].newSchool.push(...phaseData.newSchool);
            });
        });
        
        // Calculate positions for addresses (left column)
        const addressPositions = new Map();
        let addressYIndex = 0;
        
        // Position old-school addresses (top)
        addressGroups.oldSchool.forEach(addressInfo => {
            addressPositions.set(addressInfo.address, {
                address: addressInfo.address,
                yIndex: addressYIndex++,
                isOldSchool: true
            });
        });
        
        // Position new-school addresses (bottom)
        addressGroups.newSchool.forEach(addressInfo => {
            addressPositions.set(addressInfo.address, {
                address: addressInfo.address,
                yIndex: addressYIndex++,
                isOldSchool: false
            });
        });
        
        const totalAddresses = addressYIndex;
        
        // Calculate positions for each phase column
        const phasePositions = phaseBusinesses.map((phase, phaseIdx) => {
            const oldSchoolCount = phase.oldSchool.length;
            const newSchoolCount = phase.newSchool.length;
            const totalCount = oldSchoolCount + newSchoolCount;
            
            // Calculate positions: old-school at top, new-school at bottom
            const positions = new Map();
            
            // Position old-school businesses (top)
            phase.oldSchool.forEach((business, idx) => {
                const businessKey = `${business.address}-${business.phaseNumber}`;
                positions.set(businessKey, {
                    business: business,
                    yIndex: idx,
                    height: 1,
                    phaseIdx: phaseIdx,
                    isOldSchool: true
                });
            });
            
            // Position new-school businesses (bottom)
            phase.newSchool.forEach((business, idx) => {
                const businessKey = `${business.address}-${business.phaseNumber}`;
                positions.set(businessKey, {
                    business: business,
                    yIndex: oldSchoolCount + idx,
                    height: 1,
                    phaseIdx: phaseIdx,
                    isOldSchool: false
                });
            });
            
            return {
                positions: positions,
                oldSchoolCount: oldSchoolCount,
                newSchoolCount: newSchoolCount,
                totalCount: totalCount,
                oldSchool: phase.oldSchool,
                newSchool: phase.newSchool
            };
        });
        
        // Create links between consecutive phases
        // Link businesses at the same address across phases, regardless of style changes
        const links = [];
        addressData.forEach(addressInfo => {
            // For each address, create links between consecutive phases
            for (let phaseIdx = 0; phaseIdx < phases.length - 1; phaseIdx++) {
                const currentPhase = addressInfo.phaseBusinesses[phaseIdx];
                const nextPhase = addressInfo.phaseBusinesses[phaseIdx + 1];
                
                // Combine all businesses from current phase (old-school and new-school)
                const allCurrentBusinesses = [...currentPhase.oldSchool, ...currentPhase.newSchool];
                
                // For each business in current phase, find the business in next phase at same address
                allCurrentBusinesses.forEach(sourceBusiness => {
                    // Look for business in next phase at same address (regardless of style)
                    const allNextBusinesses = [...nextPhase.oldSchool, ...nextPhase.newSchool];
                    const targetBusiness = allNextBusinesses.find(b => 
                        b.address === sourceBusiness.address && 
                        b.phaseNumber === sourceBusiness.phaseNumber + 1
                    );
                    
                    if (targetBusiness) {
                        const sourceKey = `${sourceBusiness.address}-${sourceBusiness.phaseNumber}`;
                        const targetKey = `${targetBusiness.address}-${targetBusiness.phaseNumber}`;
                        const sourcePos = phasePositions[phaseIdx].positions.get(sourceKey);
                        const targetPos = phasePositions[phaseIdx + 1].positions.get(targetKey);
                        
                        if (sourcePos && targetPos) {
                            // Determine link color based on source business style
                            links.push({
                                source: sourceBusiness,
                                target: targetBusiness,
                                sourcePos: sourcePos,
                                targetPos: targetPos,
                                isOldSchool: sourceBusiness.isOldSchool
                            });
                        }
                    }
                });
            }
        });

        // Render parallel sets diagram
        const maxCount = Math.max(totalAddresses, ...phasePositions.map(p => p.totalCount));
        const nodeHeight = 12;
        const nodeSpacing = 2;
        
        const leftMargin = 20; // Moved addresses further left
        const rightMargin = 50;
        const topMargin = 80;
        const addressColumnWidth = 180; // Slightly narrower to move left
        const phaseColumnWidth = 150;
        const columnSpacing = 50;
        
        const width = leftMargin + rightMargin + addressColumnWidth + (phases.length * (phaseColumnWidth + columnSpacing));
        const height = topMargin + (maxCount * (nodeHeight + nodeSpacing)) + 100;
        
        sankeyContainer.innerHTML = '';
        const svg = d3.select('#sankey-diagram')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Calculate Y position helper
        const getYPosition = (yIndex) => {
            return topMargin + (yIndex * (nodeHeight + nodeSpacing));
        };

        // Draw address column (left)
        const addressX = leftMargin;
        
        // Draw address label
        svg.append('text')
            .attr('x', addressX + addressColumnWidth / 2)
            .attr('y', topMargin - 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1e293b')
            .text('Address');
        
        // Draw addresses (plain text, no colored backgrounds)
        addressGroups.oldSchool.forEach(addressInfo => {
            const pos = addressPositions.get(addressInfo.address);
            if (pos) {
                const y = getYPosition(pos.yIndex);
                
                // Add address text (truncate if too long)
                const addressText = addressInfo.address.length > 25 ? 
                    addressInfo.address.substring(0, 22) + '...' : 
                    addressInfo.address;
                
                svg.append('text')
                    .attr('x', addressX)
                    .attr('y', y + nodeHeight / 2)
                    .attr('dy', '0.35em')
                    .attr('fill', '#1e293b')
                    .attr('font-size', '11px')
                    .text(addressText);
            }
        });
        
        addressGroups.newSchool.forEach(addressInfo => {
            const pos = addressPositions.get(addressInfo.address);
            if (pos) {
                const y = getYPosition(pos.yIndex);
                
                // Add address text
                const addressText = addressInfo.address.length > 25 ? 
                    addressInfo.address.substring(0, 22) + '...' : 
                    addressInfo.address;
                
                svg.append('text')
                    .attr('x', addressX)
                    .attr('y', y + nodeHeight / 2)
                    .attr('dy', '0.35em')
                    .attr('fill', '#1e293b')
                    .attr('font-size', '11px')
                    .text(addressText);
            }
        });

        // Draw phase columns and businesses
        phases.forEach((phaseName, phaseIdx) => {
            const phaseX = leftMargin + addressColumnWidth + columnSpacing + phaseIdx * (phaseColumnWidth + columnSpacing);
            const phaseData = phasePositions[phaseIdx];
            
            // Draw phase label
            svg.append('text')
                .attr('x', phaseX + phaseColumnWidth / 2)
                .attr('y', topMargin - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#1e293b')
                .text(phaseName);
            
            // Draw old-school businesses (brown, at top)
            phaseData.oldSchool.forEach(business => {
                const businessKey = `${business.address}-${business.phaseNumber}`;
                const pos = phaseData.positions.get(businessKey);
                if (pos) {
                    const y = getYPosition(pos.yIndex);
                    const color = '#8B6F47';
                    
                    svg.append('rect')
                        .attr('x', phaseX)
                        .attr('y', y)
                        .attr('width', phaseColumnWidth)
                        .attr('height', nodeHeight)
                        .attr('fill', color)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', 1)
                        .attr('rx', 2);
                    
                    // Add business name text
                    const businessName = business.businessName || 'Unknown';
                    const nameText = businessName.length > 18 ? businessName.substring(0, 15) + '...' : businessName;
                    svg.append('text')
                        .attr('x', phaseX + phaseColumnWidth / 2)
                        .attr('y', y + nodeHeight / 2)
                        .attr('dy', '0.35em')
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#fff')
                        .attr('font-size', '9px')
                        .attr('font-weight', '500')
                        .text(nameText);
                }
            });
            
            // Draw new-school businesses (pink, at bottom)
            phaseData.newSchool.forEach(business => {
                const businessKey = `${business.address}-${business.phaseNumber}`;
                const pos = phaseData.positions.get(businessKey);
                if (pos) {
                    const y = getYPosition(pos.yIndex);
                    const color = '#E91E63';
                    
                    svg.append('rect')
                        .attr('x', phaseX)
                        .attr('y', y)
                        .attr('width', phaseColumnWidth)
                        .attr('height', nodeHeight)
                        .attr('fill', color)
                        .attr('stroke', '#fff')
                        .attr('stroke-width', 1)
                        .attr('rx', 2);
                    
                    // Add business name text
                    const businessName = business.businessName || 'Unknown';
                    const nameText = businessName.length > 18 ? businessName.substring(0, 15) + '...' : businessName;
                    svg.append('text')
                        .attr('x', phaseX + phaseColumnWidth / 2)
                        .attr('y', y + nodeHeight / 2)
                        .attr('dy', '0.35em')
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#fff')
                        .attr('font-size', '9px')
                        .attr('font-weight', '500')
                        .text(nameText);
                }
            });
        });

        // Draw links between consecutive phases
        links.forEach(link => {
            const sourcePhaseIdx = link.source.phaseNumber;
            const targetPhaseIdx = link.target.phaseNumber;
            
            const sourceX = leftMargin + addressColumnWidth + columnSpacing + sourcePhaseIdx * (phaseColumnWidth + columnSpacing) + phaseColumnWidth;
            const targetX = leftMargin + addressColumnWidth + columnSpacing + targetPhaseIdx * (phaseColumnWidth + columnSpacing);
            
            const sourceY = getYPosition(link.sourcePos.yIndex) + nodeHeight / 2;
            const targetY = getYPosition(link.targetPos.yIndex) + nodeHeight / 2;
            
            // Create curved path for the link
            const midX1 = sourceX + (targetX - sourceX) * 0.3;
            const midX2 = sourceX + (targetX - sourceX) * 0.7;
            
            const pathData = `M ${sourceX} ${sourceY} C ${midX1} ${sourceY}, ${midX2} ${targetY}, ${targetX} ${targetY}`;
            
            const linkColor = link.isOldSchool ? '#8B6F47' : '#E91E63';
            
            svg.append('path')
                .attr('d', pathData)
                .attr('fill', 'none')
                .attr('stroke', linkColor)
                .attr('stroke-width', 2)
                .attr('stroke-opacity', 0.6)
                .attr('stroke-linecap', 'round')
                .style('pointer-events', 'none');
        });

    } catch (error) {
        console.error('Error creating Sankey diagram:', error);
        sankeyContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #dc2626;">Error loading turnover flow diagram.</div>';
    }
}

// Stacked Area Chart for Business Trends Over Time
async function initStackedAreaChart() {
    const chartContainer = document.getElementById('stacked-area-chart');
    if (!chartContainer || chartContainer.dataset.initialized === 'true') return;

    chartContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">Loading chart data...</div>';
    chartContainer.dataset.initialized = 'true';

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

        // Helper function to parse date (same as timeline)
        const parseDate = (dateStr) => {
            if (!dateStr || dateStr.trim() === '') return null;
            try {
                let date = new Date(dateStr);
                if (!isNaN(date.getTime())) return date;
                
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
        let minDate = null;
        let maxDate = now;

        parsed.data.forEach(row => {
            const isStorefront = row['LiveXYZSeptember132025_XYTableToPoint_isStorefront'];
            if (isStorefront !== 'true' && isStorefront !== 'TRUE') return;

            // Get predicted class
            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            predictedClass = String(predictedClass || '').trim();
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');
            }
            const isOldSchool = predictedClass.toLowerCase().includes('old-school');
            
            if (!predictedClass) return;

            const placeStatus = row['LiveXYZSeptember132025_XYTableToPoint_placeStatus'] || row['Status_simplified'] || '';
            const statusLower = placeStatus.toLowerCase();
            const isClosed = statusLower === 'closed' || 
                           statusLower === 'permanently closed' || 
                           statusLower === 'temporarily closed';

            // Get start date
            const startDateStr = row['placeCreationDate_short'] || 
                                row['LiveXYZSeptember132025_XYTableToPoint_placeCreationDate'] ||
                                row['placeCreationDate'];
            const startDate = parseDate(startDateStr);
            
            // Get end date (for closed businesses)
            let endDate = null;
            if (isClosed) {
                const endDateStr = row['LiveXYZSeptember132025_XYTableToPoint_validityTime_end'];
                endDate = parseDate(endDateStr);
            }

            if (!startDate && !endDate) return;

            const actualStartDate = startDate || new Date(0);
            const actualEndDate = endDate || now;

            // Update min/max dates
            if (startDate && (!minDate || startDate < minDate)) {
                minDate = startDate;
            }
            if (endDate && endDate > maxDate) {
                maxDate = endDate;
            }

            businesses.push({
                isOldSchool: isOldSchool,
                startDate: actualStartDate,
                endDate: actualEndDate
            });
        });

        if (businesses.length === 0) {
            chartContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #64748b;">No data available for chart.</div>';
            return;
        }

        // Generate monthly time series
        const startMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const endMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
        
        const timeSeries = [];
        let currentMonth = new Date(startMonth);
        
        while (currentMonth <= endMonth) {
            const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
            
            // Count active businesses at this month
            let oldSchoolCount = 0;
            let newSchoolCount = 0;
            
            businesses.forEach(business => {
                const businessStart = new Date(business.startDate.getFullYear(), business.startDate.getMonth(), 1);
                const businessEnd = business.endDate ? 
                    new Date(business.endDate.getFullYear(), business.endDate.getMonth(), 1) : 
                    new Date(now.getFullYear(), now.getMonth(), 1);
                
                // Check if business is active in this month
                if (currentMonth >= businessStart && currentMonth <= businessEnd) {
                    if (business.isOldSchool) {
                        oldSchoolCount++;
                    } else {
                        newSchoolCount++;
                    }
                }
            });
            
            const total = oldSchoolCount + newSchoolCount;
            const oldSchoolPercent = total > 0 ? (oldSchoolCount / total * 100).toFixed(1) : 0;
            const newSchoolPercent = total > 0 ? (newSchoolCount / total * 100).toFixed(1) : 0;
            
            timeSeries.push({
                date: new Date(currentMonth),
                monthKey: monthKey,
                oldSchool: oldSchoolCount,
                newSchool: newSchoolCount,
                total: total,
                oldSchoolPercent: oldSchoolPercent,
                newSchoolPercent: newSchoolPercent
            });
            
            // Move to next month
            currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        }

        // Render chart using D3.js
        const margin = { top: 20, right: 30, bottom: 60, left: 60 };
        const width = Math.max(800, chartContainer.offsetWidth || 800) - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        chartContainer.innerHTML = '';
        const svg = d3.select('#stacked-area-chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleTime()
            .domain([startMonth, endMonth])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(timeSeries, d => d.total)])
            .nice()
            .range([height, 0]);

        // Create area generators
        // Old-school area: from bottom (height) to oldSchool value
        const areaOldSchool = d3.area()
            .x(d => xScale(d.date))
            .y0(height)
            .y1(d => yScale(d.oldSchool))
            .curve(d3.curveMonotoneX);

        // New-school area: from oldSchool value to total value
        const areaNewSchool = d3.area()
            .x(d => xScale(d.date))
            .y0(d => yScale(d.oldSchool))
            .y1(d => yScale(d.total))
            .curve(d3.curveMonotoneX);

        // Draw old-school area (brown, bottom)
        g.append('path')
            .datum(timeSeries)
            .attr('fill', '#8B6F47')
            .attr('opacity', 0.8)
            .attr('d', areaOldSchool)
            .style('cursor', 'pointer');

        // Draw new-school area (pink, top)
        g.append('path')
            .datum(timeSeries)
            .attr('fill', '#E91E63')
            .attr('opacity', 0.8)
            .attr('d', areaNewSchool)
            .style('cursor', 'pointer');

        // Create invisible overlay for tooltips
        const overlay = g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'transparent')
            .style('cursor', 'crosshair');

        // Create tooltip
        const tooltip = d3.select('body').append('div')
            .attr('class', 'stacked-area-tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('padding', '10px')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('z-index', '1000');

        // Add mouse move handler for tooltip
        overlay.on('mousemove', function(event) {
            const [mouseX] = d3.pointer(event, this);
            const hoverDate = xScale.invert(mouseX);
            
            // Find closest data point
            let closestPoint = timeSeries[0];
            let minDistance = Math.abs(timeSeries[0].date - hoverDate);
            
            timeSeries.forEach(d => {
                const distance = Math.abs(d.date - hoverDate);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = d;
                }
            });
            
            const mouseY = d3.pointer(event, this)[1];
            const oldSchoolY = yScale(closestPoint.oldSchool);
            const newSchoolY = yScale(closestPoint.total);
            
            // Determine which area is being hovered
            let hoveredArea = 'both';
            if (mouseY >= oldSchoolY && mouseY <= height) {
                hoveredArea = 'oldSchool';
            } else if (mouseY >= newSchoolY && mouseY <= oldSchoolY) {
                hoveredArea = 'newSchool';
            }
            
            const dateStr = d3.timeFormat('%B %Y')(closestPoint.date);
            const tooltipContent = `
                <div><strong>${dateStr}</strong></div>
                <div style="margin-top: 5px;">
                    <div>Old-school: ${closestPoint.oldSchool} (${closestPoint.oldSchoolPercent}%)</div>
                    <div>New-school: ${closestPoint.newSchool} (${closestPoint.newSchoolPercent}%)</div>
                    <div style="margin-top: 3px; font-size: 11px; opacity: 0.9;">Total: ${closestPoint.total}</div>
                </div>
            `;
            
            tooltip
                .html(tooltipContent)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .style('opacity', 1);
        });

        overlay.on('mouseleave', function() {
            tooltip.style('opacity', 0);
        });

        // Add x-axis
        const xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeMonth.every(6))
            .tickFormat(d3.timeFormat('%Y-%m'));

        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        // Add y-axis
        const yAxis = d3.axisLeft(yScale);
        g.append('g')
            .call(yAxis);

        // Add axis labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Number of Active Businesses');

        g.append('text')
            .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Date');

    } catch (error) {
        console.error('Error creating stacked area chart:', error);
        chartContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: #dc2626;">Error loading chart: ${error.message}</div>`;
    }
}

console.log('Script loaded v3: ' + new Date().toISOString() + ' - Contains: sticky x-axis, tooltip images, closer tooltips');

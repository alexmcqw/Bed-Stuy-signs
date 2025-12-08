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
    // Example annotations - you can customize these
    // Format: addAnnotation(containerId, label, side, targetX%, targetY%, labelY%)
    // side: 'left' or 'right' - which side of the image the label should be on
    // targetX, targetY: position in the image where the arrow should point (percentages)
    // labelY: vertical position of the label (percentage)
    
    // Annotations for first image (storefront2.jpg) - no arrows
    addAnnotation('annotations1', 'Large, clear signage', 'left', 50, 15, 15, false);
    addAnnotation('annotations1', 'Window Display', 'right', 50, 50, 45, false);
    addAnnotation('annotations1', 'Lots of color', 'left', 75, 55, 40, false);
    
    // Annotations for second image (storefront1.jpeg) - no arrows
    addAnnotation('annotations2', 'Minimal text', 'right', 50, 30, 25, false);
    addAnnotation('annotations2', 'Restrained use of color', 'left', 50, 55, 50, false);
    addAnnotation('annotations2', 'Lots of glass', 'right', 25, 80, 75, false);
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

            // Get photo URL and skip if no image
            const photoUrl = row['Photo_URL'] || '';
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
                height: Math.max(400, businesses.length * 20), // Dynamic height based on number of businesses
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
                const svg = timelineContainer.querySelector('svg');
                if (svg) {
                    // Find the x-axis group - it should be near the top
                    const allGroups = Array.from(svg.querySelectorAll('g'));
                    const xAxisGroup = allGroups.find(g => {
                        const transform = g.getAttribute('transform') || '';
                        const match = transform.match(/translate\([^,]+,\s*([\d.]+)\)/);
                        if (match) {
                            const yPos = parseFloat(match[1]);
                            // X-axis should be near the top (within marginTop range)
                            return yPos >= 50 && yPos <= 80;
                        }
                        return false;
                    });
                    
                    if (xAxisGroup) {
                        xAxisGroup.style.position = 'sticky';
                        xAxisGroup.style.top = '0';
                        xAxisGroup.style.zIndex = '100';
                        xAxisGroup.style.backgroundColor = '#f8fafc';
                        xAxisGroup.style.paddingBottom = '15px';
                        xAxisGroup.style.paddingTop = '5px';
                        
                        // Add a backdrop rect for better visibility
                        const svgNS = 'http://www.w3.org/2000/svg';
                        const backdrop = document.createElementNS(svgNS, 'rect');
                        const svgWidth = parseFloat(svg.getAttribute('width') || '1200');
                        backdrop.setAttribute('x', '-200'); // Start before left margin
                        backdrop.setAttribute('y', '-10');
                        backdrop.setAttribute('width', svgWidth.toString());
                        backdrop.setAttribute('height', '70');
                        backdrop.setAttribute('fill', '#f8fafc');
                        backdrop.setAttribute('opacity', '0.95');
                        xAxisGroup.insertBefore(backdrop, xAxisGroup.firstChild);
                    }
                    
                    // Add tooltips to dots by matching y-coordinates
                    const allCircles = Array.from(svg.querySelectorAll('circle'));
                    const marginTop = 60; // Match the marginTop from plot config
                    
                    allCircles.forEach(circle => {
                        const fill = circle.getAttribute('fill');
                        // Only process dots with our business colors
                        if (fill === '#8B6F47' || fill === '#E91E63' || 
                            fill === 'rgb(139, 111, 71)' || fill === 'rgb(233, 30, 99)') {
                            
                            const circleY = parseFloat(circle.getAttribute('cy') || '0');
                            
                            // Match dot to business by y-coordinate
                            // The y value in plotData corresponds to the row position
                            let matchingBusiness = null;
                            let minDistance = Infinity;
                            
                            plotData.forEach(plotItem => {
                                // Calculate the expected y position for this business
                                // Observable Plot uses the y value directly, adjusted by marginTop
                                const expectedY = plotItem.y + marginTop;
                                const distance = Math.abs(circleY - expectedY);
                                
                                if (distance < minDistance && distance < 15) {
                                    minDistance = distance;
                                    matchingBusiness = businesses[plotItem.index];
                                }
                            });
                            
                            if (matchingBusiness) {
                                // Create tooltip
                                const tooltip = document.createElement('div');
                                tooltip.className = 'timeline-dot-tooltip';
                                
                                let tooltipContent = `<strong>${matchingBusiness.name}</strong>`;
                                if (matchingBusiness.photoUrl && matchingBusiness.photoUrl.trim()) {
                                    tooltipContent += `<br><img src="${matchingBusiness.photoUrl}" alt="${matchingBusiness.name}" onerror="this.style.display='none'">`;
                                }
                                
                                tooltip.innerHTML = tooltipContent;
                                document.body.appendChild(tooltip);
                                
                                // Add hover events
                                circle.addEventListener('mouseenter', () => {
                                    tooltip.style.display = 'block';
                                    const rect = circle.getBoundingClientRect();
                                    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                                    
                                    // Adjust if tooltip goes off screen
                                    if (parseFloat(tooltip.style.left) < 10) {
                                        tooltip.style.left = '10px';
                                    }
                                    const maxLeft = window.innerWidth - tooltip.offsetWidth - 10;
                                    if (parseFloat(tooltip.style.left) > maxLeft) {
                                        tooltip.style.left = maxLeft + 'px';
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
                    const bgColor = getOldSchoolGradientColor(item.confidence);
                    const imgDiv = document.createElement('div');
                    const sizeClass = getSizeClass(oldSchoolItemCount);
                    imgDiv.className = `comparison-image-item ${sizeClass}`;
                    imgDiv.style.backgroundColor = bgColor;
                    
                    // Add border for "new" status, similar to map tab
                    const statusLower = (item.status || '').toLowerCase();
                    if (statusLower === 'new') {
                        imgDiv.style.border = '2px solid #5A4A2F'; // Darker brown border for new old-school
                    }
                    
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
                    
                    // Add larger thumbnail to tooltip if item is smaller than normal
                    const tooltipImage = sizeClass !== 'size-normal' 
                        ? `<div class="tooltip-image"><img src="${item.imageUrl}" alt="Storefront preview" loading="lazy"></div>`
                        : '';
                    
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
                    const bgColor = getNewSchoolGradientColor(item.confidence);
                    const imgDiv = document.createElement('div');
                    const sizeClass = getSizeClass(newSchoolItemCount);
                    imgDiv.className = `comparison-image-item ${sizeClass}`;
                    imgDiv.style.backgroundColor = bgColor;
                    
                    // Add border for "new" status, similar to map tab
                    const statusLower = (item.status || '').toLowerCase();
                    if (statusLower === 'new') {
                        imgDiv.style.border = '2px solid #B71C1C'; // Darker pink border for new new-school
                    }
                    
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
                    
                    // Add larger thumbnail to tooltip if item is smaller than normal
                    const tooltipImage = sizeClass !== 'size-normal' 
                        ? `<div class="tooltip-image"><img data-src="${item.imageUrl}" alt="Storefront preview" loading="lazy"></div>`
                        : '';
                    
                    tooltip.innerHTML = `
                        <div class="tooltip-content">
                            ${tooltipImage}
                            <div class="tooltip-row"><strong>Name:</strong> ${item.businessName}</div>
                            <div class="tooltip-row"><strong>Category:</strong> ${item.category}</div>
                            <div class="tooltip-row"><strong>Status:</strong> ${item.status}</div>
                        </div>
                    `;
                    imgDiv.appendChild(tooltip);
                    
                    // Lazy load tooltip images when tooltip is shown
                    if (tooltipImage) {
                        const tooltipImg = tooltip.querySelector('img[data-src]');
                        if (tooltipImg) {
                            imgDiv.addEventListener('mouseenter', function() {
                                if (tooltipImg.getAttribute('data-src') && !tooltipImg.src) {
                                    tooltipImg.src = tooltipImg.getAttribute('data-src');
                                }
                            }, { once: true });
                        }
                    }
                    
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
function getOldSchoolGradientColor(confidence) {
    // Confidence: 100% = medium-dark brown (lighter for better border visibility), 0% = lightest brown
    // Medium-dark brown: #8B6F47 (RGB: 139, 111, 71) - lighter than original dark
    // Lightest brown: #D2B48C (RGB: 210, 180, 140)
    const darkR = 139, darkG = 111, darkB = 71;
    const lightR = 210, lightG = 180, lightB = 140;
    
    const ratio = confidence / 100; // 1.0 for 100%, 0.0 for 0%
    const r = Math.round(darkR + (lightR - darkR) * (1 - ratio));
    const g = Math.round(darkG + (lightG - darkG) * (1 - ratio));
    const b = Math.round(darkB + (lightB - darkB) * (1 - ratio));
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to get new-school gradient color (medium-dark pink to lightest pink)
function getNewSchoolGradientColor(confidence) {
    // Confidence: 100% = medium-dark pink (lighter for better border visibility), 0% = lightest pink
    // Medium-dark pink: #E91E63 (RGB: 233, 30, 99) - lighter than original dark
    // Lightest pink: #F8D7DA (RGB: 248, 215, 218)
    const darkR = 233, darkG = 30, darkB = 99;
    const lightR = 248, lightG = 215, lightB = 218;
    
    const ratio = confidence / 100; // 1.0 for 100%, 0.0 for 0%
    const r = Math.round(darkR + (lightR - darkR) * (1 - ratio));
    const g = Math.round(darkG + (lightG - darkG) * (1 - ratio));
    const b = Math.round(darkB + (lightB - darkB) * (1 - ratio));
    
    return `rgb(${r}, ${g}, ${b})`;
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

        // Group rows by coordinates
        const coordinateGroups = new Map();
        
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

            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            predictedClass = String(predictedClass || '').trim();
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');
            }

            const placeCreationDate = row['placeCreationDate_short'] || row['placeCreationDate'] || '';
            const isOldSchool = predictedClass.includes('Old-school');

            coordinateGroups.get(coordKey).push({
                placeCreationDate,
                isOldSchool,
                predictedClass
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

        // Build nodes and links
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

        // Define 5 phases
        const phases = ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'];

        // Add location nodes (left side)
        multiBusinessGroups.forEach(([coordKey, businesses], idx) => {
            // Determine dominant typography
            const oldSchoolCount = businesses.filter(b => b.isOldSchool).length;
            const isOldSchoolDominant = oldSchoolCount >= businesses.length / 2;
            
            const nodeId = `location-${idx}`;
            nodeMap.set(nodeId, {
                id: nodeId,
                name: `Location ${idx + 1}`,
                type: 'location',
                isOldSchool: isOldSchoolDominant,
                businessCount: businesses.length
            });
            nodes.push(nodeMap.get(nodeId));
        });

        // Add phase nodes (5 columns)
        phases.forEach((phaseName, phaseIdx) => {
            const nodeId = `phase-${phaseIdx}`;
            nodeMap.set(nodeId, {
                id: nodeId,
                name: phaseName,
                type: 'phase',
                index: phaseIdx
            });
            nodes.push(nodeMap.get(nodeId));
        });

        // Create links from locations to phases based on business order
        multiBusinessGroups.forEach(([coordKey, businesses], locationIdx) => {
            businesses.forEach((business, businessOrder) => {
                // businessOrder is 0-indexed, so add 1 to get phase number (1-5)
                const phaseNumber = businessOrder + 1;
                
                // Only create links for phases 1-5
                if (phaseNumber <= 5) {
                    const sourceId = `location-${locationIdx}`;
                    const targetId = `phase-${phaseNumber - 1}`; // phaseIdx is 0-indexed
                    
                    // Check if link already exists
                    const existingLink = links.find(l => 
                        l.source === sourceId && l.target === targetId
                    );

                    if (existingLink) {
                        existingLink.value += 1;
                    } else {
                        links.push({
                            source: sourceId,
                            target: targetId,
                            value: 1,
                            isOldSchool: business.isOldSchool
                        });
                    }
                }
            });
        });

        // Render Sankey diagram using D3.js
        const width = Math.max(1400, sankeyContainer.offsetWidth || 1400);
        const height = Math.max(600, multiBusinessGroups.length * 15 + 200);

        sankeyContainer.innerHTML = '';
        const svg = d3.select('#sankey-diagram')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create a simple flow diagram (custom Sankey-like visualization)
        const locationNodes = nodes.filter(n => n.type === 'location');
        const phaseNodes = nodes.filter(n => n.type === 'phase');

        const leftMargin = 50;
        const rightMargin = 50;
        const topMargin = 50;
        const nodeHeight = 15;
        const nodeSpacing = 5;
        const leftX = leftMargin;
        const columnWidth = (width - leftMargin - rightMargin - 150) / 5; // Divide remaining space into 5 columns
        const columnSpacing = columnWidth;

        // Draw location nodes (left)
        locationNodes.forEach((node, i) => {
            const y = topMargin + i * (nodeHeight + nodeSpacing);
            const color = node.isOldSchool ? '#8B6F47' : '#E91E63';
            
            svg.append('rect')
                .attr('x', leftX)
                .attr('y', y)
                .attr('width', 150)
                .attr('height', nodeHeight)
                .attr('fill', color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);

            svg.append('text')
                .attr('x', leftX + 5)
                .attr('y', y + nodeHeight / 2)
                .attr('dy', '0.35em')
                .attr('fill', '#fff')
                .attr('font-size', '10px')
                .text(`${node.name} (${node.businessCount})`);
        });

        // Draw phase nodes (5 columns)
        phaseNodes.forEach((node, phaseIdx) => {
            const phaseX = leftX + 150 + phaseIdx * columnSpacing + 20; // Start after location column, add spacing
            const phaseY = topMargin; // All phases at the top
            
            svg.append('rect')
                .attr('x', phaseX)
                .attr('y', phaseY)
                .attr('width', 100)
                .attr('height', nodeHeight)
                .attr('fill', '#94a3b8')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);

            svg.append('text')
                .attr('x', phaseX + 5)
                .attr('y', phaseY + nodeHeight / 2)
                .attr('dy', '0.35em')
                .attr('fill', '#fff')
                .attr('font-size', '10px')
                .text(node.name);
        });

        // Draw links - connect from locations to phase columns
        const link = svg.append('g').selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('d', d => {
                const sourceNode = nodeMap.get(d.source);
                const targetNode = nodeMap.get(d.target);
                const sourceIdx = locationNodes.indexOf(sourceNode);
                const targetPhaseIdx = targetNode.index;
                
                const sourceY = topMargin + sourceIdx * (nodeHeight + nodeSpacing) + nodeHeight / 2;
                const targetX = leftX + 150 + targetPhaseIdx * columnSpacing + 20 + 50; // Center of phase column
                const targetY = sourceY; // Keep same vertical position as source
                
                const midX = (leftX + 150 + targetX) / 2;
                
                return `M ${leftX + 150} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
            })
            .attr('fill', 'none')
            .attr('stroke', d => d.isOldSchool ? '#8B6F47' : '#E91E63')
            .attr('stroke-width', d => Math.max(1, d.value * 2))
            .attr('stroke-opacity', 0.6);

    } catch (error) {
        console.error('Error creating Sankey diagram:', error);
        sankeyContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: #dc2626;">Error loading turnover flow diagram.</div>';
    }
}

console.log('Script loaded v2: ' + new Date().toISOString() + ' - Contains: CUNY Graduate Center, Lots of color, 5 phases');

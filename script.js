// Annotation Helper Function
// side: 'left' or 'right' - which side of the image the label should be on
// targetX, targetY: position in the image where the arrow should point (percentages)
// labelY: vertical position of the label (percentage)
function addAnnotation(containerId, label, side, targetX, targetY, labelY) {
    const container = document.getElementById(containerId);
    if (!container) return;

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
    
    // Create arrow SVG
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
    
    container.appendChild(annotation);
}

// Initialize annotations when page loads
function initAnnotations() {
    // Example annotations - you can customize these
    // Format: addAnnotation(containerId, label, side, targetX%, targetY%, labelY%)
    // side: 'left' or 'right' - which side of the image the label should be on
    // targetX, targetY: position in the image where the arrow should point (percentages)
    // labelY: vertical position of the label (percentage)
    
    // Annotations for first image (storefront2.jpg)
    addAnnotation('annotations1', 'Storefront Sign', 'left', 50, 25, 20);
    addAnnotation('annotations1', 'Window Display', 'right', 50, 50, 45);
    addAnnotation('annotations1', 'Doorway', 'left', 50, 85, 70);
    
    // Annotations for second image (storefront1.jpeg)
    addAnnotation('annotations2', 'Typography Style', 'right', 50, 30, 25);
    addAnnotation('annotations2', 'Color Scheme', 'left', 50, 55, 50);
    addAnnotation('annotations2', 'Architectural Detail', 'right', 50, 80, 75);
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
                placeStatus: placeStatus
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
                    endYear: business.endYear
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

            timelineContainer.appendChild(plot);
            
            // Make x-axis sticky after plot is rendered
            setTimeout(() => {
                const svg = timelineContainer.querySelector('svg');
                if (svg) {
                    // Find x-axis group (usually the first g element with transform)
                    const xAxisGroups = svg.querySelectorAll('g[transform*="translate"]');
                    if (xAxisGroups.length > 0) {
                        // The top axis should be one of the first groups
                        const topAxis = Array.from(xAxisGroups).find(g => {
                            const transform = g.getAttribute('transform') || '';
                            // Check if it's positioned at the top (y translation near 0 or small)
                            return transform.includes('translate(0') || transform.includes('translate(');
                        });
                        if (topAxis) {
                            topAxis.style.position = 'sticky';
                            topAxis.style.top = '0';
                            topAxis.style.zIndex = '10';
                            topAxis.style.backgroundColor = '#f8fafc';
                        }
                    }
                }
            }, 100);
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

        // Get all column names to find column AE (index 30, 0-indexed)
        const headers = parsed.meta.fields || Object.keys(parsed.data[0] || {});
        const columnAE = headers[30]; // Column AE is the 31st column (0-indexed: 30)
        
        // Try to find confidence column (common names)
        const confidenceCol = headers.find(h => 
            h && (h.toLowerCase().includes('confidence') || 
                 h.toLowerCase().includes('prediction confidence') ||
                 h.toLowerCase().includes('confidence score'))
        ) || headers.find((h, i) => i === 31); // Try column AF as fallback

        console.log('Column AE:', columnAE);
        console.log('Confidence column:', confidenceCol);
        console.log('All headers:', headers);

        // Filter and process data
        const imageData = parsed.data
            .filter(row => {
                const imageUrl = row[columnAE] || row['Photo_URL'] || '';
                const predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
                return imageUrl && imageUrl.trim() && predictedClass;
            })
            .map(row => {
                const imageUrl = row[columnAE] || row['Photo_URL'] || '';
                let predictedClass = (row['Predicted Class'] || '').trim().replace(/^[01]\s+/, '');
                const isOldSchool = predictedClass.toLowerCase().includes('old-school');
                
                // Get confidence (try to parse as percentage or decimal)
                let confidence = 0;
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
                
                return {
                    imageUrl: imageUrl.trim(),
                    predictedClass,
                    isOldSchool,
                    confidence: confidence || 50 // Default to 50% if not found
                };
            });

        // Separate old-school and new-school
        const oldSchool = imageData.filter(d => d.isOldSchool).sort((a, b) => b.confidence - a.confidence);
        const newSchool = imageData.filter(d => !d.isOldSchool).sort((a, b) => b.confidence - a.confidence);

        // Create visualization
        const maxLength = Math.max(oldSchool.length, newSchool.length);
        
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

        // Render images with gradient backgrounds
        for (let i = 0; i < maxLength; i++) {
            // Old-school image
            if (i < oldSchool.length) {
                const item = oldSchool[i];
                const gradientPercent = (item.confidence / 100) * 100;
                const bgColor = getOldSchoolGradientColor(item.confidence);
                
                const imgDiv = document.createElement('div');
                imgDiv.className = 'comparison-image-item';
                imgDiv.style.backgroundColor = bgColor;
                imgDiv.innerHTML = `
                    <img src="${item.imageUrl}" alt="Old-school storefront" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'image-error\\'>Image unavailable</div>';">
                    <div class="confidence-label">${Math.round(item.confidence)}%</div>
                `;
                oldSchoolContainer.appendChild(imgDiv);
            } else {
                // Empty placeholder to maintain alignment
                const placeholder = document.createElement('div');
                placeholder.className = 'comparison-image-item empty';
                oldSchoolContainer.appendChild(placeholder);
            }

            // New-school image
            if (i < newSchool.length) {
                const item = newSchool[i];
                const bgColor = getNewSchoolGradientColor(item.confidence);
                
                const imgDiv = document.createElement('div');
                imgDiv.className = 'comparison-image-item';
                imgDiv.style.backgroundColor = bgColor;
                imgDiv.innerHTML = `
                    <img src="${item.imageUrl}" alt="New-school storefront" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'image-error\\'>Image unavailable</div>';">
                    <div class="confidence-label">${Math.round(item.confidence)}%</div>
                `;
                newSchoolContainer.appendChild(imgDiv);
            } else {
                // Empty placeholder to maintain alignment
                const placeholder = document.createElement('div');
                placeholder.className = 'comparison-image-item empty';
                newSchoolContainer.appendChild(placeholder);
            }
        }

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
    // Confidence: 100% = darkest brown, 0% = lightest brown
    // Dark brown: #5A4A2F (RGB: 90, 74, 47)
    // Lightest brown: #D2B48C (RGB: 210, 180, 140)
    const darkR = 90, darkG = 74, darkB = 47;
    const lightR = 210, lightG = 180, lightB = 140;
    
    const ratio = confidence / 100; // 1.0 for 100%, 0.0 for 0%
    const r = Math.round(darkR + (lightR - darkR) * (1 - ratio));
    const g = Math.round(darkG + (lightG - darkG) * (1 - ratio));
    const b = Math.round(darkB + (lightB - darkB) * (1 - ratio));
    
    return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to get new-school gradient color (dark-pink to lightest pink)
function getNewSchoolGradientColor(confidence) {
    // Confidence: 100% = darkest pink, 0% = lightest pink
    // Dark pink: #B71C1C (RGB: 183, 28, 28)
    // Lightest pink: #F8D7DA (RGB: 248, 215, 218)
    const darkR = 183, darkG = 28, darkB = 28;
    const lightR = 248, lightG = 215, lightB = 218;
    
    const ratio = confidence / 100; // 1.0 for 100%, 0.0 for 0%
    const r = Math.round(darkR + (lightR - darkR) * (1 - ratio));
    const g = Math.round(darkG + (lightG - darkG) * (1 - ratio));
    const b = Math.round(darkB + (lightB - darkB) * (1 - ratio));
    
    return `rgb(${r}, ${g}, ${b})`;
}


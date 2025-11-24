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
            // Try multiple possible column name variations
            let predictedClass = row['Predicted Class'] || row['PredictedClass'] || row['predicted class'] || '';
            
            // Convert to string and trim
            predictedClass = String(predictedClass || '').trim();
            
            // Remove leading numeral (0 or 1) and space from Predicted Class
            if (predictedClass) {
                predictedClass = predictedClass.replace(/^[01]\s+/, '');  // Match one or more spaces after 0/1
            }
            
            const confidence = parseFloat(row['Prediction Confidence']) || 0;
            const oldSchoolProb = parseFloat(row['Old-school Probability']) || 0;
            const newSchoolProb = parseFloat(row['New-school Probability']) || 0;
            const status = row['Status_simplified'] || '';
            const name = row['LiveXYZSeptember132025_XYTableToPoint_name'] || row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] || 'Unknown';
            const address = row['LiveXYZSeptember132025_XYTableToPoint_address'] || '';
            const postcode = row['LiveXYZSeptember132025_XYTableToPoint_postcode'] || '';
            const category = row['LiveXYZSeptember132025_XYTableToPoint_subcategoriesPrimary_name'] || 
                           row['LiveXYZSeptember132025_XYTableToPoint_categoriesPrimary_name'] || '';

            // Determine if Old-school or New-school
            const isOldSchool = predictedClass.includes('Old-school') || oldSchoolProb > newSchoolProb;

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
let timelineData = null;

async function loadTimelineData() {
    if (timelineData) return timelineData; // Cache data
    
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

        timelineData = parsed.data;
        return timelineData;
    } catch (error) {
        console.error('Error loading timeline data:', error);
        return [];
    }
}

function parseDate(dateString) {
    if (!dateString || dateString.trim() === '') return null;
    
    // Try ISO format first (e.g., "2016-12-13T16:30:03Z")
    if (dateString.includes('T')) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    }
    
    // Try M/D/YYYY format (e.g., "3/24/2015")
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1; // Month is 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
    }
    
    return null;
}

function getYearFromDate(date) {
    if (!date) return null;
    return date.getFullYear();
}

async function initTimeline() {
    const timelineContainer = document.getElementById('timeline-visualization');
    if (!timelineContainer || timelineContainer.dataset.initialized === 'true') return;

    timelineContainer.innerHTML = '<p style="padding: 2rem; text-align: center; color: #64748b;">Loading timeline data...</p>';
    timelineContainer.dataset.initialized = 'true';

    // Load CSV data
    const data = await loadTimelineData();
    
    timelineContainer.innerHTML = '';
    
    // Process data into timeline items
    const stores = [];
    const minYear = 2000;
    const maxYear = 2024;
    const yearRange = maxYear - minYear;

    data.forEach(row => {
        // Only include rows with photos (same filter as map)
        const photoUrl = row['Photo_URL'] || '';
        if (!photoUrl || photoUrl.trim() === '') return;

        const status = row['Status_simplified'] || '';
        
        // Filter out rows that don't have 'new' or 'closed' status
        const statusLower = status.toLowerCase();
        if (statusLower !== 'new' && statusLower !== 'closed') {
            return;
        }
        
        const name = row['LiveXYZSeptember132025_XYTableToPoint_name'] || 
                    row['LiveXYZSeptember132025_XYTableToPoint_resolvedName'] || 
                    'Unknown';
        
        // Get predicted class and determine if old-school or new-school
        let predictedClass = row['Predicted Class'] || '';
        predictedClass = String(predictedClass || '').trim().replace(/^[01]\s+/, '');
        const isOldSchool = predictedClass.includes('Old-school');
        const type = isOldSchool ? 'old-school' : 'new-school';

        let startYear = null;
        let endYear = null;
        let isOpen = false;

        if (status && status.toLowerCase() === 'closed') {
            // Closed: no opening date, line extends left to edge
            // End date is from verifiedTimesLast (column J)
            const verifiedDate = parseDate(row['LiveXYZSeptember132025_XYTableToPoint_verifiedTimesLast'] || '');
            endYear = verifiedDate ? getYearFromDate(verifiedDate) : null;
            startYear = minYear; // Extend to left edge
            isOpen = false;
        } else if (status && status.toLowerCase() === 'new') {
            // New: opening date from spaceCreationDate_short (column P), no closing date
            const createdDate = parseDate(row['spaceCreationDate_short'] || '');
            startYear = createdDate ? getYearFromDate(createdDate) : null;
            endYear = maxYear; // Extend to right edge
            isOpen = true;
        } else {
            // Other statuses: skip for now or handle differently
            return;
        }

        // Skip if we don't have valid dates
        if (!startYear || !endYear) return;

        // Determine the dot date (the date that has the dot)
        let dotYear = null;
        if (status && status.toLowerCase() === 'closed') {
            dotYear = endYear; // Dot is at the end (verified date)
        } else if (status && status.toLowerCase() === 'new') {
            dotYear = startYear; // Dot is at the start (creation date)
        }

        stores.push({
            name: name,
            type: type,
            startYear: startYear,
            endYear: endYear,
            isOpen: isOpen,
            dotYear: dotYear,
            status: status.toLowerCase()
        });
    });

    // Sort by dot date (oldest on top, newest at bottom)
    stores.sort((a, b) => {
        if (a.dotYear !== b.dotYear) {
            return a.dotYear - b.dotYear;
        }
        // If same year, sort by name as tiebreaker
        return a.name.localeCompare(b.name);
    });

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

        // Start dot (only show if not at left edge) - for closed businesses
        if (store.status === 'closed' && store.startYear > minYear) {
            const startDot = document.createElement('div');
            startDot.className = `timeline-dot start ${store.type}`;
            startDot.style.left = startPercent + '%';
            lineContainer.appendChild(startDot);
        }

        // End dot - for closed businesses (at verified date) or new businesses (at creation date or right edge)
        if (store.status === 'closed' && store.endYear < maxYear) {
            const endDot = document.createElement('div');
            endDot.className = `timeline-dot end ${store.type}`;
            endDot.style.left = endPercent + '%';
            lineContainer.appendChild(endDot);
        } else if (store.status === 'new') {
            // For new businesses, show dot at creation date (start) or at right edge if at maxYear
            const dotPercent = store.startYear === minYear ? endPercent : startPercent;
            const endDot = document.createElement('div');
            endDot.className = `timeline-dot end ${store.type}`;
            endDot.style.left = dotPercent + '%';
            lineContainer.appendChild(endDot);
        }

        item.appendChild(lineContainer);

        // Years display
        const yearsDiv = document.createElement('div');
        yearsDiv.className = 'timeline-years';
        const startYearDisplay = store.startYear === minYear ? '—' : store.startYear;
        const endYearDisplay = store.endYear === maxYear ? '—' : store.endYear;
        yearsDiv.innerHTML = `
            <span>${startYearDisplay}</span>
            <span>${endYearDisplay}</span>
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


// Sankey Diagram for Turnover Flow
async function initSankeyDiagram() {
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

        // Extract all unique dates and sort them
        const allDates = new Set();
        multiBusinessGroups.forEach(([_, businesses]) => {
            businesses.forEach(b => {
                if (b.placeCreationDate) {
                    allDates.add(b.placeCreationDate);
                }
            });
        });

        // Sort dates and create time periods
        const sortedDates = Array.from(allDates).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        // Group dates into periods (e.g., by year or quarter)
        const datePeriods = {};
        sortedDates.forEach(dateStr => {
            try {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                const periodKey = `${year}-Q${quarter}`;
                
                if (!datePeriods[periodKey]) {
                    datePeriods[periodKey] = [];
                }
                datePeriods[periodKey].push(dateStr);
            } catch (e) {
                // If date parsing fails, use the date string as-is
                const periodKey = dateStr.substring(0, 7); // Use YYYY-MM format
                if (!datePeriods[periodKey]) {
                    datePeriods[periodKey] = [];
                }
                datePeriods[periodKey].push(dateStr);
            }
        });

        const periodKeys = Object.keys(datePeriods).sort();

        // Build nodes and links
        const nodes = [];
        const links = [];
        const nodeMap = new Map();

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

        // Add time period nodes (right side)
        periodKeys.forEach((periodKey, idx) => {
            const nodeId = `period-${idx}`;
            nodeMap.set(nodeId, {
                id: nodeId,
                name: periodKey,
                type: 'period',
                index: idx
            });
            nodes.push(nodeMap.get(nodeId));
        });

        // Create links from locations to time periods
        multiBusinessGroups.forEach(([coordKey, businesses], locationIdx) => {
            businesses.forEach(business => {
                if (!business.placeCreationDate) return;

                // Find which period this date belongs to
                let targetPeriodIdx = -1;
                periodKeys.forEach((periodKey, idx) => {
                    if (datePeriods[periodKey].includes(business.placeCreationDate)) {
                        targetPeriodIdx = idx;
                    }
                });

                if (targetPeriodIdx >= 0) {
                    const sourceId = `location-${locationIdx}`;
                    const targetId = `period-${targetPeriodIdx}`;
                    
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
        const width = Math.max(1200, sankeyContainer.offsetWidth || 1200);
        const height = Math.max(600, multiBusinessGroups.length * 15 + 200);

        sankeyContainer.innerHTML = '';
        const svg = d3.select('#sankey-diagram')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create a simple flow diagram (custom Sankey-like visualization)
        const locationNodes = nodes.filter(n => n.type === 'location');
        const periodNodes = nodes.filter(n => n.type === 'period');

        const leftMargin = 50;
        const rightMargin = 50;
        const topMargin = 50;
        const nodeHeight = 15;
        const nodeSpacing = 5;
        const leftX = leftMargin;
        const rightX = width - rightMargin - 200;

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

        // Draw period nodes (right)
        periodNodes.forEach((node, i) => {
            const y = topMargin + i * (nodeHeight + nodeSpacing * 2);
            
            svg.append('rect')
                .attr('x', rightX)
                .attr('y', y)
                .attr('width', 80)
                .attr('height', nodeHeight)
                .attr('fill', '#94a3b8')
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);

            svg.append('text')
                .attr('x', rightX + 5)
                .attr('y', y + nodeHeight / 2)
                .attr('dy', '0.35em')
                .attr('fill', '#fff')
                .attr('font-size', '10px')
                .text(node.name);
        });

        // Draw links
        const link = svg.append('g').selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('d', d => {
                const sourceNode = nodeMap.get(d.source);
                const targetNode = nodeMap.get(d.target);
                const sourceIdx = locationNodes.indexOf(sourceNode);
                const targetIdx = periodNodes.indexOf(targetNode);
                
                const sourceY = topMargin + sourceIdx * (nodeHeight + nodeSpacing) + nodeHeight / 2;
                const targetY = topMargin + targetIdx * (nodeHeight + nodeSpacing * 2) + nodeHeight / 2;
                
                const midX = (leftX + 150 + rightX) / 2;
                
                return `M ${leftX + 150} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${rightX} ${targetY}`;
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










export class ChartManager {
    createLineChart(canvasId, options) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const chart = {
            canvas,
            ctx,
            data: {
                labels: [],
                values: [],
                options
            },
            draw: function () {
                const { width, height } = this.canvas;
                const padding = 40;
                const chartWidth = width - (padding * 2);
                const chartHeight = height - (padding * 2);

                // Clear canvas
                this.ctx.clearRect(0, 0, width, height);

                if (this.data.values.length === 0) return;

                // Calculate scales
                const maxValue = Math.max(...this.data.values);
                const yScale = chartHeight / maxValue;
                const xStep = chartWidth / (this.data.values.length - 1);

                // Draw axes
                this.ctx.beginPath();
                this.ctx.strokeStyle = '#ccc';
                this.ctx.moveTo(padding, padding);
                this.ctx.lineTo(padding, height - padding);
                this.ctx.lineTo(width - padding, height - padding);
                this.ctx.stroke();

                // Draw line
                this.ctx.beginPath();
                this.ctx.strokeStyle = options.borderColor;
                this.ctx.lineWidth = 2;

                this.data.values.forEach((value, index) => {
                    const x = padding + (index * xStep);
                    const y = height - padding - (value * yScale);

                    if (index === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                });

                this.ctx.stroke();

                // Draw labels
                this.ctx.fillStyle = '#666';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';

                // X-axis labels
                this.data.labels.forEach((label, index) => {
                    const x = padding + (index * xStep);
                    this.ctx.fillText(label, x, height - padding + 20);
                });

                // Y-axis labels
                const yStep = maxValue / 5;
                for (let i = 0; i <= 5; i++) {
                    const value = Math.round(i * yStep);
                    const y = height - padding - (value * yScale);
                    this.ctx.fillText(value.toLocaleString(), padding - 25, y + 5);
                }
            }
        };

        return chart;
    }

    createDoughnutChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const chart = {
            canvas,
            ctx,
            data: {
                labels: [],
                values: []
            },
            colors: ['#1a237e', '#0d47a1', '#1565c0', '#1976d2', '#1e88e5'],
            draw: function () {
                const { width, height } = this.canvas;
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 3;
                const innerRadius = radius * 0.6;

                // Clear canvas
                this.ctx.clearRect(0, 0, width, height);

                if (this.data.values.length === 0) return;

                // Calculate total
                const total = this.data.values.reduce((sum, value) => sum + value, 0);
                let startAngle = 0;

                // Draw segments
                this.data.values.forEach((value, index) => {
                    const sliceAngle = (2 * Math.PI * value) / total;

                    // Draw segment
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.colors[index % this.colors.length];
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                    this.ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // Draw label
                    const labelAngle = startAngle + (sliceAngle / 2);
                    const labelRadius = radius + 30;
                    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                    const labelY = centerY + Math.sin(labelAngle) * labelRadius;

                    this.ctx.fillStyle = '#333';
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(this.data.labels[index], labelX, labelY);
                    this.ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY + 15);

                    startAngle += sliceAngle;
                });
            }
        };

        return chart;
    }

    createPieChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const chart = {
            canvas,
            ctx,
            data: {
                labels: [],
                values: []
            },
            colors: ['#00897b', '#00acc1', '#26c6da', '#4dd0e1', '#80deea'],
            draw: function () {
                const { width, height } = this.canvas;
                const centerX = width / 2;
                const centerY = height / 2;
                const radius = Math.min(width, height) / 3;

                // Clear canvas
                this.ctx.clearRect(0, 0, width, height);

                if (this.data.values.length === 0) return;

                // Calculate total
                const total = this.data.values.reduce((sum, value) => sum + value, 0);
                let startAngle = 0;

                // Draw segments
                this.data.values.forEach((value, index) => {
                    const sliceAngle = (2 * Math.PI * value) / total;

                    // Draw segment
                    this.ctx.beginPath();
                    this.ctx.fillStyle = this.colors[index % this.colors.length];
                    this.ctx.moveTo(centerX, centerY);
                    this.ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                    this.ctx.closePath();
                    this.ctx.fill();

                    // Draw label
                    const labelAngle = startAngle + (sliceAngle / 2);
                    const labelRadius = radius + 30;
                    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
                    const labelY = centerY + Math.sin(labelAngle) * labelRadius;

                    this.ctx.fillStyle = '#333';
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(this.data.labels[index], labelX, labelY);
                    this.ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY + 15);

                    startAngle += sliceAngle;
                });
            }
        };

        return chart;
    }

    updateLineChart(chart, data) {
        chart.data.labels = data.labels;
        chart.data.values = data.data;
        chart.draw();
    }

    updateDoughnutChart(chart, data) {
        chart.data.labels = data.labels;
        chart.data.values = data.data;
        chart.draw();
    }

    updatePieChart(chart, data) {
        chart.data.labels = data.labels;
        chart.data.values = data.data;
        chart.draw();
    }
}
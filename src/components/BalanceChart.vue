<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'vue-chartjs'
import { useLeaveCalculations } from '../composables/useLeaveCalculations'
import { useLeaveStore } from '../stores/leaveStore'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Register the plugin
)

const store = useLeaveStore()
const { rows } = useLeaveCalculations()

const chartData = computed(() => {
  return {
    labels: rows.value.map(row => row.displayMonth),
    datasets: [
      {
        label: 'Projected Balance (Hours)',
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        data: rows.value.map(row => row.closingBalance),
        tension: 0.1
      }
    ]
  }
})

const chartOptions = computed(() => {
  const fyStartMonth = store.settings.financialYearStartMonth || 7

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Leave Balance Projection'
      },
      tooltip: {
        callbacks: {
          // Add leave descriptions to the tooltip footer
          footer: (tooltipItems: TooltipItem<'line'>[]) => {
            const item = tooltipItems[0]
            if (!item) return ''

            const rowIndex = item.dataIndex
            const rowData = rows.value[rowIndex]

            if (rowData && rowData.leaveDescriptions.length > 0) {
              return rowData.leaveDescriptions.join('\n')
            }
            return ''
          }
        }
      },
      // Configure the datalabels plugin
      datalabels: {
        // Display labels only if there are leave descriptions
        display: (context: any) => {
          const rowIndex = context.dataIndex
          const rowData = rows.value[rowIndex]
          return rowData && rowData.leaveDescriptions.length > 0
        },
        // Format the label content
        formatter: (_value: any, context: any) => {
          const rowIndex = context.dataIndex
          const rowData = rows.value[rowIndex]
          return rowData.leaveDescriptions.join(', ')
        },
        // Position the label above the point
        align: 'start' as const,
        anchor: 'start' as const,
        rotation: -45, // Rotate the label
        offset: 8,
        // Style the label
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 4,
        padding: 4,
        color: '#4b5563',
        font: {
          size: 10,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      },
      x: {
        grid: {
          color: (context: any) => {
            const index = context.index
            const rowData = rows.value[index]
            if (!rowData) return 'rgba(0, 0, 0, 0.1)' // Default grid color

            const [_, month] = rowData.monthKey.split('-').map(Number)

            // Highlight the start of the financial year
            if (month === fyStartMonth) {
              return 'rgba(255, 99, 132, 0.8)' // Reddish color for FY start
            }

            return 'rgba(0, 0, 0, 0.1)' // Default grid color
          },
          lineWidth: (context: any) => {
            const index = context.index
            const rowData = rows.value[index]
            if (!rowData) return 1

            const [_, month] = rowData.monthKey.split('-').map(Number)

            if (month === fyStartMonth) {
              return 2 // Thicker line for FY start
            }
            return 1
          }
        }
      }
    }
  }
})
</script>

<template>
  <div class="bg-white shadow rounded-lg p-4 h-96">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

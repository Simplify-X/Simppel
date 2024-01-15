import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const DisplayAnalysisResults = ({ results }) => {
  const data = {
    labels: Object.keys(results),
    datasets: [
      {
        label: 'SEO Analysis Results',
        data: Object.values(results).map(result => (result.passed ? 100 : 0)),
        backgroundColor: Object.values(results).map(result => (result.passed ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)')),
        borderColor: Object.values(results).map(result => (result.passed ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Grid container spacing={4}>
      {Object.entries(results).map(([key, value]) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card raised>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {key.replace(/([A-Z])/g, ' $1').trim()} {/* Converts camelCase to normal text */}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {value.message}
              </Typography>
              <Bar data={data} options={options} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

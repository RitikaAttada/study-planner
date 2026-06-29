import * as Recharts from 'recharts';
const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = Recharts;

const COLORS = ['#810B38', '#541A1A', '#5C766D', '#0A2947', '#C2A56D', '#2FA4D7', '#574964', '#3E3F29'];

const TaskPieChart = ({ tasks, title }) => {
    
  const data = tasks
  .filter(t => t.completed)
  .map(t => ({
    name: t.title,
    value: Number(t.plannedMinutes) || 30
  }));
  console.log('tasks received:', tasks);
  console.log('data for chart:', data);
  if (data.length === 0) {
    return (
      <div className="chart-box">
        <h3>{title}</h3>
        <p className="no-chart-data">No completed tasks yet!</p>
      </div>
    );
  }
  

  return (
    <div className="chart-box">
      <h3>{title}</h3>
      <div style={{width:'100%', height:250}}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} mins`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskPieChart;
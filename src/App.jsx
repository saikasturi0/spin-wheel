import { useEffect, useState } from "react"
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, PieController, Title, Tooltip, Legend} from 'chart.js';
import "./App.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PieController,
  ChartDataLabels
);

function App() {
  const [values,setValues] = useState([]);  
  const [input,setInput] = useState("");
  const [chartInstance,setChartInstance] = useState(null);
  const [rotation,setRotation] = useState(0);

useEffect(() => {
  if (chartInstance) chartInstance.destroy();

  if (values.length > 0) {
    const arrVal = Array(values.length).fill(360 / values.length);

    const colors = [
      "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FFB5E8",
      "#FF8E72", "#B28DFF", "#FF6F91", "#FFC75F", "#00C9A7"
    ];

    const segmentColors = values.map((_, index) => colors[index % colors.length]);

    const ctx = document.getElementById("wheel").getContext("2d");

    const newChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: values,
        datasets: [{
          label: "Spin",
          data: arrVal,
          backgroundColor: segmentColors,
          borderColor: "#fff", 
          borderWidth: 3,
          hoverOffset: 15,    
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          datalabels: {
            formatter: (value, context) =>
              context.chart.data.labels[context.dataIndex],
            color: "#333",
            font: {
              size: 18,
              weight: "bold",
              family: "Poppins"
            },
          },
        },
      },
      plugins: [{
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(0,0,0,0.2)";
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.restore();
        }
      }]
    });

    setChartInstance(newChartInstance);
  }
}, [values]);


  function mywheel(e){
    if(values.length > 9){
      alert("you can only enter maximum 10 items");
      return;
    }
    e.preventDefault();
    setValues((prevalues) => [...prevalues,input]);
    setInput("");
  }

  function spin(){
    const newRotation = rotation + 360 * 3 + Math.floor(Math.random() * 360);
    setRotation(newRotation);
  }

  return (
    <>
    <br />
    <div className="h-[750px] w-full">
      <h1 className="text-[35px]" id="title">Welcome To customization Spin Wheel</h1>

      <div className="flex mr-[500px] ml-[570px] mt-[50px]">
        <input type="text" name="" id="" value={input} onChange={(e)=>setInput(e.target.value)}
        className="border-1 h-[30px] w-[200px] ml-6 mt-6 mb-6 mr-4 rounded-[5px]" />
        <button 
        onClick={(e)=>mywheel(e)}
        className="border-1 h-[30px] w-[70px] mt-6 mr-6 mb-6 rounded-[5px] p-0.5">Add</button>
      </div>

        <div
          className={`${values.length === 0 ? "" : "h-[100px] w-[100px] bg-purple-700 absolute left-[930px] top-[370px] arrow-sway"}`}
          style={{ clipPath: "polygon(0 54%, 100% 65%, 100% 44%)" }}
        ></div>

      <div className="h-[400px] w-[400px] ml-[530px] mt-[20px] transition-transform duration-[3000ms] ease-out"
           style={{ transform: `rotate(${rotation}deg)` }}>
      <canvas id="wheel"></canvas>
      </div>

      <button 
      onClick={() => spin()}
      className="h-[50px] w-[150px] rounded-[5px] ml-[658px] border-1 mt-[40px] bg-blue-500 text-white text-2xl "
      >Spin</button>
    </div>
    </>
  )
}

export default App

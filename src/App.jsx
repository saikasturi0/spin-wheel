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

const handleKeyDown = (e) => {
   if (e.key === "Enter") {
     mywheel(e);
   }
 };
  function spin(){
    const newRotation = rotation + 360 * 3 + Math.floor(Math.random() * 360);
    setRotation(newRotation);
  }

  return (
    <>
    <br />
    <div className="min-h-screen w-full flex flex-col items-center py-6 px-4">
      <h1 className="text-[28px] sm:text-[35px] mb-6 text-center" id="title">
        Welcome To Customization Spin Wheel
      </h1>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border-2 border-black h-[40px] w-[80vw] sm:w-[250px] rounded-[5px] px-2"
          placeholder="Enter item"
        />
        <button
          onClick={(e) => mywheel(e)}
          className="h-[40px] w-[100px] rounded-[5px] spin-btn"
        >
          Add
        </button>
      </div>

      {/* Wheel with Arrow */}
      <div className="relative mt-8 flex justify-center">
        {/* Arrow */}
        {values.length > 0 && (
          <div
            className="bg-purple-700 arrow-sway absolute right-[-40px] top-1/2 -translate-y-1/2"
            style={{
              width: "40px",
              height: "40px",
              clipPath: "polygon(0 54%, 100% 65%, 100% 44%)",
            }}
          ></div>
        )}

        {/* Wheel */}
        <div
          className="transition-transform duration-[3000ms] ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            width: values.length > 0 ? "min(80vw, 400px)" : "0px",
            height: values.length > 0 ? "min(80vw, 400px)" : "0px",
          }}
        >
          <canvas id="wheel"></canvas>
        </div>
      </div>

      {/* Spin Button */}
      {values.length > 0 && (
        <button
          onClick={() => spin()}
          className="h-[45px] w-[140px] rounded-[5px] mt-6 bg-blue-500 text-white text-lg sm:text-2xl"
        >
          Spin
        </button>
      )}
    </div>

    </>
  )
}

export default App

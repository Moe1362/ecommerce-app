import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  useEffect(() => {
    if (salesDetail) {
      console.log('Sales Detail Data:', salesDetail);
    }
  }, [salesDetail]);

  const [chartData, setChartData] = useState({
    options: {
      chart: {
        id: "basic-bar",
        background: '#1F2937',
        foreColor: '#E5E7EB'
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '70%',
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#E5E7EB'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#E5E7EB'
          },
          formatter: function (value) {
            return "$ " + value;
          }
        }
      },
      grid: {
        borderColor: '#374151'
      },
      colors: ['#EC4899'],
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(value) {
            return "$ " + value
          }
        }
      }
    },
    series: [
      {
        name: "Sales",
        data: []
      }
    ]
  });

  useEffect(() => {
    if (salesDetail && Array.isArray(salesDetail)) {
      const dates = salesDetail.map(item => item._id);
      const amounts = salesDetail.map(item => item.totalSales);

      setChartData(prev => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: dates
          }
        },
        series: [
          {
            name: "Sales",
            data: amounts
          }
        ]
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-[0rem] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500 p-3 rounded-lg">
                <div className="text-2xl text-white">$</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {isLoading ? <Loader /> : `$${sales?.totalSales?.toFixed(2)}`}
              </div>
            </div>
            <div className="text-gray-400 text-lg">Total Sales</div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500 p-3 rounded-lg">
                <div className="text-2xl text-white">👥</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {loading ? <Loader /> : customers?.length}
              </div>
            </div>
            <div className="text-gray-400 text-lg">Total Customers</div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500 p-3 rounded-lg">
                <div className="text-2xl text-white">📦</div>
              </div>
              <div className="text-3xl font-bold text-white">
                {loadingTwo ? <Loader /> : orders?.totalOrders}
              </div>
            </div>
            <div className="text-gray-400 text-lg">Total Orders</div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          {salesDetail && Array.isArray(salesDetail) && salesDetail.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-white">Sales Analytics</h2>
              <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="70%"
                height="400"
              />
            </>
          ) : (
            <div className="text-center py-8 text-gray-400 text-lg">
              {isLoading ? <Loader /> : "No sales data available"}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
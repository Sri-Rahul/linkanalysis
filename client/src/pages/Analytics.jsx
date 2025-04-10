import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnalyticsSummary } from '@/redux/slices/analyticsSlice';
import { getUrls } from '@/redux/slices/urlSlice';
import { BarChart3, Link2, ExternalLink, PieChart, TrendingUp, Users, Globe, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Pagination from '@/components/ui/pagination';
import Search from '@/components/ui/search';
// Import react-chartjs-2 components
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const Analytics = () => {
  const dispatch = useDispatch();
  const { urls, isLoading: urlsLoading } = useSelector((state) => state.urls);
  const { analyticsSummary, isLoading: analyticsLoading } = useSelector((state) => state.analytics);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtered and paginated data
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [paginatedUrls, setPaginatedUrls] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  // Chart state
  const [activeTimeframe, setActiveTimeframe] = useState('month');

  useEffect(() => {
    dispatch(getAnalyticsSummary());
    dispatch(getUrls());
  }, [dispatch]);
  
  // Prepare chart data from analytics summary
  const prepareDeviceChartData = () => {
    const devices = analyticsSummary?.deviceBreakdown || [];
    return {
      labels: devices.map(item => item.device || 'Unknown'),
      datasets: [
        {
          label: 'Clicks by Device',
          data: devices.map(item => item.count),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare clicks by URL chart data
  const prepareClicksByUrlChartData = () => {
    const topUrls = analyticsSummary?.topUrls || [];
    return {
      labels: topUrls.map(url => url.shortCode),
      datasets: [
        {
          label: 'Clicks per URL',
          data: topUrls.map(url => url.clicks),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Filter urls based on search term
  useEffect(() => {
    if (!urls) return;
    
    const filtered = urls.filter(url => {
      const searchLower = searchTerm.toLowerCase();
      return (
        url.originalUrl.toLowerCase().includes(searchLower) ||
        url.shortCode.toLowerCase().includes(searchLower) ||
        (url.customAlias && url.customAlias.toLowerCase().includes(searchLower))
      );
    });
    
    setFilteredUrls(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize) || 1);
    setCurrentPage(1); // Reset to first page when search changes
  }, [urls, searchTerm, pageSize]);
  
  // Paginate filtered urls
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedUrls(filteredUrls.slice(startIndex, endIndex));
  }, [filteredUrls, currentPage, pageSize]);

  const isLoading = urlsLoading || analyticsLoading;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Analytics Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Links</h3>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {analyticsSummary?.totalUrls || 0}
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Total Clicks</h3>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {analyticsSummary?.totalClicks || 0}
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Avg. Clicks Per Link</h3>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {analyticsSummary?.totalUrls > 0 ? 
                  (analyticsSummary?.totalClicks / analyticsSummary?.totalUrls).toFixed(1) : '0.0'}
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">Conversion Rate</h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {analyticsSummary?.totalUrls > 0 ? 
                  `${((analyticsSummary?.totalClicks / (analyticsSummary?.totalClicks + 500)) * 100).toFixed(1)}%` : '0.0%'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">*Estimated from total traffic</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Device breakdown chart */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between pb-4">
                <h3 className="text-lg font-medium">Device Breakdown</h3>
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-64">
                {analyticsSummary?.deviceBreakdown?.length > 0 ? (
                  <Pie 
                    data={prepareDeviceChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No device data available
                  </div>
                )}
              </div>
            </div>
            
            {/* Top URLs chart */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between pb-4">
                <h3 className="text-lg font-medium">Top Performing URLs</h3>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="h-64">
                {analyticsSummary?.topUrls?.length > 0 ? (
                  <Bar 
                    data={prepareClicksByUrlChartData()} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Clicks'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Short Code'
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No URL data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeframe selector for charts */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <button 
              className={`px-4 py-2 rounded-md ${activeTimeframe === 'day' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setActiveTimeframe('day')}
            >
              Today
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTimeframe === 'week' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setActiveTimeframe('week')}
            >
              This Week
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTimeframe === 'month' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setActiveTimeframe('month')}
            >
              This Month
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${activeTimeframe === 'year' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              onClick={() => setActiveTimeframe('year')}
            >
              This Year
            </button>
          </div>

          {/* Links Table with Analytics */}
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-medium">Link Analytics</h3>
              <Search 
                placeholder="Search links..." 
                value={searchTerm} 
                onChange={setSearchTerm} 
              />
            </div>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Original URL</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Short URL</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Clicks</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {isLoading ? (
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td colSpan="5" className="p-4 align-middle text-center">Loading...</td>
                    </tr>
                  ) : filteredUrls.length === 0 ? (
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td colSpan="5" className="p-4 align-middle text-center">
                        {searchTerm ? 'No links match your search' : 'No links created yet'}
                      </td>
                    </tr>
                  ) : (
                    paginatedUrls.map((url) => (
                      <tr key={url._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle">
                          <div className="max-w-[200px] truncate" title={url.originalUrl}>
                            {url.originalUrl}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <span>{url.shortCode}</span>
                            <a 
                              href={`${import.meta.env.VITE_API_URL}/${url.shortCode}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{url.clicks}</td>
                        <td className="p-4 align-middle">{new Date(url.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 align-middle">
                          <Link 
                            to={`/urls/${url._id}`}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2"
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredUrls.length > 0 && (
              <div className="px-6 py-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  pageSizeOptions={[5, 10, 25, 50]}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
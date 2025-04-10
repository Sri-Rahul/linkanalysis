import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUrlById } from '@/redux/slices/urlSlice';
import { getUrlAnalytics, getClicksOverTime, getDeviceBreakdown, getBrowserBreakdown, getOsBreakdown } from '@/redux/slices/analyticsSlice';
import { ArrowLeft, Copy, Check, ExternalLink, Calendar, Link2, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const UrlDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [copied, setCopied] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  
  const { currentUrl, isLoading: urlLoading } = useSelector((state) => state.urls);
  const { 
    clicksOverTime, 
    deviceBreakdown, 
    browserBreakdown, 
    osBreakdown,
    isLoading: analyticsLoading 
  } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(getUrlById(id));
    dispatch(getUrlAnalytics(id));
    loadAnalytics();
  }, [dispatch, id]);

  const loadAnalytics = () => {
    dispatch(getClicksOverTime({ urlId: id, timeframe }));
    dispatch(getDeviceBreakdown(id));
    dispatch(getBrowserBreakdown(id));
    dispatch(getOsBreakdown(id));
  };

  useEffect(() => {
    dispatch(getClicksOverTime({ urlId: id, timeframe }));
  }, [dispatch, id, timeframe]);

  const handleCopyLink = () => {
    if (!currentUrl) return;
    
    const linkToCopy = `${import.meta.env.VITE_API_URL}/${currentUrl.shortCode}`;
    navigator.clipboard.writeText(linkToCopy);
    
    setCopied(true);
    toast({
      title: 'Link copied to clipboard',
      description: linkToCopy,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Format device data for pie chart
  const formatDeviceData = () => {
    if (!deviceBreakdown || deviceBreakdown.length === 0) return [];
    return deviceBreakdown.map(item => ({
      name: (item.device || 'unknown').length > 15 ? 
            (item.device || 'unknown').substring(0, 15) + '...' : 
            (item.device || 'unknown'),
      fullName: (item.device || 'unknown'), // Store the full name for tooltip
      value: item.count
    }));
  };

  // Format browser data for pie chart
  const formatBrowserData = () => {
    if (!browserBreakdown || browserBreakdown.length === 0) return [];
    return browserBreakdown.map(item => ({
      name: (item.browser || 'unknown').length > 15 ? 
            (item.browser || 'unknown').substring(0, 15) + '...' : 
            (item.browser || 'unknown'),
      fullName: (item.browser || 'unknown'),
      value: item.count
    }));
  };

  // Format OS data for pie chart
  const formatOsData = () => {
    if (!osBreakdown || osBreakdown.length === 0) return [];
    return osBreakdown.map(item => ({
      name: (item.os || 'unknown').length > 15 ? 
            (item.os || 'unknown').substring(0, 15) + '...' : 
            (item.os || 'unknown'),
      fullName: (item.os || 'unknown'),
      value: item.count
    }));
  };

  // Format clicks over time data for chart
  const formatClicksData = () => {
    if (!clicksOverTime || clicksOverTime.length === 0) return [];
    return clicksOverTime.map(item => ({
      label: item.date,
      clicks: item.clicks
    }));
  };

  const deviceData = formatDeviceData();
  const browserData = formatBrowserData();
  const osData = formatOsData();
  const clicksData = formatClicksData();

  const isLoading = urlLoading || analyticsLoading;

  if (isLoading && !currentUrl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUrl) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">URL not found</h2>
        <p className="text-muted-foreground mb-6">The URL you're looking for doesn't exist or you don't have access to it.</p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Link 
            to="/"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Link Analytics</h1>
        </div>
      </div>

      {/* URL Info Card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Link Details</h2>
            <p className="text-sm text-muted-foreground">Basic information about your shortened link</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Original URL</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground break-all">{currentUrl.originalUrl}</p>
                <a 
                  href={currentUrl.originalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Short URL</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {`${import.meta.env.VITE_API_URL}/${currentUrl.shortCode}`}
                </p>
                <button 
                  onClick={handleCopyLink}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <a 
                  href={`${import.meta.env.VITE_API_URL}/${currentUrl.shortCode}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {new Date(currentUrl.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Expires At</p>
              <p className="text-sm text-muted-foreground">
                {currentUrl.expiresAt 
                  ? new Date(currentUrl.expiresAt).toLocaleString() 
                  : 'Never expires'}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Clicks</p>
              <p className="text-sm text-muted-foreground">{currentUrl.clicks}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">QR Code</p>
              <div className="flex flex-col items-start gap-2">
                <div className="p-2 bg-white rounded-md">
                  <QRCodeSVG 
                    value={`${import.meta.env.VITE_API_URL}/${currentUrl.shortCode}`} 
                    size={120} 
                    level="H" 
                    includeMargin={true}
                  />
                </div>
                <button
                  onClick={() => {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const qrCode = document.querySelector('svg');
                    const serializer = new XMLSerializer();
                    const qrCodeString = serializer.serializeToString(qrCode);
                    
                    // Create an image from the SVG
                    const img = new Image();
                    img.src = 'data:image/svg+xml;base64,' + btoa(qrCodeString);
                    
                    img.onload = () => {
                      // Draw the image on the canvas
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const context = canvas.getContext('2d');
                      context.drawImage(img, 0, 0);
                      
                      // Create a download link
                      const link = document.createElement('a');
                      link.download = `qrcode-${currentUrl.shortCode}.png`;
                      link.href = canvas.toDataURL('image/png');
                      link.click();
                    };
                  }}
                  className="text-blue-500 hover:text-blue-700 inline-flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clicks Over Time Chart */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Clicks Over Time</h2>
            <p className="text-sm text-muted-foreground">Number of clicks over the selected timeframe</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${timeframe === 'week' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${timeframe === 'month' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${timeframe === 'year' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Last 12 Months
            </button>
          </div>
          
          <div className="h-80 w-full">
            {clicksData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={clicksData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">No click data available for this timeframe</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Device, Browser, OS Breakdown */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Device Breakdown */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Device Types</h2>
              <p className="text-sm text-muted-foreground">Breakdown by device category</p>
            </div>
            
            <div className="h-64 w-full">
              {deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} (${((value / deviceData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`, 
                        props.payload.fullName
                      ]} 
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: "12px", overflowWrap: "break-word", width: "30%" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">No device data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Browser Breakdown */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Browsers</h2>
              <p className="text-sm text-muted-foreground">Breakdown by browser type</p>
            </div>
            
            <div className="h-64 w-full">
              {browserData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={browserData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {browserData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} (${((value / browserData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`, 
                        props.payload.fullName
                      ]} 
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: "12px", overflowWrap: "break-word", width: "30%" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">No browser data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* OS Breakdown */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Operating Systems</h2>
              <p className="text-sm text-muted-foreground">Breakdown by OS</p>
            </div>
            
            <div className="h-64 w-full">
              {osData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={osData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {osData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} (${((value / osData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`, 
                        props.payload.fullName
                      ]} 
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ fontSize: "12px", overflowWrap: "break-word", width: "30%" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">No OS data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlDetails;
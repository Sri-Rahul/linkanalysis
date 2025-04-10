import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUrls, deleteUrl } from '@/redux/slices/urlSlice';
import { getAnalyticsSummary } from '@/redux/slices/analyticsSlice';
import { Link } from 'react-router-dom';
import { BarChart3, Link2, ExternalLink, TrendingUp, EyeIcon, Calendar, Copy, Check, Trash2 } from 'lucide-react';
import Search from '@/components/ui/search';
import Pagination from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { urls, isLoading: urlsLoading } = useSelector((state) => state.urls);
  const { analyticsSummary, isLoading: analyticsLoading } = useSelector((state) => state.analytics);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Clipboard state
  const [copiedId, setCopiedId] = useState(null);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);
  
  // Filtered and paginated data
  const [filteredUrls, setFilteredUrls] = useState([]);
  const [paginatedUrls, setPaginatedUrls] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    dispatch(getUrls());
    dispatch(getAnalyticsSummary());
  }, [dispatch]);
  
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

  // Copy short URL to clipboard
  const copyToClipboard = (shortCode) => {
    const url = `${import.meta.env.VITE_API_URL}/${shortCode}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(shortCode);
      toast({
        title: "URL Copied!",
        description: "Short URL has been copied to clipboard",
        duration: 3000,
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Handle delete link
  const handleDeleteClick = (url) => {
    setUrlToDelete(url);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!urlToDelete) return;
    
    dispatch(deleteUrl(urlToDelete._id))
      .unwrap()
      .then(() => {
        toast({
          title: "Link deleted",
          description: `Link ${urlToDelete.shortCode} has been deleted successfully.`,
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error || "Failed to delete link. Please try again.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Link Management Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track and manage your shortened URLs</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Analytics Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Links
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsSummary?.totalUrls || 0}
                </div>
                <Progress 
                  value={100} 
                  className="h-2 mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {analyticsSummary?.totalUrls > 0 ? `${analyticsSummary?.totalUrls} links created so far` : 'No links created yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Total Clicks
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsSummary?.totalClicks || 0}
                </div>
                <Progress 
                  value={analyticsSummary?.totalClicks > 1000 ? 100 : (analyticsSummary?.totalClicks / 10)} 
                  className="h-2 mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {analyticsSummary?.totalClicks > 0 
                    ? `${analyticsSummary?.totalClicks} total redirects tracked` 
                    : 'No clicks recorded yet'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  Avg. Clicks Per Link
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsSummary?.totalUrls > 0 
                    ? (analyticsSummary?.totalClicks / analyticsSummary?.totalUrls).toFixed(1) 
                    : '0.0'}
                </div>
                <Progress 
                  value={analyticsSummary?.totalUrls > 0 
                    ? Math.min((analyticsSummary?.totalClicks / analyticsSummary?.totalUrls) * 10, 100) 
                    : 0} 
                  className="h-2 mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {analyticsSummary?.totalUrls > 0 
                    ? `Average performance across all links` 
                    : 'No data available yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Links Table */}
          <Card>
            <CardHeader className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg font-medium">Recent Links</CardTitle>
                  <CardDescription>Manage and analyze your shortened URLs</CardDescription>
                </div>
                <Search 
                  placeholder="Search links..." 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                />
              </div>
            </CardHeader>
            <ScrollArea className="h-[400px] rounded-md">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b sticky top-0 bg-card z-10">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Original URL</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Short URL</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          <span>Clicks</span>
                        </div>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Created</span>
                        </div>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle"><Skeleton className="h-4 w-[200px]" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-4 w-[100px]" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-4 w-[50px]" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-4 w-[80px]" /></td>
                          <td className="p-4 align-middle"><Skeleton className="h-9 w-[100px]" /></td>
                        </tr>
                      ))
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
                              <Badge variant="secondary" className="font-mono">
                                {url.shortCode}
                              </Badge>
                              <button
                                onClick={() => copyToClipboard(url.shortCode)}
                                className="text-muted-foreground hover:text-foreground"
                                title="Copy short URL"
                              >
                                {copiedId === url.shortCode ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                              </button>
                              <a 
                                href={`${import.meta.env.VITE_API_URL}/${url.shortCode}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                                title="Open short URL"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge variant={url.clicks > 10 ? "default" : "outline"}>
                              {url.clicks}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle">
                            {new Date(url.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Link 
                                to={`/urls/${url._id}`}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2"
                              >
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </Link>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                                onClick={() => handleDeleteClick(url)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
            <CardFooter className="px-6 py-4 border-t">
              {filteredUrls.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  pageSizeOptions={[5, 10, 25]}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={setPageSize}
                />
              )}
            </CardFooter>
          </Card>
        </>
      )}
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Link"
        description={`Are you sure you want to delete the link "${urlToDelete?.shortCode}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default Dashboard;
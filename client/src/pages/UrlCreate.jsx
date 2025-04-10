import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createUrl } from '@/redux/slices/urlSlice';
import { Link2, Calendar, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UrlCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.urls);

  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiresAt: '',
  });

  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const { originalUrl, customAlias, expiresAt } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate original URL
    if (!originalUrl) {
      newErrors.originalUrl = 'Original URL is required';
    } else {
      try {
        new URL(originalUrl);
      } catch (err) {
        newErrors.originalUrl = 'Please enter a valid URL';
      }
    }
    
    // Validate custom alias (optional)
    if (customAlias && !/^[a-zA-Z0-9-_]+$/.test(customAlias)) {
      newErrors.customAlias = 'Custom alias can only contain letters, numbers, hyphens, and underscores';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(createUrl(formData))
      .unwrap()
      .then((url) => {
        toast({
          title: 'URL created successfully',
          description: 'Your shortened URL is ready to use',
        });
        navigate(`/urls/${url._id}`);
      })
      .catch((error) => {
        toast({
          title: 'Error creating URL',
          description: error,
          variant: 'destructive',
        });
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Create New Link</h1>
        <p className="text-muted-foreground">Shorten your URL and track its performance with detailed analytics.</p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <form onSubmit={onSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="originalUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Original URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    id="originalUrl"
                    name="originalUrl"
                    value={originalUrl}
                    onChange={onChange}
                    placeholder="https://example.com/very-long-url"
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.originalUrl ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.originalUrl && <p className="text-sm text-red-500">{errors.originalUrl}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="customAlias" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Custom Alias <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  type="text"
                  id="customAlias"
                  name="customAlias"
                  value={customAlias}
                  onChange={onChange}
                  placeholder="my-custom-link"
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.customAlias ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {errors.customAlias && <p className="text-sm text-red-500">{errors.customAlias}</p>}
                <p className="text-sm text-muted-foreground">Leave blank to generate a random code</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="expiresAt" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Expiration Date <span className="text-muted-foreground">(optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    id="expiresAt"
                    name="expiresAt"
                    value={expiresAt}
                    onChange={onChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Leave blank for a link that never expires</p>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full md:w-auto"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UrlCreate;
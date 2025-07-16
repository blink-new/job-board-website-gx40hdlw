import { useState, useEffect } from 'react'
import { Search, MapPin, DollarSign, Clock, Building, Plus, Filter } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Label } from './components/ui/label'
import { Textarea } from './components/ui/textarea'
import { Checkbox } from './components/ui/checkbox'
import { blink } from './blink/client'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  description: string
  requirements?: string
  benefits?: string
  jobType: string
  experienceLevel: string
  tags: string[]
  applicationType: string
  applicationEmail?: string
  applicationUrl?: string
  companyLogo?: string
  companyWebsite?: string
  isRemote: boolean
  isFeatured: boolean
  userId: string
  createdAt: string
}

// Sample jobs data
const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salaryMin: 120000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
      requirements: 'React, TypeScript, 5+ years experience',
      benefits: 'Health insurance, 401k, Remote work',
      jobType: 'full-time',
      experienceLevel: 'senior',
      tags: ['React', 'TypeScript', 'Frontend'],
      applicationType: 'email',
      applicationEmail: 'jobs@techcorp.com',
      isRemote: true,
      isFeatured: true,
      userId: 'sample',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salaryMin: 100000,
      salaryMax: 140000,
      salaryCurrency: 'USD',
      description: 'Join our product team to drive innovation and growth.',
      requirements: 'MBA preferred, 3+ years PM experience',
      benefits: 'Equity, Health insurance, Flexible hours',
      jobType: 'full-time',
      experienceLevel: 'mid',
      tags: ['Product Management', 'Strategy', 'Analytics'],
      applicationType: 'external',
      applicationUrl: 'https://startupxyz.com/careers',
      isRemote: false,
      isFeatured: false,
      userId: 'sample',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Remote',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      description: 'Create beautiful and intuitive user experiences for our clients.',
      requirements: 'Figma, Adobe Creative Suite, Portfolio required',
      benefits: 'Remote work, Professional development budget',
      jobType: 'full-time',
      experienceLevel: 'mid',
      tags: ['UX Design', 'Figma', 'User Research'],
      applicationType: 'email',
      applicationEmail: 'hello@designstudio.com',
      isRemote: true,
      isFeatured: false,
      userId: 'sample',
      createdAt: new Date().toISOString()
    }
  ]

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [experienceFilter, setExperienceFilter] = useState('')
  const [showPostJob, setShowPostJob] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // Initialize with sample data
    setJobs(sampleJobs)
    setFilteredJobs(sampleJobs)
  }, [])

  useEffect(() => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.jobType === jobTypeFilter)
    }

    if (experienceFilter) {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter)
    }

    setFilteredJobs(filtered)
  }, [searchTerm, locationFilter, jobTypeFilter, experienceFilter, jobs])

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
    if (min) return `$${min.toLocaleString()}+`
    return `Up to $${max?.toLocaleString()}`
  }

  const handleApply = (job: Job) => {
    if (job.applicationType === 'email' && job.applicationEmail) {
      window.location.href = `mailto:${job.applicationEmail}?subject=Application for ${job.title}&body=Hi, I'm interested in the ${job.title} position at ${job.company}.`
    } else if (job.applicationType === 'external' && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Building className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Board</h1>
          <p className="text-gray-600 mb-8">Find your next opportunity or post a job opening</p>
          <Button onClick={() => blink.auth.login()} size="lg" className="w-full">
            Sign In to Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">JobBoard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showPostJob} onOpenChange={setShowPostJob}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Post Job</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Post a New Job</DialogTitle>
                  </DialogHeader>
                  <PostJobForm onClose={() => setShowPostJob(false)} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={() => blink.auth.logout()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {job.isFeatured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                        {job.isRemote && (
                          <Badge variant="outline" className="ml-2">Remote</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                      </div>
                      <span>•</span>
                      <span className="capitalize">{job.experienceLevel} Level</span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApply(job)
                    }}
                    className="ml-4"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </main>

      {/* Job Detail Modal */}
      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <JobDetailView job={selectedJob} onApply={handleApply} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Job Detail Component
function JobDetailView({ job, onApply }: { job: Job; onApply: (job: Job) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <div className="flex items-center space-x-4 text-gray-600 mt-2">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button onClick={() => onApply(job)} size="lg">
          Apply Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Requirements</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>
          )}

          {job.benefits && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Benefits</h3>
              <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Job Type</Label>
                <p className="capitalize">{job.jobType.replace('-', ' ')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Experience Level</Label>
                <p className="capitalize">{job.experienceLevel} Level</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Remote Work</Label>
                <p>{job.isRemote ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Posted</Label>
                <p>{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Post Job Form Component
function PostJobForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
    benefits: '',
    jobType: '',
    experienceLevel: '',
    tags: '',
    applicationType: 'email',
    applicationEmail: '',
    applicationUrl: '',
    isRemote: false,
    isFeatured: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save to the database
    console.log('Job posted:', formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRemote"
            checked={formData.isRemote}
            onCheckedChange={(checked) => setFormData({ ...formData, isRemote: !!checked })}
          />
          <Label htmlFor="isRemote">Remote Position</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salaryMin">Minimum Salary</Label>
          <Input
            id="salaryMin"
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="salaryMax">Maximum Salary</Label>
          <Input
            id="salaryMax"
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="jobType">Job Type *</Label>
          <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full Time</SelectItem>
              <SelectItem value="part-time">Part Time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="experienceLevel">Experience Level *</Label>
          <Select value={formData.experienceLevel} onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry Level</SelectItem>
              <SelectItem value="mid">Mid Level</SelectItem>
              <SelectItem value="senior">Senior Level</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Job Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="benefits">Benefits</Label>
        <Textarea
          id="benefits"
          value={formData.benefits}
          onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="tags">Skills/Tags (comma separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="React, TypeScript, Node.js"
        />
      </div>

      <div>
        <Label>Application Method *</Label>
        <div className="space-y-4 mt-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="email"
              name="applicationType"
              value="email"
              checked={formData.applicationType === 'email'}
              onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
            />
            <Label htmlFor="email">Email Application</Label>
          </div>
          {formData.applicationType === 'email' && (
            <Input
              placeholder="jobs@company.com"
              value={formData.applicationEmail}
              onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
            />
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="external"
              name="applicationType"
              value="external"
              checked={formData.applicationType === 'external'}
              onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
            />
            <Label htmlFor="external">External Link</Label>
          </div>
          {formData.applicationType === 'external' && (
            <Input
              placeholder="https://company.com/careers"
              value={formData.applicationUrl}
              onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Post Job
        </Button>
      </div>
    </form>
  )
}

export default App
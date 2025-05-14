
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileUploader } from "@/components";
import ResumeTable, { ResumeData } from "@/components/ResumeTable";
import ResumeDetail from "@/components/ResumeDetail";
import QuestionForm from "@/components/QuestionForm";
import { processDocuments, askQuestionAboutCVs } from "@/services/documentProcessing";
import { Upload, FileText, Search, Loader2, Github } from "lucide-react";

const Index = () => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResumeFiles, setSelectedResumeFiles] = useState<File[]>([]);
  const [selectedJDFile, setSelectedJDFile] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const handleResumeFilesSelected = (files: File[]) => {
    // Already handled by the component state
  };

  const handleJDFileSelected = (files: File[]) => {
    // Already handled by the component state
  };

  const processFiles = async () => {
    if (selectedResumeFiles.length === 0) {
      toast.error("Please upload at least one resume file");
      return;
    }

    setProcessing(true);
    setResumes([]);
    
    try {
      const jdFile = selectedJDFile.length > 0 ? selectedJDFile[0] : undefined;
      const result = await processDocuments(selectedResumeFiles, jdFile);
      
      if (result.error) {
        toast.error(result.error);
      } else if (result.resumes.length === 0) {
        toast.warning("No data could be extracted from the provided files");
      } else {
        setResumes(result.resumes);
        setActiveTab("results");
        toast.success(`Successfully processed ${result.resumes.length} resumes`);
      }
    } catch (error) {
      console.error("Processing error:", error);
      toast.error("An error occurred while processing the files");
    } finally {
      setProcessing(false);
    }
  };

  const handleViewResume = (resume: ResumeData) => {
    setSelectedResume(resume);
    setIsDetailOpen(true);
  };

  const handleAskQuestion = async (question: string) => {
    if (resumes.length === 0) {
      throw new Error("No resumes available to analyze");
    }
    
    return await askQuestionAboutCVs(question, resumes);
  };

  const clearAllFiles = () => {
    setSelectedResumeFiles([]);
    setSelectedJDFile([]);
    setResumes([]);
    setActiveTab("upload");
  };

  return (
    <div className="container py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">CV Analyzer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload CV files and a job description to analyze and compare candidates.
          Extract structured information and check fitment scores.
        </p>
        <div className="flex justify-center mt-4">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://github.com/yourusername/cv-analyzer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </a>
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="upload" className="text-base py-3">
            <Upload className="h-4 w-4 mr-2" /> Upload Files
          </TabsTrigger>
          <TabsTrigger value="results" className="text-base py-3" disabled={resumes.length === 0}>
            <FileText className="h-4 w-4 mr-2" /> Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload Resumes</CardTitle>
                <CardDescription>
                  Upload CV files in PDF, DOC, or DOCX format.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFilesSelected={handleResumeFilesSelected}
                  accept=".pdf,.doc,.docx"
                  multiple={true}
                  label="Upload Resumes"
                  selectedFiles={selectedResumeFiles}
                  setSelectedFiles={setSelectedResumeFiles}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
                <CardDescription>
                  Upload a job description to compare with resumes. (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFilesSelected={handleJDFileSelected}
                  accept=".pdf,.doc,.docx"
                  multiple={false}
                  label="Upload Job Description"
                  selectedFiles={selectedJDFile}
                  setSelectedFiles={setSelectedJDFile}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={processFiles}
              disabled={processing || selectedResumeFiles.length === 0}
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Files"
              )}
            </Button>
            {(selectedResumeFiles.length > 0 || selectedJDFile.length > 0) && (
              <Button
                variant="outline"
                onClick={clearAllFiles}
                disabled={processing}
                size="lg"
              >
                Clear All
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-8">
          {resumes.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Resume Analysis</CardTitle>
                  <CardDescription>
                    View structured information extracted from the uploaded resumes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeTable resumes={resumes} onViewResume={handleViewResume} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ask Questions</CardTitle>
                  <CardDescription>
                    Ask questions about the uploaded CVs to get insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuestionForm onAsk={handleAskQuestion} disabled={resumes.length === 0} />
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No results to display. Please upload and process files first.
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveTab("upload")}
                className="mt-4"
              >
                Go to Upload
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ResumeDetail
        resume={selectedResume}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      
      <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <p>CV Analyzer - Powered by Lovable & Gemini</p>
        <p className="text-xs mt-1">Created for demonstration purposes</p>
      </footer>
    </div>
  );
};

export default Index;


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, X, Linkedin } from "lucide-react";
import { type ResumeData } from "./ResumeTable";

interface ResumeDetailProps {
  resume: ResumeData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ResumeDetail = ({ resume, isOpen, onClose }: ResumeDetailProps) => {
  if (!resume) return null;
  
  const downloadResume = () => {
    const url = URL.createObjectURL(resume.originalFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = resume.originalFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getBadgeColor = (score?: number) => {
    if (!score) return "secondary";
    if (score >= 75) return "success";
    if (score >= 50) return "info";
    return "warning";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{resume.name}</span>
            <div className="flex items-center gap-2">
              {resume.fitmentScore !== undefined && (
                <Badge variant="outline" className={`bg-${getBadgeColor(resume.fitmentScore)}/10 text-${getBadgeColor(resume.fitmentScore)} border-${getBadgeColor(resume.fitmentScore)}/20 px-3 py-1`}>
                  {resume.fitmentScore}% Match
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadResume}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">CONTACT INFORMATION</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p>{resume.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p>{resume.phone}</p>
              </div>
              {resume.linkedin && (
                <div>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Linkedin className="h-3 w-3" /> LinkedIn
                  </p>
                  <a 
                    href={resume.linkedin.startsWith('http') ? resume.linkedin : `https://${resume.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {resume.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">EMPLOYMENT STATUS</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium">Currently Working</p>
                <p>{resume.currentlyWorking ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Employer</p>
                <p>{resume.lastEmployer}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Work Experience</p>
                <p>{resume.totalExperience}</p>
              </div>
            </div>
          </div>
        </div>
        
        {resume.keywords && resume.keywords.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">KEYWORDS</h3>
            <div className="flex flex-wrap gap-1">
              {resume.keywords.map((keyword, idx) => (
                <Badge key={idx} variant="secondary">{keyword}</Badge>
              ))}
            </div>
          </div>
        )}
        
        {resume.rawText && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">RESUME TEXT</h3>
            <div className="bg-muted/30 p-4 rounded-md text-sm max-h-80 overflow-y-auto whitespace-pre-wrap">
              {resume.rawText}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDetail;

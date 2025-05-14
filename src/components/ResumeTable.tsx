
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download } from "lucide-react";

export type ResumeData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  currentlyWorking: boolean;
  lastEmployer: string;
  totalExperience: string;
  fitmentScore?: number;
  keywords?: string[];
  rawText?: string;
  originalFile: File;
};

interface ResumeTableProps {
  resumes: ResumeData[];
  onViewResume: (resume: ResumeData) => void;
}

const ResumeTable = ({ resumes, onViewResume }: ResumeTableProps) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredResumes = activeTab === "all"
    ? resumes
    : activeTab === "highMatch"
    ? resumes.filter(r => (r.fitmentScore || 0) >= 75)
    : activeTab === "mediumMatch"
    ? resumes.filter(r => (r.fitmentScore || 0) >= 50 && (r.fitmentScore || 0) < 75)
    : resumes.filter(r => (r.fitmentScore || 0) < 50);

  const downloadResume = (resume: ResumeData) => {
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
    <div className="w-full space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="all">All ({resumes.length})</TabsTrigger>
          <TabsTrigger value="highMatch">
            High Match ({resumes.filter(r => (r.fitmentScore || 0) >= 75).length})
          </TabsTrigger>
          <TabsTrigger value="mediumMatch">
            Medium Match ({resumes.filter(r => (r.fitmentScore || 0) >= 50 && (r.fitmentScore || 0) < 75).length})
          </TabsTrigger>
          <TabsTrigger value="lowMatch">
            Low Match ({resumes.filter(r => (r.fitmentScore || 0) < 50).length})
          </TabsTrigger>
        </TabsList>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Employer</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead className="text-center">Match</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResumes.length > 0 ? (
                filteredResumes.map((resume) => (
                  <TableRow key={resume.id}>
                    <TableCell className="font-medium">{resume.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{resume.email}</div>
                        <div className="text-xs text-muted-foreground">{resume.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {resume.lastEmployer}
                      <div className="text-xs text-muted-foreground mt-1">
                        {resume.currentlyWorking ? 'Currently working' : 'Not working'}
                      </div>
                    </TableCell>
                    <TableCell>{resume.totalExperience}</TableCell>
                    <TableCell className="text-center">
                      {resume.fitmentScore !== undefined ? (
                        <Badge variant="outline" className={`bg-${getBadgeColor(resume.fitmentScore)}/10 text-${getBadgeColor(resume.fitmentScore)} border-${getBadgeColor(resume.fitmentScore)}/20`}>
                          {resume.fitmentScore}%
                        </Badge>
                      ) : (
                        <Badge variant="outline">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewResume(resume)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => downloadResume(resume)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No resumes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Tabs>
    </div>
  );
};

export default ResumeTable;

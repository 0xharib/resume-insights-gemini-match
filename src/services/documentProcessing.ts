
import { v4 as uuidv4 } from 'uuid';
import { type ResumeData } from '@/components/ResumeTable';
import { toast } from 'sonner';

// Mock function to simulate document processing with AI
// In a real application, this would use the Gemini API
export const processDocuments = async (
  resumeFiles: File[],
  jobDescriptionFile?: File
): Promise<{ resumes: ResumeData[]; error?: string }> => {
  try {
    if (resumeFiles.length === 0) {
      return { resumes: [], error: "No resume files provided" };
    }

    // This is a placeholder for actual document processing
    // In a real application, you would:
    // 1. Extract text from the documents using PDF.js or similar
    // 2. Send the text to the Gemini API for analysis
    // 3. Process the responses to create structured data

    const mockProcessingDelay = 2000; // 2 seconds per file to simulate processing
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, mockProcessingDelay * resumeFiles.length));
    
    const processedResumes: ResumeData[] = resumeFiles.map((file, index) => {
      // Generate mock data for demonstration purposes
      const names = ['John Smith', 'Sarah Johnson', 'Michael Williams', 'Emily Brown', 'David Miller'];
      const employers = ['Tech Solutions Inc.', 'Digital Innovations', 'Infosys', 'Global Systems', 'Data Analytics Co.'];
      const experiences = ['3 years', '5 years', '2 years', '7 years', '4 years'];
      const keywords = [
        'React', 'TypeScript', 'Node.js', 'Python', 'Data Analysis',
        'Project Management', 'UI/UX Design', 'AWS', 'Docker', 'Machine Learning'
      ];
      
      // Randomize data for demo purposes
      const randomName = names[index % names.length];
      const randomEmployer = employers[index % employers.length];
      const randomExperience = experiences[index % experiences.length];
      
      // Generate dummy email and phone based on name
      const email = `${randomName.toLowerCase().replace(' ', '.')}@example.com`;
      const phone = `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const linkedin = `linkedin.com/in/${randomName.toLowerCase().replace(' ', '-')}`;
      
      // Generate random keywords
      const shuffledKeywords = [...keywords].sort(() => 0.5 - Math.random());
      const selectedKeywords = shuffledKeywords.slice(0, Math.floor(Math.random() * 5) + 2);
      
      // Generate random fitment score if job description was provided
      const fitmentScore = jobDescriptionFile ? Math.floor(Math.random() * 100) : undefined;
      
      // Mock raw text for demo
      const rawText = `Name: ${randomName}\nEmail: ${email}\nPhone: ${phone}\nLinkedIn: ${linkedin}\n\nExperience:\n${randomEmployer} - ${randomExperience}\n\nSkills:\n${selectedKeywords.join(', ')}`;
      
      return {
        id: uuidv4(),
        name: randomName,
        email,
        phone,
        linkedin,
        currentlyWorking: Math.random() > 0.3, // 70% chance of currently working
        lastEmployer: randomEmployer,
        totalExperience: randomExperience,
        fitmentScore,
        keywords: selectedKeywords,
        rawText,
        originalFile: file
      };
    });
    
    // Sort by fitment score if available
    if (jobDescriptionFile) {
      processedResumes.sort((a, b) => (b.fitmentScore || 0) - (a.fitmentScore || 0));
    }
    
    return { resumes: processedResumes };
  } catch (error) {
    console.error('Document processing error:', error);
    return { resumes: [], error: "Failed to process documents" };
  }
};

// Mock function to simulate asking questions about the CVs
export const askQuestionAboutCVs = async (
  question: string,
  resumes: ResumeData[]
): Promise<string> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Predefined answers for demonstration purposes
  const predefinedQuestions: { [key: string]: string } = {
    "who has worked at infosys": "Based on the analyzed resumes, 1 candidate has worked at Infosys before.",
    "which candidate has the most experience": "Emily Brown has the most experience with 7 years of work history.",
    "who has react experience": "3 candidates mention React in their skills: John Smith, Sarah Johnson, and David Miller.",
    "who is currently employed": "5 candidates are currently employed, while 2 candidates are not currently working."
  };
  
  // Simplified matching by converting to lowercase and checking for keywords
  const questionLower = question.toLowerCase();
  let answer = "I couldn't find specific information about that in the resumes.";
  
  // Check for matches in predefined questions
  for (const [key, response] of Object.entries(predefinedQuestions)) {
    if (questionLower.includes(key)) {
      answer = response;
      break;
    }
  }
  
  // If nothing matched, generate a generic answer based on the question
  if (answer === "I couldn't find specific information about that in the resumes.") {
    if (questionLower.includes("experience") || questionLower.includes("skill")) {
      answer = "The candidates have various levels of experience ranging from 2 to 7 years, with skills including React, TypeScript, Node.js, Python, and more.";
    } else if (questionLower.includes("education") || questionLower.includes("degree")) {
      answer = "Education details vary among candidates, with most having bachelor's degrees in Computer Science, Information Technology, or related fields.";
    }
  }
  
  return answer;
};

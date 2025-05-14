
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionFormProps {
  onAsk: (question: string) => Promise<string>;
  disabled: boolean;
}

const QuestionForm = ({ onAsk, disabled }: QuestionFormProps) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await onAsk(question);
      setAnswer(response);
    } catch (error) {
      toast.error('Failed to get an answer. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask a question about these CVs..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={disabled || isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={disabled || isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="ml-2">Ask</span>
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-1">
          Example: "Who has worked at Infosys before?" or "Which candidate has the most relevant experience for this role?"
        </p>
      </div>
      
      {answer && (
        <div className="border rounded-md p-4 bg-secondary/50">
          <h3 className="font-medium mb-2">Answer:</h3>
          <p className="text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;

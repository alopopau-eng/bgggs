import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Shield,
  CheckCircle2,
  Download,
  Printer,
  Mail,
  Clock,
  FileSearch,
  Home,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const nextSteps = [
  {
    step: 1,
    title: "Application Received",
    description: "Your application has been successfully submitted",
    status: "completed",
  },
  {
    step: 2,
    title: "Document Verification",
    description: "Our team will verify your submitted documents",
    status: "pending",
    duration: "1-2 business days",
  },
  {
    step: 3,
    title: "Processing",
    description: "Your application is being processed",
    status: "pending",
    duration: "5-10 business days",
  },
  {
    step: 4,
    title: "Approval & Printing",
    description: "Once approved, your document will be printed",
    status: "pending",
    duration: "3-5 business days",
  },
  {
    step: 5,
    title: "Delivery/Collection",
    description: "Collect your document or receive it by mail",
    status: "pending",
    duration: "2-3 business days",
  },
];

export default function ConfirmationPage() {
  const [, params] = useRoute("/confirmation/:referenceNumber");
  const referenceNumber = params?.referenceNumber || "APP-XXXXXXXX";
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber);
    toast({
      title: "Copied",
      description: "Reference number copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold">Document Portal</h1>
              <p className="text-xs text-muted-foreground">
                Official Application Services
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-3xl font-semibold text-foreground" data-testid="text-success-title">
            Application Submitted Successfully
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto" data-testid="text-success-description">
            Your application has been received and is being processed. Please
            save your reference number for tracking.
          </p>
        </div>

        <Card data-testid="card-reference-number">
          <CardContent className="py-6">
            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Your Reference Number
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-mono font-bold tracking-wider"
                  data-testid="text-reference-number"
                >
                  {referenceNumber}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  data-testid="button-copy-reference"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Use this number to track your application status
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" data-testid="button-download-pdf">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" data-testid="button-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" data-testid="button-email">
            <Mail className="h-4 w-4 mr-2" />
            Email Confirmation
          </Button>
        </div>

        <Card data-testid="card-next-steps">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              What Happens Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nextSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4" data-testid={`step-timeline-${item.step}`}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        ${
                          item.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        item.step
                      )}
                    </div>
                    {index < nextSteps.length - 1 && (
                      <div className="w-0.5 h-full min-h-[40px] bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      {item.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {item.duration}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button variant="outline" data-testid="button-return-home">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          <Button data-testid="button-track-application">
            <FileSearch className="h-4 w-4 mr-2" />
            Track Application
          </Button>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="py-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Need Assistance?</p>
              <p className="text-sm text-muted-foreground">
                If you have questions about your application, please contact our
                helpline at{" "}
                <span className="font-medium text-foreground">
                  1-800-DOC-HELP
                </span>{" "}
                or email{" "}
                <span className="font-medium text-foreground">
                  support@documentportal.gov
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

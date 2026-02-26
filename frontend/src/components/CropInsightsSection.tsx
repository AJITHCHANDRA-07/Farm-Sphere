import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";

const ContextOneSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="section-container bg-surface">
      <div className="max-w-4xl mx-auto text-center"> {/* Adjusted width to match other panels */}
        <div className="space-y-6">
          <div 
            className="professional-card p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
          >
            <div className="space-y-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-3xl">📘</span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Context One Section
              </h2>

              {/* Subtext */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore detailed information interactively, just like the Dialog, 
                but shown inline here with expand/collapse functionality.
              </p>

              {/* Explore/Hide Button */}
              <Button
                variant="professional"
                size="lg"
                className="px-8 py-3"
                onClick={handleToggle}
              >
                {isOpen ? "Hide Details" : "Explore Details"}
                {isOpen ? (
                  <ChevronDown className="ml-2 h-5 w-5" />
                ) : (
                  <ChevronRight className="ml-2 h-5 w-5" />
                )}
              </Button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="mt-6 text-left max-w-3xl mx-auto bg-muted p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold mb-4">General Dialog Title</h3>
                  <p className="text-muted-foreground mb-4">
                    This is where all the content from your Dialog component will be placed.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>First detail from Dialog</li>
                    <li>Second detail from Dialog</li>
                    <li>Third detail from Dialog</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContextOneSection;

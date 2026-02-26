import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StateDetailModalProps {
  state: {
    name: string;
    weather: string;
    soil: string;
    returnPerAcre: number;
    investmentPerAcre: number;
    roi: number;
    additionalDetails: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const StateDetailModal = ({ state, isOpen, onClose }: StateDetailModalProps) => {
  if (!state) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-2xl border-2 border-blue-200 p-8">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-3xl font-bold text-blue-800 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            {state.name}
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-600">
            Comprehensive Agricultural Insights for {state.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Key Metrics */}
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">Key Metrics</h3>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Weather:</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {state.weather}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Soil Type:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {state.soil}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Return/Acre:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-bold">
                ₹{state.returnPerAcre.toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Investment/Acre:</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-bold">
                ₹{state.investmentPerAcre.toLocaleString()}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">ROI:</span>
              <Badge variant="secondary" className={`${state.roi > 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} font-bold`}>
                {state.roi}%
              </Badge>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-green-200 pb-2 mb-4">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {state.additionalDetails}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <div className="text-sm text-blue-600">Major Crops</div>
                <div className="font-semibold">Multiple</div>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-green-600">Water Needs</div>
                <div className="font-semibold">Moderate-High</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4 border-t border-gray-200">
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={onClose}
          >
            Got It
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-2 rounded-lg transition-all duration-200"
          >
            Save Details
          </Button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Tip: Consider soil testing and local climate patterns for optimal crop selection
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StateDetailModal;

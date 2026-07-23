const ProctorStatus = ({ status }) => {

    const config = {
  
      "one-face": {
        color: "bg-green-500",
        text: "Face Detected"
      },
  
      "no-face": {
        color: "bg-red-500",
        text: "No Face Detected"
      },
  
      "multiple-faces": {
        color: "bg-yellow-500",
        text: "Multiple Faces Detected"
      }
  
    };
  
    const current = config[status];
  
    return (
  
      <div className="w-full bg-gray-900 rounded-xl p-4 shadow-lg">
  
        <h2 className="text-lg font-bold text-white mb-3">
  
          Camera Status
  
        </h2>
  
        <div className="flex items-center gap-3">
  
          <div
            className={`w-4 h-4 rounded-full ${current.color}`}
          />
  
          <p className="text-white font-medium">
  
            {current.text}
  
          </p>
  
        </div>
  
      </div>
  
    );
  
  };
  
  export default ProctorStatus;
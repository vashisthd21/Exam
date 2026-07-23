import { calculateRiskScore } from "./RiskEngine";

const ViolationPanel = ({ violations }) => {

  const riskScore =
    calculateRiskScore(violations);

  return (

    <div className="w-[370px] bg-gray-900 text-white rounded-xl shadow-2xl p-6">

      <h1 className="text-2xl font-bold mb-6">

        🛡 AI Proctor

      </h1>

      <div className="mb-5">

        <div className="flex justify-between">

          <span>

            Total Violations

          </span>

          <span className="font-bold">

            {violations.length}

          </span>

        </div>

      </div>

      <div className="mb-6">

        <div className="flex justify-between mb-2">

          <span>

            Risk Score

          </span>

          <span>

            {riskScore}/100

          </span>

        </div>

        <div className="w-full h-3 bg-gray-700 rounded-full">

          <div

            className={`h-3 rounded-full transition-all duration-500

            ${riskScore < 30
              ? "bg-green-500"
              : riskScore < 70
              ? "bg-yellow-500"
              : "bg-red-500"
            }`}

            style={{

              width: `${riskScore}%`

            }}

          />

        </div>

      </div>

      <hr className="border-gray-700 mb-5"/>

      <div className="space-y-4 max-h-[420px] overflow-y-auto">

        {

          violations.length===0 ?

          <div className="text-gray-400 text-center">

            No Violations Yet

          </div>

          :

          violations.map((v,index)=>(

            <div

              key={index}

              className="bg-gray-800 rounded-lg p-3"

            >

              <div className="flex justify-between mb-2">

                <span className="font-semibold text-red-400">

                  {v.type.replaceAll("_"," ")}

                </span>

                <span className="text-xs text-gray-400">

                  {v.time}

                </span>

              </div>

              <p className="text-sm text-gray-300">

                {v.message}

              </p>

            </div>

          ))

        }

      </div>

    </div>

  );

};

export default ViolationPanel;
import { Check } from "lucide-react"

interface CheckoutProgressProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Cart", description: "Review items" },
  { id: 2, name: "Shipping", description: "Delivery details" },
  { id: 3, name: "Payment", description: "Payment method" },
  { id: 4, name: "Confirmation", description: "Order complete" },
]

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step.id < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.id === currentStep
                      ? "border-primary text-primary"
                      : "border-muted-foreground text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? <Check className="w-5 h-5" /> : <span>{step.id}</span>}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.name}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors ${step.id < currentStep ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

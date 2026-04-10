import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {

  const errorMessage =
    error instanceof Error ? error.message : "Something went wrong";

  return (
    <div className="p-6 text-center">
      <h2 className="text-red-600 text-lg font-semibold">
        Something went wrong
      </h2>

      <p className="text-gray-600 mt-2">
        {errorMessage}
      </p>

      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}